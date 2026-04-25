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

class Config:
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    DEBUG = os.getenv("FLASK_DEBUG", False)
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/auto")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")
    CORS_ORIGINS = _parse_cors_origins()
