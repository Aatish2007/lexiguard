import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { supabase, isSupabaseConfigured, SUPABASE_UNCONFIGURED_MESSAGE } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { refreshSession } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    clearMessages();
    setActiveTab(tab);
  };

  const validateEmail = (val: string) => {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(val.trim());
};
const passwordProblem = (val: string): string | null => {
  if (val.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[a-z]/.test(val)) return 'Password must include a lowercase letter.';
  if (!/[A-Z]/.test(val)) return 'Password must include an uppercase letter.';
  if (!/[0-9]/.test(val)) return 'Password must include a number.';
  if (!/[^A-Za-z0-9]/.test(val)) return 'Password must include a special character (e.g. @, #, !).';
  return null;
};

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage(SUPABASE_UNCONFIGURED_MESSAGE);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        await refreshSession();
      }
    } catch (err: any) {
      console.warn('Login error:', err);
      setErrorMessage(err.message || 'Unable to log in with provided credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage(SUPABASE_UNCONFIGURED_MESSAGE);
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

  const pwProblem = passwordProblem(password);
  if (pwProblem) {
    setErrorMessage(pwProblem);
    return;
}

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        await refreshSession();
      } else {
        setSuccessMessage(
          'Account created successfully! If email confirmation is required, please check your inbox before logging in.'
        );
        setActiveTab('login');
      }
    } catch (err: any) {
      console.warn('Sign up error:', err);
      setErrorMessage(err.message || 'Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!isSupabaseConfigured || !supabase) {
      setForgotError(SUPABASE_UNCONFIGURED_MESSAGE);
      return;
    }

    if (!validateEmail(forgotEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);

    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        throw error;
      }

      setForgotSuccess('Password reset link sent to your email. Please check your inbox.');
    } catch (err: any) {
      console.warn('Reset password error:', err);
      setForgotError(err.message || 'Failed to send password reset link.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F7F3EC] px-4 py-8 sm:py-12">
      {/* Centered Auth Box */}
      <div className="w-full max-w-md bg-white rounded border border-[#D8D0C3] shadow-[0_2px_12px_rgba(20,33,61,0.04)] overflow-hidden">
        {/* Brand Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-[#EFE9DF] text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <span className="font-serif text-3xl font-bold tracking-tight text-[#14213D]">
              LexiGuard
            </span>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#C8372D]">
            Indian Legal AI & Contract Risk Intelligence
          </p>
          <p className="text-xs text-[#4A5366] max-w-xs mx-auto leading-relaxed">
            Scan contracts, detect unconscionable clauses, and translate rights across 10 Indian languages.
          </p>
        </div>

        {/* Supabase Unconfigured Warning Banner if secrets missing */}
        {!isSupabaseConfigured && (
          <div className="m-4 p-4 rounded bg-[#FFF7EE] border border-[#F5D5B5] text-[#9A4B14] text-xs space-y-2">
            <div className="flex items-start gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-[#C8372D] shrink-0 mt-0.5" />
              <span>{SUPABASE_UNCONFIGURED_MESSAGE}</span>
            </div>
            <p className="text-[11px] text-[#7A3F10] leading-relaxed">
              You can also specify your credentials in <code className="bg-white/80 px-1 py-0.5 rounded font-mono border border-[#F5D5B5]">src/lib/supabaseConfig.ts</code> by setting <code className="font-mono font-semibold">SUPABASE_URL</code> and <code className="font-mono font-semibold">SUPABASE_ANON_KEY</code>.
            </p>
          </div>
        )}

        {/* Error and Success Banners */}
        {errorMessage && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Two Tabs: "Log in" and "Sign up" */}
        <div className="flex items-center border-b border-[#EFE9DF] bg-[#FAF8F5]">
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors text-center border-b-2 cursor-pointer ${
              activeTab === 'login'
                ? 'border-[#14213D] text-[#14213D] bg-white'
                : 'border-transparent text-[#767E8E] hover:text-[#14213D]'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors text-center border-b-2 cursor-pointer ${
              activeTab === 'signup'
                ? 'border-[#14213D] text-[#14213D] bg-white'
                : 'border-transparent text-[#767E8E] hover:text-[#14213D]'
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#14213D] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advocate@example.com"
                  autoComplete="email"
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded border border-[#D8D0C3] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#14213D] focus:border-[#14213D] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#14213D] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotError(null);
                      setForgotSuccess(null);
                      setIsForgotModalOpen(true);
                    }}
                    className="text-[11px] font-medium text-[#C8372D] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm rounded border border-[#D8D0C3] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#14213D] focus:border-[#14213D] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767E8E] hover:text-[#14213D]"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !isSupabaseConfigured}
                  className="w-full py-2.5 px-4 bg-[#14213D] hover:bg-[#203154] disabled:bg-slate-300 text-[#FAF8F5] text-xs sm:text-sm font-semibold rounded border border-[#14213D] transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-none"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Log in to LexiGuard</span>
                      <ArrowRight className="w-4 h-4 text-[#E2DBD0]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#14213D] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  autoComplete="name"
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded border border-[#D8D0C3] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#14213D] focus:border-[#14213D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14213D] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advocate@example.com"
                  autoComplete="email"
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded border border-[#D8D0C3] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#14213D] focus:border-[#14213D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14213D] uppercase tracking-wider mb-1.5">
                  Password <span className="text-[11px] font-normal text-[#767E8E]">(min 8 characters)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm rounded border border-[#D8D0C3] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#14213D] focus:border-[#14213D] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767E8E] hover:text-[#14213D]"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14213D] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm rounded border border-[#D8D0C3] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#14213D] focus:border-[#14213D] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767E8E] hover:text-[#14213D]"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !isSupabaseConfigured}
                  className="w-full py-2.5 px-4 bg-[#14213D] hover:bg-[#203154] disabled:bg-slate-300 text-[#FAF8F5] text-xs sm:text-sm font-semibold rounded border border-[#14213D] transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-none"
                >
                  {isLoading ? (
                    <span>Creating account...</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 text-[#E2DBD0]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Security footnote */}
          <div className="mt-6 pt-4 border-t border-[#EFE9DF] text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#767E8E]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F5E36]" />
              <span>Grounded in Indian Contract Act & BNS 2023</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-[#D8D0C3] max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#14213D]/10 text-[#14213D] flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#14213D]">
                  Reset Your Password
                </h3>
                <p className="text-xs text-[#767E8E]">
                  Enter your email to receive recovery instructions.
                </p>
              </div>
            </div>

            {forgotError && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {forgotSuccess}
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#14213D] uppercase tracking-wider mb-1">
                  Account Email
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-3 py-2 text-xs rounded border border-[#D8D0C3] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#14213D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#767E8E] hover:text-[#14213D] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-1.5 bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] text-xs font-semibold rounded border border-[#14213D] transition-colors cursor-pointer"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
