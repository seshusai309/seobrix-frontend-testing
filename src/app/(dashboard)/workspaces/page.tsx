'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, Plus } from 'lucide-react';
import { workspaceApi } from '@/lib/api/workspace.api';
import { extractError } from '@/lib/api/client';
import { Workspace } from '@/types';
import { Card, PageHeader, Spinner, EmptyState, Btn, Input, Label } from '@/components/ui';
import { Modal } from '@/components/Modal';

export default function WorkspacesPage() {
  const [items, setItems] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');

  const load = () => {
    setLoading(true);
    workspaceApi.list().then(setItems).catch((e) => setError(extractError(e))).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const create = async () => {
    setSaving(true); setFormErr('');
    try { await workspaceApi.create({ name }); setOpen(false); setName(''); load(); }
    catch (e) { setFormErr(extractError(e)); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title="Workspaces" desc="Group your clients into separate workspaces." actions={<Btn icon={<Plus size={15} />} onClick={() => setOpen(true)}>New Workspace</Btn>} />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={26} /></div>
      ) : error ? (
        <Card className="p-6 text-[13px] text-red">{error}</Card>
      ) : items.length === 0 ? (
        <Card><EmptyState title="No workspaces yet" desc="Create a workspace, then add clients to it." action={<Btn icon={<Plus size={15} />} onClick={() => setOpen(true)}>New Workspace</Btn>} /></Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {items.map((w) => (
            <Link key={w.id} href={`/workspaces/${w.id}`}>
              <Card hover className="p-5">
                <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                  <Layers size={17} className="text-brand" />
                </div>
                <p className="text-[14.5px] font-semibold text-ink">{w.name}</p>
                <p className="text-[12px] text-muted mt-0.5">Created {new Date(w.createdAt).toLocaleDateString()}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create Workspace"
        footer={<><Btn variant="secondary" onClick={() => setOpen(false)}>Cancel</Btn><Btn onClick={create} loading={saving}>Create</Btn></>}>
        <div className="space-y-3.5">
          {formErr && <p className="text-[12.5px] text-red">{formErr}</p>}
          <div className="space-y-1.5"><Label>Workspace name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Healthcare Workspace" autoFocus /></div>
        </div>
      </Modal>
    </div>
  );
}
