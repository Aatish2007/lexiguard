import base64, io, json, logging, os, re, time
from typing import Any, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai
from google.genai import types

import prompts as P
import rag

load_dotenv()
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("lexiguard")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))
MODELS = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"]

LANGUAGE_NAMES = {
    "en": "English", "hi": "Hindi (हिन्दी)", "mr": "Marathi (मराठी)", "bn": "Bengali (বাংলা)",
    "ta": "Tamil (தமிழ்)", "te": "Telugu (తెలుగు)", "gu": "Gujarati (ગુજરાતી)",
    "kn": "Kannada (ಕನ್ನಡ)", "ml": "Malayalam (മലയാളം)", "pa": "Punjabi (ਪੰਜਾਬੀ)",
}
DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

app = FastAPI(title="LexiGuard API")
origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])


@app.on_event("startup")
def _startup():
    rag.init(client)


def lang(code: Optional[str]) -> str:
    return LANGUAGE_NAMES.get(code or "", "Hindi (हिन्दी)")


def fill(tpl: str, **kw: str) -> str:
    for k, v in kw.items():
        tpl = tpl.replace(f"<<{k}>>", v)
    return tpl


def call_gemini(contents: Any, json_mode: bool = False, retries: int = 2):
    cfg = types.GenerateContentConfig(response_mime_type="application/json") if json_mode else None
    last = None
    for attempt in range(retries + 1):
        model = MODELS[min(attempt, len(MODELS) - 1)]
        try:
            return client.models.generate_content(model=model, contents=contents, config=cfg)
        except Exception as ex:  # noqa
            last = ex
            log.warning("Gemini attempt %d (%s) failed: %s", attempt + 1, model, ex)
            if attempt < retries:
                time.sleep(2 ** attempt)
    raise last


def parse_json(raw: str):
    clean = (raw or "").strip()
    clean = re.sub(r"^```(?:json)?\s*", "", clean, flags=re.I)
    clean = re.sub(r"```\s*$", "", clean)
    a, b = clean.find("{"), clean.rfind("}")
    if a != -1 and b > a:
        clean = clean[a:b + 1]
    try:
        return json.loads(clean)
    except Exception:
        try:
            return json.loads(re.sub(r",\s*([}\]])", r"\1", clean))
        except Exception:
            log.error("JSON parse failed: %s", raw[:300])
            return None


def err(msg: str, code: int = 500):
    return JSONResponse({"error": msg}, status_code=code)


@app.get("/health")
def health():
    return {"status": "ok", "kb_entries": len(rag.KB), "retrieval": "chromadb" if rag._collection is not None else "keyword"}


# 1. ANALYZE DOCUMENT -------------------------------------------------
@app.post("/api/analyze-document")
def analyze_document(body: dict):
    try:
        file_b64 = body.get("fileBase64")
        mime = body.get("mimeType")
        name = body.get("fileName")
        raw = body.get("rawText")
        if not file_b64 and not raw:
            return err("Please provide a document file or text content.", 400)

        parts: list = []
        snippet = ""
        doc_text = ""
        if mime == DOCX_MIME and file_b64:
            try:
                from docx import Document
                d = Document(io.BytesIO(base64.b64decode(file_b64)))
                doc_text = "\n".join(p.text for p in d.paragraphs)
                snippet = doc_text[:3000]
                parts.append(f"Document Name: {name or 'Document.docx'}\n\nDocument Content:\n{doc_text}")
            except Exception as ex:  # noqa
                log.warning("DOCX extraction failed: %s", ex)
        elif file_b64 and mime:
            parts.append(types.Part.from_bytes(data=base64.b64decode(file_b64), mime_type=mime))
            snippet = f"[Multimodal Document Upload: {name or 'scanned_contract'}]"
        elif raw:
            doc_text = raw
            snippet = raw[:3000]
            parts.append(f"Document Content:\n{raw}")

        L = lang(body.get("targetLanguage"))
        # RAG: retrieve statutory context from text (for scans/PDFs use the file name + doc type hints)
        query = doc_text or "rent agreement employment contract security deposit penalty non-compete eviction cheating breach of trust intimidation"
        ctx = rag.format_context(rag.retrieve(client, query, 4))
        system = fill(P.SYSTEM_ANALYZE, LANG=L) + ctx
        parts.append(f"{system}\n\n" + fill(P.ANALYZE_SCHEMA, LANG=L))

        resp = call_gemini(parts, json_mode=True)
        parsed = parse_json(resp.text)
        if not parsed:
            return err("Failed to parse legal analysis result.")
        if not parsed.get("extracted_text_snippet") and snippet:
            parsed["extracted_text_snippet"] = snippet
        parsed["retrieval_mode"] = rag.last_mode
        return parsed
    except Exception as ex:  # noqa
        log.exception("analyze-document")
        return err(str(ex) or "An unexpected error occurred while analyzing the document.")


# 2. CHAT WITH CONTRACT (RAG) ----------------------------------------
@app.post("/api/chat-contract")
def chat_contract(body: dict):
    try:
        question = body.get("question")
        if not question:
            return err("Question is required.", 400)
        ctx_doc = body.get("documentContext")
        doc = ctx_doc if isinstance(ctx_doc, str) else json.dumps(ctx_doc, indent=2, ensure_ascii=False)
        hist = "\n\n".join(
            f"{'User' if m.get('role') == 'user' else 'LexiGuard'}: {m.get('content')}"
            for m in (body.get("chatHistory") or [])
        ) or "No prior messages."
        prompt = fill(P.CHAT, DOC=doc, HISTORY=hist, QUESTION=question, LANG=lang(body.get("targetLanguage")))
        prompt += rag.format_context(rag.retrieve(client, question, 3))
        resp = call_gemini(prompt)
        return {"answer": resp.text}
    except Exception as ex:  # noqa
        log.exception("chat-contract")
        return err(str(ex) or "Failed to answer contract question.")


# 3. VOICE -> ENTITIES ------------------------------------------------
@app.post("/api/draft-extract-entities")
def draft_extract(body: dict):
    try:
        if not body.get("transcript"):
            return err("Voice transcript or text description is required.", 400)
        prompt = fill(P.EXTRACT, DOCTYPE=body.get("documentType", ""), TRANSCRIPT=body["transcript"])
        resp = call_gemini(prompt, json_mode=True)
        return parse_json(resp.text) or {}
    except Exception as ex:  # noqa
        log.exception("draft-extract")
        return err(str(ex) or "Failed to extract draft entities.")


# 4. GENERATE CONTRACT -----------------------------------------------
@app.post("/api/draft-generate-contract")
def draft_generate(body: dict):
    try:
        fields = body.get("fields")
        if not fields:
            return err("Document fields are required.", 400)
        prompt = fill(P.GENERATE, DOCTYPE=body.get("documentType", ""),
                      FIELDS=json.dumps(fields, indent=2, ensure_ascii=False),
                      LANG=lang(body.get("targetLanguage")))
        resp = call_gemini(prompt, json_mode=True)
        parsed = parse_json(resp.text)
        return parsed if parsed else err("Failed to generate contract.")
    except Exception as ex:  # noqa
        log.exception("draft-generate")
        return err(str(ex) or "Failed to generate draft contract.")


# 5. LEGAL NAVIGATOR --------------------------------------------------
@app.post("/api/legal-navigator")
def legal_navigator(body: dict):
    try:
        q = body.get("query")
        if not q:
            return err("Please enter a legal issue or dispute.", 400)
        cat = f"Category: {body['category']}" if body.get("category") else ""
        prompt = fill(P.NAVIGATOR, QUERY=q, CATEGORY=cat, LANG=lang(body.get("targetLanguage")))
        prompt += rag.format_context(rag.retrieve(client, q, 3))
        resp = call_gemini(prompt, json_mode=True)
        parsed = parse_json(resp.text)
        return parsed if parsed else err("Failed to generate legal roadmap.")
    except Exception as ex:  # noqa
        log.exception("legal-navigator")
        return err(str(ex) or "Failed to navigate legal procedure.")
