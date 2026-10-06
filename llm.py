"""Single entry point to the LLM. Swap provider/model via env vars only."""
import os
from openai import OpenAI


class LLMError(Exception):
    pass


_client = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(
            base_url=os.getenv("LLM_BASE_URL", "http://localhost:11434/v1"),
            api_key=os.getenv("LLM_API_KEY", "ollama"),
            timeout=float(os.getenv("LLM_TIMEOUT", "40")),
        )
    return _client


def chat(messages: list[dict], temperature: float = 0.2) -> str:
    model = os.getenv("LLM_MODEL", "qwen2.5:7b-instruct")
    kwargs = dict(model=model, messages=messages, temperature=temperature, max_tokens=700)
    try:
        try:
            r = _get_client().chat.completions.create(
                response_format={"type": "json_object"}, **kwargs
            )
        except Exception:
            # some providers/models don't support JSON mode: retry without it
            r = _get_client().chat.completions.create(**kwargs)
        return r.choices[0].message.content or ""
    except Exception as e:
        raise LLMError(str(e)) from e
