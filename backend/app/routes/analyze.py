
from flask import Blueprint, request, jsonify, current_app
from app.utils.validators import validate_analyze_request
from app.utils.response_validator import validate_response
from app.services.openrouter_service import callLLM
from app.prompts.system_prompt import OPTICODE_SYSTEM_PROMPT
from app.security.prompt_guard import detect_prompt_injection, build_user_message
import json

analyze_bp = Blueprint("analyze", __name__)


def _parse_model_json(raw_response: str):
    cleaned = (raw_response or "").strip()

    # Strip accidental markdown fences if model disobeys
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    return json.loads(cleaned)

@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
  

    #  Parse incoming JSON body 
    data = request.get_json(silent=True)

    #  Validate input
    validation = validate_analyze_request(data)

    if not validation["valid"]:
        return jsonify({
            "status": "error",
            "source": "validation",
            "errors": validation["errors"]
        }), 400

    #  Extract fields 
    code = data["code"].strip()
    language = data["language"].strip()

    #  Prompt injection scan
    security_scan = detect_prompt_injection(code)
    hardened_mode = security_scan["risk_level"] in ["medium", "high"]

    user_message = build_user_message(language, code, hardened=hardened_mode)

    messages = [
        {"role": "system", "content": OPTICODE_SYSTEM_PROMPT},
        {"role": "user",   "content": user_message}
    ]

    #  Call LLM provider chain (OpenRouter -> Groq)
    try:
        raw_response = callLLM(messages)
    except Exception as e:
        current_app.logger.exception("LLM request failed: %s", e)
        return jsonify({
            "status": "error",
            "source": "openrouter",
            "message": "Analysis service is temporarily unavailable."
        }), 502

    #  Parse model response as JSON 
    retried = False
    try:
        parsed = _parse_model_json(raw_response)
    except json.JSONDecodeError:
        # Retry once with explicit hardened mode if first parse failed
        retried = True
        hardened_mode = True
        retry_user_message = build_user_message(language, code, hardened=True)
        retry_messages = [
            {"role": "system", "content": OPTICODE_SYSTEM_PROMPT},
            {"role": "user", "content": retry_user_message},
        ]

        try:
            retry_raw = callLLM(retry_messages)
            parsed = _parse_model_json(retry_raw)
        except Exception as e:
            current_app.logger.exception("LLM retry failed: %s", e)
            return jsonify({
                "status": "error",
                "source": "parsing",
                "message": "Model returned an invalid response format."
            }), 500

    # Validate and normalize the response 
    result = validate_response(parsed)

    result["security"] = {
        "prompt_injection": security_scan,
        "mode": "hardened" if hardened_mode else "standard",
        "retry_used": retried,
    }

    #  Return guaranteed structured result 
    return jsonify(result), 200
