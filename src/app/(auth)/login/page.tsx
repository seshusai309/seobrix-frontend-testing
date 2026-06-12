'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api/auth.api';
import { Btn, Input, Label } from '@/components/ui';
import { homeForRole } from '@/lib/roles';
import { Eye, EyeOff } from 'lucide-react';

type Mode = 'signin' | 'signup';
type Method = 'email' | 'phone';
type Step = 'form' | 'otp' | 'profile';

const STATS = [
  { value: '2.4M+', label: 'Words Published' },
  { value: '98%', label: 'Client Retention' },
  { value: '340+', label: 'Clients Served' },
];

const COUNTRIES = [
  { code: 'IN', dial: '+91',  flag: '🇮🇳', name: 'India' },
  { code: 'US', dial: '+1',   flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial: '+44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'AU', dial: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: 'CA', dial: '+1',   flag: '🇨🇦', name: 'Canada' },
  { code: 'SG', dial: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: 'DE', dial: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dial: '+33',  flag: '🇫🇷', name: 'France' },
  { code: 'NL', dial: '+31',  flag: '🇳🇱', name: 'Netherlands' },
  { code: 'BR', dial: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: 'ZA', dial: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'PK', dial: '+92',  flag: '🇵🇰', name: 'Pakistan' },
  { code: 'BD', dial: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'PH', dial: '+63',  flag: '🇵🇭', name: 'Philippines' },
  { code: 'ID', dial: '+62',  flag: '🇮🇩', name: 'Indonesia' },
  { code: 'MY', dial: '+60',  flag: '🇲🇾', name: 'Malaysia' },
  { code: 'JP', dial: '+81',  flag: '🇯🇵', name: 'Japan' },
  { code: 'KR', dial: '+82',  flag: '🇰🇷', name: 'South Korea' },
];

export default function LoginPage() {
  const { login, setTokens, user, isLoading } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('signin');
  const [method, setMethod] = useState<Method>('email');
  const [step, setStep] = useState<Step>('form');

  // Phone fields
  const [dialCode, setDialCode] = useState('+91');
  const [localNumber, setLocalNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [phoneToken, setPhoneToken] = useState('');

  // Email sign-in
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Email sign-up
  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');

  // Profile step (phone signup)
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileAgency, setProfileAgency] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(homeForRole(user.role));
    }
  }, [user, isLoading, router]);

  const fullPhone = dialCode + localNumber;

  function resetToForm() {
    setStep('form');
    setError('');
    setInfo('');
    setSmsCode('');
    setEmailOtp('');
    setPhoneToken('');
  }

  function switchMode(m: Mode) {
    setMode(m);
    setMethod('email');
    resetToForm();
  }

  function switchMethod(m: Method) {
    setMethod(m);
    resetToForm();
  }

  // ── Sign In ───────────────────────────────────────────────────────────────

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignInPhoneSend(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.sendSmsOtp(fullPhone);
      setInfo(result.message);
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignInPhoneVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.verifySmsOtp(fullPhone, smsCode);
      if ('accessToken' in result) {
        setTokens(result.accessToken, result.refreshToken, result.user);
        router.replace(homeForRole(result.user.role));
      } else if (result.status === 'needs_profile') {
        // Number verified but not registered — switch to sign-up profile step
        setMode('signup');
        setPhoneToken(result.phoneToken);
        setInfo('Number verified! Fill in your details to create an account.');
        setStep('profile');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  }

  // ── Sign Up — Email ───────────────────────────────────────────────────────

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.register({
        name,
        email: signupEmail,
        password: signupPassword,
        agencyName,
      });
      setInfo(result.message);
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.verifyEmailOtp(signupEmail, emailOtp);
      setTokens(result.accessToken, result.refreshToken, result.user);
      router.replace(homeForRole(result.user.role));
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Sign Up — Phone ───────────────────────────────────────────────────────

  async function handleSignUpPhoneSend(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.sendSmsOtp(fullPhone);
      setInfo(result.message);
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUpPhoneVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.verifySmsOtp(fullPhone, smsCode);
      if ('accessToken' in result) {
        // Number already registered — sign them in directly
        setTokens(result.accessToken, result.refreshToken, result.user);
        router.replace(homeForRole(result.user.role));
      } else if (result.status === 'needs_profile') {
        setPhoneToken(result.phoneToken);
        setInfo('');
        setStep('profile');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteProfile(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.completePhoneSignup({
        phoneToken,
        name: profileName,
        email: profileEmail,
        agencyName: profileAgency,
      });
      setTokens(result.accessToken, result.refreshToken, result.user);
      router.replace(homeForRole(result.user.role));
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const oauthRedirect = (provider: 'google' | 'facebook' | 'microsoft') => {
    window.location.href = authApi.getOAuthUrl(provider);
  };

  async function handleResendSmsOtp() {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const result = await authApi.sendSmsOtp(fullPhone);
      setSmsCode('');
      setInfo(result.message);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }

  // ── Renderers ─────────────────────────────────────────────────────────────

  function renderSignIn() {
    if (method === 'email') {
      return (
        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Email address</Label>
            <Input type="email" placeholder="you@company.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Password</Label>
            <PasswordInput value={password} onChange={setPassword} show={showPw}
              onToggle={() => setShowPw(p => !p)} autoComplete="current-password" />
          </div>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Btn type="submit" loading={loading} className="w-full justify-center h-10 text-[14px]">
            Sign in
          </Btn>
          <p className="text-center text-[12.5px] text-muted">
            No account?{' '}
            <button type="button" onClick={() => switchMode('signup')} className="text-brand hover:underline">
              Create one
            </button>
          </p>
        </form>
      );
    }

    if (step === 'form') {
      return (
        <form onSubmit={handleSignInPhoneSend} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Phone number</Label>
            <PhoneInput dialCode={dialCode} onDialChange={setDialCode}
              localNumber={localNumber} onLocalChange={setLocalNumber} />
          </div>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Btn type="submit" loading={loading} className="w-full justify-center h-10 text-[14px]">
            Send OTP
          </Btn>
        </form>
      );
    }

    return (
      <form onSubmit={handleSignInPhoneVerify} className="flex flex-col gap-4">
        {info && <InfoMsg>{info}</InfoMsg>}
        <div className="flex flex-col gap-1.5">
          <Label>6-digit OTP</Label>
          <Input type="text" placeholder="123456" value={smsCode}
            onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required maxLength={6} autoComplete="one-time-code" inputMode="numeric" />
          <p className="text-[11.5px] text-muted">Sent to {fullPhone}</p>
        </div>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Btn type="submit" loading={loading} className="w-full justify-center h-10 text-[14px]">
          Verify &amp; Sign in
        </Btn>
        <div className="flex items-center justify-between">
          <button type="button" onClick={handleResendSmsOtp}
            className="text-[12.5px] text-muted hover:text-brand transition-colors">
            Resend OTP
          </button>
          <BackLink onClick={resetToForm}>Change number</BackLink>
        </div>
      </form>
    );
  }

  function renderSignUp() {
    if (method === 'email') {
      if (step === 'form') {
        return (
          <form onSubmit={handleEmailSignUp} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <Label>Full name</Label>
              <Input type="text" placeholder="Jane Smith" value={name}
                onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Work email</Label>
              <Input type="email" placeholder="you@company.com" value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Password</Label>
              <PasswordInput value={signupPassword} onChange={setSignupPassword}
                show={showSignupPw} onToggle={() => setShowSignupPw(p => !p)}
                autoComplete="new-password" placeholder="Min 8 chars, 1 uppercase, 1 number" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Agency name</Label>
              <Input type="text" placeholder="NorthShore Digital" value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)} required autoComplete="organization" />
            </div>
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <Btn type="submit" loading={loading} className="w-full justify-center h-10 text-[14px] mt-1">
              Create account
            </Btn>
            <p className="text-center text-[12.5px] text-muted">
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('signin')} className="text-brand hover:underline">
                Sign in
              </button>
            </p>
          </form>
        );
      }

      return (
        <form onSubmit={handleEmailOtpVerify} className="flex flex-col gap-4">
          {info && <InfoMsg>{info}</InfoMsg>}
          <div className="flex flex-col gap-1.5">
            <Label>4-digit verification code</Label>
            <Input type="text" placeholder="1234" value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required maxLength={4} autoComplete="one-time-code" inputMode="numeric" />
            <p className="text-[11.5px] text-muted">Sent to {signupEmail}</p>
          </div>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Btn type="submit" loading={loading} className="w-full justify-center h-10 text-[14px]">
            Verify email
          </Btn>
          <button type="button"
            onClick={() => { setError(''); authApi.sendOtp(signupEmail).then(() => setInfo('New code sent!')).catch(() => setError('Failed to resend')); }}
            className="text-[12.5px] text-muted hover:text-brand text-center transition-colors">
            Resend code
          </button>
          <BackLink onClick={resetToForm}>Back</BackLink>
        </form>
      );
    }

    // Phone sign-up
    if (step === 'form') {
      return (
        <form onSubmit={handleSignUpPhoneSend} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Phone number</Label>
            <PhoneInput dialCode={dialCode} onDialChange={setDialCode}
              localNumber={localNumber} onLocalChange={setLocalNumber} />
          </div>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Btn type="submit" loading={loading} className="w-full justify-center h-10 text-[14px]">
            Send OTP
          </Btn>
        </form>
      );
    }

    if (step === 'otp') {
      return (
        <form onSubmit={handleSignUpPhoneVerify} className="flex flex-col gap-4">
          {info && <InfoMsg>{info}</InfoMsg>}
          <div className="flex flex-col gap-1.5">
            <Label>6-digit OTP</Label>
            <Input type="text" placeholder="123456" value={smsCode}
              onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required maxLength={6} autoComplete="one-time-code" inputMode="numeric" />
            <p className="text-[11.5px] text-muted">Sent to {fullPhone}</p>
          </div>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Btn type="submit" loading={loading} className="w-full justify-center h-10 text-[14px]">
            Verify number
          </Btn>
          <div className="flex items-center justify-between">
            <button type="button" onClick={handleResendSmsOtp}
              className="text-[12.5px] text-muted hover:text-brand transition-colors">
              Resend OTP
            </button>
            <BackLink onClick={resetToForm}>Change number</BackLink>
          </div>
        </form>
      );
    }

    // step === 'profile'
    return (
      <form onSubmit={handleCompleteProfile} className="flex flex-col gap-3.5">
        <InfoMsg>Number verified! Tell us a bit about yourself.</InfoMsg>
        <div className="flex flex-col gap-1.5">
          <Label>Full name</Label>
          <Input type="text" placeholder="Jane Smith" value={profileName}
            onChange={(e) => setProfileName(e.target.value)} required autoComplete="name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Work email</Label>
          <Input type="email" placeholder="you@company.com" value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Agency name</Label>
          <Input type="text" placeholder="NorthShore Digital" value={profileAgency}
            onChange={(e) => setProfileAgency(e.target.value)} required autoComplete="organization" />
        </div>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Btn type="submit" loading={loading} className="w-full justify-center h-10 text-[14px] mt-1">
          Create account
        </Btn>
      </form>
    );
  }

  const showTabs = step === 'form' && method === 'email';

  const titles: Record<string, string> = {
    'signin-email-form': 'Welcome back',
    'signin-phone-form': 'Sign in with phone',
    'signin-phone-otp': 'Check your phone',
    'signup-email-form': 'Create your account',
    'signup-email-otp': 'Check your inbox',
    'signup-phone-form': 'Sign up with phone',
    'signup-phone-otp': 'Verify your number',
    'signup-phone-profile': 'Almost there',
  };

  const subtitles: Record<string, string> = {
    'signin-email-form': 'Sign in to your workspace',
    'signin-phone-form': "We'll send a one-time code to your number",
    'signin-phone-otp': 'Enter the 6-digit code we sent you',
    'signup-email-form': 'Start managing your SEO content',
    'signup-email-otp': 'Enter the 4-digit code we emailed you',
    'signup-phone-form': "We'll send a one-time code to verify",
    'signup-phone-otp': 'Enter the 6-digit code we sent you',
    'signup-phone-profile': 'Enter your name and email to finish',
  };

  const titleKey = `${mode}-${method}-${step}`;

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── Left panel — branding ── */}
      <div
        className="hidden lg:flex w-[30%] flex-col items-start justify-center p-10 relative overflow-hidden flex-shrink-0 h-full"
        style={{ background: 'linear-gradient(135deg, #0d2b1e 0%, #0a1f15 40%, var(--bg) 100%)' }}
      >
        <div className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--brand), transparent 70%)' }} />
        <div className="absolute bottom-[80px] right-[40px] w-[200px] h-[200px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, var(--brand), transparent 70%)' }} />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-16">
            <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[15px] font-bold"
              style={{ background: 'var(--brand)' }}>SB</span>
            <span className="text-[18px] font-semibold text-white tracking-tight">SEO Brix</span>
          </div>

          <p className="text-[13px] uppercase tracking-widest text-brand font-semibold mb-4">
            SEO Content Platform
          </p>
          <h2 className="text-[38px] font-semibold text-white leading-snug mb-5">
            Scale your SEO<br />content operation
          </h2>
          <p className="text-[14.5px] text-ink-2 leading-relaxed mb-12 max-w-[340px]">
            Manage blogs, clients, and your entire team workflow — from draft to published.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mb-12">
            {STATS.map((s) => (
              <div key={s.value}>
                <p className="text-[26px] font-bold text-white tnum">{s.value}</p>
                <p className="text-[12px] text-ink-2 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="hairline rounded-card px-5 py-4 bg-surface/20 backdrop-blur-sm max-w-[360px]">
            <p className="text-[13px] text-ink-2 leading-relaxed italic">
              "SEO Brix streamlined our entire content pipeline. Our team ships 3× more approved content per month."
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: 'var(--brand)' }}>JD</span>
              <div>
                <p className="text-[12px] font-semibold text-ink">Jamie D.</p>
                <p className="text-[11px] text-muted">Agency Director, NorthShore Digital</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="w-[70%] overflow-y-auto flex items-center justify-center px-8 py-12 bg-bg">
        <div className="w-full max-w-[520px] animate-fadeup">

          {/* Mobile logo (only visible < lg) */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[14px] font-bold"
              style={{ background: 'var(--brand)' }}>SB</span>
            <span className="text-[17px] font-semibold text-ink tracking-tight">SEO Brix</span>
          </div>

          {/* Mode tabs */}
          {showTabs && (
            <div className="flex hairline rounded-btn mb-8 p-0.5 bg-surface">
              {(['signin', 'signup'] as Mode[]).map((m) => (
                <button key={m} type="button" onClick={() => switchMode(m)}
                  className={`flex-1 h-8 rounded-[5px] text-[13px] font-medium transition-all ${
                    mode === m ? 'bg-surface-2 text-ink' : 'text-muted hover:text-ink-2'
                  }`}>
                  {m === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-[24px] font-semibold text-ink tracking-tight mb-1">
            {titles[titleKey] || 'Welcome'}
          </h1>
          <p className="text-[13.5px] text-ink-2 mb-7">
            {subtitles[titleKey] || ''}
          </p>

          {/* OAuth buttons + phone — shown only on email/form step */}
          {showTabs && method === 'email' && (
            <>
              <div className="flex flex-col gap-2.5 mb-6">
                <OAuthBtn icon={<GoogleIcon />} label="Continue with Google" onClick={() => oauthRedirect('google')} />
                <OAuthBtn icon={<MicrosoftIcon />} label="Continue with Microsoft" onClick={() => oauthRedirect('microsoft')} />
                <OAuthBtn icon={<FacebookIcon />} label="Continue with Facebook" onClick={() => oauthRedirect('facebook')} />
                <OAuthBtn icon={<PhoneIcon />} label="Continue with phone number" onClick={() => switchMethod('phone')} />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-surface-3" />
                <span className="text-[11.5px] text-muted">or</span>
                <div className="flex-1 h-px bg-surface-3" />
              </div>
            </>
          )}

          {/* Back link when in phone flow */}
          {method === 'phone' && step === 'form' && (
            <button type="button" onClick={() => switchMethod('email')}
              className="flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink-2 transition-colors mb-6">
              ← Back to all options
            </button>
          )}

          {mode === 'signin' ? renderSignIn() : renderSignUp()}
        </div>
      </div>
    </div>
  );
}

// ── PhoneInput ────────────────────────────────────────────────────────────────

function PhoneInput({
  dialCode, onDialChange, localNumber, onLocalChange,
}: {
  dialCode: string;
  onDialChange: (v: string) => void;
  localNumber: string;
  onLocalChange: (v: string) => void;
}) {
  const selected = COUNTRIES.find(c => c.dial === dialCode) || COUNTRIES[0];
  return (
    <div className="flex hairline rounded-btn bg-surface overflow-hidden focus-within:shadow-ring transition-shadow">
      <div className="relative flex-shrink-0">
        <select
          value={dialCode}
          onChange={(e) => onDialChange(e.target.value)}
          className="h-10 pl-3 pr-7 bg-transparent text-[13.5px] text-ink outline-none appearance-none cursor-pointer border-r border-surface-3"
          style={{ minWidth: 80 }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.dial}>
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted text-[10px]">▾</span>
      </div>
      <input
        type="tel"
        placeholder="98765 43210"
        value={localNumber}
        onChange={(e) => onLocalChange(e.target.value.replace(/\D/g, ''))}
        required
        autoComplete="tel-national"
        inputMode="numeric"
        className="flex-1 h-10 px-3 bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
      />
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function PasswordInput({
  value, onChange, show, onToggle, autoComplete, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder || '••••••••'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete={autoComplete}
        className="w-full h-10 px-3 pr-10 rounded-btn hairline bg-surface text-[14px] text-ink outline-none focus:shadow-ring placeholder:text-muted transition-shadow"
      />
      <button type="button" onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink-2 transition-colors">
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

function OAuthBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center justify-center gap-3 px-4 h-10 rounded-btn hairline bg-surface hover:bg-surface-2 text-[13.5px] text-ink transition-colors">
      <span className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return <p className="text-[12.5px] text-red px-3 py-2 rounded-btn bg-red/10">{children}</p>;
}

function InfoMsg({ children }: { children: React.ReactNode }) {
  return <p className="text-[12.5px] text-brand px-3 py-2 rounded-btn bg-brand/10">{children}</p>;
}

function BackLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className="text-[12.5px] text-muted hover:text-ink-2 text-center transition-colors">
      ← {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022"/>
      <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00"/>
      <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="9" fill="#1877F2"/>
      <path fill="white" d="M12.5 9H10V7.5c0-.55.45-1 1-1h1V4h-1.5C9.12 4 8 5.12 8 6.5V9H6.5v2H8v5h2v-5h1.5L12.5 9z"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  );
}
