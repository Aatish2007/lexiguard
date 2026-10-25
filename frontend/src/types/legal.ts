export interface RedFlag {
  clause_text: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  legal_basis: string;
  issue_explanation: string;
  plain_language_explanation?: string;
  hindi_explanation?: string;
  regional_explanation?: string;
  recommendation: string;
}

export interface FavorableClause {
  clause_text: string;
  benefit: string;
  hindi_benefit?: string;
  regional_benefit?: string;
}

export interface IpcBnsMapping {
  old_ipc_section: string;
  new_bns_section: string;
  title: string;
  bailable: 'Bailable' | 'Non-Bailable' | string;
  cognizable: 'Cognizable' | 'Non-Cognizable' | string;
  punishment: string;
  hindi_explanation?: string;
  regional_explanation?: string;
  applicability_context: string;
}

export interface DocumentAnalysisResult {
  id?: string;
  supabase_id?: string | number;
  timestamp?: number;
  document_name?: string;
  document_type: string;
  document_hash?: string;
  analysis_language?: string;
  analysis_language_code?: string;
  document_summary: string;
  document_summary_hindi?: string;
  document_summary_regional?: string;
  regional_language_name?: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  extracted_text_snippet: string;
  red_flags: RedFlag[];
  favorable_clauses?: FavorableClause[];
  missing_protections?: string[];
  ipc_bns_mappings: IpcBnsMapping[];
  expert_escalation_needed?: boolean;
  tele_law_guidance?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface LegalNavigatorStep {
  step_number: number;
  title: string;
  estimated_timeline: string;
  cost_inr: string;
  action_description: string;
  hindi_guidance?: string;
  regional_guidance?: string;
  portal_name: string;
  portal_url: string;
  helpline: string;
  documents_needed: string[];
}

export interface LegalNavigatorResult {
  issue_title: string;
  category: string;
  summary_hindi?: string;
  summary_regional?: string;
  regional_language_name?: string;
  applicable_laws: Array<{
    act_name: string;
    key_sections: string;
    citizen_right: string;
  }>;
  urgent_first_step: {
    action: string;
    deadline: string;
    helpline_or_link: string;
  };
  steps: LegalNavigatorStep[];
  free_legal_aid: {
    tele_law_available: boolean;
    tele_law_info: string;
    nalsa_helpline: string;
  };
}

export interface GeneratedContract {
  id?: string;
  timestamp?: number;
  document_title: string;
  document_type: string;
  legal_agreement_text: string;
  hindi_summary?: string;
  regional_summary?: string;
  regional_language_name?: string;
  statutory_compliance_checklist: string[];
  parties_summary?: string;
}
