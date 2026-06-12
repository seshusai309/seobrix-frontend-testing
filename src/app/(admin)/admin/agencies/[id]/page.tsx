'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Briefcase, FileText } from 'lucide-react';
import { adminApi } from '@/lib/api/admin.api';
import { extractError } from '@/lib/api/client';
import { Agency, AgencyStats } from '@/types';
import { Card, PageHeader, Pill, Spinner, Btn, Input, Label } from '@/components/ui';

export default function AgencyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [stats, setStats] = useState<AgencyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const agency = agencies.find((a) => a.id === id);

  useEffect(() => {
    Promise.all([adminApi.listAgencies(), adminApi.agencyStats(id)])
      .then(([list, s]) => {
        setAgencies(list);
        setStats(s);
        setName(list.find((a) => a.id === id)?.name ?? '');
      })
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async (patch: Partial<{ name: string; status: 'ACTIVE' | 'SUSPENDED' }>) => {
    setSaving(true);
    try {
      const updated = await adminApi.updateAgency(id, patch);
      setAgencies((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (e) { setError(extractError(e)); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (error && !agency) return <Card className="p-6 text-[13px] text-red max-w-3xl mx-auto">{error}</Card>;
  if (!agency) return null;

  const cards = [
    { label: 'Members', value: stats?.users ?? 0, icon: Users },
    { label: 'Clients', value: stats?.clients ?? 0, icon: Briefcase },
    { label: 'Blogs', value: stats?.blogs ?? 0, icon: FileText },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/agencies" className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink">
        <ArrowLeft size={14} /> Agencies
      </Link>

      <PageHeader title={agency.name} desc={`Created ${new Date(agency.createdAt).toLocaleDateString()}`} actions={<Pill status={agency.status} />} />

      <div className="grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <c.icon size={16} className="text-muted" />
            <p className="text-[26px] font-semibold text-ink mt-2">{c.value}</p>
            <p className="text-[12px] text-muted">{c.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5 space-y-4">
        <h2 className="text-[14px] font-semibold text-ink">Manage</h2>
        <div className="space-y-1.5">
          <Label>Agency name</Label>
          <div className="flex gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Btn onClick={() => save({ name })} loading={saving} disabled={!name || name === agency.name}>Save</Btn>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-surface-3">
          <div>
            <p className="text-[13px] font-medium text-ink">{agency.status === 'ACTIVE' ? 'Suspend agency' : 'Reactivate agency'}</p>
            <p className="text-[12px] text-muted">{agency.status === 'ACTIVE' ? 'Members will be blocked from signing in.' : 'Restore access for all members.'}</p>
          </div>
          <Btn
            variant={agency.status === 'ACTIVE' ? 'danger' : 'primary'}
            loading={saving}
            onClick={() => save({ status: agency.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
          >
            {agency.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
          </Btn>
        </div>
      </Card>
    </div>
  );
}
