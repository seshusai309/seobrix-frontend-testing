'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, Briefcase, FolderKanban, CheckSquare, ArrowRight, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { workspaceApi } from '@/lib/api/workspace.api';
import { clientsApi } from '@/lib/api/clients.api';
import { projectApi } from '@/lib/api/project.api';
import { reviewsApi } from '@/lib/api/blogs.api';
import { Workspace, Client, Project, Blog } from '@/types';
import { Card, PageHeader, Spinner, EmptyState, Pill } from '@/components/ui';

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'AGENCY_ADMIN';
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [queue, setQueue] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (isAdmin) {
      Promise.all([workspaceApi.list(), clientsApi.list(), reviewsApi.getQueue().catch(() => [])])
        .then(([w, c, q]) => { setWorkspaces(w); setClients(c); setQueue(q); })
        .catch(() => {}).finally(() => setLoading(false));
    } else {
      projectApi.mine().then(setProjects).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user, isAdmin]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;

  const first = user?.name?.split(' ')[0];

  if (!isAdmin) {
    // SEO_MANAGER / SEO_EXPERT
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title={`Welcome, ${first}`} desc="Your assigned projects." />
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-5"><FolderKanban size={16} className="text-muted" /><p className="text-[26px] font-semibold text-ink mt-2">{projects.length}</p><p className="text-[12px] text-muted">Assigned projects</p></Card>
        </div>
        {projects.length === 0 ? (
          <Card><EmptyState title="No projects yet" desc="You'll see projects here once an admin assigns you." /></Card>
        ) : (
          <Card>
            <div className="px-5 py-3 border-b border-surface-3 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-ink">My Projects</h2>
              <Link href="/my-projects" className="text-[12.5px] text-brand hover:underline flex items-center gap-1">View all <ArrowRight size={13} /></Link>
            </div>
            <div className="divide-y divide-surface-3">
              {projects.slice(0, 6).map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2 transition-colors">
                  <FolderKanban size={15} className="text-muted" />
                  <span className="text-[13.5px] font-medium text-ink flex-1 truncate">{p.name}</span>
                  <span className="text-[11.5px] text-muted truncate flex items-center gap-1"><Globe size={11} /> {p.websiteUrl}</span>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // AGENCY_ADMIN
  const kpis = [
    { label: 'Workspaces', value: workspaces.length, icon: Layers, href: '/workspaces' },
    { label: 'Clients', value: clients.length, icon: Briefcase, href: '/clients' },
    { label: 'In Review', value: queue.length, icon: CheckSquare, href: '/reviews' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title={`Good day, ${first}`} desc="Here's what's happening across your agency." />
      <div className="grid grid-cols-3 gap-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href}>
            <Card hover className="p-5">
              <k.icon size={16} className="text-muted" />
              <p className="text-[28px] font-semibold text-ink mt-2">{k.value}</p>
              <p className="text-[12px] text-muted">{k.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <div className="px-5 py-3 border-b border-surface-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-ink">Clients</h2>
          <Link href="/clients" className="text-[12.5px] text-brand hover:underline flex items-center gap-1">View all <ArrowRight size={13} /></Link>
        </div>
        {clients.length === 0 ? (
          <EmptyState title="No clients yet" desc="Create a workspace and add your first client." />
        ) : (
          <div className="divide-y divide-surface-3">
            {clients.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center"><Briefcase size={14} className="text-brand" /></div>
                <span className="text-[13.5px] font-medium text-ink flex-1 truncate">{c.name}</span>
                {!c.isActive && <Pill status="SUSPENDED">Inactive</Pill>}
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
