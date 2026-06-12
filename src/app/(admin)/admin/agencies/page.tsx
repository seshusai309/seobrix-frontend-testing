'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Plus } from 'lucide-react';
import { adminApi } from '@/lib/api/admin.api';
import { extractError } from '@/lib/api/client';
import { Agency } from '@/types';
import { Card, PageHeader, Pill, Spinner, EmptyState, Btn, Input, Label } from '@/components/ui';
import { Modal } from '@/components/Modal';

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', adminName: '', adminEmail: '', adminPassword: '' });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.listAgencies().then(setAgencies).catch((e) => setError(extractError(e))).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const create = async () => {
    setSaving(true); setFormErr('');
    try {
      await adminApi.createAgency(form);
      setOpen(false);
      setForm({ name: '', adminName: '', adminEmail: '', adminPassword: '' });
      load();
    } catch (e) { setFormErr(extractError(e)); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Agencies"
        desc="Every agency on the platform."
        actions={<Btn icon={<Plus size={15} />} onClick={() => setOpen(true)}>New Agency</Btn>}
      />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={26} /></div>
      ) : error ? (
        <Card className="p-6 text-[13px] text-red">{error}</Card>
      ) : agencies.length === 0 ? (
        <Card><EmptyState title="No agencies yet" desc="Create the first agency." action={<Btn icon={<Plus size={15} />} onClick={() => setOpen(true)}>New Agency</Btn>} /></Card>
      ) : (
        <Card>
          <div className="divide-y divide-surface-3">
            {agencies.map((a) => (
              <Link key={a.id} href={`/admin/agencies/${a.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                  <Building2 size={15} className="text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium text-ink truncate">{a.name}</p>
                  <p className="text-[11.5px] text-muted">Created {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <Pill status={a.status} />
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Agency"
        footer={<>
          <Btn variant="secondary" onClick={() => setOpen(false)}>Cancel</Btn>
          <Btn onClick={create} loading={saving}>Create</Btn>
        </>}
      >
        <div className="space-y-3.5">
          {formErr && <p className="text-[12.5px] text-red">{formErr}</p>}
          <div className="space-y-1.5"><Label>Agency name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Agency" /></div>
          <div className="space-y-1.5"><Label>Admin name</Label><Input value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} placeholder="Jane Doe" /></div>
          <div className="space-y-1.5"><Label>Admin email</Label><Input type="email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} placeholder="admin@acme.com" /></div>
          <div className="space-y-1.5"><Label>Admin password</Label><Input type="password" value={form.adminPassword} onChange={(e) => setForm({ ...form, adminPassword: e.target.value })} placeholder="Min 8 characters" /></div>
        </div>
      </Modal>
    </div>
  );
}
