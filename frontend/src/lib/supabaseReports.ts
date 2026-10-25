import { supabase, isSupabaseConfigured } from './supabase';
import { DocumentAnalysisResult } from '../types/legal';

/**
 * Computes a standard hex-encoded SHA-256 hash of text or binary data.
 */
export async function computeDocumentHash(content: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.warn('Failed to compute crypto SHA-256, using fallback hash:', err);
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = (hash << 5) - hash + content.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }
}

export interface SaveReportParams {
  documentName: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  documentHash: string;
  reportJson: DocumentAnalysisResult;
  userId?: string;
}

/**
 * Inserts a row into the 'risk_reports' table with:
 * document_name, risk_score, risk_level, document_hash, report_json, user_id
 */
export async function saveRiskReportToSupabase({
  documentName,
  riskScore,
  riskLevel,
  documentHash,
  reportJson,
  userId,
}: SaveReportParams): Promise<{ id: string | number } | null> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase client is not configured.');
  }

  const payload: Record<string, any> = {
    document_name: documentName || reportJson.document_name || 'Legal Agreement',
    risk_score: riskScore,
    risk_level: riskLevel,
    document_hash: documentHash,
    report_json: reportJson,
  };

  if (userId) {
    payload.user_id = userId;
  }

  const { data, error } = await supabase
    .from('risk_reports')
    .insert([payload])
    .select('id, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Fetches the user's saved reports from the 'risk_reports' table, newest first.
 */
export async function fetchUserRiskReports(userId?: string): Promise<DocumentAnalysisResult[]> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  let query = supabase
    .from('risk_reports')
    .select('id, document_name, risk_score, risk_level, document_hash, report_json, created_at, user_id')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  if (!data) return [];

  return data.map((row) => {
    const rawReport: DocumentAnalysisResult = row.report_json || {};
    const parsedTimestamp = row.created_at ? new Date(row.created_at).getTime() : Date.now();

    return {
      ...rawReport,
      id: String(row.id),
      supabase_id: row.id,
      timestamp: rawReport.timestamp || parsedTimestamp,
      document_name: row.document_name || rawReport.document_name || 'Legal Contract',
      risk_score: row.risk_score ?? rawReport.risk_score,
      risk_level: (row.risk_level as any) || rawReport.risk_level,
      document_hash: row.document_hash || rawReport.document_hash,
    };
  });
}

/**
 * Deletes a risk report row from Supabase.
 */
export async function deleteRiskReportFromSupabase(id: string | number): Promise<void> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('risk_reports').delete().eq('id', id);

  if (error) {
    throw error;
  }
}
