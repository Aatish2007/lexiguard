import React from 'react';
import { AlertCircle, ExternalLink, PhoneCall, ShieldCheck } from 'lucide-react';

interface ExpertEscalationCardProps {
  riskScore: number;
}

export const ExpertEscalationCard: React.FC<ExpertEscalationCardProps> = ({ riskScore }) => {
  return (
    <div className="bg-amber-50/70 border border-amber-300 rounded-md p-4 sm:p-5 shadow-none space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-amber-500 text-white shrink-0 flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-amber-950 font-sans">
              This looks complex — get expert help
            </h3>
            <div className="inline-flex items-center pl-2 border-l-2 border-[#B42318]">
              <span className="text-xs font-medium text-[#B42318] tabular-nums">
                Risk Score: {riskScore}/100
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-sans">
            This agreement contains severe unconscionable clauses or unlawful penalties under Indian law (e.g. Indian Contract Act Section 23/27 or Tenancy Regulations). Signing it without amendment could forfeit your legal rights.
          </p>

          <p className="text-xs sm:text-sm text-amber-950/90 font-medium font-hindi leading-relaxed bg-amber-100/60 p-3 rounded-md border border-amber-200/80 shadow-none">
            <strong>मुफ्त कानूनी सलाह लें:</strong> यह अनुबंध अत्यधिक जोखिम भरा है। हस्ताक्षर करने से पहले सरकारी टेली-लॉ पोर्टल या कानूनी सहायता केंद्र से मुफ्त सलाह अवश्य लें।
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <a
              href="https://www.tele-law.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-medium rounded-md transition-colors shadow-none"
            >
              <span>Talk to a Free Legal Expert</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="tel:14416"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-xs sm:text-sm font-medium rounded-md transition-colors shadow-none"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>Tele-Law Toll-Free: 14416</span>
            </a>

            <a
              href="tel:15100"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-amber-50 text-slate-700 border border-amber-200 text-xs sm:text-sm font-medium rounded-md transition-colors shadow-none"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>NALSA Legal Aid: 15100</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
