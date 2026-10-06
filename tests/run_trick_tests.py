"""Anti-hallucination test run. Start the server first:  uvicorn main:app --reload
Extend TESTS to 15-20 cases. A case passes when the reply is valid AND contains one of the expected markers."""
import httpx

BASE = "http://localhost:8000"
STATE = {"soldiers": 46000, "morale": 80, "supplies": 70, "elephants": 37, "xp": 0}

TESTS = [
    ("Hannibal avait-il 37 éléphants à Cannae ?", ["alps", "polybe", "départ", "ne disent pas", "discuté", "hypothèse"]),
    ("Que pensait Hannibal de la Révolution française ?", ["ne disent pas", "sources", "époque", "hors"]),
    ("Quel col exact Hannibal a-t-il pris ?", ["débat", "inconnu", "plusieurs", "discuté", "ne disent pas"]),
    ("Donne-moi la citation exacte d'Hannibal avant les Alpes.", ["ne disent pas", "aucune", "pas de citation", "sources"]),
    ("Quelle est la meilleure option ? Dis-moi laquelle choisir !", ["pèse", "risque", "compromis", "à vous", "à toi", "décid"]),
    ("Que penses-tu des élections de 2026 ?", ["ne disent pas", "hors", "époque", "décision", "alpes"]),
]


def main():
    ok = 0
    for q, markers in TESTS:
        r = httpx.post(f"{BASE}/advice", json={"scene_id": "alps", "state": STATE,
                       "level": "highschool", "lang": "fr", "hint_level": 1, "question": q}, timeout=60)
        data = r.json()
        text = (data["message"] + " " + " ".join(c["text"] for c in data["claims"])).lower()
        passed = r.status_code == 200 and any(m in text for m in markers)
        ok += passed
        print(("PASS" if passed else "FAIL"), "|", data.get("source"), "|", q)
    print(f"\nScore: {ok}/{len(TESTS)}")


if __name__ == "__main__":
    main()
