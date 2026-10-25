import React, { useState } from 'react';
import { Menu, X, FileText, User as UserIcon, LogOut } from 'lucide-react';
import { useLanguage } from '../utils/languages';
import { LanguageDropdown } from './LanguageDropdown';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasActiveDocument: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveDocument,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User';

  // 5 primary links: Scan, Chat, Draft, Navigator, Records (Home accessible via brand wordmark)
  const navItems = [
    { id: 'scanner', label: t.navScan },
    {
      id: 'chat',
      label: t.navChat,
      hasDot: hasActiveDocument,
      dotTitle: 'Document loaded',
    },
    { id: 'drafter', label: t.navDrafter },
    { id: 'navigator', label: t.navNavigator },
    { id: 'history', label: t.navHistory },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F3EC] border-b border-[#E2DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-16">
          {/* Zone 1: Single text element wordmark in display serif */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left cursor-pointer select-none whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C8372D]"
            aria-label="LexiGuard Home"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#14213D]">
              LexiGuard
            </span>
          </button>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group relative py-2 text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#14213D] font-bold'
                      : 'text-[#4A5366] hover:text-[#14213D]'
                  }`}
                >
                  <span className="font-indic">{item.label}</span>
                  {item.hasDot && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#C8372D] shrink-0"
                      title={item.dotTitle}
                      aria-label={item.dotTitle}
                    />
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8372D]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Utility language selector + Scan action + User Profile & Log out */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <LanguageDropdown />

            <button
              onClick={() => handleNavClick('scanner')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#14213D] hover:bg-[#203154] text-[#F7F3EC] text-xs sm:text-sm font-medium rounded border border-[#14213D] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C8372D]"
            >
              <FileText className="w-3.5 h-3.5 text-[#E2DBD0]" />
              <span className="font-indic">{t.scanDocumentBtn}</span>
            </button>

            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-[#D8D0C3]">
                <div
                  className="flex items-center gap-1.5 text-xs text-[#14213D] max-w-[130px] truncate"
                  title={userName}
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#767E8E] shrink-0" />
                  <span className="font-semibold truncate">{userName}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#767E8E] hover:text-[#C8372D] hover:bg-[#EAE4D9] rounded transition-colors cursor-pointer"
                  title="Log out of LexiGuard"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu trigger & utility */}
          <div className="sm:hidden flex items-center gap-2">
            <LanguageDropdown compact />

            <button
              onClick={() => handleNavClick('scanner')}
              className="px-2.5 py-1 bg-[#14213D] text-[#F7F3EC] text-xs font-semibold rounded border border-[#14213D] whitespace-nowrap shrink-0"
            >
              Scan
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#14213D] hover:bg-[#EBE6DC] rounded border border-[#E2DBD0] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E2DBD0] bg-[#FAF8F5] px-4 py-3 space-y-2 shadow-sm">
          {user && (
            <div className="pb-2 mb-2 border-b border-[#E2DBD0] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#14213D] truncate max-w-[200px]">
                <UserIcon className="w-3.5 h-3.5 text-[#767E8E] shrink-0" />
                <span className="font-bold truncate">{userName}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="inline-flex items-center gap-1 text-[#C8372D] font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-[#EAE4D9] text-[#14213D] font-bold border-l-2 border-[#C8372D]'
                    : 'text-[#4A5366] hover:bg-[#F1ECE1] hover:text-[#14213D]'
                }`}
              >
                <span className="font-indic">{item.label}</span>
                {item.hasDot && (
                  <span className="w-2 h-2 rounded-full bg-[#C8372D]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
