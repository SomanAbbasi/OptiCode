
from config import Config

SUPPORTED_LANGUAGES = ["python", "c++", "c", "java", "c#"]

def validate_analyze_request(data: dict) -> dict:
    errors=[]
    
    if not data or not isinstance(data, dict):
        return {
            "valid": False,
            "errors": ["Request body is missing or not valid JSON."]
        }
        
    if "code" not in data:
        errors.append("Missing required field: 'code'.")

    elif not isinstance(data["code"], str) or not data["code"].strip():
        errors.append("Field 'code' must be a non-empty string.")
    else:
        code_bytes = len(data["code"].encode("utf-8"))
        if code_bytes > Config.MAX_CODE_BYTES:
            errors.append("Field 'code' exceeds the maximum allowed size.")

    if "language" not in data:
        errors.append("Missing required field: 'language'.")

    elif data["language"].lower() not in SUPPORTED_LANGUAGES:
        errors.append(
            f"Unsupported language '{data['language']}'. "
            f"Supported languages are: {', '.join(SUPPORTED_LANGUAGES)}."
        )
        
    return {
        "valid": len(errors) == 0,
        "errors": errors
    }