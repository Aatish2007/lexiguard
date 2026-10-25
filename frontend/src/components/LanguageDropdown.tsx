import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../utils/languages';

interface LanguageDropdownProps {
  compact?: boolean;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ compact = false }) => {
  const { language, setLanguage, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#FAF8F5] hover:bg-[#EAE4D9] border border-[#D8D0C3] text-[#14213D] text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8372D] whitespace-nowrap shrink-0"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Select Language / भाषा"
      >
        <Globe className="w-3.5 h-3.5 text-[#4A5366] shrink-0" />
        <span className="font-indic font-semibold text-[#14213D]">
          {currentLanguageOption.nativeName}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[#767E8E] transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-[#14213D]' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown List */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-52 rounded bg-[#FAF8F5] border border-[#C9C0B3] shadow-md py-1 z-50 origin-top-right focus:outline-none"
          role="listbox"
        >
          <div className="px-3 py-1.5 border-b border-[#E2DBD0] text-[10px] uppercase tracking-wider font-bold text-[#767E8E]">
            Language · भाषा
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-[#EFE9DF]">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#EAE4D9] text-[#14213D] font-bold'
                      : 'text-[#4A5366] hover:bg-[#F1ECE1] hover:text-[#14213D]'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex flex-col">
                    <span className="font-indic text-xs font-semibold text-[#14213D]">
                      {lang.nativeName}
                    </span>
                    <span className="text-[10px] text-[#767E8E]">
                      {lang.englishName}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#C8372D] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
