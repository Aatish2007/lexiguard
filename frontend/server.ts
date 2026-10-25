import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

// Configure body limits for document/photo uploads (up to 25MB base64)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  gu: 'Gujarati (ગુજરાતી)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
};

// Helper to call Gemini with retries on transient errors (e.g. 503 high demand)
async function callGeminiWithRetry(
  params: {
    model?: string;
    contents: any;
    config?: any;
  },
  maxRetries = 2
) {
  const modelsToTry = [params.model || 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const modelToUse = modelsToTry[Math.min(attempt, modelsToTry.length - 1)];
    try {
      const res = await ai.models.generateContent({
        ...params,
        model: modelToUse,
      });
      return res;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`Gemini attempt ${attempt + 1} with ${modelToUse} failed:`, errMsg);
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

// Helper to sanitize Gemini JSON responses
function parseGeminiJson<T>(rawText: string, fallback: T): T {
  try {
    let clean = (rawText || '').trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/```\s*$/i, '');
    }

    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }

    try {
      return JSON.parse(clean) as T;
    } catch {
      // Clean up common JSON issues like trailing commas
      clean = clean.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(clean) as T;
    }
  } catch (err) {
    console.error('Failed to parse JSON response from Gemini:', err, rawText);
    return fallback;
  }
}

// -------------------------------------------------------------
// 1. ANALYZE DOCUMENT API
// -------------------------------------------------------------
app.post('/api/analyze-document', async (req: Request, res: Response) => {
  try {
    const { fileBase64, mimeType, fileName, rawText, targetLanguage } = req.body;

    if (!fileBase64 && !rawText) {
      return res.status(400).json({ error: 'Please provide a document file or text content.' });
    }

    const targetLangName = LANGUAGE_NAMES[targetLanguage] || 'Hindi (हिन्दी)';

    let contentsParts: any[] = [];
    let extractedSnippet = '';

    // Handle DOCX via mammoth
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && fileBase64) {
      try {
        const buffer = Buffer.from(fileBase64, 'base64');
        const result = await mammoth.extractRawText({ buffer });
        const docxText = result.value;
        extractedSnippet = docxText.slice(0, 3000);
        contentsParts.push({
          text: `Document Name: ${fileName || 'Document.docx'}\n\nDocument Content:\n${docxText}`
        });
      } catch (mErr) {
        console.warn('DOCX extraction error, falling back:', mErr);
      }
    } else if (fileBase64 && mimeType) {
      // Direct multimodal support for PDF and images (png, jpeg, webp)
      contentsParts.push({
        inlineData: {
          mimeType,
          data: fileBase64,
        },
      });
      extractedSnippet = `[Multimodal Document Upload: ${fileName || 'scanned_contract'}]`;
    } else if (rawText) {
      extractedSnippet = rawText.slice(0, 3000);
      contentsParts.push({
        text: `Document Content:\n${rawText}`,
      });
    }

    const systemPrompt = `You are LexiGuard, an expert Indian Legal Assistant and Contract Risk Analyzer.
Your task is to thoroughly inspect legal contracts, agreements, notices, or terms under Indian Law.
You must apply REAL Indian legal provisions:
1. Indian Contract Act, 1872:
   - Section 23 (Unlawful consideration/object, against public policy)
   - Section 27 (Agreement in restraint of trade is VOID — e.g., blanket employee non-compete clauses are strictly void in India per Sup. Ct. Niranjan Shankar Golikari and Percept D'Mark rulings)
   - Section 28 (Agreements in restraint of legal proceedings)
   - Section 73 & 74 (Liquidated damages vs unconscionable penalty bonds)
2. Bharatiya Nyaya Sanhita, 2023 (BNS) & corresponding Indian Penal Code (IPC):
   - Cheating: IPC 420 -> BNS 318(4)
   - Criminal Breach of Trust: IPC 405/406 -> BNS 316
   - Forgery & Fraudulent Execution: IPC 463/465 -> BNS 336
   - Criminal Intimidation & Extortion: IPC 503/506 -> BNS 351
   State whether offenses are Bailable/Non-Bailable and Cognizable/Non-Cognizable under BNSS 2023.
3. Consumer Protection Act, 2019:
   - Section 2(46) "Unfair Contract" (imposing unreasonable charge/penalty, unilateral termination, excessive deposit).
4. Rent & Tenancy Laws (Transfer of Property Act 1882 Sections 105-111, State Rent Control Acts, Model Tenancy Act principles):
   - Arbitrary immediate eviction without 30-day notice is unlawful.
   - Forfeiture of complete security deposit without proof of actual damage is void.
   - Landlord cutting electricity/water is an offense under rent control acts.

USER'S PREFERRED REGIONAL LANGUAGE: ${targetLangName}.
CRITICAL INSTRUCTIONS:
- NEVER invent fake laws, acts, or section numbers.
- Calculate risk_score from 0 (very safe) to 100 (critically dangerous/exploitative/illegal).
- Risk level: LOW (0-35), MEDIUM (36-70), HIGH (71-100).
- Provide clear, high-quality, authentic regional translations in ${targetLangName} ("regional_explanation" and "document_summary_regional") using its proper script so that citizens clearly understand what they are signing. Also populate "hindi_explanation" for fallback.
- Identify at least 2-5 red flags if present, or highlight missing vital protections.
- Provide IPC to BNS mappings relevant to contract disputes (fraudulent retention of deposit, extortionate threats, breach of trust, document forgery).
- If risk_score > 80, set "expert_escalation_needed": true.`;

    contentsParts.push({
      text: `${systemPrompt}\n\nAnalyze this document and return valid JSON strictly following this schema structure:
{
  "document_type": "Rent Agreement / Employment Offer / Notice / Contract",
  "document_summary": "Executive summary in English",
  "document_summary_hindi": "Hindi summary",
  "document_summary_regional": "Plain language summary in authentic ${targetLangName} script",
  "regional_language_name": "${targetLangName}",
  "risk_score": 75,
  "risk_level": "HIGH",
  "extracted_text_snippet": "Relevant clause snippet",
  "red_flags": [
    {
      "clause_text": "Quoted problematic clause",
      "severity": "HIGH",
      "legal_basis": "Section 23/27 Indian Contract Act 1872 or BNS section",
      "issue_explanation": "Why this clause is legally invalid or harmful",
      "hindi_explanation": "Explanation in Hindi",
      "regional_explanation": "Natural explanation in ${targetLangName}",
      "recommendation": "Suggested amendment"
    }
  ],
  "favorable_clauses": [
    {
      "clause_text": "Protective clause",
      "benefit": "Why this protects the citizen",
      "hindi_benefit": "Hindi explanation",
      "regional_benefit": "Regional explanation in ${targetLangName}"
    }
  ],
  "missing_protections": [
    "Missing protection item"
  ],
  "ipc_bns_mappings": [
    {
      "old_ipc_section": "IPC 420",
      "new_bns_section": "BNS 318(4)",
      "title": "Cheating & Fraud",
      "bailable": "Non-Bailable",
      "cognizable": "Cognizable",
      "punishment": "Imprisonment up to 7 years and fine",
      "hindi_explanation": "Explanation in Hindi",
      "regional_explanation": "Explanation in ${targetLangName}",
      "applicability_context": "Relevance to this contract"
    }
  ],
  "expert_escalation_needed": true,
  "tele_law_guidance": "Guidance on seeking free legal aid"
}`
    });

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: contentsParts,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseGeminiJson<any>(response.text || '{}', null);
    if (!parsed) {
      return res.status(500).json({ error: 'Failed to parse legal analysis result.' });
    }

    if (!parsed.extracted_text_snippet && extractedSnippet) {
      parsed.extracted_text_snippet = extractedSnippet;
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-document:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred while analyzing the document.',
    });
  }
});

// -------------------------------------------------------------
// 2. CHAT WITH CONTRACT (RAG-based Q&A)
// -------------------------------------------------------------
app.post('/api/chat-contract', async (req: Request, res: Response) => {
  try {
    const { documentContext, question, chatHistory, targetLanguage } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const targetLangName = LANGUAGE_NAMES[targetLanguage] || 'Hindi (हिन्दी)';

    const historyPrompt = (chatHistory || [])
      .map((m: any) => `${m.role === 'user' ? 'User' : 'LexiGuard'}: ${m.content}`)
      .join('\n\n');

    const prompt = `You are LexiGuard, an Indian Legal Assistant providing grounded answers about a user's analyzed legal contract.

DOCUMENT CONTEXT & EXTRACTED DATA:
${typeof documentContext === 'string' ? documentContext : JSON.stringify(documentContext, null, 2)}

PREVIOUS CONVERSATION:
${historyPrompt || 'No prior messages.'}

USER QUESTION:
${question}

USER'S PREFERRED LANGUAGE FOR EXPLANATION: ${targetLangName}

INSTRUCTIONS:
1. Ground your answer directly in the document clauses and relevant Indian statutes (Indian Contract Act 1872, BNS 2023, Consumer Protection Act 2019, Transfer of Property Act 1882, Specific Relief Act 1963).
2. If a clause violates Indian law (e.g., Section 27 restraint of trade for employees, unreasonable forfeiture of deposit without damage proof, lockout without due process), explain why the clause is legally void under Indian law.
3. Quote relevant contract lines where appropriate.
4. Give a practical, actionable recommendation for the citizen in India.
5. Provide a clear, natural summary/advice section in the user's chosen language: ${targetLangName} ("सरल सारांश / Plain Language Advice (${targetLangName})") using its authentic script so it is accessible.
6. Format your answer with clean Markdown (bullet points, bold highlights).`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error in /api/chat-contract:', error);
    return res.status(500).json({ error: error.message || 'Failed to answer contract question.' });
  }
});

// -------------------------------------------------------------
// 3. VOICE-TO-CONTRACT: EXTRACT STRUCTURED ENTITIES
// -------------------------------------------------------------
app.post('/api/draft-extract-entities', async (req: Request, res: Response) => {
  try {
    const { documentType, transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Voice transcript or text description is required.' });
    }

    const prompt = `You are LexiGuard's Voice-to-Contract AI parser ("Awaaz Se Draft").
The user spoke or typed in Hindi, Hinglish, or English describing terms for a legal document: "${documentType}".

USER INPUT:
"${transcript}"

Extract all legal entities and terms mentioned in the input, and provide reasonable standard Indian legal defaults for any missing standard fields.
Return a clean JSON object with these keys depending on documentType:

For "Rent Agreement":
{
  "landlord_name": string,
  "tenant_name": string,
  "property_address": string,
  "monthly_rent": string (e.g. "₹25,000"),
  "security_deposit": string (e.g. "₹75,000"),
  "lease_duration": string (e.g. "11 Months"),
  "lock_in_period": string (e.g. "3 Months" or "None"),
  "notice_period": string (e.g. "1 Month written notice"),
  "utility_charges": string (e.g. "As per actual meter reading"),
  "jurisdiction_city": string (e.g. "Bengaluru, Karnataka"),
  "additional_terms": string
}

For "Employment Letter":
{
  "employer_name": string,
  "employee_name": string,
  "job_title": string,
  "annual_ctc": string (e.g. "₹12,00,000 per annum"),
  "probation_period": string (e.g. "3 Months"),
  "notice_period": string (e.g. "30 Days"),
  "location": string,
  "working_hours": string,
  "additional_terms": string
}

For "Freelance Contract":
{
  "client_name": string,
  "freelancer_name": string,
  "project_title": string,
  "total_fee": string (e.g. "₹85,000"),
  "milestone_schedule": string,
  "revision_limit": string (e.g. "Up to 2 rounds of minor revisions"),
  "ip_transfer_term": string (e.g. "IP transfers strictly upon 100% full payment receipt"),
  "deadline": string,
  "jurisdiction_city": string
}

For "Non-Disclosure Agreement (NDA)":
{
  "disclosing_party": string,
  "receiving_party": string,
  "purpose": string,
  "confidential_period": string (e.g. "2 Years from disclosure"),
  "jurisdiction_city": string,
  "exceptions": string
}

Also include:
{
  "extracted_fields": { ... the fields above ... },
  "confidence_notes": string (brief summary of what was heard vs what was auto-filled)
}`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseGeminiJson(response.text || '{}', {});
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/draft-extract-entities:', error);
    return res.status(500).json({ error: error.message || 'Failed to extract draft entities.' });
  }
});

// -------------------------------------------------------------
// 4. VOICE-TO-CONTRACT: GENERATE FORMATTED LEGAL CONTRACT
// -------------------------------------------------------------
app.post('/api/draft-generate-contract', async (req: Request, res: Response) => {
  try {
    const { documentType, fields, targetLanguage } = req.body;

    if (!fields) {
      return res.status(400).json({ error: 'Document fields are required.' });
    }

    const targetLangName = LANGUAGE_NAMES[targetLanguage] || 'Hindi (हिन्दी)';

    const prompt = `You are a Senior Advocate practicing Indian Commercial & Civil Law.
Generate a comprehensive, legally enforceable Indian legal contract for "${documentType}" based on these verified particulars:

PARTICULARS:
${JSON.stringify(fields, null, 2)}

USER PREFERRED REGIONAL LANGUAGE: ${targetLangName}

REQUIREMENTS:
1. Formal Indian Legal Structure:
   - Proper title and Stamp Duty / e-Stamp declaration preamble (e.g., "This Agreement is made and executed on this [Day] of [Month, Year] at [City]...")
   - Clear identification of Parties (Names, Addresses, "hereinafter referred to as...")
   - WHEREAS Recitals
   - Operative Covenants & Clauses:
     * Consideration, Payment terms, Bank mode
     * Obligations of each party
     * Fair Termination and Notice clause
     * Force Majeure clause
     * Dispute Resolution: Mandatory mediation followed by Arbitration under the Arbitration and Conciliation Act, 1996 with specified seat and jurisdiction of Indian Courts.
     * Protection against unfair non-compete per Section 27 of Indian Contract Act 1872.
   - Signature Blocks for First Party, Second Party, and Two Witnesses.
2. Parallel Plain Language Summary ("regional_summary"):
   - A clear, section-by-section breakdown in authentic ${targetLangName} (using proper script) explaining what each major term means for the citizen, avoiding legal jargon so there is zero misunderstanding. Also provide "hindi_summary" as fallback.

Return strict JSON:
{
  "document_title": string,
  "document_type": string,
  "legal_agreement_text": string (full formatted contract in markdown with sections),
  "hindi_summary": string,
  "regional_summary": string (plain language summary in ${targetLangName}),
  "regional_language_name": "${targetLangName}",
  "statutory_compliance_checklist": [
    string (e.g. "Execute on non-judicial stamp paper of appropriate value as per State Stamp Act", "Get notarized or registered before Sub-Registrar if lease exceeds 11 months under Registration Act 1908")
  ]
}`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseGeminiJson(response.text || '{}', null);
    if (!parsed) {
      return res.status(500).json({ error: 'Failed to generate contract.' });
    }
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/draft-generate-contract:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate draft contract.' });
  }
});

// -------------------------------------------------------------
// 5. LEGAL PROCEDURE NAVIGATOR API
// -------------------------------------------------------------
app.post('/api/legal-navigator', async (req: Request, res: Response) => {
  try {
    const { query, category, targetLanguage } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Please enter a legal issue or dispute.' });
    }

    const targetLangName = LANGUAGE_NAMES[targetLanguage] || 'Hindi (हिन्दी)';

    const prompt = `You are the LexiGuard Legal Procedure Navigator for Indian Citizens.
A citizen has described a legal grievance or problem:
"${query}"
${category ? `Category: ${category}` : ''}

USER PREFERRED REGIONAL LANGUAGE: ${targetLangName}

Provide a structured, practical, non-intimidating step-by-step roadmap to resolve this under Indian law.
Include real government portals, toll-free helplines, time limits (limitation period), and realistic costs.
Provide explanations and step guidance in authentic ${targetLangName} (using proper script).

Return strict JSON matching this schema:
{
  "issue_title": string,
  "category": string,
  "summary_hindi": string (2 sentence overview in plain Hindi),
  "summary_regional": string (2 sentence overview in authentic ${targetLangName}),
  "regional_language_name": "${targetLangName}",
  "applicable_laws": [
    {
      "act_name": string (e.g. "Information Technology Act, 2000 & BNS 2023" or "Consumer Protection Act, 2019"),
      "key_sections": string (e.g. "Section 66D IT Act; Section 318(4) BNS"),
      "citizen_right": string
    }
  ],
  "urgent_first_step": {
    "action": string,
    "deadline": string (e.g., "Golden Hour: within 2 hours"),
    "helpline_or_link": string (e.g., "Call 1930 immediately or visit cybercrime.gov.in")
  },
  "steps": [
    {
      "step_number": number,
      "title": string,
      "estimated_timeline": string (e.g., "Day 1-3" or "2-4 Weeks"),
      "cost_inr": string (e.g., "Free (₹0)" or "Nominal Court Fee ₹100-₹500"),
      "action_description": string,
      "hindi_guidance": string,
      "regional_guidance": string (action guidance in ${targetLangName}),
      "portal_name": string,
      "portal_url": string,
      "helpline": string,
      "documents_needed": [
        string
      ]
    }
  ],
  "free_legal_aid": {
    "tele_law_available": true,
    "tele_law_info": "Book a free video consultation with panel advocate via Tele-Law Portal (tele-law.in) or call 14416 / nearest CSC center.",
    "nalsa_helpline": "15100 (National Legal Services Authority toll-free legal aid helpline)"
  }
}`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseGeminiJson(response.text || '{}', null);
    if (!parsed) {
      return res.status(500).json({ error: 'Failed to generate legal roadmap.' });
    }
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/legal-navigator:', error);
    return res.status(500).json({ error: error.message || 'Failed to navigate legal procedure.' });
  }
});

// -------------------------------------------------------------
// Vite middleware in dev or static files in production
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`LexiGuard server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
