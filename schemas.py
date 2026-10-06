from typing import Literal, Optional
from pydantic import BaseModel, Field

Label = Literal["FAIT_SOURCE", "PROBABLE", "HYPOTHESE_IA"]
Level = Literal["kid", "highschool", "student"]


class State(BaseModel):
    """Owned by the game engine (Person B). The backend never modifies it."""
    soldiers: int
    morale: int
    supplies: int
    elephants: int
    xp: int = 0


class DecisionRecord(BaseModel):
    scene_id: str
    decision_id: str


class AdviceReq(BaseModel):
    scene_id: str
    state: State
    level: Level = "highschool"
    lang: str = "fr"
    hint_level: int = Field(1, ge=1, le=3)
    question: Optional[str] = None  # free-text question to Maharbal


class ReviewReq(BaseModel):
    scene_id: str
    state: State
    decision_id: str
    level: Level = "highschool"
    lang: str = "fr"
    history: list[DecisionRecord] = []


class VerdictReq(BaseModel):
    decisions: list[DecisionRecord]
    state: State
    level: Level = "highschool"
    lang: str = "fr"


class Claim(BaseModel):
    text: str
    label: Label
    fact_id: Optional[str] = None


class Reply(BaseModel):
    role: Literal["advisor", "supervisor"]
    message: str
    claims: list[Claim] = []
    comparison_with_history: Optional[str] = None
    lesson_modern: Optional[str] = None
    source: Literal["llm", "fallback", "cache"] = "llm"


class Comparison(BaseModel):
    scene_id: str
    title: str
    player_choice: str
    historical_choice: str
    match: bool


class VerdictReply(BaseModel):
    comparisons: list[Comparison]  # built by code, not by the LLM
    reply: Reply
