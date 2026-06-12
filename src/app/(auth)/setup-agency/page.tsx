'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { agencyApi } from '@/lib/api/agency.api';
import { Btn, Input, Label } from '@/components/ui';
import { Building2 } from 'lucide-react';

export default function SetupAgencyPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      await agencyApi.setup(name.trim());
      await refreshUser();
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to create agency. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-[420px] animate-fadeup">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[14px] font-bold"
            style={{ background: 'var(--brand)' }}>SB</span>
          <span className="text-[17px] font-semibold text-ink tracking-tight">SEO Brix</span>
        </div>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
          style={{ background: 'var(--brand)18' }}>
          <Building2 size={22} style={{ color: 'var(--brand)' }} />
        </div>

        <h1 className="text-[24px] font-semibold text-ink tracking-tight mb-1">
          Name your agency
        </h1>
        <p className="text-[13.5px] text-ink-2 mb-7">
          Hey {user?.name?.split(' ')[0] || 'there'}! One last step — what should we call your agency?
        </p>

        <form onSubmit={handleSetup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Agency name</Label>
            <Input
              type="text"
              placeholder="NorthShore Digital"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              autoComplete="organization"
            />
            <p className="text-[11.5px] text-muted">This will be your workspace name. You can change it later in settings.</p>
          </div>

          {error && (
            <p className="text-[12.5px] text-red px-3 py-2 rounded-btn bg-red/10">{error}</p>
          )}

          <Btn
            type="submit"
            loading={loading}
            className="w-full justify-center h-10 text-[14px] mt-1"
          >
            Create Agency &amp; Continue
          </Btn>
        </form>
      </div>
    </div>
  );
}
