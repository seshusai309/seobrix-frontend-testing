'use client';
import { useEffect, useState } from 'react';
import { Plus, RefreshCw, Mail, Clock } from 'lucide-react';
import { usersApi } from '@/lib/api/users.api';
import { extractError } from '@/lib/api/client';
import { User, Role, PendingInvite } from '@/types';
import { roleLabel } from '@/lib/roles';
import { Card, PageHeader, Pill, Btn, Spinner, EmptyState, Input, Label, Avatar } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';

const ROLE_OPTIONS: Role[] = ['SEO_MANAGER', 'SEO_EXPERT'];

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'SEO_MANAGER' as Role });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [resendId, setResendId] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  const loadData = async (spin = false) => {
    if (spin) setRefreshing(true);
    try {
      const [u, i] = await Promise.all([usersApi.list(), usersApi.listInvites()]);
      setUsers(u); setInvites(i);
    } finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { loadData(); }, []);

  const handleInvite = async () => {
    if (!form.name || !form.email) return;
    setSaving(true); setError('');
    try {
      await usersApi.invite(form);
      await loadData();
      setShowModal(false);
      setForm({ name: '', email: '', role: 'SEO_MANAGER' });
    } catch (e) { setError(extractError(e)); } finally { setSaving(false); }
  };

  const handleCancel = async (id: string) => {
    await usersApi.cancelInvite(id).catch(() => {});
    setInvites((p) => p.filter((i) => i.id !== id));
  };

  const handleResend = async () => {
    if (!resendId) return;
    setResending(true); setError('');
    const original = invites.find((i) => i.id === resendId);
    const emailChanged = resendEmail !== original?.email;
    try {
      await usersApi.resendInvite(resendId, emailChanged ? resendEmail : undefined);
      await loadData();
      setResendId(null);
    } catch (e) { setError(extractError(e)); } finally { setResending(false); }
  };

  const toggleActive = async (u: User) => {
    if (u.isActive) await usersApi.deactivate(u.id).catch(() => {});      // DELETE /users/:id
    else await usersApi.update(u.id, { isActive: true }).catch(() => {}); // PATCH /users/:id
    await loadData();
  };

  const timeLeft = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Team"
        desc={`${users.length} member${users.length !== 1 ? 's' : ''}`}
        actions={<>
          <Btn variant="secondary" icon={<RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />} onClick={() => loadData(true)} disabled={refreshing}>Refresh</Btn>
          <Btn icon={<Plus size={14} />} onClick={() => { setError(''); setShowModal(true); }}>Invite Member</Btn>
        </>}
      />

      {users.length === 0 ? (
        <Card><EmptyState title="No team members yet" desc="Invite your first team member." /></Card>
      ) : (
        <Card><div className="divide-y divide-surface-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3.5 px-5 py-3.5">
              <Avatar name={u.name} size={34} />
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-ink truncate">{u.name}</p>
                <p className="text-[12px] text-muted truncate">{u.email}</p>
              </div>
              <span className="text-[12px] text-ink-2 hidden sm:block">{roleLabel[u.role]}</span>
              <Pill status={u.isActive ? 'ACTIVE' : 'SUSPENDED'} dot />
              <Btn size="sm" variant={u.isActive ? 'danger' : 'soft'} onClick={() => toggleActive(u)}>{u.isActive ? 'Deactivate' : 'Activate'}</Btn>
            </div>
          ))}
        </div></Card>
      )}

      {invites.length > 0 && (
        <div className="space-y-3">
          <p className="text-[12.5px] font-semibold text-ink-2 uppercase tracking-wide">Pending Invites ({invites.length})</p>
          <Card><div className="divide-y divide-surface-3">
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3.5 px-5 py-3.5">
                <span className="w-[34px] h-[34px] rounded-lg bg-surface-2 flex items-center justify-center shrink-0"><Mail size={15} className="text-muted" /></span>
                <div className="flex-1 min-w-0">
                  {resendId === inv.id ? (
                    <Input type="email" value={resendEmail} onChange={(e) => setResendEmail(e.target.value)} className="h-8 text-[13px]" autoFocus />
                  ) : (
                    <><p className="text-[13.5px] font-medium text-ink truncate">{inv.email}</p><p className="text-[12px] text-muted">{inv.name}</p></>
                  )}
                </div>
                <span className="text-[12px] text-ink-2 shrink-0 hidden sm:block">{roleLabel[inv.role]}</span>
                <span className="flex items-center gap-1 text-[11.5px] text-muted shrink-0"><Clock size={11} />{timeLeft(inv.expiresAt)}</span>
                {resendId === inv.id ? (
                  <div className="flex items-center gap-1.5">
                    <Btn size="sm" loading={resending} onClick={handleResend}>Send</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => { setResendId(null); setError(''); }}>Cancel</Btn>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Btn size="sm" variant="secondary" icon={<RefreshCw size={12} />} onClick={() => { setResendId(inv.id); setResendEmail(inv.email); setError(''); }}>Resend</Btn>
                    <Btn size="sm" variant="danger" onClick={() => handleCancel(inv.id)}>Cancel</Btn>
                  </div>
                )}
              </div>
            ))}
          </div></Card>
          {error && resendId && <p className="text-[12.5px] text-red">{error}</p>}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setError(''); }}
        title="Invite Team Member"
        footer={<>
          <Btn variant="secondary" onClick={() => { setShowModal(false); setError(''); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleInvite} disabled={!form.name || !form.email}>Send Invite</Btn>
        </>}
      >
        <div className="space-y-3.5">
          <div className="space-y-1.5"><Label>Full name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" autoFocus /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" /></div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select
              value={form.role}
              onChange={(r) => setForm({ ...form, role: r })}
              options={ROLE_OPTIONS.map((r) => ({ value: r, label: roleLabel[r] }))}
            />
          </div>
          <p className="text-[12px] text-muted">Staff are SEO Managers or Experts. An invite link is emailed; they set their own password on accept, then you add them to workspaces.</p>
          {error && <p className="text-[12.5px] text-red">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}
