import { API } from '../lib/api';
import React, { useState } from 'react';
import {
  Compass,
  Search,
  ExternalLink,
  PhoneCall,
  Clock,
  IndianRupee,
  FileCheck2,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { LegalNavigatorResult } from '../types/legal';
import { useLanguage } from '../utils/languages';

const POPULAR_LEGAL_ISSUES = [
  {
    title: 'Cyber Fraud & UPI Scam',
    query: 'Cyber fraud of ₹45,000 happened via fake bank link and UPI PIN entered. What is the immediate procedure?',
    category: 'Financial / Cyber Crime',
  },
  {
    title: 'Landlord Refusing Deposit Refund',
    query: 'Vacated rental flat 2 months ago in good condition. Landlord is ghosting calls and refusing to return ₹75,000 security deposit. How do I recover it legally?',
    category: 'Tenancy Dispute',
  },
  {
    title: 'Defective Product E-Commerce Refund',
    query: 'Ordered a refrigerator online for ₹32,000. It arrived broken and seller cancelled return request. How to file a consumer complaint?',
    category: 'Consumer Rights',
  },
  {
    title: 'Employer Withheld Salary & Relieving Letter',
    query: 'Completed 60 days notice period at tech firm, but employer is holding 2 months salary and refusing to give relieving letter or PF clearance.',
    category: 'Labor & Employment',
  },
  {
    title: 'Harassment by Loan Recovery Agents',
    query: 'Receiving threatening WhatsApp messages and calls to my contacts from an illegal digital lending loan app. What legal actions can I take?',
    category: 'Intimidation / RBI Norms',
  },
];

export const LegalNavigator: React.FC = () => {
  const { t, language, currentLanguageOption } = useLanguage();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LegalNavigatorResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (userQuery?: string) => {
    const q = (userQuery || query).trim();
    if (!q) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API}/api/legal-navigator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, targetLanguage: language }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate legal roadmap.');
      }

      const data: LegalNavigatorResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error navigating legal procedure.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white rounded border border-[#D8D0C3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,33,61,0.03)]">
        <div className="max-w-3xl space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[#C8372D] block">
            Module 03 · Dispute Procedure Navigator
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
            {t.navHeadline}
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5366] leading-relaxed">
            {t.navDescription}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t.searchGrievancePlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded border border-[#C9C0B3] bg-[#FAF8F5] text-xs sm:text-sm text-[#14213D] focus:outline-none focus:border-[#14213D]"
            />
            <Search className="w-4 h-4 text-[#767E8E] absolute left-3 top-3.5" />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || isLoading}
            className="px-5 py-2.5 bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] text-xs sm:text-sm font-semibold rounded border border-[#14213D] transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {isLoading ? 'Generating Roadmap...' : t.getRoadmapBtn}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-[#FBECEB] border border-[#E8B4B0] text-[#A83226] rounded text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Presets */}
        <div className="mt-6 pt-5 border-t border-[#EFE9DF]">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#767E8E] block mb-3">
            Common Citizen Grievances (Select to Inspect):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {POPULAR_LEGAL_ISSUES.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setQuery(item.query);
                  handleSearch(item.query);
                }}
                className="p-3.5 rounded border border-[#D8D0C3] hover:border-[#14213D] bg-[#FAF8F5] hover:bg-white transition-colors cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8372D]">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-[#14213D]">
                    {item.title}
                  </h4>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-[#767E8E] group-hover:text-[#14213D]">
                  <span>Inspect Docket</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROADMAP RESULTS VIEW */}
      {result && (
        <div className="space-y-6">
          {/* Issue Overview & Applicable Statutes */}
          <div className="bg-white rounded border border-[#D8D0C3] p-6 sm:p-7 shadow-[0_1px_3px_rgba(20,33,61,0.03)] space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EFE9DF] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#767E8E] border border-[#D8D0C3] px-1.5 py-0.5 rounded bg-[#FAF8F5]">
                  {result.category}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#14213D] mt-1.5">
                  {result.issue_title}
                </h2>
              </div>
            </div>

            {/* Plain Vernacular Summary */}
            <div className="bg-[#FAF8F5] border-l-2 border-[#C8372D] p-3.5 rounded-r border-y border-r border-[#E2DBD0]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#14213D] mb-1">
                दस्तावेज़ सारांश / Overview ({currentLanguageOption.nativeName}):
              </div>
              <p className="text-xs sm:text-sm text-[#14213D] font-indic leading-relaxed">
                {result.summary_regional || result.summary_hindi}
              </p>
            </div>

            {/* Applicable Acts & Sections */}
            {result.applicable_laws && (
              <div className="pt-2">
                <h3 className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#767E8E] mb-2">
                  Applicable Indian Legal Acts & Sections:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.applicable_laws.map((law, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF8F5] border border-[#E2DBD0] rounded p-3 text-xs space-y-1"
                    >
                      <div className="font-serif font-bold text-[#14213D]">{law.act_name}</div>
                      <div className="text-[#C8372D] font-mono text-[11px]">
                        {law.key_sections}
                      </div>
                      <div className="text-[#4A5366]">{law.citizen_right}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* URGENT GOLDEN HOUR STEP */}
          {result.urgent_first_step && (
            <div className="bg-[#FAF8F5] border-2 border-[#C8372D] rounded p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-[#C8372D] text-white shrink-0 flex items-center justify-center font-mono font-bold text-sm">
                !
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8372D] font-bold">
                  Immediate Golden Hour Action ({result.urgent_first_step.deadline})
                </span>
                <h3 className="font-serif text-base font-bold text-[#14213D]">
                  {result.urgent_first_step.action}
                </h3>
                <p className="text-xs text-[#4A5366]">
                  Official Contact / Helpline: <strong className="text-[#14213D] font-mono">{result.urgent_first_step.helpline_or_link}</strong>
                </p>
              </div>
            </div>
          )}

          {/* VERTICAL STEPPER / TIMELINE */}
          <div className="bg-white rounded border border-[#D8D0C3] p-6 sm:p-8 shadow-[0_1px_3px_rgba(20,33,61,0.03)] space-y-6">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#14213D] border-b border-[#EFE9DF] pb-3">
              Step-by-Step Statutory Resolution Stepper
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#D8D0C3]">
              {result.steps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Marker Dot */}
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded bg-[#14213D] text-[#FAF8F5] flex items-center justify-center text-xs font-mono font-bold">
                    {step.step_number || idx + 1}
                  </div>

                  {/* Step Content Card */}
                  <div className="bg-[#FAF8F5] border border-[#E2DBD0] rounded p-4 sm:p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#14213D]">
                        {step.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 text-[#4A5366] bg-white border border-[#D8D0C3] px-2 py-0.5 rounded font-mono text-[11px]">
                          <Clock className="w-3 h-3 text-[#767E8E]" />
                          <span>{step.estimated_timeline}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#3F5E36] bg-[#F1F5EE] border border-[#BDD1B8] px-2 py-0.5 rounded font-mono text-[11px]">
                          <IndianRupee className="w-3 h-3" />
                          <span>{step.cost_inr}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#4A5366] leading-relaxed">
                      {step.action_description}
                    </p>

                    {/* Regional guidance */}
                    {(step.regional_guidance || step.hindi_guidance) && (
                      <div className="p-3 bg-white rounded border border-[#E2DBD0] text-xs text-[#14213D] font-indic">
                        <strong>मार्गदर्शन ({currentLanguageOption.nativeName}):</strong> {step.regional_guidance || step.hindi_guidance}
                      </div>
                    )}

                    {/* Links & Helplines */}
                    <div className="pt-1 flex flex-wrap items-center gap-2.5">
                      {step.portal_url && (
                        <a
                          href={step.portal_url.startsWith('http') ? step.portal_url : `https://${step.portal_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] text-xs font-semibold rounded transition-colors"
                        >
                          <span>{step.portal_name || 'Official Portal'}</span>
                          <ExternalLink className="w-3 h-3 text-[#E2DBD0]" />
                        </a>
                      )}

                      {step.helpline && (
                        <a
                          href={`tel:${step.helpline.replace(/[^0-9]/g, '')}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#EAE4D9] text-[#14213D] border border-[#D8D0C3] text-xs font-medium rounded transition-colors"
                        >
                          <PhoneCall className="w-3 h-3 text-[#767E8E]" />
                          <span>Helpline: {step.helpline}</span>
                        </a>
                      )}
                    </div>

                    {/* Evidence needed */}
                    {step.documents_needed && step.documents_needed.length > 0 && (
                      <div className="pt-2 border-t border-[#E2DBD0]">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#767E8E] block mb-1">
                          Mandatory Evidence / Documents:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {step.documents_needed.map((doc, docIdx) => (
                            <span
                              key={docIdx}
                              className="text-xs bg-white text-[#14213D] border border-[#D8D0C3] px-2 py-0.5 rounded flex items-center gap-1"
                            >
                              <FileCheck2 className="w-3 h-3 text-[#767E8E]" />
                              <span>{doc}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FREE GOVERNMENT LEGAL AID */}
          {result.free_legal_aid && (
            <div className="bg-[#FAF8F5] rounded border border-[#D8D0C3] p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#14213D] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-xs">
                  §
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#14213D]">
                    Free Legal Aid by Government of India
                  </h3>
                  <p className="text-xs text-[#767E8E]">
                    Department of Justice (Tele-Law) & National Legal Services Authority (NALSA)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded border border-[#E2DBD0] space-y-1.5">
                  <div className="font-semibold text-[#14213D]">Tele-Law Pre-Litigation Advice</div>
                  <p className="text-[#4A5366]">{result.free_legal_aid.tele_law_info}</p>
                  <a
                    href="https://www.tele-law.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#14213D] hover:text-[#C8372D]"
                  >
                    <span>tele-law.in</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 bg-white rounded border border-[#E2DBD0] space-y-1.5">
                  <div className="font-semibold text-[#14213D]">NALSA Legal Aid Helpline</div>
                  <p className="text-[#4A5366]">
                    Call <strong>{result.free_legal_aid.nalsa_helpline}</strong> for free advice and legal counsel allocation under Legal Services Authorities Act 1987.
                  </p>
                  <a
                    href="tel:15100"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#14213D] hover:text-[#C8372D]"
                  >
                    <span>Dial 15100 (Toll-Free)</span>
                    <PhoneCall className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
