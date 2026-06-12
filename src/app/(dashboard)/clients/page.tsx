'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { clientsApi } from '@/lib/api/clients.api';
import { workspaceApi } from '@/lib/api/workspace.api';
import { extractError } from '@/lib/api/client';
import { Client, Workspace } from '@/types';
import { Card, PageHeader, Spinner, EmptyState, Pill } from '@/components/ui';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([clientsApi.list(), workspaceApi.list()])
      .then(([c, w]) => { setClients(c); setWorkspaces(w); })
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, []);

  const wsName = (wid: string) => workspaces.find((w) => w.id === wid)?.name ?? '—';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title="Clients" desc="All client businesses across your workspaces." />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={26} /></div>
      ) : error ? (
        <Card className="p-6 text-[13px] text-red">{error}</Card>
      ) : clients.length === 0 ? (
        <Card><EmptyState title="No clients yet" desc="Add clients from inside a workspace." /></Card>
      ) : (
        <Card><div className="divide-y divide-surface-3">
          {clients.map((c) => (
            <Link key={c.id} href={`/clients/${c.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0"><Briefcase size={15} className="text-brand" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-ink truncate">{c.name}</p>
                <p className="text-[11.5px] text-muted truncate">{c.industry || 'No industry'} · {wsName(c.workspaceId)}</p>
              </div>
              {!c.isActive && <Pill status="SUSPENDED">Inactive</Pill>}
            </Link>
          ))}
        </div></Card>
      )}
    </div>
  );
}
