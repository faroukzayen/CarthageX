import json
from pathlib import Path

SCENES: dict[str, dict] = {}
FACTS: dict[str, dict] = {}

for p in sorted(Path(__file__).parent.joinpath("data/scenes").glob("*.json")):
    scene = json.loads(p.read_text(encoding="utf-8"))
    SCENES[scene["scene_id"]] = scene
    for f in scene["facts"]:
        f["scene_id"] = scene["scene_id"]
        FACTS[f["id"]] = f


def scene_facts(scene_id: str, include_spoilers: bool = True) -> dict[str, dict]:
    return {
        f["id"]: f
        for f in SCENES[scene_id]["facts"]
        if include_spoilers or not f.get("spoiler")
    }
