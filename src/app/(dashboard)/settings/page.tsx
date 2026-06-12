'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { agencyApi } from '@/lib/api/agency.api';
import { extractError } from '@/lib/api/client';
import { Agency } from '@/types';
import { roleLabel } from '@/lib/roles';
import { Card, PageHeader, Btn, Input, Label, Avatar, Spinner } from '@/components/ui';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const isAdmin = user?.role === 'AGENCY_ADMIN';

  const [agency, setAgency] = useState<Agency | null>(null);
  const [agencyName, setAgencyName] = useState('');
  const [loading, setLoading] = useState(isAdmin);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    agencyApi.getMyAgency()
      .then((a) => { setAgency(a); setAgencyName(a?.name ?? ''); })
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const saveAgency = async () => {
    setSaving(true); setError('');
    try {
      const updated = await agencyApi.updateMyAgency({ name: agencyName });
      setAgency(updated);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
      refreshUser();
    } catch (e) { setError(extractError(e)); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader title="Settings" desc="Your account and agency." />

      <Card className="p-6">
        <p className="text-[13.5px] font-semibold text-ink mb-5">Profile</p>
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} size={52} />
          <div>
            <p className="text-[14px] font-semibold text-ink">{user?.name}</p>
            <p className="text-[12.5px] text-muted">{user?.email}</p>
            <p className="text-[12px] text-ink-2 mt-0.5">{user ? roleLabel[user.role] : ''}</p>
          </div>
        </div>
      </Card>

      {isAdmin && (
        <Card className="p-6">
          <p className="text-[13.5px] font-semibold text-ink mb-1">Agency</p>
          <p className="text-[12.5px] text-muted mb-5">Your agency's display name.</p>
          {loading ? (
            <div className="flex py-4"><Spinner size={20} /></div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Agency name</Label>
                <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
              </div>
              {error && <p className="text-[12.5px] text-red">{error}</p>}
              <div className="flex items-center gap-3">
                <Btn loading={saving} onClick={saveAgency} disabled={!agencyName || agencyName === agency?.name}>Save Changes</Btn>
                {saved && <span className="text-[12.5px] text-brand">Saved!</span>}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
