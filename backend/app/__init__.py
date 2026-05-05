
from flask import Flask, request, jsonify
from config import Config
from flask_cors import CORS
import hmac
from app.services.openrouter_service import callLLM
from app.prompts.system_prompt import OPTICODE_SYSTEM_PROMPT
from app.utils.validators import validate_analyze_request
from app.routes.analyze import analyze_bp
from app.utils.error_handlers import error_handlers
from app.security.rate_limiter import SimpleRateLimiter


def _is_origin_allowed(request_origin: str, allowed_origins) -> bool:
    allowed = allowed_origins

    if allowed == "*":
        return True

    normalized_request = request_origin.rstrip("/")
    return normalized_request in allowed


def _get_client_ip() -> str:
    forwarded = request.headers.get("X-Forwarded-For", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.remote_addr or "unknown"


def _extract_api_key() -> str:
    header_key = request.headers.get("X-API-Key")
    if header_key:
        return header_key

    auth = request.headers.get("Authorization", "")
    if auth.lower().startswith("bearer "):
        return auth.split(" ", 1)[1].strip()

    return ""


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    if Config.REQUIRE_API_KEY and not Config.API_KEY:
        raise RuntimeError("OPTICODE_API_KEY is required when REQUIRE_API_KEY is enabled.")

    allowed_origins = Config.CORS_ORIGINS
    if allowed_origins == "*" and not Config.ALLOW_WILDCARD_CORS:
        app.logger.warning("Wildcard CORS is disabled. Falling back to default origins.")
        allowed_origins = Config.DEFAULT_CORS_ORIGINS

    app.config["CORS_ALLOWED_ORIGINS"] = allowed_origins
    app.config["MAX_CONTENT_LENGTH"] = Config.MAX_CONTENT_LENGTH

    limiter = SimpleRateLimiter(
        Config.RATE_LIMIT_MAX,
        Config.RATE_LIMIT_WINDOW_SECONDS,
    )
    
    
    # CORS
    CORS(app, resources={
        r"/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-API-Key"],
            "supports_credentials": False,
            "send_wildcard": allowed_origins == "*",
            "max_age": 86400,
        }
    })

    @app.before_request
    def reject_disallowed_origin():
        origin = request.headers.get("Origin")

        if not origin or _is_origin_allowed(origin, allowed_origins):
            return None

        return jsonify({
            "status": "error",
            "message": "Origin not allowed.",
        }), 403

    @app.before_request
    def require_api_key():
        if request.path == "/health":
            return None

        if not Config.REQUIRE_API_KEY:
            return None

        client_key = _extract_api_key()
        if client_key and hmac.compare_digest(client_key, Config.API_KEY):
            return None

        return jsonify({
            "status": "error",
            "message": "Unauthorized.",
        }), 401

    @app.before_request
    def rate_limit_requests():
        if request.path == "/health":
            return None

        if not limiter.allow(_get_client_ip()):
            return jsonify({
                "status": "error",
                "message": "Too many requests. Please slow down.",
            }), 429

    @app.after_request
    def apply_cors_fallback(response):
        origin = request.headers.get("Origin")
        if not origin:
            return response

        if not _is_origin_allowed(origin, allowed_origins):
            return response

        if allowed_origins == "*":
            response.headers["Access-Control-Allow-Origin"] = "*"
        else:
            response.headers["Access-Control-Allow-Origin"] = origin.rstrip("/")
            response.headers["Vary"] = "Origin"

        response.headers.setdefault("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.setdefault(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-API-Key",
        )
        response.headers.setdefault("Access-Control-Max-Age", "86400")

        return response

     # Register Blueprints 
    app.register_blueprint(analyze_bp)
    
    # Register global error object
    
    error_handlers(app)
    
    @app.route("/health", methods=["GET"])
    def health():
        return {"status": "ok", "service": "OptiCode Backend"}, 200

    if Config.ENABLE_TEST_ENDPOINTS:
        @app.route("/test-connection", methods=["GET"])
        def test_connection():
            try:
                response = callLLM([
                    {"role": "user", "content": "Reply with: LLM connection successful"}
                ])
                return {"status": "ok", "response": response}, 200
            except Exception as e:
                app.logger.exception("Test connection failed: %s", e)
                return {"status": "error", "message": "Test failed."}, 500

        @app.route("/test-prompt", methods=["GET"])
        def test_prompt():
            try:
                messages = [
                    {"role": "system", "content": OPTICODE_SYSTEM_PROMPT},
                    {"role": "user", "content": "Reply with only this JSON: {\"status\": \"prompt loaded\"}"}
                ]
                response = callLLM(messages)

                return {"status": "ok", "model_reply": response}, 200
            except Exception as e:
                app.logger.exception("Test prompt failed: %s", e)
                return {"status": "error", "message": "Test failed."}, 500

        @app.route("/test-validator", methods=["POST"])
        def test_validator():
            data = request.get_json()
            result = validate_analyze_request(data)
            return jsonify(result), 200

    return app