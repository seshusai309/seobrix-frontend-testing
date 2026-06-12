'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, FolderKanban, MoveRight, Pencil, Trash2 } from 'lucide-react';
import { clientsApi } from '@/lib/api/clients.api';
import { workspaceApi } from '@/lib/api/workspace.api';
import { extractError } from '@/lib/api/client';
import { Client, Project, Workspace } from '@/types';
import { Card, PageHeader, Spinner, EmptyState, Btn, Input, Label, Pill } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', industry: '' });
  const [moveModal, setMoveModal] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');

  const load = () => {
    Promise.all([clientsApi.getById(id), clientsApi.listProjects(id), workspaceApi.list()])
      .then(([c, p, w]) => { setClient(c); setProjects(p); setWorkspaces(w); setEditForm({ name: c.name, industry: c.industry || '' }); })
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const saveEdit = async () => {
    setSaving(true); setFormErr('');
    try { await clientsApi.update(id, editForm); setEditModal(false); load(); }
    catch (e) { setFormErr(extractError(e)); } finally { setSaving(false); }
  };
  const move = async (workspaceId: string) => {
    setSaving(true); setFormErr('');
    try { await clientsApi.move(id, workspaceId); setMoveModal(false); load(); }
    catch (e) { setFormErr(extractError(e)); } finally { setSaving(false); }
  };
  const del = async () => {
    setSaving(true);
    try { await clientsApi.remove(id); router.push('/clients'); }
    catch (e) { setFormErr(extractError(e)); setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (!client) return <Card className="p-6 text-[13px] text-red max-w-4xl mx-auto">{error || 'Client not found'}</Card>;

  const currentWs = workspaces.find((w) => w.id === client.workspaceId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/clients" className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink"><ArrowLeft size={14} /> Clients</Link>
      <PageHeader
        title={client.name}
        desc={`${client.industry || 'No industry'} · ${currentWs?.name || 'Unknown workspace'}`}
        actions={<>
          <Btn variant="secondary" size="sm" icon={<MoveRight size={14} />} onClick={() => { setFormErr(''); setMoveModal(true); }}>Move</Btn>
          <Btn variant="secondary" size="sm" icon={<Pencil size={14} />} onClick={() => { setFormErr(''); setEditModal(true); }}>Edit</Btn>
          <Btn variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => { setFormErr(''); setDelModal(true); }}>Delete</Btn>
        </>}
      />

      <div>
        <h2 className="text-[14px] font-semibold text-ink mb-3">Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <Card><EmptyState title="No projects yet" desc="Only the client can create projects from their portal. Each project is one website." /></Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`}>
                <Card hover className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center"><FolderKanban size={15} className="text-brand" /></div>
                    {!p.isActive && <Pill status="SUSPENDED">Inactive</Pill>}
                  </div>
                  <p className="text-[14px] font-semibold text-ink truncate">{p.name}</p>
                  <p className="text-[11.5px] text-muted truncate flex items-center gap-1 mt-0.5"><Globe size={11} /> {p.websiteUrl}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Client"
        footer={<><Btn variant="secondary" onClick={() => setEditModal(false)}>Cancel</Btn><Btn onClick={saveEdit} loading={saving}>Save</Btn></>}>
        <div className="space-y-3.5">
          {formErr && <p className="text-[12.5px] text-red">{formErr}</p>}
          <div className="space-y-1.5"><Label>Name</Label><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Industry</Label><Input value={editForm.industry} onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal open={moveModal} onClose={() => setMoveModal(false)} title="Move to Workspace">
        {formErr && <p className="text-[12.5px] text-red mb-3">{formErr}</p>}
        <p className="text-[12.5px] text-muted mb-3">Projects move with the client. Staff assignments on those projects will be revoked.</p>
        <div className="space-y-1.5">
          {workspaces.filter((w) => w.id !== client.workspaceId).map((w) => (
            <button key={w.id} onClick={() => move(w.id)} disabled={saving}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-btn hover:bg-surface-2 transition-colors text-left disabled:opacity-50">
              <span className="text-[13px] font-medium text-ink">{w.name}</span>
              <MoveRight size={14} className="text-muted" />
            </button>
          ))}
          {workspaces.filter((w) => w.id !== client.workspaceId).length === 0 && (
            <p className="text-[12.5px] text-muted text-center py-3">No other workspaces available.</p>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={delModal}
        onClose={() => setDelModal(false)}
        onConfirm={del}
        loading={saving}
        danger
        title="Delete Client"
        message={`Remove "${client.name}"? This deactivates the client and its projects. This cannot be undone from the UI.`}
        confirmLabel="Delete Client"
      />
    </div>
  );
}
