import React from 'react';
import {
  FileText,
  Mic,
  Compass,
  MessageSquare,
  ArrowRight,
  UploadCloud,
  FileCheck,
} from 'lucide-react';
import { SAMPLE_CONTRACTS, SampleContract } from '../data/sampleContracts';
import { useLanguage } from '../utils/languages';

interface HomeHeroProps {
  onScanClick: () => void;
  onSelectSample: (sample: SampleContract) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onScanClick,
  onSelectSample,
  onNavigateTab,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-12 pb-6">
      {/* ---------------- ASYMMETRIC LEGAL HERO SECTION ---------------- */}
      <section className="bg-white border border-[#D8D0C3] rounded p-6 sm:p-10 lg:p-12 shadow-[0_1px_3px_rgba(20,33,61,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Asymmetric Editorial Heading & Subheading */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#14213D] tracking-tight leading-[1.12]">
                {t.heroHeadline1}{' '}
                <span className="italic font-normal font-serif text-[#C8372D]">
                  {t.heroHeadlineHighlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#4A5366] leading-relaxed max-w-xl font-normal">
                {t.heroSubheadline}
              </p>
            </div>

            {/* Quiet line of text replacing green ticks */}
            <div className="pt-1 text-xs text-[#767E8E] font-medium tracking-wide">
              Grounded in the Indian Contract Act 1872 · Consumer Protection Act 2019 · Bharatiya Nyaya Sanhita 2023
            </div>

            {/* Quick 1-click test chips (typo fixed) */}
            <div className="pt-3 border-t border-[#EFE9DF] space-y-2">
              <span className="block text-xs uppercase tracking-wider font-semibold text-[#767E8E]">
                {t.instantTestPrompt}
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_CONTRACTS.map((sample) => {
                  // Resolve chip label cleanly without repeating "Freelance"
                  const cityOrTopic = sample.name.includes('Noida')
                    ? 'Noida'
                    : sample.name.includes('Bengaluru')
                    ? 'Bengaluru'
                    : 'Mumbai';

                  return (
                    <button
                      key={sample.id}
                      onClick={() => onSelectSample(sample)}
                      className="bg-[#FAF8F5] hover:bg-[#EAE4D9] text-[#14213D] text-xs font-medium px-3 py-1.5 rounded border border-[#D8D0C3] hover:border-[#14213D] transition-colors cursor-pointer text-left"
                    >
                      {sample.category} <span className="text-[#767E8E]">({cityOrTopic})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: "Document Tray" / Stamped Legal Intake Desk */}
          <div className="lg:col-span-5">
            <div
              onClick={onScanClick}
              className="bg-[#FAF8F5] border border-[#C9C0B3] hover:border-[#14213D] rounded p-6 sm:p-7 transition-all cursor-pointer group flex flex-col justify-between relative shadow-sm"
            >
              {/* Stamped Corner Mark */}
              <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-3 mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#767E8E]">
                  Intake Dossier · Sec. 1
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8372D] border border-[#C8372D]/40 px-1.5 py-0.5 rounded">
                  Doc Tray
                </span>
              </div>

              <div className="space-y-4 text-left py-2">
                <div className="w-10 h-10 rounded bg-[#14213D] text-[#FAF8F5] flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-[#E2DBD0]" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-[#14213D] group-hover:text-[#C8372D] transition-colors">
                    {t.dropContractPrompt}{' '}
                    <span className="underline underline-offset-4 decoration-[#C9C0B3]">
                      {t.browseFiles}
                    </span>
                  </h3>
                  <p className="text-xs text-[#4A5366] leading-relaxed">
                    {t.dropContractSub}
                  </p>
                </div>
              </div>

              {/* Single primary button CTA only (duplicate removed) */}
              <div className="mt-5 pt-4 border-t border-[#E2DBD0] flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#14213D] group-hover:bg-[#203154] text-[#FAF8F5] text-xs font-semibold rounded border border-[#14213D] transition-colors">
                  <FileText className="w-3.5 h-3.5 text-[#E2DBD0]" />
                  <span>{t.analyzeNowBtn}</span>
                </div>
                <span className="text-[11px] font-mono text-[#767E8E]">
                  PDF · DOCX · Scans
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4-COLUMN STATUTORY MODULES ---------------- */}
      <section className="space-y-4">
        <div className="border-b border-[#D8D0C3] pb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#14213D] tracking-tight">
            {t.featuresTitle}
          </h2>
          <p className="text-xs text-[#767E8E] font-medium">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Scanner */}
          <div
            onClick={() => onNavigateTab('scanner')}
            className="bg-white rounded border border-[#D8D0C3] hover:border-[#14213D] p-5 transition-colors cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2.5 text-left">
              <div className="w-8 h-8 rounded bg-[#F1ECE1] text-[#14213D] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#14213D] group-hover:text-[#C8372D] transition-colors">
                {t.featScannerTitle}
              </h3>
              <p className="text-xs text-[#4A5366] leading-relaxed">
                {t.featScannerDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFE9DF] flex items-center justify-between text-xs font-semibold text-[#14213D]">
              <span>{t.featScannerAction}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#767E8E] group-hover:translate-x-0.5 group-hover:text-[#14213D] transition-all" />
            </div>
          </div>

          {/* Card 2: Voice Drafter */}
          <div
            onClick={() => onNavigateTab('drafter')}
            className="bg-white rounded border border-[#D8D0C3] hover:border-[#14213D] p-5 transition-colors cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2.5 text-left">
              <div className="w-8 h-8 rounded bg-[#F1ECE1] text-[#14213D] flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#14213D] group-hover:text-[#C8372D] transition-colors">
                {t.featDrafterTitle}
              </h3>
              <p className="text-xs text-[#4A5366] leading-relaxed">
                {t.featDrafterDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFE9DF] flex items-center justify-between text-xs font-semibold text-[#14213D]">
              <span>{t.featDrafterAction}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#767E8E] group-hover:translate-x-0.5 group-hover:text-[#14213D] transition-all" />
            </div>
          </div>

          {/* Card 3: Legal Procedure Navigator */}
          <div
            onClick={() => onNavigateTab('navigator')}
            className="bg-white rounded border border-[#D8D0C3] hover:border-[#14213D] p-5 transition-colors cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2.5 text-left">
              <div className="w-8 h-8 rounded bg-[#F1ECE1] text-[#14213D] flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#14213D] group-hover:text-[#C8372D] transition-colors">
                {t.featNavigatorTitle}
              </h3>
              <p className="text-xs text-[#4A5366] leading-relaxed">
                {t.featNavigatorDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFE9DF] flex items-center justify-between text-xs font-semibold text-[#14213D]">
              <span>{t.featNavigatorAction}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#767E8E] group-hover:translate-x-0.5 group-hover:text-[#14213D] transition-all" />
            </div>
          </div>

          {/* Card 4: Chat with Contract */}
          <div
            onClick={() => onNavigateTab('chat')}
            className="bg-white rounded border border-[#D8D0C3] hover:border-[#14213D] p-5 transition-colors cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2.5 text-left">
              <div className="w-8 h-8 rounded bg-[#F1ECE1] text-[#14213D] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#14213D] group-hover:text-[#C8372D] transition-colors">
                {t.featChatTitle}
              </h3>
              <p className="text-xs text-[#4A5366] leading-relaxed">
                {t.featChatDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EFE9DF] flex items-center justify-between text-xs font-semibold text-[#14213D]">
              <span>{t.featChatAction}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#767E8E] group-hover:translate-x-0.5 group-hover:text-[#14213D] transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATUTORY FRAMEWORK SECTION ---------------- */}
      <section className="bg-white rounded border border-[#D8D0C3] p-6 sm:p-7 space-y-4 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE9DF] pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-[#14213D]">
              Codified Indian Statutory Framework
            </h3>
            <p className="text-xs text-[#767E8E]">
              Zero invented clauses. Every analysis maps directly to codified acts and Supreme Court precedents.
            </p>
          </div>
          <span className="text-[11px] font-mono uppercase text-[#14213D] border border-[#D8D0C3] px-2 py-0.5 rounded bg-[#FAF8F5]">
            Statutory Basis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#FAF8F5] rounded border border-[#E2DBD0] space-y-1">
            <span className="font-serif font-bold text-[#14213D] block">Indian Contract Act, 1872</span>
            <p className="text-[#4A5366]">
              Section 23 (Unlawful object), Section 27 (Restraint of trade void), Section 74 (Penalties vs damages).
            </p>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded border border-[#E2DBD0] space-y-1">
            <span className="font-serif font-bold text-[#14213D] block">Bharatiya Nyaya Sanhita, 2023</span>
            <p className="text-[#4A5366]">
              BNS 318(4) Cheating, BNS 316 Criminal Breach of Trust, BNS 336 Forgery replacing outdated IPC.
            </p>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded border border-[#E2DBD0] space-y-1">
            <span className="font-serif font-bold text-[#14213D] block">Consumer Protection Act, 2019</span>
            <p className="text-[#4A5366]">
              Section 2(46) Unfair Contracts, unilateral termination rights, and excessive deposit demands.
            </p>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded border border-[#E2DBD0] space-y-1">
            <span className="font-serif font-bold text-[#14213D] block">Tenancy & Rent Norms</span>
            <p className="text-[#4A5366]">
              Transfer of Property Act 1882 Sections 105-111, mandatory 30-day notice, and eviction safeguards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
