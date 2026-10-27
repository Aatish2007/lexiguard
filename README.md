# LexiGuard

AI-powered legal assistant and contract risk analyzer for Indian citizens. LexiGuard reads a rent agreement, employment letter or similar document, scores its risk, flags unfair clauses with the relevant Indian statute, explains them in the user's own language, and guides the user to free legal aid when the risk is high.

> Academic project (B.Tech, Semester 5, AI), PSIT Kanpur. Not a substitute for advice from a qualified lawyer.

## Features

- **Contract risk analysis**: upload a PDF, image or DOCX, or paste text. Returns a 0-100 risk score, red flags with statutory basis, favourable clauses and missing protections.
- **Grounded in statute (RAG)**: relevant provisions are retrieved from a legal knowledge base (ChromaDB + Gemini embeddings) and supplied to the model, so answers cite real sections.
- **IPC to BNS mapping**: old IPC sections are mapped to the Bharatiya Nyaya Sanhita, 2023 with bailable / cognizable status.
- **Chat with your contract**: ask questions about the analysed document.
- **Legal Navigator**: step-by-step procedure, portals, helplines and costs for a dispute.
- **Awaaz Se Draft**: speak or type your terms in Hindi/English and get a formatted agreement draft.
- **Multilingual output**: English, Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi.
- **Escalation**: risk above 80 recommends Tele-Law / NALSA free legal aid.
- **Accounts and history**: sign-in with Supabase Auth; reports saved per user with Row Level Security.

## Architecture

```
React + Vite (TypeScript)  --->  FastAPI backend  --->  Gemini API
        |                              |
        |                              +--> ChromaDB (legal_kb.json, Gemini embeddings)
        |
        +--> Supabase (Auth + PostgreSQL: profiles, risk_reports)
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| AI | Google Gemini (structured JSON output, multimodal), Gemini embeddings |
| Retrieval | ChromaDB (embedded) over `backend/data/legal_kb.json` |
| Auth and data | Supabase (Auth, PostgreSQL, Row Level Security) |
| Deployment | Render |

## Project structure

```
lexiguard/
  backend/
    main.py            # FastAPI app and the 5 API endpoints
    rag.py             # ChromaDB index and retrieval
    prompts.py         # prompt templates
    data/legal_kb.json # statutory knowledge base
    requirements.txt
  frontend/
    src/               # React app (components, context, lib, utils)
    package.json
```

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | status, KB size, retrieval mode |
| POST | `/api/analyze-document` | contract risk analysis |
| POST | `/api/chat-contract` | Q&A about the analysed contract |
| POST | `/api/draft-extract-entities` | voice/text to structured fields |
| POST | `/api/draft-generate-contract` | generate formatted agreement |
| POST | `/api/legal-navigator` | legal procedure roadmap |

## Run locally

Requirements: Python 3.12, Node.js 20+, a Gemini API key, a Supabase project.

**Backend**
```
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env       # then set GEMINI_API_KEY
uvicorn main:app --port 8000
```

**Frontend**
```
cd frontend
npm install
# create .env with:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
# VITE_API_URL=http://localhost:8000
npm run dev
```
Open http://localhost:3000.

## Disclaimer

LexiGuard provides general legal information and risk indicators. Statutory text in the knowledge base should be verified against official sources (indiacode.nic.in). It does not create a lawyer-client relationship.
