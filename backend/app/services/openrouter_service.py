import requests
from config import Config

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


# -----------------------------
# OpenRouter Call (Primary)
# -----------------------------
def callOpenrouter(messages: list) -> str:
    
    headers = {
        "Authorization": f"Bearer {Config.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": Config.OPENROUTER_MODEL,
        "messages": messages,
    }

    response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        return data["choices"][0]["message"]["content"]

    raise Exception(f"OPENROUTER_ERROR: {response.status_code} — {response.text}")


# -----------------------------
# Groq Call (Fallback)
# -----------------------------
def callGroq(messages: list) -> str:

    headers = {
        "Authorization": f"Bearer {Config.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": Config.GROQ_MODEL,
        "messages": messages,
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        return data["choices"][0]["message"]["content"]

    raise Exception(f"GROQ_ERROR: {response.status_code} — {response.text}")


# -----------------------------
# Main Smart Fallback
# -----------------------------
def callLLM(messages: list) -> str:

    try:
        return callOpenrouter(messages)
    except Exception as e:
        print(f"[OpenRouter Failed] {e}")

    try:
        return callGroq(messages)
    except Exception as e:
        print(f"[Groq Failed] {e}")

    return "All AI providers are currently busy. Please try again later."