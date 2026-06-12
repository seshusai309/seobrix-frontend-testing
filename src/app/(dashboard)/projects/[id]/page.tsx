'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Globe, Plug, FileText, Users, Plus, Trash2, RefreshCw, UserPlus, ExternalLink, Pencil,
} from 'lucide-react';
import { projectApi } from '@/lib/api/project.api';
import { clientsApi } from '@/lib/api/clients.api';
import { workspaceApi } from '@/lib/api/workspace.api';
import { integrationApi } from '@/lib/api/integration.api';
import { blogsApi } from '@/lib/api/blogs.api';
import { extractError } from '@/lib/api/client';
import { Project, ProjectAssignment, Integration, Blog, Client, WorkspaceMember } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { roleLabel } from '@/lib/roles';
import { Card, PageHeader, Spinner, EmptyState, Btn, Input, Label, Pill, Avatar } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { cx } from '@/lib/utils';

type Tab = 'blogs' | 'integrations' | 'assignments';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'AGENCY_ADMIN';
  const isManager = user?.role === 'SEO_MANAGER';

  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tab, setTab] = useState<Tab>('blogs');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [wpModal, setWpModal] = useState(false);
  const [shopifyModal, setShopifyModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', websiteUrl: '', description: '' });
  const [delModal, setDelModal] = useState(false);
  const [wp, setWp] = useState({ siteUrl: '', username: '', applicationPassword: '' });
  const [shopify, setShopify] = useState({ siteUrl: '', accessToken: '' });
  const [busy, setBusy] = useState(false);
  const [formErr, setFormErr] = useState('');

  const load = useCallback(() => {
    projectApi.getById(id)
      .then(async (p) => {
        setProject(p);
        const [blg, intg, c] = await Promise.all([
          blogsApi.list(id), integrationApi.list(id), clientsApi.getById(p.clientId),
        ]);
        setBlogs(blg); setIntegrations(intg); setClient(c);
        if (isAdmin) {
          const [asg, mem] = await Promise.all([projectApi.listAssignments(id), workspaceApi.listMembers(c.workspaceId)]);
          setAssignments(asg); setMembers(mem);
        }
      })
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, [id, isAdmin]);
  useEffect(load, [load]);

  const connectWp = async () => { setBusy(true); setFormErr(''); try { await integrationApi.connectWordPress(id, wp); setWpModal(false); setWp({ siteUrl: '', username: '', applicationPassword: '' }); load(); } catch (e) { setFormErr(extractError(e)); } finally { setBusy(false); } };
  const connectShopify = async () => { setBusy(true); setFormErr(''); try { await integrationApi.connectShopify(id, shopify); setShopifyModal(false); setShopify({ siteUrl: '', accessToken: '' }); load(); } catch (e) { setFormErr(extractError(e)); } finally { setBusy(false); } };
  const testIntg = async (iid: string) => { await integrationApi.test(id, iid).catch(() => {}); load(); };
  const removeIntg = async (iid: string) => { await integrationApi.remove(id, iid).catch(() => {}); load(); };
  const assign = async (userId: string) => { setBusy(true); setFormErr(''); try { await projectApi.assign(id, userId); setAssignModal(false); load(); } catch (e) { setFormErr(extractError(e)); } finally { setBusy(false); } };
  const unassign = async (userId: string) => { await projectApi.unassign(id, userId).catch(() => {}); load(); };
  const saveProject = async () => { setBusy(true); setFormErr(''); try { await projectApi.update(id, editForm); setEditModal(false); load(); } catch (e) { setFormErr(extractError(e)); } finally { setBusy(false); } };
  const delProject = async () => { setBusy(true); try { await projectApi.remove(id); router.push(client ? `/clients/${client.id}` : '/clients'); } catch (e) { setFormErr(extractError(e)); setBusy(false); } };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (!project) return <Card className="p-6 text-[13px] text-red max-w-4xl mx-auto">{error || 'Project not found'}</Card>;

  const assignedIds = new Set(assignments.map((a) => a.userId));
  const addable = members.filter((m) => !assignedIds.has(m.userId));

  const tabs: { key: Tab; label: string; icon: typeof FileText; show: boolean }[] = [
    { key: 'blogs', label: 'Blogs', icon: FileText, show: true },
    { key: 'integrations', label: 'Integrations', icon: Plug, show: true },
    { key: 'assignments', label: 'Team', icon: Users, show: isAdmin },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href={client ? `/clients/${client.id}` : '/clients'} className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink"><ArrowLeft size={14} /> {client?.name || 'Client'}</Link>
      <PageHeader
        title={project.name}
        desc={project.description || undefined}
        actions={<>
          <a href={project.websiteUrl} target="_blank" rel="noreferrer"><Btn variant="secondary" size="sm" icon={<Globe size={14} />} iconR={<ExternalLink size={12} />}>Visit site</Btn></a>
          {isAdmin && <Btn variant="secondary" size="sm" icon={<Pencil size={14} />} onClick={() => { setFormErr(''); setEditForm({ name: project.name, websiteUrl: project.websiteUrl, description: project.description || '' }); setEditModal(true); }}>Edit</Btn>}
          {isAdmin && <Btn variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => { setFormErr(''); setDelModal(true); }}>Delete</Btn>}
        </>}
      />

      <div className="flex gap-1 border-b border-surface-3">
        {tabs.filter((t) => t.show).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cx('flex items-center gap-1.5 px-3.5 h-9 text-[13px] font-medium border-b-2 -mb-px transition-colors',
              tab === t.key ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* BLOGS */}
      {tab === 'blogs' && (
        <div className="space-y-3">
          {isManager && <div className="flex justify-end"><Link href={`/projects/${id}/blogs/new`}><Btn size="sm" icon={<Plus size={14} />}>New Blog</Btn></Link></div>}
          {blogs.length === 0 ? (
            <Card><EmptyState title="No blogs yet" desc={isManager ? 'Create the first draft.' : 'No blogs have been written for this project.'} /></Card>
          ) : (
            <Card><div className="divide-y divide-surface-3">
              {blogs.map((b) => (
                <Link key={b.id} href={`/projects/${id}/blogs/${b.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2 transition-colors">
                  <FileText size={15} className="text-muted shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-[13.5px] font-medium text-ink truncate">{b.title}</p><p className="text-[11.5px] text-muted truncate">/{b.slug}</p></div>
                  <Pill status={b.status} />
                </Link>
              ))}
            </div></Card>
          )}
        </div>
      )}

      {/* INTEGRATIONS */}
      {tab === 'integrations' && (
        <div className="space-y-3">
          <div className="flex justify-end gap-2">
            <Btn size="sm" variant="secondary" onClick={() => { setFormErr(''); setWpModal(true); }}>+ WordPress</Btn>
            <Btn size="sm" variant="secondary" onClick={() => { setFormErr(''); setShopifyModal(true); }}>+ Shopify</Btn>
          </div>
          {integrations.length === 0 ? (
            <Card><EmptyState title="No integrations" desc="Connect WordPress or Shopify to publish blogs to this site." /></Card>
          ) : (
            <Card><div className="divide-y divide-surface-3">
              {integrations.map((i) => (
                <div key={i.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Plug size={15} className="text-muted shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-[13.5px] font-medium text-ink">{i.type}</p><p className="text-[11.5px] text-muted truncate">{i.siteUrl}</p></div>
                  <Pill status={i.status} />
                  <button onClick={() => testIntg(i.id)} className="text-muted hover:text-ink p-1.5 rounded-btn hover:bg-surface-2" title="Test"><RefreshCw size={14} /></button>
                  {isAdmin && <button onClick={() => removeIntg(i.id)} className="text-muted hover:text-red p-1.5 rounded-btn hover:bg-red/10" title="Remove"><Trash2 size={14} /></button>}
                </div>
              ))}
            </div></Card>
          )}
        </div>
      )}

      {/* ASSIGNMENTS */}
      {tab === 'assignments' && isAdmin && (
        <div className="space-y-3">
          <div className="flex justify-end"><Btn size="sm" icon={<UserPlus size={14} />} onClick={() => { setFormErr(''); setAssignModal(true); }}>Assign Staff</Btn></div>
          {assignments.length === 0 ? (
            <Card><EmptyState title="No staff assigned" desc="Assign SEO Managers/Experts who can work on this project." /></Card>
          ) : (
            <Card><div className="divide-y divide-surface-3">
              {assignments.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={a.user.name} size={32} />
                  <div className="flex-1 min-w-0"><p className="text-[13.5px] font-medium text-ink truncate">{a.user.name}</p><p className="text-[11.5px] text-muted truncate">{a.user.email}</p></div>
                  <Pill>{roleLabel[a.user.role]}</Pill>
                  <button onClick={() => unassign(a.userId)} className="text-muted hover:text-red p-1.5 rounded-btn hover:bg-red/10"><Trash2 size={14} /></button>
                </div>
              ))}
            </div></Card>
          )}
        </div>
      )}

      {/* Modals */}
      <Modal open={wpModal} onClose={() => setWpModal(false)} title="Connect WordPress"
        footer={<><Btn variant="secondary" onClick={() => setWpModal(false)}>Cancel</Btn><Btn onClick={connectWp} loading={busy}>Connect</Btn></>}>
        <div className="space-y-3.5">
          {formErr && <p className="text-[12.5px] text-red">{formErr}</p>}
          <div className="space-y-1.5"><Label>Site URL</Label><Input value={wp.siteUrl} onChange={(e) => setWp({ ...wp, siteUrl: e.target.value })} placeholder="https://example.com" /></div>
          <div className="space-y-1.5"><Label>Username</Label><Input value={wp.username} onChange={(e) => setWp({ ...wp, username: e.target.value })} placeholder="admin" /></div>
          <div className="space-y-1.5"><Label>Application Password</Label><Input value={wp.applicationPassword} onChange={(e) => setWp({ ...wp, applicationPassword: e.target.value })} placeholder="xxxx xxxx xxxx xxxx" /></div>
        </div>
      </Modal>

      <Modal open={shopifyModal} onClose={() => setShopifyModal(false)} title="Connect Shopify"
        footer={<><Btn variant="secondary" onClick={() => setShopifyModal(false)}>Cancel</Btn><Btn onClick={connectShopify} loading={busy}>Connect</Btn></>}>
        <div className="space-y-3.5">
          {formErr && <p className="text-[12.5px] text-red">{formErr}</p>}
          <div className="space-y-1.5"><Label>Store URL</Label><Input value={shopify.siteUrl} onChange={(e) => setShopify({ ...shopify, siteUrl: e.target.value })} placeholder="https://store.myshopify.com" /></div>
          <div className="space-y-1.5"><Label>Access Token</Label><Input value={shopify.accessToken} onChange={(e) => setShopify({ ...shopify, accessToken: e.target.value })} placeholder="shpat_..." /></div>
        </div>
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Project"
        footer={<><Btn variant="secondary" onClick={() => setEditModal(false)}>Cancel</Btn><Btn onClick={saveProject} loading={busy}>Save</Btn></>}>
        <div className="space-y-3.5">
          {formErr && <p className="text-[12.5px] text-red">{formErr}</p>}
          <div className="space-y-1.5"><Label>Name</Label><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Website URL</Label><Input value={editForm.websiteUrl} onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Description</Label><Input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} /></div>
        </div>
      </Modal>

      <ConfirmDialog open={delModal} onClose={() => setDelModal(false)} onConfirm={delProject} loading={busy} danger
        title="Delete Project" message={`Delete "${project.name}"? Its blogs and integrations will be removed from the UI.`} confirmLabel="Delete Project" />

      <Modal open={assignModal} onClose={() => setAssignModal(false)} title="Assign Staff to Project">
        {formErr && <p className="text-[12.5px] text-red mb-3">{formErr}</p>}
        {members.length === 0 ? (
          <div className="py-3 text-center space-y-3">
            <p className="text-[13px] text-muted">No staff are members of this project&apos;s workspace yet.</p>
            <p className="text-[12px] text-muted">Add SEO Managers / Experts to the workspace first — then you can assign them here.</p>
            {client && <Link href={`/workspaces/${client.workspaceId}`}><Btn size="sm" variant="secondary" icon={<Users size={14} />}>Open Workspace → Staff</Btn></Link>}
          </div>
        ) : addable.length === 0 ? (
          <p className="text-[13px] text-muted py-4 text-center">All workspace staff are already assigned to this project.</p>
        ) : (
          <div className="space-y-1.5">
            {addable.map((m) => (
              <button key={m.id} onClick={() => assign(m.userId)} disabled={busy}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-btn hover:bg-surface-2 transition-colors text-left disabled:opacity-50">
                <Avatar name={m.user.name} size={30} />
                <div className="flex-1 min-w-0"><p className="text-[13px] font-medium text-ink truncate">{m.user.name}</p><p className="text-[11.5px] text-muted truncate">{m.user.email}</p></div>
                <Pill>{roleLabel[m.user.role]}</Pill>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
