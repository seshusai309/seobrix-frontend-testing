'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, UserPlus, Briefcase, Pencil } from 'lucide-react';
import { workspaceApi } from '@/lib/api/workspace.api';
import { usersApi } from '@/lib/api/users.api';
import { extractError } from '@/lib/api/client';
import { Workspace, WorkspaceMember, Client, User } from '@/types';
import { roleLabel, isStaff } from '@/lib/roles';
import { Card, PageHeader, Spinner, EmptyState, Btn, Input, Label, Avatar, Pill } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { cx } from '@/lib/utils';

type Tab = 'clients' | 'members';

export default function WorkspaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ws, setWs] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [tab, setTab] = useState<Tab>('clients');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [clientModal, setClientModal] = useState(false);
  const [clientForm, setClientForm] = useState({ name: '', industry: '', contactName: '', contactEmail: '' });
  const [memberModal, setMemberModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [wsName, setWsName] = useState('');
  const [delModal, setDelModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');

  const load = () => {
    Promise.all([workspaceApi.getById(id), workspaceApi.listMembers(id), workspaceApi.listClients(id), usersApi.list()])
      .then(([w, m, c, u]) => { setWs(w); setMembers(m); setClients(c); setStaff(u.filter((x) => isStaff(x.role) && x.isActive)); })
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const addClient = async () => {
    setSaving(true); setFormErr('');
    try {
      // 1) create the client business in this workspace
      const created = await workspaceApi.createClient(id, { name: clientForm.name, industry: clientForm.industry || undefined });
      // 2) invite its portal user, linked to the new client
      await usersApi.invite({
        name: clientForm.contactName,
        email: clientForm.contactEmail,
        role: 'CLIENT',
        clientId: created.id,
      });
      setClientModal(false);
      setClientForm({ name: '', industry: '', contactName: '', contactEmail: '' });
      load();
    } catch (e) { setFormErr(extractError(e)); } finally { setSaving(false); }
  };
  const addMember = async (userId: string) => {
    setSaving(true);
    try { await workspaceApi.addMember(id, userId); setMemberModal(false); load(); }
    catch (e) { setFormErr(extractError(e)); } finally { setSaving(false); }
  };
  const removeMember = async (userId: string) => {
    await workspaceApi.removeMember(id, userId); load();
  };
  const rename = async () => {
    setSaving(true); setFormErr('');
    try { await workspaceApi.update(id, { name: wsName }); setRenameModal(false); load(); }
    catch (e) { setFormErr(extractError(e)); } finally { setSaving(false); }
  };
  const delWorkspace = async () => {
    setSaving(true);
    try { await workspaceApi.remove(id); router.push('/workspaces'); }
    catch (e) { setFormErr(extractError(e)); setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (!ws) return <Card className="p-6 text-[13px] text-red max-w-4xl mx-auto">{error || 'Workspace not found'}</Card>;

  const memberIds = new Set(members.map((m) => m.userId));
  const addable = staff.filter((s) => !memberIds.has(s.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/workspaces" className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink"><ArrowLeft size={14} /> Workspaces</Link>
      <PageHeader title={ws.name} desc={`${clients.length} clients · ${members.length} staff`}
        actions={<>
          <Btn variant="secondary" size="sm" icon={<Pencil size={14} />} onClick={() => { setFormErr(''); setWsName(ws.name); setRenameModal(true); }}>Rename</Btn>
          <Btn variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => { setFormErr(''); setDelModal(true); }}>Delete</Btn>
        </>} />

      <div className="flex gap-1 border-b border-surface-3">
        {(['clients', 'members'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cx('px-3.5 h-9 text-[13px] font-medium border-b-2 -mb-px capitalize transition-colors',
              tab === t ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink')}>
            {t === 'members' ? 'Staff' : 'Clients'}
          </button>
        ))}
      </div>

      {tab === 'clients' && (
        <div className="space-y-3">
          <div className="flex justify-end"><Btn size="sm" icon={<Plus size={14} />} onClick={() => setClientModal(true)}>Add Client</Btn></div>
          {clients.length === 0 ? (
            <Card><EmptyState title="No clients in this workspace" desc="Add a client business here." /></Card>
          ) : (
            <Card><div className="divide-y divide-surface-3">
              {clients.map((c) => (
                <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center"><Briefcase size={15} className="text-muted" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[13.5px] font-medium text-ink truncate">{c.name}</p>{c.industry && <p className="text-[11.5px] text-muted">{c.industry}</p>}</div>
                </Link>
              ))}
            </div></Card>
          )}
        </div>
      )}

      {tab === 'members' && (
        <div className="space-y-3">
          <div className="flex justify-end"><Btn size="sm" icon={<UserPlus size={14} />} onClick={() => { setFormErr(''); setMemberModal(true); }}>Add Staff</Btn></div>
          {members.length === 0 ? (
            <Card><EmptyState title="No staff in this workspace" desc="Add SEO Managers or Experts so they can be assigned to projects here." /></Card>
          ) : (
            <Card><div className="divide-y divide-surface-3">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={m.user.name} size={32} />
                  <div className="flex-1 min-w-0"><p className="text-[13.5px] font-medium text-ink truncate">{m.user.name}</p><p className="text-[11.5px] text-muted truncate">{m.user.email}</p></div>
                  <Pill>{roleLabel[m.user.role]}</Pill>
                  <button onClick={() => removeMember(m.userId)} className="text-muted hover:text-red p-1.5 rounded-btn hover:bg-red/10 transition-colors"><Trash2 size={14} /></button>
                </div>
              ))}
            </div></Card>
          )}
        </div>
      )}

      <Modal open={clientModal} onClose={() => setClientModal(false)} title="Add Client to Workspace"
        footer={<><Btn variant="secondary" onClick={() => setClientModal(false)}>Cancel</Btn>
          <Btn onClick={addClient} loading={saving} disabled={!clientForm.name || !clientForm.contactName || !clientForm.contactEmail}>Add & Invite</Btn></>}>
        <div className="space-y-4">
          {formErr && <p className="text-[12.5px] text-red">{formErr}</p>}
          <div className="space-y-3.5">
            <p className="text-[11.5px] font-semibold text-muted uppercase tracking-wide">Client Business</p>
            <div className="space-y-1.5"><Label>Client name</Label><Input value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} placeholder="Smile Care Dental" autoFocus /></div>
            <div className="space-y-1.5"><Label>Industry (optional)</Label><Input value={clientForm.industry} onChange={(e) => setClientForm({ ...clientForm, industry: e.target.value })} placeholder="Healthcare" /></div>
          </div>
          <div className="space-y-3.5 pt-2 border-t border-surface-3">
            <p className="text-[11.5px] font-semibold text-muted uppercase tracking-wide">Portal User (gets a login)</p>
            <div className="space-y-1.5"><Label>Contact name</Label><Input value={clientForm.contactName} onChange={(e) => setClientForm({ ...clientForm, contactName: e.target.value })} placeholder="Dr. Smith" /></div>
            <div className="space-y-1.5"><Label>Contact email</Label><Input type="email" value={clientForm.contactEmail} onChange={(e) => setClientForm({ ...clientForm, contactEmail: e.target.value })} placeholder="owner@smilecare.com" /></div>
            <p className="text-[12px] text-muted">An invite link is emailed to this person. They set a password and can then create projects.</p>
          </div>
        </div>
      </Modal>

      <Modal open={renameModal} onClose={() => setRenameModal(false)} title="Rename Workspace"
        footer={<><Btn variant="secondary" onClick={() => setRenameModal(false)}>Cancel</Btn><Btn onClick={rename} loading={saving} disabled={!wsName}>Save</Btn></>}>
        <div className="space-y-1.5">
          {formErr && <p className="text-[12.5px] text-red mb-2">{formErr}</p>}
          <Label>Workspace name</Label><Input value={wsName} onChange={(e) => setWsName(e.target.value)} autoFocus />
        </div>
      </Modal>

      <ConfirmDialog open={delModal} onClose={() => setDelModal(false)} onConfirm={delWorkspace} loading={saving} danger
        title="Delete Workspace" message={`Delete "${ws.name}"? Move or delete its clients first if needed.`} confirmLabel="Delete Workspace" />

      <Modal open={memberModal} onClose={() => setMemberModal(false)} title="Add Staff to Workspace">
        {formErr && <p className="text-[12.5px] text-red mb-3">{formErr}</p>}
        {addable.length === 0 ? (
          <p className="text-[13px] text-muted py-4 text-center">All eligible staff are already members. Invite more from the Team page.</p>
        ) : (
          <div className="space-y-1.5">
            {addable.map((s) => (
              <button key={s.id} onClick={() => addMember(s.id)} disabled={saving}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-btn hover:bg-surface-2 transition-colors text-left disabled:opacity-50">
                <Avatar name={s.name} size={30} />
                <div className="flex-1 min-w-0"><p className="text-[13px] font-medium text-ink truncate">{s.name}</p><p className="text-[11.5px] text-muted truncate">{s.email}</p></div>
                <Pill>{roleLabel[s.role]}</Pill>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
