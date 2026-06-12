'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, Plus, Globe } from 'lucide-react';
import { portalApi } from '@/lib/api/blogs.api';
import { clientsApi } from '@/lib/api/clients.api';
import { extractError } from '@/lib/api/client';
import { Project } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader, Spinner, EmptyState, Btn, Input, Label } from '@/components/ui';
import { Modal } from '@/components/Modal';

export default function PortalProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', websiteUrl: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');

  const load = () => { portalApi.projects().then(setProjects).catch((e) => setError(extractError(e))).finally(() => setLoading(false)); };
  useEffect(load, []);

  const create = async () => {
    if (!user?.clientId) { setFormErr('Your account is not linked to a client.'); return; }
    setSaving(true); setFormErr('');
    try { await clientsApi.createProject(user.clientId, form); setOpen(false); setForm({ name: '', websiteUrl: '', description: '' }); load(); }
    catch (e) { setFormErr(extractError(e)); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="My Projects" desc="Each project is one website we optimise for you." actions={<Btn icon={<Plus size={15} />} onClick={() => { setFormErr(''); setOpen(true); }}>New Project</Btn>} />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={26} /></div>
      ) : error ? (
        <Card className="p-6 text-[13px] text-red">{error}</Card>
      ) : projects.length === 0 ? (
        <Card><EmptyState title="No projects yet" desc="Add a website to get started." action={<Btn icon={<Plus size={15} />} onClick={() => setOpen(true)}>New Project</Btn>} /></Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/portal/projects/${p.id}`}>
              <Card hover className="p-4">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center mb-2"><FolderKanban size={15} className="text-brand" /></div>
                <p className="text-[14px] font-semibold text-ink truncate">{p.name}</p>
                <p className="text-[11.5px] text-muted truncate flex items-center gap-1 mt-0.5"><Globe size={11} /> {p.websiteUrl}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New Project"
        footer={<><Btn variant="secondary" onClick={() => setOpen(false)}>Cancel</Btn><Btn onClick={create} loading={saving}>Create</Btn></>}>
        <div className="space-y-3.5">
          {formErr && <p className="text-[12.5px] text-red">{formErr}</p>}
          <div className="space-y-1.5"><Label>Project name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Main Website SEO" autoFocus /></div>
          <div className="space-y-1.5"><Label>Website URL</Label><Input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://example.com" /></div>
          <div className="space-y-1.5"><Label>Description (optional)</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What this site is about" /></div>
        </div>
      </Modal>
    </div>
  );
}
