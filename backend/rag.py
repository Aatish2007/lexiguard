"""Retrieval over data/legal_kb.json.

Primary: ChromaDB (embedded, in-memory) + Gemini embeddings.
Fallback: simple keyword-overlap scoring, so the app still answers if
embeddings or Chroma fail (e.g. quota). `last_mode` tells which was used.
"""
import json, os, re, logging
from typing import List, Dict

log = logging.getLogger("rag")
KB_PATH = os.path.join(os.path.dirname(__file__), "data", "legal_kb.json")
EMBED_MODEL = "gemini-embedding-001"

KB: List[Dict] = []
_collection = None
last_mode = "none"


def _doc_text(e: Dict) -> str:
    return f"{e['source']} {e['section']}: {e['text']}"


def init(client) -> None:
    """Load KB and try to build the Chroma index. Never raises."""
    global KB, _collection
    with open(KB_PATH, encoding="utf8") as f:
        KB = json.load(f)
    try:
        import chromadb
        chroma = chromadb.EphemeralClient()
        col = chroma.get_or_create_collection("legal_kb", metadata={"hnsw:space": "cosine"})
        texts = [_doc_text(e) for e in KB]
        emb = client.models.embed_content(model=EMBED_MODEL, contents=texts)
        col.add(ids=[e["id"] for e in KB], documents=texts,
                embeddings=[x.values for x in emb.embeddings])
        _collection = col
        log.info("ChromaDB index built with %d entries", len(KB))
    except Exception as ex:  # noqa
        _collection = None
        log.warning("Chroma/embeddings unavailable, using keyword fallback: %s", ex)


def _keyword(query: str, k: int) -> List[Dict]:
    q = set(re.findall(r"[a-z0-9]+", query.lower()))
    scored = []
    for e in KB:
        d = set(re.findall(r"[a-z0-9]+", _doc_text(e).lower()))
        scored.append((len(q & d), e))
    scored.sort(key=lambda x: -x[0])
    return [e for s, e in scored[:k] if s > 0]


def retrieve(client, query: str, k: int = 3) -> List[Dict]:
    global last_mode
    query = (query or "")[:6000]
    if not KB or not query.strip():
        return []
    if _collection is not None:
        try:
            qe = client.models.embed_content(model=EMBED_MODEL, contents=[query])
            res = _collection.query(query_embeddings=[qe.embeddings[0].values], n_results=min(k, len(KB)))
            ids = res["ids"][0]
            last_mode = "chromadb"
            return [e for i in ids for e in KB if e["id"] == i]
        except Exception as ex:  # noqa
            log.warning("Vector query failed, keyword fallback: %s", ex)
    last_mode = "keyword"
    return _keyword(query, k)


def format_context(entries: List[Dict]) -> str:
    if not entries:
        return ""
    lines = [f"- [{e['source']} - {e['section']}] {e['text']}" for e in entries]
    return ("\n\nRETRIEVED STATUTORY CONTEXT (use these provisions as grounding; "
            "cite them when relevant; do not invent other sections):\n" + "\n".join(lines))
