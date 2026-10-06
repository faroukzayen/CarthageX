# Hannibal AI backend

## Run
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env     # then export the variables (or use your shell / direnv)
    uvicorn main:app --reload
Docs: http://localhost:8000/docs

## Local open-source model (recommended for demo safety)
    ollama pull qwen2.5:7b-instruct
    export LLM_BASE_URL=http://localhost:11434/v1 LLM_API_KEY=ollama LLM_MODEL=qwen2.5:7b-instruct

## Add a scene
Copy data/scenes/alps.json, change ids (trasimene_01...), facts, options, fallbacks. Restart the server.

## Contract
POST /advice  /review  /verdict   (see schemas.py). State always comes from the game engine.
If the LLM fails or output is invalid twice, the pre-written fallback is returned (source = "fallback").
