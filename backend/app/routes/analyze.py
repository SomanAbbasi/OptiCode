
from flask import Blueprint, request, jsonify
from app.utils.validators import validate_analyze_request
from app.utils.response_validator import validate_response
from app.services.openrouter_service import callLLM
from app.prompts.system_prompt import OPTICODE_SYSTEM_PROMPT
import json

analyze_bp = Blueprint("analyze", __name__)

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

    #  Build message payload for the model
    user_message = f"""
Analyze the following {language} code and return ONLY a valid JSON response.
No markdown. No explanation outside the JSON.

INPUT:
{{
  "code": {json.dumps(code)},
  "language": "{language}"
}}
"""

    messages = [
        {"role": "system", "content": OPTICODE_SYSTEM_PROMPT},
        {"role": "user",   "content": user_message}
    ]

    #  Call LLM provider chain (OpenRouter -> Groq)
    try:
        raw_response = callLLM(messages)
    except Exception as e:
        return jsonify({
            "status": "error",
            "source": "openrouter",
            "message": str(e)
        }), 502

    #  Parse model response as JSON 
    try:
        cleaned = raw_response.strip()

        # Strip accidental markdown fences if model disobeys
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
            cleaned = cleaned.strip()

        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        return jsonify({
            "status": "error",
            "source": "parsing",
            "message": "Model returned a non-JSON response.",
            "raw": raw_response
        }), 500

    # Validate and normalize the response 
    result = validate_response(parsed)

    #  Return guaranteed structured result 
    return jsonify(result), 200
