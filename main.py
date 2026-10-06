import hashlib
import json
import time
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import llm
from prompts import build_advice_messages, build_review_messages, build_verdict_messages
from scenes import FACTS, SCENES, scene_facts
from schemas import (AdviceReq, Comparison, ReviewReq, Reply, VerdictReply, VerdictReq)
from validator import ValidationFailure, validate_reply

app = FastAPI(title="Hannibal AI backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

CACHE: dict[str, Reply] = {}
LOG = Path("logs/requests.jsonl")
LOG.parent.mkdir(exist_ok=True)


def log(**kw):
    with LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"t": time.time(), **kw}, ensure_ascii=False) + "\n")


def get_scene(scene_id: str) -> dict:
    if scene_id not in SCENES:
        raise HTTPException(404, f"unknown scene {scene_id!r}")
    return SCENES[scene_id]


def generate(kind, role, messages, facts, fallback: Reply, forbidden=(), cache_key=None) -> Reply:
    if cache_key and cache_key in CACHE:
        return CACHE[cache_key].model_copy(update={"source": "cache"})
    for attempt in range(2):
        try:
            raw = llm.chat(messages)
        except llm.LLMError as e:
            log(kind=kind, outcome="llm_error", error=str(e))
            break
        try:
            reply = validate_reply(raw, role, facts, forbidden)
            log(kind=kind, outcome="ok", attempt=attempt, reply=reply.model_dump())
            if cache_key:
                CACHE[cache_key] = reply
            return reply
        except ValidationFailure as e:
            log(kind=kind, outcome="rejected", attempt=attempt, error=str(e), raw=raw)
            messages = messages + [
                {"role": "assistant", "content": raw},
                {"role": "user", "content": f"Invalid output: {e}. Return the corrected JSON only."},
            ]
    return fallback.model_copy(update={"source": "fallback"})


def key(*parts) -> str:
    return hashlib.sha1("|".join(map(str, parts)).encode()).hexdigest()


@app.get("/health")
def health():
    return {"ok": True, "scenes": list(SCENES), "facts": len(FACTS)}


@app.post("/advice", response_model=Reply)
def advice(req: AdviceReq):
    scene = get_scene(req.scene_id)
    facts = scene_facts(req.scene_id, include_spoilers=False)
    fb = Reply(**scene["fallbacks"]["advice"])
    ck = None if req.question else key("advice", req.scene_id, req.level, req.lang, req.hint_level)
    return generate("advice", "advisor", build_advice_messages(req), facts, fb,
                    forbidden=scene.get("forbidden_reveal", []), cache_key=ck)


@app.post("/review", response_model=Reply)
def review(req: ReviewReq):
    scene = get_scene(req.scene_id)
    if req.decision_id not in {o["id"] for o in scene["options"]}:
        raise HTTPException(422, f"unknown decision {req.decision_id!r}")
    facts = scene_facts(req.scene_id)
    fb = Reply(**scene["fallbacks"]["review"][req.decision_id])
    ck = key("review", req.scene_id, req.decision_id, req.level, req.lang)
    return generate("review", "supervisor", build_review_messages(req), facts, fb, cache_key=ck)


@app.post("/verdict", response_model=VerdictReply)
def verdict(req: VerdictReq):
    comparisons = []
    for d in req.decisions:
        scene = get_scene(d.scene_id)
        opts = {o["id"]: o["text"] for o in scene["options"]}
        if d.decision_id not in opts:
            raise HTTPException(422, f"unknown decision {d.decision_id!r} for {d.scene_id}")
        hist = scene["historical_option_id"]
        comparisons.append(Comparison(
            scene_id=d.scene_id, title=scene["title"], player_choice=opts[d.decision_id],
            historical_choice=opts[hist], match=(d.decision_id == hist)))
    matches = sum(c.match for c in comparisons)
    fb = Reply(role="supervisor", source="fallback",
               message=f"Tu as suivi mes choix {matches} fois sur {len(comparisons)}. Ce n'est pas le résultat qui compte, mais la raison de chaque décision.",
               lesson_modern="Comprendre pourquoi on décide vaut mieux que copier une décision.")
    reply = generate("verdict", "supervisor", build_verdict_messages(req, comparisons, FACTS),
                     FACTS, fb)
    return VerdictReply(comparisons=comparisons, reply=reply)
