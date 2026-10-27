"""Automated API tests for LexiGuard backend.

Gemini and embeddings are mocked, so these tests run offline, are free,
and are deterministic. Run from the backend folder:  pytest -v
"""
import json
import os
import sys

os.environ.setdefault("GEMINI_API_KEY", "test-key")
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from fastapi.testclient import TestClient

import main
import rag


class FakeResponse:
    def __init__(self, text):
        self.text = text


@pytest.fixture()
def client(monkeypatch):
    # Load the KB without calling the embeddings API (keyword retrieval mode)
    def fake_init(_client):
        with open(rag.KB_PATH, encoding="utf8") as f:
            rag.KB = json.load(f)
        rag._collection = None

    monkeypatch.setattr(rag, "init", fake_init)
    captured = {}

    def fake_gemini(contents, json_mode=False, retries=2):
        captured["contents"] = contents
        return FakeResponse(json.dumps({"risk_score": 90, "risk_level": "HIGH", "red_flags": []}))

    monkeypatch.setattr(main, "call_gemini", fake_gemini)
    with TestClient(main.app) as c:
        c.captured = captured
        yield c


def test_health_reports_kb_size(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["kb_entries"] >= 10


def test_analyze_rejects_empty_request(client):
    assert client.post("/api/analyze-document", json={}).status_code == 400


def test_analyze_returns_json_with_retrieval_mode(client):
    r = client.post("/api/analyze-document",
                    json={"rawText": "Security deposit shall be forfeited fully as penalty.", "targetLanguage": "hi"})
    assert r.status_code == 200
    data = r.json()
    assert data["risk_score"] == 90
    assert data["retrieval_mode"] in ("chromadb", "keyword")


def test_analyze_prompt_contains_retrieved_statutes_and_language(client):
    client.post("/api/analyze-document",
                json={"rawText": "Tenant shall not work in any business after leaving. Deposit forfeited as penalty.",
                      "targetLanguage": "hi"})
    prompt = client.captured["contents"][-1]
    assert "RETRIEVED STATUTORY CONTEXT" in prompt
    assert "Hindi" in prompt


def test_retrieval_finds_section_74_for_penalty_query(client):
    ids = [e["id"] for e in rag.retrieve(main.client, "security deposit forfeited penalty without proof of loss", 3)]
    assert "ica-74" in ids


def test_chat_requires_question(client):
    assert client.post("/api/chat-contract", json={}).status_code == 400


def test_chat_returns_answer(client, monkeypatch):
    monkeypatch.setattr(main, "call_gemini", lambda c, json_mode=False, retries=2: FakeResponse("Answer text"))
    r = client.post("/api/chat-contract", json={"question": "Is the penalty valid?", "documentContext": {"a": 1}})
    assert r.status_code == 200
    assert r.json()["answer"] == "Answer text"


def test_navigator_requires_query(client):
    assert client.post("/api/legal-navigator", json={}).status_code == 400


def test_draft_endpoints_validate_input(client):
    assert client.post("/api/draft-extract-entities", json={}).status_code == 400
    assert client.post("/api/draft-generate-contract", json={}).status_code == 400


def test_parse_json_handles_markdown_fences_and_trailing_commas():
    raw = "```json\n{\"a\": 1, \"b\": [1,2,],}\n```"
    assert main.parse_json(raw) == {"a": 1, "b": [1, 2]}
