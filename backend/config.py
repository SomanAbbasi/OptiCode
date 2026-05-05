import os
from typing import List, Union
from dotenv import load_dotenv

load_dotenv()

DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://codeenhancer.vercel.app",
]


def _normalize_origin(origin: str) -> str:
    return origin.strip().strip('"').strip("'").rstrip("/")


def _parse_cors_origins() -> Union[str, List[str]]:
    """Parse CORS origins from env, supporting common formats."""
    raw = os.getenv("CORS_ORIGINS") or os.getenv("CORS_ORIGIN")

    if not raw:
        return DEFAULT_CORS_ORIGINS.copy()

    raw = raw.strip()

    if raw == "*":
        return "*"

    # Support JSON-ish arrays without adding a JSON dependency path.
    if raw.startswith("[") and raw.endswith("]"):
        raw = raw[1:-1]

    origins = [_normalize_origin(item) for item in raw.split(",")]
    origins = [item for item in origins if item]

    return origins or "*"


def _parse_bool(value: str, default: bool = False) -> bool:
    if value is None:
        return default
    return str(value).strip().lower() in ("1", "true", "yes", "on")


def _parse_int(value: str, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default

class Config:
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    DEBUG = _parse_bool(os.getenv("FLASK_DEBUG"), False)
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/auto")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")
    CORS_ORIGINS = _parse_cors_origins()
    DEFAULT_CORS_ORIGINS = DEFAULT_CORS_ORIGINS
    ALLOW_WILDCARD_CORS = _parse_bool(os.getenv("ALLOW_WILDCARD_CORS"), False)
    ENABLE_TEST_ENDPOINTS = _parse_bool(os.getenv("ENABLE_TEST_ENDPOINTS"), False)
    REQUIRE_API_KEY = _parse_bool(
        os.getenv("REQUIRE_API_KEY"), FLASK_ENV == "production"
    )
    API_KEY = os.getenv("OPTICODE_API_KEY")
    RATE_LIMIT_MAX = _parse_int(os.getenv("RATE_LIMIT_MAX"), 60)
    RATE_LIMIT_WINDOW_SECONDS = _parse_int(os.getenv("RATE_LIMIT_WINDOW_SECONDS"), 60)
    MAX_CONTENT_LENGTH = _parse_int(os.getenv("MAX_CONTENT_LENGTH"), 1024 * 128)
    MAX_CODE_BYTES = _parse_int(os.getenv("MAX_CODE_BYTES"), 1024 * 64)
    LLM_CONNECT_TIMEOUT_SECONDS = _parse_int(
        os.getenv("LLM_CONNECT_TIMEOUT_SECONDS"), 5
    )
    LLM_READ_TIMEOUT_SECONDS = _parse_int(
        os.getenv("LLM_READ_TIMEOUT_SECONDS"), 25
    )
