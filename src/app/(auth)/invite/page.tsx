'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api/auth.api';
import { homeForRole } from '@/lib/roles';
import { Btn, Input, Label } from '@/components/ui';
import { Eye, EyeOff } from 'lucide-react';

function InviteInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTokens } = useAuth();
  const token = searchParams.get('token') || '';

  type Status = 'loading' | 'valid' | 'invalid';
  const [status, setStatus] = useState<Status>('loading');
  const [inviteInfo, setInviteInfo] = useState<{ email: string; name: string; role: string } | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [invalidMsg, setInvalidMsg] = useState('');

  useEffect(() => {
    if (!token) { setStatus('invalid'); setInvalidMsg('No invite token found.'); return; }
    authApi.validateInvite(token)
      .then((info) => { setInviteInfo(info); setStatus('valid'); })
      .catch((err) => {
        setStatus('invalid');
        setInvalidMsg(err?.response?.data?.error?.message || 'This invite link is invalid or has expired.');
      });
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setSaving(true);
    try {
      const result = await authApi.acceptInvite(token, password);
      setTokens(result.accessToken, result.refreshToken, result.user);
      router.replace(homeForRole(result.user.role));
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || '';
      if (!msg || err?.response?.status >= 500) {
        router.replace('/login');
        return;
      }
      setError(msg || 'Failed to accept invite. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-red text-xl">✕</span>
          </div>
          <h1 className="text-[18px] font-semibold text-ink mb-2">Invalid Invite</h1>
          <p className="text-[13.5px] text-muted mb-6">{invalidMsg}</p>
          <Btn onClick={() => router.push('/login')} variant="secondary">Back to Sign In</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-[420px] animate-fadeup">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[14px] font-bold"
            style={{ background: 'var(--brand)' }}>SB</span>
          <span className="text-[17px] font-semibold text-ink tracking-tight">SEO Brix</span>
        </div>

        <h1 className="text-[24px] font-semibold text-ink tracking-tight mb-1">Accept Invitation</h1>
        <p className="text-[13.5px] text-ink-2 mb-7">Set your password to activate your account</p>

        {/* Invite details */}
        <div className="hairline rounded-card px-4 py-3.5 bg-surface mb-6 flex flex-col gap-1">
          <p className="text-[13px] text-ink font-medium">{inviteInfo?.name}</p>
          <p className="text-[12.5px] text-muted">{inviteInfo?.email}</p>
          <span className="text-[11.5px] font-semibold text-brand uppercase tracking-wide mt-0.5">
            {inviteInfo?.role.replace(/_/g, ' ')}
          </span>
        </div>

        <form onSubmit={handleAccept} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>New password</Label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full h-10 px-3 pr-10 rounded-btn hairline bg-surface text-[14px] text-ink outline-none focus:shadow-ring placeholder:text-muted transition-shadow"
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink-2">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Confirm password</Label>
            <Input
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-[12.5px] text-red px-3 py-2 rounded-btn bg-red/10">{error}</p>}
          <Btn type="submit" loading={saving} className="w-full justify-center h-10 text-[14px] mt-1">
            Activate Account
          </Btn>
        </form>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-bg"><div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}>
      <InviteInner />
    </Suspense>
  );
}
