import { API } from '../lib/api';
import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  FileCheck,
  FileText,
  Copy,
  Check,
  Printer,
  RotateCcw,
  ArrowRight,
  Shield,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { GeneratedContract } from '../types/legal';
import { saveDraftedContract } from '../utils/historyStorage';
import { useLanguage } from '../utils/languages';

const SAMPLE_VOICE_PROMPTS = {
  'Rent Agreement':
    'Draft a rent agreement for 2BHK flat 304, Green Glen Layout, Bellandur, Bengaluru. Landlord name is Suresh Menon, tenant is Neha Agarwal. Monthly rent is 32000 rupees, security deposit is 1 lakh rupees. Duration 11 months with 1 month notice period. Maintenance 3000 extra per month.',
  'Employment Letter':
    'Draft an employment letter from TechVanguard Solutions Pvt Ltd, Gurugram for Amit Saxena for the post of Senior Product Manager. Fixed annual CTC 18 lakh rupees, probation period 3 months, notice period 60 days. Standard health insurance and 18 annual paid leaves.',
  'Freelance Contract':
    'Freelance agreement between Apex Digital Mumbai and Vikram Joshi for mobile app UI UX redesign. Total project fee 95000 rupees with 30% advance on signing, 40% on Figma prototype, 30% on final handover. 2 rounds of revisions included. IP rights transfer only upon 100% full payment.',
  'Non-Disclosure Agreement (NDA)':
    'Mutual NDA between BioInovate Labs Hyderabad and Dr. Kavita Rao for reviewing proprietary AI drug discovery formulation datasets. Duration 2 years. Jurisdiction Hyderabad courts. Excludes publicly known info.',
};

export const VoiceContractDrafter: React.FC = () => {
  const { t, language, currentLanguageOption } = useLanguage();
  const [docType, setDocType] = useState<string>('Rent Agreement');
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<'hi-IN' | 'en-IN'>('en-IN');
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'input' | 'form' | 'result'>('input');
  const [extractedFields, setExtractedFields] = useState<Record<string, string>>({});
  const [generatedContract, setGeneratedContract] = useState<GeneratedContract | null>(null);
  const [copiedSection, setCopiedSection] = useState<'legal' | 'hindi' | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => (prev ? `${prev.trim()} ${finalTranscript}` : finalTranscript));
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. You can still type your terms manually.');
        } else {
          setSpeechError(`Voice input: ${event.error}. You can continue typing.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    }
  }, [speechLang]);

  const toggleListening = () => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      setSpeechError('Voice recording is not supported in this browser. Please type terms directly.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = speechLang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const handleLoadSample = () => {
    const sample = SAMPLE_VOICE_PROMPTS[docType as keyof typeof SAMPLE_VOICE_PROMPTS];
    if (sample) {
      setTranscript(sample);
      setSpeechError(null);
    }
  };

  // Step 1 -> Step 2: Extract Entities
  const handleExtractEntities = async () => {
    if (!transcript.trim()) {
      setSpeechError('Please speak or type terms first.');
      return;
    }

    setSpeechError(null);
    setIsExtracting(true);

    try {
      const response = await fetch(`${API}/api/draft-extract-entities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          transcript,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract legal terms from speech.');
      }

      const data = await response.json();
      setExtractedFields(data.extracted_fields || data);
      setStep('form');
    } catch (err: any) {
      setSpeechError(err.message || 'Error parsing contract terms.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Step 2 -> Step 3: Generate Contract
  const handleGenerateContract = async () => {
    setIsGenerating(true);
    setSpeechError(null);

    try {
      const response = await fetch(`${API}/api/draft-generate-contract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          fields: extractedFields,
          targetLanguage: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to compile full legal agreement.');
      }

      const result: GeneratedContract = await response.json();
      result.timestamp = Date.now();
      result.document_type = docType;

      // Save to local storage
      saveDraftedContract(result);
      setGeneratedContract(result);
      setStep('result');
    } catch (err: any) {
      setSpeechError(err.message || 'Error generating contract.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, type: 'legal' | 'hindi') => {
    navigator.clipboard.writeText(text);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleReset = () => {
    setTranscript('');
    setInterimText('');
    setExtractedFields({});
    setGeneratedContract(null);
    setStep('input');
    setSpeechError(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded border border-[#D8D0C3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,33,61,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-wider text-[#C8372D] block">
              Module 02 · Voice Contract Drafter
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
              Draft Indian Legal Agreements
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5366] leading-relaxed">
              Dictate or type terms in Hindi or English. LexiGuard structures key particulars, generates an enforceable deed under the Indian Contract Act 1872, and compiles a parallel vernacular summary.
            </p>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded border border-[#E2DBD0] text-xs font-mono">
            <span
              className={`px-2.5 py-1 rounded ${
                step === 'input'
                  ? 'bg-[#14213D] text-[#FAF8F5] font-semibold'
                  : 'text-[#767E8E]'
              }`}
            >
              1. Input
            </span>
            <ArrowRight className="w-3 h-3 text-[#C9C0B3]" />
            <span
              className={`px-2.5 py-1 rounded ${
                step === 'form'
                  ? 'bg-[#14213D] text-[#FAF8F5] font-semibold'
                  : 'text-[#767E8E]'
              }`}
            >
              2. Review
            </span>
            <ArrowRight className="w-3 h-3 text-[#C9C0B3]" />
            <span
              className={`px-2.5 py-1 rounded ${
                step === 'result'
                  ? 'bg-[#14213D] text-[#FAF8F5] font-semibold'
                  : 'text-[#767E8E]'
              }`}
            >
              3. Deed
            </span>
          </div>
        </div>

        {speechError && (
          <div className="mt-4 p-3 bg-[#FBF4E8] border border-[#E8D3AE] text-[#A96F15] rounded text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}
      </div>

      {/* STEP 1: VOICE / TEXT INPUT */}
      {step === 'input' && (
        <div className="space-y-6">
          {/* Document Type Selector Tabs */}
          <div className="bg-white rounded border border-[#D8D0C3] p-6 shadow-[0_1px_3px_rgba(20,33,61,0.03)] space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#767E8E] block">
              Select Agreement Type to Draft:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Rent Agreement',
                'Employment Letter',
                'Freelance Contract',
                'Non-Disclosure Agreement (NDA)',
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => setDocType(type)}
                  className={`p-3 rounded border text-xs font-semibold text-left transition-colors cursor-pointer ${
                    docType === type
                      ? 'bg-[#14213D] text-[#FAF8F5] border-[#14213D]'
                      : 'bg-[#FAF8F5] hover:bg-[#EAE4D9] text-[#14213D] border-[#D8D0C3]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Voice Input Section */}
            <div className="pt-4 border-t border-[#EFE9DF] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {/* Mic Toggle Button */}
                  <button
                    onClick={toggleListening}
                    className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border ${
                      isListening
                        ? 'bg-[#C8372D] text-white border-[#C8372D]'
                        : 'bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] border-[#14213D]'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-[#FAF8F5]" />
                        <span>Recording... (Click to Stop)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-[#E2DBD0]" />
                        <span>Start Voice Input</span>
                      </>
                    )}
                  </button>

                  {/* Language Selector */}
                  <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded border border-[#D8D0C3] text-xs font-medium">
                    <button
                      onClick={() => setSpeechLang('en-IN')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        speechLang === 'en-IN'
                          ? 'bg-white text-[#14213D] font-bold border border-[#D8D0C3]'
                          : 'text-[#767E8E]'
                      }`}
                    >
                      English (India)
                    </button>
                    <button
                      onClick={() => setSpeechLang('hi-IN')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        speechLang === 'hi-IN'
                          ? 'bg-white text-[#14213D] font-bold border border-[#D8D0C3]'
                          : 'text-[#767E8E]'
                      }`}
                    >
                      हिंदी (Hindi)
                    </button>
                  </div>
                </div>

                {/* Instant 1-Click Sample Audio Button */}
                <button
                  onClick={handleLoadSample}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE4D9] text-[#14213D] border border-[#D8D0C3] text-xs font-medium rounded transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#767E8E]" />
                  <span>Insert Sample Terms ({docType.split(' ')[0]})</span>
                </button>
              </div>

              {/* Interim voice speech preview */}
              {interimText && (
                <div className="p-3 bg-[#FAF8F5] border border-[#C8372D] rounded text-xs text-[#14213D] font-mono">
                  Recording: "{interimText}"
                </div>
              )}

              {/* Transcript & Text Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#767E8E]">
                  Dictated or Typed Terms (Editable):
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={`Speak into the microphone or type terms here... E.g. "Draft ${docType} between Ramesh Sharma and Priya Verma, rent 25000, deposit 75000, 11 months duration in Indiranagar Bengaluru..."`}
                  rows={5}
                  className="w-full p-3.5 rounded border border-[#C9C0B3] text-xs sm:text-sm text-[#14213D] focus:outline-none focus:border-[#14213D] bg-[#FAF8F5] leading-relaxed font-mono"
                />
              </div>

              {/* Next Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleExtractEntities}
                  disabled={!transcript.trim() || isExtracting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] text-xs sm:text-sm font-semibold rounded border border-[#14213D] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span>{isExtracting ? 'Extracting Particulars...' : 'Extract Particulars & Review'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: EDITABLE STRUCTURED FORM */}
      {step === 'form' && (
        <div className="bg-white rounded border border-[#D8D0C3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,33,61,0.03)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-3">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#14213D]">
                Review Extracted Particulars ({docType})
              </h2>
              <p className="text-xs text-[#767E8E]">
                Verify extracted particulars before compiling the formal legal deed.
              </p>
            </div>
            <button
              onClick={() => setStep('input')}
              className="text-xs font-medium text-[#14213D] hover:bg-[#EAE4D9] px-3 py-1.5 bg-[#FAF8F5] border border-[#D8D0C3] rounded cursor-pointer"
            >
              ← Edit Input
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(extractedFields).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#767E8E]">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) =>
                    setExtractedFields({ ...extractedFields, [key]: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-[#C9C0B3] bg-[#FAF8F5] text-xs sm:text-sm font-medium text-[#14213D] focus:outline-none focus:border-[#14213D]"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#EFE9DF] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setStep('input')}
              className="text-xs font-medium text-[#4A5366] hover:text-[#14213D] cursor-pointer"
            >
              Modify Terms Prompt
            </button>

            <button
              onClick={handleGenerateContract}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] text-xs sm:text-sm font-semibold rounded border border-[#14213D] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#E2DBD0]" />
              <span>{isGenerating ? 'Compiling Agreement...' : 'Compile Legal Agreement & Summary'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FINAL FORMATTED AGREEMENT & SUMMARY */}
      {step === 'result' && generatedContract && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="bg-white p-4 sm:p-5 rounded border border-[#D8D0C3] shadow-[0_1px_2px_rgba(20,33,61,0.03)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#14213D] text-[#FAF8F5] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#E2DBD0]" />
              </div>
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#14213D]">
                  {generatedContract.document_title || docType}
                </h2>
                <span className="text-xs text-[#767E8E]">
                  Enforceable under Indian Law · Indian Contract Act 1872 & Arbitration Act 1996
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopy(generatedContract.legal_agreement_text, 'legal')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE4D9] text-[#14213D] text-xs font-medium rounded border border-[#D8D0C3] transition-colors cursor-pointer"
              >
                {copiedSection === 'legal' ? (
                  <Check className="w-3.5 h-3.5 text-[#3F5E36]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#767E8E]" />
                )}
                <span>{copiedSection === 'legal' ? 'Copied' : 'Copy Deed'}</span>
              </button>

              <button
                onClick={() => handleCopy(generatedContract.regional_summary || generatedContract.hindi_summary || '', 'hindi')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE4D9] text-[#14213D] text-xs font-medium rounded border border-[#D8D0C3] transition-colors cursor-pointer"
              >
                {copiedSection === 'hindi' ? (
                  <Check className="w-3.5 h-3.5 text-[#3F5E36]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#767E8E]" />
                )}
                <span className="font-indic">{copiedSection === 'hindi' ? 'Copied' : `Copy Summary (${currentLanguageOption.nativeName})`}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] text-xs font-semibold rounded border border-[#14213D] transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#E2DBD0]" />
                <span className="font-indic">{t.printSavePdfBtn}</span>
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#EAE4D9] text-[#14213D] text-xs font-medium rounded border border-[#D8D0C3] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#767E8E]" />
                <span className="font-indic">{t.draftAnotherBtn}</span>
              </button>
            </div>
          </div>

          {/* Statutory Checklist */}
          {generatedContract.statutory_compliance_checklist && (
            <div className="bg-[#FAF8F5] border border-[#D8D0C3] rounded p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C8372D]" />
                <h3 className="text-xs font-mono font-bold text-[#14213D] uppercase tracking-wider">
                  Statutory Execution & Stamp Duty Checklist (India)
                </h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4A5366]">
                {generatedContract.statutory_compliance_checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded border border-[#E2DBD0]">
                    <span className="text-[#C8372D] font-mono font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 2-Column Side-by-Side: Formal Legal Text & Plain Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Formal Legal Agreement (English) */}
            <div className="lg:col-span-7 bg-white rounded border border-[#D8D0C3] p-6 shadow-[0_1px_3px_rgba(20,33,61,0.03)] space-y-3">
              <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-2">
                <h3 className="font-serif text-sm font-bold text-[#14213D]">
                  {t.formalLegalTitle}
                </h3>
                <span className="text-[10px] font-mono uppercase text-[#767E8E]">Legal Indenture</span>
              </div>
              <div className="text-xs sm:text-sm text-[#14213D] font-serif leading-relaxed whitespace-pre-wrap bg-[#FAF8F5] p-5 rounded border border-[#E2DBD0] max-h-[600px] overflow-y-auto">
                {generatedContract.legal_agreement_text}
              </div>
            </div>

            {/* Plain Vernacular Summary */}
            <div className="lg:col-span-5 bg-white rounded border border-[#D8D0C3] p-6 shadow-[0_1px_3px_rgba(20,33,61,0.03)] space-y-3">
              <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-2">
                <h3 className="font-serif text-sm font-bold text-[#14213D]">
                  {t.plainRegionalSummaryTitle} ({currentLanguageOption.nativeName})
                </h3>
                <span className="text-[10px] font-mono uppercase text-[#767E8E]">{currentLanguageOption.englishName}</span>
              </div>
              <div className="p-4 bg-[#FAF8F5] border border-[#E2DBD0] rounded text-xs sm:text-sm text-[#14213D] font-indic leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                {generatedContract.regional_summary || generatedContract.hindi_summary}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
