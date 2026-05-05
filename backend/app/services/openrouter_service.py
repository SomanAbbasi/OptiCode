import logging
import requests
from config import Config

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
logger = logging.getLogger(__name__)


def _timeout() -> tuple:
    return (
        Config.LLM_CONNECT_TIMEOUT_SECONDS,
        Config.LLM_READ_TIMEOUT_SECONDS,
    )


# -----------------------------
# OpenRouter Call (Primary)
# -----------------------------
def callOpenrouter(messages: list) -> str:
    if not Config.OPENROUTER_API_KEY:
        raise RuntimeError("OpenRouter API key is not configured.")

    headers = {
        "Authorization": f"Bearer {Config.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": Config.OPENROUTER_MODEL,
        "messages": messages,
    }

    response = requests.post(
        OPENROUTER_API_URL,
        headers=headers,
        json=payload,
        timeout=_timeout(),
    )

    if response.status_code == 200:
        data = response.json()
        return data["choices"][0]["message"]["content"]

    raise RuntimeError(
        f"OPENROUTER_ERROR: {response.status_code} - request failed."
    )


# -----------------------------
# Groq Call (Fallback)
# -----------------------------
def callGroq(messages: list) -> str:
    if not Config.GROQ_API_KEY:
        raise RuntimeError("Groq API key is not configured.")

    headers = {
        "Authorization": f"Bearer {Config.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": Config.GROQ_MODEL,
        "messages": messages,
    }

    response = requests.post(
        GROQ_API_URL,
        headers=headers,
        json=payload,
        timeout=_timeout(),
    )

    if response.status_code == 200:
        data = response.json()
        return data["choices"][0]["message"]["content"]

    raise RuntimeError(f"GROQ_ERROR: {response.status_code} - request failed.")


# -----------------------------
# Main Smart Fallback
# -----------------------------
def callLLM(messages: list) -> str:
    try:
        return callOpenrouter(messages)
    except Exception as e:
        logger.warning("OpenRouter failed: %s", e)

    try:
        return callGroq(messages)
    except Exception as e:
        logger.warning("Groq failed: %s", e)

    raise RuntimeError("All AI providers are currently unavailable.")
