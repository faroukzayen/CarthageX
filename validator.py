import json
import re
from pydantic import ValidationError
from schemas import Reply

RANK = {"HYPOTHESE_IA": 0, "PROBABLE": 1, "FAIT_SOURCE": 2}


class ValidationFailure(Exception):
    pass


def extract_json(raw: str) -> dict:
    raw = re.sub(r"```(?:json)?", "", raw).strip()
    s, e = raw.find("{"), raw.rfind("}")
    if s == -1 or e == -1:
        raise ValidationFailure("no JSON object found")
    try:
        return json.loads(raw[s : e + 1])
    except json.JSONDecodeError as ex:
        raise ValidationFailure(f"invalid JSON: {ex}")


def validate_reply(raw: str, role: str, facts: dict[str, dict], forbidden=()) -> Reply:
    data = extract_json(raw)
    data["role"] = role
    data.pop("source", None)
    try:
        reply = Reply(**data)
    except ValidationError as ex:
        raise ValidationFailure(str(ex)[:300])

    if not reply.message.strip():
        raise ValidationFailure("empty message")

    for c in reply.claims:
        if c.label == "HYPOTHESE_IA":
            continue
        fact = facts.get(c.fact_id or "")
        if fact is None:
            raise ValidationFailure(f"claim labeled {c.label} has unknown fact_id {c.fact_id!r}")
        if RANK[c.label] > RANK[fact["certainty"]]:
            raise ValidationFailure(
                f"claim label {c.label} is stronger than fact {fact['id']} certainty {fact['certainty']}"
            )

    if role == "advisor":
        low = reply.message.lower()
        for phrase in forbidden:
            if phrase.lower() in low:
                raise ValidationFailure(f"advisor revealed the best option ({phrase!r})")
    return reply
