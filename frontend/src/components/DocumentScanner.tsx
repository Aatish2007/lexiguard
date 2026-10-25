import { API } from '../lib/api';
import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  FileCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Printer,
  Shield,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { DocumentAnalysisResult } from '../types/legal';
import { SAMPLE_CONTRACTS, SampleContract } from '../data/sampleContracts';
import { RiskGauge } from './RiskGauge';
import { RedFlagCard } from './RedFlagCard';
import { IpcBnsSection } from './IpcBnsSection';
import { ExpertEscalationCard } from './ExpertEscalationCard';
import { saveAnalyzedDocument } from '../utils/historyStorage';
import { useLanguage } from '../utils/languages';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { computeDocumentHash, saveRiskReportToSupabase } from '../lib/supabaseReports';

interface DocumentScannerProps {
  currentAnalysis: DocumentAnalysisResult | null;
  setCurrentAnalysis: (analysis: DocumentAnalysisResult | null) => void;
  onOpenChat: (doc: DocumentAnalysisResult) => void;
  initialSample?: SampleContract | null;
  onClearInitialSample?: () => void;
}

const ROTATING_LOADING_STATUSES = [
  'Reading document & extracting clauses...',
  'Analyzing clauses under Indian Contract Act, 1872...',
  'Checking Consumer Protection Act 2019 & Tenancy norms...',
  'Cross-referencing IPC sections with Bharatiya Nyaya Sanhita (BNS 2023)...',
  'Translating red flags into accessible regional explanations...',
  'Calculating risk gauge & finalizing legal advisory...',
];

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  currentAnalysis,
  setCurrentAnalysis,
  onOpenChat,
  initialSample,
  onClearInitialSample,
}) => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatusIdx, setLoadingStatusIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [activeTabRight, setActiveTabRight] = useState<'flags' | 'ipcbns' | 'favorable' | 'raw'>('flags');

  const { t, language, currentLanguageOption } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto trigger sample if passed from home
  useEffect(() => {
    if (initialSample) {
      handleSelectSample(initialSample);
      if (onClearInitialSample) {
        onClearInitialSample();
      }
    }
  }, [initialSample]);

  // Rotate loading text
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStatusIdx((prev) => (prev + 1) % ROTATING_LOADING_STATUSES.length);
      }, 2400);
    } else {
      setLoadingStatusIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle file drop / select
  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    setSelectedFileName(file.name);
    setIsLoading(true);

    try {
      const reader = new FileReader();

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.onload = async () => {
          try {
            const base64String = (reader.result as string).split(',')[1];
            await callAnalyzeApi({
              fileBase64: base64String,
              mimeType: file.type,
              fileName: file.name,
            });
          } catch (err: any) {
            setErrorMessage(err.message || 'Error processing document.');
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } else if (
        file.name.endsWith('.docx') ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        reader.onload = async () => {
          try {
            const base64String = (reader.result as string).split(',')[1];
            await callAnalyzeApi({
              fileBase64: base64String,
              mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              fileName: file.name,
            });
          } catch (err: any) {
            setErrorMessage(err.message || 'Error processing DOCX file.');
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Plain text fallback
        reader.onload = async () => {
          try {
            const textContent = reader.result as string;
            await callAnalyzeApi({
              rawText: textContent,
              fileName: file.name,
            });
          } catch (err: any) {
            setErrorMessage(err.message || 'Error reading text file.');
            setIsLoading(false);
          }
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to read file.');
      setIsLoading(false);
    }
  };

  const handlePastedSubmit = async () => {
    if (!pastedText.trim()) {
      setErrorMessage('Please paste contract or agreement text.');
      return;
    }
    setErrorMessage(null);
    setSelectedFileName('Pasted-Legal-Text.txt');
    setIsLoading(true);
    await callAnalyzeApi({
      rawText: pastedText,
      fileName: 'Pasted-Document.txt',
    });
  };

  const handleSelectSample = async (sample: SampleContract) => {
    setErrorMessage(null);
    setSelectedFileName(sample.name);
    setIsLoading(true);
    await callAnalyzeApi({
      rawText: sample.content,
      fileName: sample.name,
    });
  };

  const callAnalyzeApi = async (payload: any) => {
    setSaveWarning(null);
    try {
      // Calculate SHA-256 hash of the document content
      const contentForHash =
        payload.fileBase64 ||
        payload.rawText ||
        selectedFileName ||
        'document-' + Date.now();
      const docHash = await computeDocumentHash(contentForHash);

      const response = await fetch(`${API}/api/analyze-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, targetLanguage: language }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const result: DocumentAnalysisResult = await response.json();
      result.document_name = selectedFileName || payload.fileName || 'Legal Contract';
      result.timestamp = Date.now();
      result.document_hash = docHash;

      // Insert row into 'risk_reports' table if Supabase is configured
      if (isSupabaseConfigured) {
        try {
          const savedRow = await saveRiskReportToSupabase({
            documentName: result.document_name || 'Legal Contract',
            riskScore: result.risk_score,
            riskLevel: result.risk_level,
            documentHash: docHash,
            reportJson: result,
            userId: user?.id,
          });
          if (savedRow) {
            result.supabase_id = savedRow.id;
          }
        } catch (supabaseErr: any) {
          console.warn('Failed to save to Supabase risk_reports table:', supabaseErr);
          // Show a short error but still display the analysis result
          setSaveWarning(
            `Cloud sync note: Report displayed, but saving to Supabase failed (${supabaseErr.message || 'database unreachable'}). Saved to local backup.`
          );
        }
      }

      // Save to local storage history as fallback/cache
      saveAnalyzedDocument(result);
      setCurrentAnalysis(result);
    } catch (err: any) {
      console.error('Document analysis failed:', err);
      setErrorMessage(err.message || 'Unable to analyze document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* ----------------- LOADING STATE OVERLAY ----------------- */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-5 animate-scaleUp">
            {/* Centered pulsing purple icon animation */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-xl shadow-[#5F259F]/30 animate-pulse">
                <Shield className="w-10 h-10 text-amber-300" />
              </div>
              <div className="absolute -inset-2 rounded-2xl border-2 border-[#5F259F]/40 animate-ping pointer-events-none" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                LexiGuard Analysis Engine
              </h3>
              <p className="text-sm font-semibold text-[#5F259F] h-12 flex items-center justify-center transition-all duration-300">
                {ROTATING_LOADING_STATUSES[loadingStatusIdx]}
              </p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#5F259F] h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${((loadingStatusIdx + 1) / ROTATING_LOADING_STATUSES.length) * 100}%`,
                }}
              />
            </div>

            <p className="text-xs text-slate-500 font-hindi">
              कृप्या प्रतीक्षा करें — भारतीय कानूनों और बी.एन.एस. (BNS) के तहत दस्तावेज़ की गहन जांच की जा रही है...
            </p>
          </div>
        </div>
      )}

      {/* ----------------- UPLOAD / INPUT CONTAINER ----------------- */}
      {!currentAnalysis && (
        <div className="space-y-6">
          {/* Top Header Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#5F259F]/10 text-[#5F259F] text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-indic">{t.featScannerTitle}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-indic">
                {t.scanHeaderTitle}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-sans font-indic">
                {t.scanHeaderDesc}
              </p>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-500 hover:text-rose-700 font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input Mode Selector */}
            <div className="mt-6 flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setInputMode('upload')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  inputMode === 'upload'
                    ? 'bg-[#5F259F] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="font-indic">{t.uploadFileTab}</span>
              </button>
              <button
                onClick={() => setInputMode('paste')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  inputMode === 'paste'
                    ? 'bg-[#5F259F] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="font-indic">{t.pasteTextTab}</span>
              </button>
            </div>

            {/* Drag and Drop Zone */}
            {inputMode === 'upload' ? (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-4 border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-[#5F259F] bg-[#5F259F]/5 scale-[1.01]'
                    : 'border-slate-300 hover:border-[#5F259F]/60 bg-slate-50/50 hover:bg-[#5F259F]/5'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.txt"
                  className="hidden"
                />
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-slate-200 text-[#5F259F] flex items-center justify-center shadow-sm mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 font-indic">
                  {t.dragDropMain} <span className="text-[#5F259F] underline">{t.browseFiles}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-3 font-indic">
                  {t.supportedFormats}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">PDF</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">Images</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">DOCX</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">Up to 25MB</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={t.pastePlaceholder}
                  rows={8}
                  className="w-full p-4 rounded-xl border border-slate-300 bg-white font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5F259F] focus:border-transparent font-indic"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handlePastedSubmit}
                    className="px-6 py-2.5 bg-[#5F259F] hover:bg-[#4d1d82] text-white text-sm font-bold rounded-lg shadow-sm hover:shadow transition-colors cursor-pointer font-indic"
                  >
                    {t.analyzePastedBtn}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* One-Click Realistic Indian Sample Documents */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-indic">
                  {t.instantContractsTitle}
                </h3>
                <p className="text-xs text-slate-500 font-indic">
                  {t.instantContractsSub}
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Hackathon Quick Demos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_CONTRACTS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="border border-slate-200 hover:border-[#5F259F] rounded-xl p-4 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5F259F] bg-[#5F259F]/10 px-2 py-0.5 rounded">
                      {sample.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#5F259F] transition-colors">
                      {sample.name}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                      {sample.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#5F259F]">
                    <span>Scan this Contract</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- RESULTS PAGE VIEW ----------------- */}
      {currentAnalysis && (
        <div className="space-y-6">
          {/* Cloud Sync Notice Banner if Supabase save fails */}
          {saveWarning && (
            <div className="p-3.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-none">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{saveWarning}</span>
              </div>
              <button
                onClick={() => setSaveWarning(null)}
                className="text-amber-700 hover:text-amber-950 text-xs font-bold px-1.5 py-0.5 hover:bg-amber-100 rounded cursor-pointer"
                aria-label="Dismiss warning"
              >
                ✕
              </button>
            </div>
          )}

          {/* Top Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-md border border-slate-200 shadow-none">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[#5F259F] text-white flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
                    {currentAnalysis.document_name || 'Legal Contract Report'}
                  </h2>
                  <div className="inline-flex items-center pl-2 border-l-2 border-slate-300">
                    <span className="text-xs font-medium text-slate-600">
                      {currentAnalysis.document_type}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Analyzed under Indian Legal Acts (Contract Act 1872 · Consumer Protection 2019 · BNS 2023)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenChat(currentAnalysis)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#5F259F] hover:bg-[#4d1d82] text-white text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer shadow-none"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span className="font-indic">{t.chatWithContractBtn}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer shadow-none"
                title="Print or Save PDF"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline font-indic">{t.printSavePdfBtn}</span>
              </button>

              <button
                onClick={() => setCurrentAnalysis(null)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer shadow-none"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="font-indic">{t.scanAnotherBtn}</span>
              </button>
            </div>
          </div>

          {/* TWO-COLUMN DESKTOP LAYOUT (stacks to 1 column on mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Risk Gauge, Executive Summary & Escalation */}
            <div className="lg:col-span-4 space-y-6">
              {/* Risk Gauge Card */}
              <div className="bg-white rounded-md border border-slate-200 shadow-none p-4 sm:p-6 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-indic">
                  {t.overallRiskTitle}
                </span>
                <RiskGauge
                  score={currentAnalysis.risk_score}
                  level={currentAnalysis.risk_level}
                  size={190}
                />

                {/* Quick breakdown metrics: One simple row with thin vertical dividers */}
                <div className="w-full mt-4 pt-4 border-t border-slate-200 grid grid-cols-3 divide-x divide-slate-200 text-center">
                  <div className="px-2 py-1">
                    <span className="block text-lg font-bold tabular-nums text-[#B42318]">
                      {currentAnalysis.red_flags.filter((f) => f.severity === 'HIGH').length}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      High Risks
                    </span>
                  </div>
                  <div className="px-2 py-1">
                    <span className="block text-lg font-bold tabular-nums text-[#B7791F]">
                      {currentAnalysis.red_flags.filter((f) => f.severity === 'MEDIUM').length}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      Medium
                    </span>
                  </div>
                  <div className="px-2 py-1">
                    <span className="block text-lg font-bold tabular-nums text-[#2F6B4F]">
                      {currentAnalysis.favorable_clauses?.length || 0}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      Favorable
                    </span>
                  </div>
                </div>
              </div>

              {/* Expert Escalation Card if score > 80 */}
              {(currentAnalysis.risk_score > 80 || currentAnalysis.expert_escalation_needed) && (
                <ExpertEscalationCard riskScore={currentAnalysis.risk_score} />
              )}

              {/* Executive Summary Card (English & Regional) */}
              <div className="bg-white rounded-md border border-slate-200 shadow-none p-4 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-indic">
                    {t.executiveSummaryTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {currentAnalysis.document_summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-[#5F259F] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-indic">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.regionalSummaryTitle} ({currentLanguageOption.nativeName})</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-800 font-indic leading-relaxed bg-[#5F259F]/5 p-3 rounded-md border border-[#5F259F]/15">
                    {currentAnalysis.document_summary_regional || currentAnalysis.document_summary_hindi}
                  </p>
                </div>
              </div>

              {/* Missing Protections Widget */}
              {currentAnalysis.missing_protections && currentAnalysis.missing_protections.length > 0 && (
                <div className="bg-white rounded-md border border-slate-200 shadow-none p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-indic">
                      {t.missingProtectionsTitle}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {currentAnalysis.missing_protections.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2.5 rounded-md border border-slate-200/60 font-indic"
                      >
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Red Flags, IPC/BNS, Favorable Clauses, Raw text */}
            <div className="lg:col-span-8 space-y-6">
              {/* Tab Navigation: Underlined Text Tabs */}
              <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto pb-px">
                <button
                  onClick={() => setActiveTabRight('flags')}
                  className={`pb-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
                    activeTabRight === 'flags'
                      ? 'border-[#5F259F] text-[#5F259F] font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span className="font-indic">{t.tabRedFlags} ({currentAnalysis.red_flags.length})</span>
                </button>
                <button
                  onClick={() => setActiveTabRight('ipcbns')}
                  className={`pb-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
                    activeTabRight === 'ipcbns'
                      ? 'border-[#5F259F] text-[#5F259F] font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span className="font-indic">{t.tabIpcBns} ({currentAnalysis.ipc_bns_mappings?.length || 0})</span>
                </button>
                <button
                  onClick={() => setActiveTabRight('favorable')}
                  className={`pb-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
                    activeTabRight === 'favorable'
                      ? 'border-[#5F259F] text-[#5F259F] font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span className="font-indic">{t.tabFavorable} ({currentAnalysis.favorable_clauses?.length || 0})</span>
                </button>
                <button
                  onClick={() => setActiveTabRight('raw')}
                  className={`pb-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
                    activeTabRight === 'raw'
                      ? 'border-[#5F259F] text-[#5F259F] font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span className="font-indic">{t.tabDocContent}</span>
                </button>
              </div>

              {/* TAB 1: Red Flags List */}
              {activeTabRight === 'flags' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>Identified Unfair or Risky Clauses with Translations</span>
                    <span className="font-semibold">Indian Contract & Consumer Law Grounded</span>
                  </div>

                  {currentAnalysis.red_flags.map((flag, idx) => (
                    <RedFlagCard key={idx} flag={flag} index={idx} />
                  ))}
                </div>
              )}

              {/* TAB 2: IPC to BNS Mappings */}
              {activeTabRight === 'ipcbns' && (
                <IpcBnsSection mappings={currentAnalysis.ipc_bns_mappings} />
              )}

              {/* TAB 3: Favorable Clauses */}
              {activeTabRight === 'favorable' && (
                <div className="space-y-4">
                  {currentAnalysis.favorable_clauses && currentAnalysis.favorable_clauses.length > 0 ? (
                    currentAnalysis.favorable_clauses.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-md border border-slate-200 p-4 shadow-none space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center pl-2 border-l-2 border-[#2F6B4F]">
                            <span className="text-xs font-medium text-[#2F6B4F]">
                              Protective Term #{idx + 1}
                            </span>
                          </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-md text-xs sm:text-sm font-mono text-slate-800 italic shadow-none">
                          "{item.clause_text}"
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700">
                          <strong className="font-semibold text-slate-900">Benefit to Citizen:</strong> {item.benefit}
                        </p>
                        {item.hindi_benefit && (
                          <p className="text-xs sm:text-sm text-emerald-950 font-hindi bg-emerald-50/60 p-3 rounded-md border border-emerald-200/80 shadow-none">
                            <strong>नागरिक को लाभ:</strong> {item.hindi_benefit}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-md p-6 text-center text-xs text-slate-500 border border-slate-200 shadow-none">
                      No explicit favorable clauses were identified in this document.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Raw Document Content */}
              {activeTabRight === 'raw' && (
                <div className="bg-white rounded-md border border-slate-200 p-4 shadow-none space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Extracted Document Text Snippet
                    </h3>
                    <span className="text-xs text-slate-500">
                      Grounded Source Text
                    </span>
                  </div>
                  <pre className="p-4 bg-slate-50 rounded-md border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed shadow-none">
                    {currentAnalysis.extracted_text_snippet || 'Document text extracted successfully.'}
                  </pre>
                </div>
              )}

              {/* Bottom Quick-Action to Chat */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 shadow-none flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">
                    Have specific questions about this document?
                  </h4>
                  <p className="text-xs text-slate-600">
                    Ask questions like "Can the landlord evict me without notice?" in English or Hindi.
                  </p>
                </div>
                <button
                  onClick={() => onOpenChat(currentAnalysis)}
                  className="px-3.5 py-2 bg-[#5F259F] hover:bg-[#4d1d82] text-white text-xs sm:text-sm font-medium rounded-md shadow-none transition-colors cursor-pointer flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-300" />
                  <span>Start Contract Q&A Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
