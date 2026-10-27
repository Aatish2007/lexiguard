import { DocumentAnalysisResult, GeneratedContract } from '../types/legal';

const ANALYZED_DOCS_KEY = 'lexiguard_analyzed_documents_v1';
const DRAFTED_CONTRACTS_KEY = 'lexiguard_drafted_contracts_v1';

// Initial pre-loaded seed for demo/academic inspection
const INITIAL_SEED_DOCUMENTS: DocumentAnalysisResult[] = [];

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
