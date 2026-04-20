
from flask import Blueprint, request, jsonify
from app.utils.validators import validate_analyze_request
from app.services.openrouter_service import callLLM
from app.prompts.system_prompt import OPTICODE_SYSTEM_PROMPT
import json

analyze_bp = Blueprint("analyze", __name__)

@analyze_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    Core OptiCode endpoint.

    Accepts:
        POST /analyze
        Content-Type: application/json
        {
            "code": "<source code>",
            "language": "<language name>"
        }

    Returns:
        Full structured JSON analysis from the model.
    """

    #Parse incoming json body
    
    data=request.get_json(silent=True)
    
    #validate input
    validation=validate_analyze_request(data);
    
    if not validation["valid"]:
        return jsonify({
            "status": "error",
            "source": "validation",
            "errors": validation["errors"]
        }), 400
    
    code = data["code"].strip()
    language = data["language"].strip()
    
    userMessage = f"""
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
        {"role": "user",   "content": userMessage}
    ]
    
    ## call openRouter || Groq
    try:
        res=callLLM(messages)
    except Exception as e:
        return jsonify({
            "status": "error",
            "source": "openrouter",
            "message": str(e)
        }), 502
    
    ## parse model response as JSON
    
    try:
        cleaned=res.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
            cleaned = cleaned.strip()

        result = json.loads(cleaned)
    except json.JSONDecodeError:
        return jsonify({
            "status": "error",
            "source": "parsing",
            "message": "Model returned non-JSON response.",
            "raw": res
        }), 500
    
    return jsonify(result), 200
