import React, { useState } from 'react';
import { RedFlag } from '../types/legal';
import { Copy, Check, ChevronDown, ChevronUp, BookOpen, Sparkles } from 'lucide-react';
import { useLanguage } from '../utils/languages';

interface RedFlagCardProps {
  flag: RedFlag;
  index: number;
}

export const RedFlagCard: React.FC<RedFlagCardProps> = ({ flag, index }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const { t, currentLanguageOption } = useLanguage();

  const handleCopyRecommendation = () => {
    navigator.clipboard.writeText(flag.recommendation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const severityConfigs = {
    HIGH: {
      color: '#B42318',
      label: 'High Severity Clause',
    },
    MEDIUM: {
      color: '#B7791F',
      label: 'Medium Severity Clause',
    },
    LOW: {
      color: '#2F6B4F',
      label: 'Low / Advisory Notice',
    },
  };

  const config = severityConfigs[flag.severity] || severityConfigs.MEDIUM;
  const riskColor = config.color;
  const explanationText = flag.regional_explanation || flag.hindi_explanation;

  return (
    <div className="bg-white rounded-md border border-slate-200 shadow-none overflow-hidden">
      {/* Header bar */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">
              #{index + 1}
            </span>
            <div
              className="inline-flex items-center pl-2 border-l-2"
              style={{ borderColor: riskColor }}
            >
              <span
                className="text-xs font-medium"
                style={{ color: riskColor }}
              >
                {config.label}
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-sm hover:bg-slate-100 transition-colors"
            aria-label="Toggle clause details"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Quoted clause text */}
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-md p-3 text-xs sm:text-sm font-mono text-slate-800 leading-relaxed italic shadow-none">
          "{flag.clause_text}"
        </div>

        {/* Legal statute basis badge */}
        {flag.legal_basis && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#5F259F]" />
            <span className="text-slate-500 font-indic">{t.statutoryBasis}</span>
            <span className="text-[#5F259F] font-semibold">{flag.legal_basis}</span>
          </div>
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-100 pt-3">
          {/* Issue explanation in English */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 font-indic">
              {t.whyProblematic}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {flag.issue_explanation}
            </p>
          </div>

          {/* Regional Explanation callout box */}
          {explanationText && (
            <div className="bg-[#5F259F]/5 border border-[#5F259F]/20 rounded-md p-3.5 shadow-none">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#5F259F] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-indic">{t.plainRegionalExpl} ({currentLanguageOption.nativeName})</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-indic leading-relaxed">
                {explanationText}
              </p>
            </div>
          )}

          {/* Recommendation / Recommended amendment box */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-md p-3.5 shadow-none">
            <div className="flex items-center justify-between mb-1.5">
              <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider font-indic">
                {t.recommendedAction}
              </h5>
              <button
                onClick={handleCopyRecommendation}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/70 px-2 py-0.5 rounded-sm transition-colors cursor-pointer"
                title="Copy suggested replacement clause"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
              {flag.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
