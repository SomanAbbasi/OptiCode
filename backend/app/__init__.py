
from flask import Flask,request,jsonify
from config import Config
from app.services.openrouter_service import callLLM
from app.prompts.system_prompt import OPTICODE_SYSTEM_PROMPT
from app.utils.validators import validate_analyze_request


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    @app.route("/health", methods=["GET"])
    def health():
        return {"status": "ok", "service": "OptiCode Backend"}, 200
    
    @app.route("/test-connection", methods=["GET"])
    def test_connection():
        try:
            response = callLLM([
                {"role": "user", "content": "Reply with: LLM connection successful"}
            ])
            return {"status": "ok", "response": response}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
        
    @app.route("/test-prompt",methods=["GET"])
    def test_prompt():
        try:
            messages = [
                {"role": "system", "content": OPTICODE_SYSTEM_PROMPT},
                {"role": "user", "content": "Reply with only this JSON: {\"status\": \"prompt loaded\"}"}
            ]
            response=callLLM(messages)
            
            return {"status": "ok", "model_reply": response}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
        
    @app.route("/test-validator", methods=["POST"])
    def test_validator():
        data = request.get_json()
        result = validate_analyze_request(data)
        return jsonify(result), 200

    return app