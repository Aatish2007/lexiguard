import React from 'react';
import { PhoneCall, ExternalLink } from 'lucide-react';
import { useLanguage } from '../utils/languages';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#FAF8F5] border-t border-[#D8D0C3] mt-16 text-[#4A5366]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <span className="font-serif text-xl font-bold tracking-tight text-[#14213D] block">
              LexiGuard
            </span>
            <p className="text-xs text-[#767E8E] leading-relaxed">
              {t.footerMission}
            </p>
            <div className="text-[11px] font-hindi text-[#14213D] font-semibold border-l border-[#C8372D] pl-2 py-0.5">
              सत्यमेव जयते · नागरिक अधिकार संरक्षण
            </div>
          </div>

          {/* Col 2: Emergency Helplines */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#14213D]">
              {t.emergencyHelplinesTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="tel:14416"
                  className="hover:text-[#C8372D] transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3 h-3 text-[#767E8E]" />
                  <span>Tele-Law (Free Legal Counsel): <strong className="font-mono text-[#14213D]">14416</strong></span>
                </a>
              </li>
              <li>
                <a
                  href="tel:15100"
                  className="hover:text-[#C8372D] transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3 h-3 text-[#767E8E]" />
                  <span>NALSA Legal Aid Helpline: <strong className="font-mono text-[#14213D]">15100</strong></span>
                </a>
              </li>
              <li>
                <a
                  href="tel:1930"
                  className="hover:text-[#C8372D] transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3 h-3 text-[#767E8E]" />
                  <span>National Cyber Fraud Helpline: <strong className="font-mono text-[#14213D]">1930</strong></span>
                </a>
              </li>
              <li>
                <a
                  href="tel:1915"
                  className="hover:text-[#C8372D] transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3 h-3 text-[#767E8E]" />
                  <span>National Consumer Helpline: <strong className="font-mono text-[#14213D]">1915</strong></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Citizen Portals */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#14213D]">
              {t.govPortalsTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.tele-law.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C8372D] transition-colors flex items-center gap-1"
                >
                  <span>Tele-Law Portal (Dept. of Justice)</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#767E8E]" />
                </a>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C8372D] transition-colors flex items-center gap-1"
                >
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#767E8E]" />
                </a>
              </li>
              <li>
                <a
                  href="https://consumerhelpline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C8372D] transition-colors flex items-center gap-1"
                >
                  <span>Consumer Grievance (e-Daakhil)</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#767E8E]" />
                </a>
              </li>
              <li>
                <a
                  href="https://services.ecourts.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C8372D] transition-colors flex items-center gap-1"
                >
                  <span>eCourts Services India</span>
                  <ExternalLink className="w-2.5 h-2.5 text-[#767E8E]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Statutory Legal Disclaimer */}
          <div className="space-y-2 text-xs">
            <h4 className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#14213D]">
              {t.disclaimerTitle}
            </h4>
            <p className="text-[11px] text-[#767E8E] leading-relaxed">
              {t.disclaimerText}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E2DBD0] flex flex-wrap items-center justify-between gap-3 text-xs text-[#767E8E]">
          <div>
            © {new Date().getFullYear()} LexiGuard · Indian Contract Risk & Statutory Review
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Bharatiya Nyaya Sanhita 2023 Compliant</span>
            <span>·</span>
            <span>Indian Contract Act 1872 Grounded</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
