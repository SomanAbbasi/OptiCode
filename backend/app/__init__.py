
from flask import Flask,request,jsonify
from config import Config
from flask_cors import CORS
from app.services.openrouter_service import callLLM
from app.prompts.system_prompt import OPTICODE_SYSTEM_PROMPT
from app.utils.validators import validate_analyze_request
from app.routes.analyze import analyze_bp
from app.utils.error_handlers import error_handlers


def _is_origin_allowed(request_origin: str) -> bool:
    allowed = Config.CORS_ORIGINS

    if allowed == "*":
        return True

    normalized_request = request_origin.rstrip("/")
    return normalized_request in allowed


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    
    # CORS
    CORS(app, resources={
        r"/*": {
            "origins": Config.CORS_ORIGINS,
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": False,
            "send_wildcard": Config.CORS_ORIGINS == "*",
            "max_age": 86400,
        }
    })

    @app.before_request
    def reject_disallowed_origin():
        origin = request.headers.get("Origin")

        if not origin or _is_origin_allowed(origin):
            return None

        return jsonify({
            "status": "error",
            "message": "Origin not allowed.",
        }), 403

    @app.after_request
    def apply_cors_fallback(response):
        origin = request.headers.get("Origin")
        if not origin:
            return response

        if not _is_origin_allowed(origin):
            return response

        if Config.CORS_ORIGINS == "*":
            response.headers["Access-Control-Allow-Origin"] = "*"
        else:
            response.headers["Access-Control-Allow-Origin"] = origin.rstrip("/")
            response.headers["Vary"] = "Origin"

        response.headers.setdefault("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.setdefault("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.setdefault("Access-Control-Max-Age", "86400")

        return response

     # Register Blueprints 
    app.register_blueprint(analyze_bp)
    
    # Register global error object
    
    error_handlers(app)
    
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