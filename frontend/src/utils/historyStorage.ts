import { DocumentAnalysisResult, GeneratedContract } from '../types/legal';

const ANALYZED_DOCS_KEY = 'lexiguard_analyzed_documents_v1';
const DRAFTED_CONTRACTS_KEY = 'lexiguard_drafted_contracts_v1';

// Initial pre-loaded seed for demo/academic inspection
const INITIAL_SEED_DOCUMENTS: DocumentAnalysisResult[] = [
  {
    id: 'seed-rent-agreement-1',
    timestamp: Date.now() - 86400000 * 2,
    document_name: 'Noida-Sec120-Rent-Agreement.pdf',
    document_type: 'Residential Rent Agreement',
    document_summary: '11-month residential lease deed for Flat in Sector 120 Noida. Contains multiple critical unconscionable clauses including 24-hour summary eviction and complete deposit forfeiture.',
    document_summary_hindi: 'नोएडा सेक्टर 120 के लिए 11 महीने का किराया अनुबंध। इसमें 24 घंटे में जबरन बेदखली और पूरी सिक्योरिटी जब्त करने जैसी गैर-कानूनी शर्तें मौजूद हैं।',
    risk_score: 86,
    risk_level: 'HIGH',
    extracted_text_snippet: 'RENT AGREEMENT: Flat 404, Prateek Fedora, Sector 120 Noida... Clause 3: Entire security deposit of Rs 72,000 shall be forfeited unconditionally... Clause 4: Landlord reserves absolute right to demand immediate possession within 24 hours...',
    red_flags: [
      {
        clause_text: 'If Tenant vacates before 11 months, entire deposit of Rs 72,000 shall be forfeited unconditionally without obligation to prove actual damage.',
        severity: 'HIGH',
        legal_basis: 'Section 74, Indian Contract Act 1872 & Section 2(46), Consumer Protection Act 2019',
        issue_explanation: 'Indian courts consistently hold that forfeiture of security deposit without proving actual financial loss constitutes an unlawful penalty rather than genuine liquidated damages (Fateh Chand v. Balkishan Dass).',
        hindi_explanation: 'मकान मालिक बिना नुकसान साबित किए पूरी सिक्योरिटी जब्त नहीं कर सकता। भारतीय अनुबंध अधिनियम की धारा 74 के तहत यह अवैध जुर्माना माना जाता है।',
        recommendation: 'Replace with: "Security deposit shall be refunded within 15 days of handover, subject only to deductions for unpaid utility bills or verified structural damage beyond normal wear and tear."'
      },
      {
        clause_text: 'Landlord reserves absolute right to demand immediate possession with 24 hours notice, failing which locks shall be changed.',
        severity: 'HIGH',
        legal_basis: 'Section 106 & 111, Transfer of Property Act 1882 & UP Regulation of Urban Premises Tenancy Act',
        issue_explanation: 'Summary eviction with 24-hour notice and self-help eviction (changing locks) is illegal under Indian law. A minimum 30-day written notice or court order is mandatory.',
        hindi_explanation: 'मकान मालिक 24 घंटे का नोटिस देकर ताला नहीं बदल सकता। कानूनन कम से कम 30 दिनों का लिखित नोटिस देना अनिवार्य है।',
        recommendation: 'Mandate a mutual minimum 30-day written notice period for either party to terminate the tenancy.'
      },
      {
        clause_text: 'Landlord shall have the right to disconnect electricity and municipal water supply if rent is delayed by 3 days.',
        severity: 'HIGH',
        legal_basis: 'Section 20, Model Tenancy Act & State Rent Control Provisions',
        issue_explanation: 'Disconnection of essential services (water, electricity, sanitary services) by a landlord to force rent recovery or eviction is a punishable civil and criminal wrong.',
        hindi_explanation: 'किराया देर होने पर बिजली-पानी काटना दंडनीय अपराध है। आवश्यक सेवाओं को कोई भी मकान मालिक नहीं काट सकता।',
        recommendation: 'Delete this clause completely. Standard remedy for delay is nominal interest (1% per month) on arrears.'
      }
    ],
    favorable_clauses: [
      {
        clause_text: 'Tenancy duration fixed for 11 months commencing from 01.08.2024.',
        benefit: 'Provides predictable occupation tenure without requiring formal stamp duty registration under Registration Act 1908.',
        hindi_benefit: '11 महीने का तय समय मिलता है।'
      }
    ],
    missing_protections: [
      'No clause guaranteeing 30-day notice for inspection by landlord.',
      'No clear timeline (e.g. 14 days) for return of security deposit post move-out.',
      'No force majeure or rent abatement clause in case of natural disasters or uninhabitable conditions.'
    ],
    ipc_bns_mappings: [
      {
        old_ipc_section: 'IPC Section 420',
        new_bns_section: 'BNS Section 318(4)',
        title: 'Cheating and dishonestly inducing delivery of property',
        bailable: 'Non-Bailable',
        cognizable: 'Cognizable',
        punishment: 'Imprisonment up to 7 years + Fine',
        hindi_explanation: 'धोखाधड़ी और बेईमानी से संपत्ति हड़पना। यह गैर-जमानती अपराध है।',
        applicability_context: 'Applies if a landlord accepts security deposit with prior fraudulent intention to never refund it.'
      },
      {
        old_ipc_section: 'IPC Section 406',
        new_bns_section: 'BNS Section 316',
        title: 'Criminal Breach of Trust (Entrusted Property / Security Deposit)',
        bailable: 'Non-Bailable',
        cognizable: 'Cognizable',
        punishment: 'Imprisonment up to 3 years or fine or both',
        hindi_explanation: 'अमानत में खयानत (धरोहर राशि को हड़पना)।',
        applicability_context: 'Security deposit is legally entrusted money held in fiduciary capacity; misusing it may constitute criminal breach of trust.'
      },
      {
        old_ipc_section: 'IPC Section 506',
        new_bns_section: 'BNS Section 351',
        title: 'Criminal Intimidation',
        bailable: 'Bailable (Non-bailable for threat to cause grievous harm)',
        cognizable: 'Non-Cognizable',
        punishment: 'Imprisonment up to 2 years or fine',
        hindi_explanation: 'धमकाना या जबरन डराना।',
        applicability_context: 'Threats to forcefully throw belongings onto the street or bodily harm.'
      }
    ],
    expert_escalation_needed: true,
    tele_law_guidance: 'Because this agreement contains multiple severe unconscionable clauses with a risk score of 86, we strongly recommend free legal consultation via Tele-Law (14416) or NALSA (15100).'
  }
];

export function getAnalyzedDocuments(): DocumentAnalysisResult[] {
  try {
    const raw = localStorage.getItem(ANALYZED_DOCS_KEY);
    if (!raw) {
      localStorage.setItem(ANALYZED_DOCS_KEY, JSON.stringify(INITIAL_SEED_DOCUMENTS));
      return INITIAL_SEED_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load analyzed documents from storage:', e);
    return INITIAL_SEED_DOCUMENTS;
  }
}

export function saveAnalyzedDocument(doc: DocumentAnalysisResult): DocumentAnalysisResult {
  const current = getAnalyzedDocuments();
  const newDoc: DocumentAnalysisResult = {
    ...doc,
    id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: doc.timestamp || Date.now(),
  };

  // Add to top, prevent duplicates by ID
  const filtered = current.filter((item) => item.id !== newDoc.id);
  const updated = [newDoc, ...filtered];
  try {
    localStorage.setItem(ANALYZED_DOCS_KEY, JSON.stringify(updated.slice(0, 30)));
  } catch (e) {
    console.warn('Storage limit reached, saving trimmed records:', e);
  }
  return newDoc;
}

export function deleteAnalyzedDocument(id: string): void {
  const current = getAnalyzedDocuments();
  const updated = current.filter((d) => d.id !== id);
  localStorage.setItem(ANALYZED_DOCS_KEY, JSON.stringify(updated));
}

export function getDraftedContracts(): GeneratedContract[] {
  try {
    const raw = localStorage.getItem(DRAFTED_CONTRACTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveDraftedContract(contract: GeneratedContract): GeneratedContract {
  const current = getDraftedContracts();
  const newContract: GeneratedContract = {
    ...contract,
    id: contract.id || `draft-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: contract.timestamp || Date.now(),
  };
  const updated = [newContract, ...current.filter((c) => c.id !== newContract.id)];
  localStorage.setItem(DRAFTED_CONTRACTS_KEY, JSON.stringify(updated.slice(0, 20)));
  return newContract;
}

export function deleteDraftedContract(id: string): void {
  const current = getDraftedContracts();
  const updated = current.filter((c) => c.id !== id);
  localStorage.setItem(DRAFTED_CONTRACTS_KEY, JSON.stringify(updated));
}
