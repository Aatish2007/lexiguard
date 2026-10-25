import React, { useState, useEffect } from 'react';
import {
  Trash2,
  MessageSquare,
  FileCheck,
  Calendar,
  Cloud,
  HardDrive,
  Loader2,
} from 'lucide-react';
import { DocumentAnalysisResult, GeneratedContract } from '../types/legal';
import {
  getAnalyzedDocuments,
  deleteAnalyzedDocument,
  getDraftedContracts,
  deleteDraftedContract,
} from '../utils/historyStorage';
import { useLanguage } from '../utils/languages';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchUserRiskReports, deleteRiskReportFromSupabase } from '../lib/supabaseReports';

interface RecordsHistoryProps {
  onViewDocument: (doc: DocumentAnalysisResult) => void;
  onChatDocument: (doc: DocumentAnalysisResult) => void;
}

export const RecordsHistory: React.FC<RecordsHistoryProps> = ({
  onViewDocument,
  onChatDocument,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<'analyzed' | 'drafts'>('analyzed');
  const [analyzedDocs, setAnalyzedDocs] = useState<DocumentAnalysisResult[]>([]);
  const [draftedContracts, setDraftedContracts] = useState<GeneratedContract[]>([]);
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isCloudSource, setIsCloudSource] = useState(false);

  const reloadData = async () => {
    setIsLoadingReports(true);
    setDraftedContracts(getDraftedContracts());

    if (isSupabaseConfigured) {
      try {
        const remoteDocs = await fetchUserRiskReports(user?.id);
        setAnalyzedDocs(remoteDocs);
        setIsCloudSource(true);
        setIsLoadingReports(false);
        return;
      } catch (err: any) {
        console.warn('Supabase fetch failed, falling back to local records:', err);
        setIsCloudSource(false);
      }
    } else {
      setIsCloudSource(false);
    }

    // Local storage fallback
    setAnalyzedDocs(getAnalyzedDocuments());
    setIsLoadingReports(false);
  };

  useEffect(() => {
    reloadData();
  }, [user?.id]);

  const handleDeleteDoc = async (doc: DocumentAnalysisResult, e: React.MouseEvent) => {
    e.stopPropagation();
    if (doc.supabase_id && isSupabaseConfigured) {
      try {
        await deleteRiskReportFromSupabase(doc.supabase_id);
      } catch (err) {
        console.warn('Failed to delete report from Supabase:', err);
      }
    }
    if (doc.id) {
      deleteAnalyzedDocument(doc.id);
    }
    setAnalyzedDocs((prev) =>
      prev.filter((d) => d.id !== doc.id && d.supabase_id !== doc.supabase_id)
    );
  };

  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDraftedContract(id);
    reloadData();
  };

  const handleCopyDraft = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraftId(id);
    setTimeout(() => setCopiedDraftId(null), 2000);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Recent';
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Docket Bar */}
      <div className="bg-white rounded border border-[#D8D0C3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,33,61,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#C8372D] block">
              {isCloudSource ? 'Archival Dossier · Supabase Cloud' : 'Archival Dossier · Local Storage'}
            </span>
            {isCloudSource ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-[#3F5E36] bg-[#F1F5EE] border border-[#BDD1B8] px-1.5 py-0.5 rounded">
                <Cloud className="w-3 h-3 text-[#3F5E36]" />
                <span>Synced</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-[#767E8E] bg-[#FAF8F5] border border-[#D8D0C3] px-1.5 py-0.5 rounded">
                <HardDrive className="w-3 h-3 text-[#767E8E]" />
                <span>Local</span>
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
            {t.recordsHeadline}
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5366]">
            {t.recordsDesc}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded border border-[#D8D0C3]">
          <button
            onClick={() => setFilterType('analyzed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              filterType === 'analyzed'
                ? 'bg-[#14213D] text-[#FAF8F5]'
                : 'text-[#4A5366] hover:text-[#14213D]'
            }`}
          >
            <span>{t.scannedContractsTab} ({analyzedDocs.length})</span>
          </button>
          <button
            onClick={() => setFilterType('drafts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              filterType === 'drafts'
                ? 'bg-[#14213D] text-[#FAF8F5]'
                : 'text-[#4A5366] hover:text-[#14213D]'
            }`}
          >
            <span>{t.voiceDraftsTab} ({draftedContracts.length})</span>
          </button>
        </div>
      </div>

      {/* LIST OF ANALYZED DOCUMENTS */}
      {filterType === 'analyzed' && (
        <div className="space-y-3">
          {isLoadingReports ? (
            <div className="bg-white rounded p-12 text-center border border-[#D8D0C3] text-xs text-[#767E8E] flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 text-[#14213D] animate-spin" />
              <span>Loading saved dossier reports...</span>
            </div>
          ) : analyzedDocs.length === 0 ? (
            <div className="bg-white rounded p-12 text-center border border-[#D8D0C3] text-xs text-[#767E8E]">
              {t.noScannedFound}
            </div>
          ) : (
            analyzedDocs.map((doc) => {
              const isHigh = doc.risk_score > 70;
              const isMedium = doc.risk_score > 35 && doc.risk_score <= 70;
              const badgeClass = isHigh
                ? 'bg-[#FBECEB] text-[#A83226] border-[#E8B4B0]'
                : isMedium
                ? 'bg-[#FBF4E8] text-[#A96F15] border-[#E8D3AE]'
                : 'bg-[#F1F5EE] text-[#3F5E36] border-[#BDD1B8]';

              return (
                <div
                  key={doc.id}
                  onClick={() => onViewDocument(doc)}
                  className="bg-white rounded border border-[#D8D0C3] hover:border-[#14213D] p-4 sm:p-5 shadow-[0_1px_2px_rgba(20,33,61,0.03)] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded flex flex-col items-center justify-center font-mono font-bold shrink-0 border ${badgeClass}`}
                    >
                      <span className="text-base leading-none">{doc.risk_score}</span>
                      <span className="text-[8px] uppercase tracking-wider opacity-80 mt-0.5">
                        Risk
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="font-serif text-sm sm:text-base font-bold text-[#14213D] group-hover:text-[#C8372D] transition-colors">
                          {doc.document_name || 'Legal Agreement'}
                        </h3>
                        <span className="text-[10px] font-mono uppercase text-[#767E8E] border border-[#D8D0C3] px-1.5 py-0.2 rounded bg-[#FAF8F5]">
                          {doc.document_type}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A5366] line-clamp-2 max-w-2xl leading-relaxed">
                        {doc.document_summary}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#767E8E] pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#767E8E]" />
                          <span>{formatDate(doc.timestamp)}</span>
                        </span>
                        <span>·</span>
                        <span>{doc.red_flags?.length || 0} Red Flags identified</span>
                        {doc.expert_escalation_needed && (
                          <>
                            <span>·</span>
                            <span className="text-[#C8372D] font-semibold">Advisory Footnote Active</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onChatDocument(doc);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE4D9] text-[#14213D] border border-[#D8D0C3] text-xs font-medium rounded transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3 text-[#767E8E]" />
                      <span>Inquire</span>
                    </button>

                    <button
                      onClick={() => onViewDocument(doc)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] text-xs font-semibold rounded border border-[#14213D] transition-colors cursor-pointer"
                    >
                      <span>{t.viewReportBtn}</span>
                    </button>

                    <button
                      onClick={(e) => handleDeleteDoc(doc, e)}
                      className="p-1.5 text-[#767E8E] hover:text-[#C8372D] rounded hover:bg-[#FAF8F5] transition-colors"
                      title="Delete record"
                      aria-label="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* LIST OF DRAFTED CONTRACTS */}
      {filterType === 'drafts' && (
        <div className="space-y-3">
          {draftedContracts.length === 0 ? (
            <div className="bg-white rounded p-12 text-center border border-[#D8D0C3] text-xs text-[#767E8E]">
              {t.noDraftsFound}
            </div>
          ) : (
            draftedContracts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded border border-[#D8D0C3] p-5 shadow-[0_1px_2px_rgba(20,33,61,0.03)] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE9DF] pb-3">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-[#14213D]" />
                    <div>
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#14213D]">
                        {draft.document_title || draft.document_type}
                      </h3>
                      <span className="text-xs text-[#767E8E]">
                        Compiled on {formatDate(draft.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyDraft(draft.id!, draft.legal_agreement_text)}
                      className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE4D9] text-[#14213D] border border-[#D8D0C3] text-xs font-medium rounded cursor-pointer transition-colors"
                    >
                      {copiedDraftId === draft.id ? 'Copied to Clipboard' : 'Copy Deed Text'}
                    </button>
                    <button
                      onClick={(e) => handleDeleteDraft(draft.id!, e)}
                      className="p-1.5 text-[#767E8E] hover:text-[#C8372D] rounded hover:bg-[#FAF8F5] transition-colors"
                      aria-label="Delete draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 rounded border border-[#E2DBD0] text-xs font-mono text-[#14213D] max-h-28 overflow-hidden relative leading-relaxed">
                  {draft.legal_agreement_text}
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#FAF8F5] to-transparent" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
