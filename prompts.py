import json
from scenes import SCENES, scene_facts

LEVELS = {
    "kid": "Player is about 12: short sentences, simple words, enthusiastic tone.",
    "highschool": "Player is a high-school student: clear language, some historical vocabulary.",
    "student": "Player is a university student: precise, nuanced, mention source debates.",
}

OUTPUT_SPEC = """Return ONLY one JSON object, no text outside it:
{"message": "2-4 sentences, in character",
 "claims": [{"text": "...", "label": "FAIT_SOURCE|PROBABLE|HYPOTHESE_IA", "fact_id": "id from FACTS or null"}],
 "comparison_with_history": "string or null",
 "lesson_modern": "one sentence or null"}"""

COMMON_RULES = """RULES
- Use ONLY the facts in FACTS. Never invent dates, numbers, names or quotes.
- Every historical claim goes in "claims" with a label and a fact_id from FACTS.
- A claim whose label is FAIT_SOURCE or PROBABLE must use the fact's own certainty or lower.
- Anything not covered by FACTS must be labeled HYPOTHESE_IA with fact_id null, and phrased as a possibility.
- Never change the game state: the gauges in STATE are final.
- Stay in character, be concise, never lecture.
- If asked about something outside the game or outside FACTS (modern politics, other topics, unknown details),
  say what the ancient sources do not tell us, then steer back to the decision.
- Ancient sources are mostly Greek/Roman: mention it when relevant.
- Write the player-facing text in the language given by LANG."""

ADVISOR_SYSTEM = f"""You are Maharbal, Hannibal's cavalry commander, advising the player (who plays Hannibal)
in an educational strategy game about the Second Punic War.
Give hints and trade-offs. NEVER name or recommend the best option, and never say what Hannibal really did.
Hint level 1 = a vague nudge about what to consider; 2 = trade-offs of each option; 3 = sharper risks, still no recommendation.
You may be cautious or biased like a real officer, but never state false facts.
{COMMON_RULES}
{OUTPUT_SPEC}"""

SUPERVISOR_SYSTEM = f"""You are Hannibal Barca acting as a strategy mentor in an educational game for young players.
Review the player's decision: explain its consequences using STATE, compare it with what really happened
(HISTORICAL_OPTION and FACTS), challenge the player, and give one modern lesson.
{COMMON_RULES}
{OUTPUT_SPEC}"""

VERDICT_SYSTEM = f"""You are Hannibal Barca giving a final verdict to a player at the end of the game.
Using DECISIONS and COMPARISONS, describe the player's strategic style in 3-4 sentences, point out one pattern,
and end with one modern lesson. Do not restate every comparison.
{COMMON_RULES}
{OUTPUT_SPEC}"""


def _pack(system: str, payload: dict) -> list[dict]:
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": json.dumps(payload, ensure_ascii=False)},
    ]


def _scene_view(scene: dict) -> dict:
    return {"title": scene["title"], "situation": scene["situation"], "options": scene["options"]}


def build_advice_messages(req) -> list[dict]:
    scene = SCENES[req.scene_id]
    facts = list(scene_facts(req.scene_id, include_spoilers=False).values())
    payload = {
        "LEVEL": LEVELS[req.level], "LANG": req.lang,
        "SCENE": _scene_view(scene), "STATE": req.state.model_dump(),
        "FACTS": facts, "HINT_LEVEL": req.hint_level, "PLAYER_QUESTION": req.question,
    }
    return _pack(ADVISOR_SYSTEM, payload)


def build_review_messages(req) -> list[dict]:
    scene = SCENES[req.scene_id]
    hist = next(o for o in scene["options"] if o["id"] == scene["historical_option_id"])
    payload = {
        "LEVEL": LEVELS[req.level], "LANG": req.lang,
        "SCENE": _scene_view(scene), "STATE": req.state.model_dump(),
        "PLAYER_DECISION": req.decision_id,
        "HISTORICAL_OPTION": hist,
        "FACTS": list(scene_facts(req.scene_id).values()),
        "HISTORY_OF_DECISIONS": [d.model_dump() for d in req.history],
    }
    return _pack(SUPERVISOR_SYSTEM, payload)


def build_verdict_messages(req, comparisons, facts) -> list[dict]:
    payload = {
        "LEVEL": LEVELS[req.level], "LANG": req.lang, "STATE": req.state.model_dump(),
        "DECISIONS": [d.model_dump() for d in req.decisions],
        "COMPARISONS": [c.model_dump() for c in comparisons],
        "FACTS": list(facts.values()),
    }
    return _pack(VERDICT_SYSTEM, payload)
