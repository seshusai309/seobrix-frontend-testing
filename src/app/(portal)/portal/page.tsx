'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, FileText, ArrowRight, Globe } from 'lucide-react';
import { portalApi } from '@/lib/api/blogs.api';
import { extractError } from '@/lib/api/client';
import { Client, Project, Blog } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader, Spinner, EmptyState, Pill } from '@/components/ui';

export default function PortalOverviewPage() {
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([portalApi.me(), portalApi.projects(), portalApi.blogs()])
      .then(([c, p, b]) => { setClient(c); setProjects(p); setBlogs(b); })
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (error) return <Card className="p-6 text-[13px] text-red max-w-4xl mx-auto">{error}</Card>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[0]}`} desc={client ? client.name : undefined} />

      <div className="grid grid-cols-2 gap-4">
        <Link href="/portal/projects">
          <Card hover className="p-5"><FolderKanban size={16} className="text-muted" /><p className="text-[28px] font-semibold text-ink mt-2">{projects.length}</p><p className="text-[12px] text-muted">Projects</p></Card>
        </Link>
        <Card className="p-5"><FileText size={16} className="text-muted" /><p className="text-[28px] font-semibold text-brand mt-2">{blogs.length}</p><p className="text-[12px] text-muted">Published blogs</p></Card>
      </div>

      <Card>
        <div className="px-5 py-3 border-b border-surface-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-ink">Recently Published</h2>
        </div>
        {blogs.length === 0 ? (
          <EmptyState title="Nothing published yet" desc="Your agency will publish content to your sites here." />
        ) : (
          <div className="divide-y divide-surface-3">
            {blogs.slice(0, 8).map((b) => (
              <div key={b.id} className="flex items-center gap-3 px-5 py-3.5">
                <FileText size={15} className="text-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium text-ink truncate">{b.title}</p>
                  {b.livePostUrl && <a href={b.livePostUrl} target="_blank" rel="noreferrer" className="text-[11.5px] text-brand hover:underline">View live</a>}
                </div>
                <Pill status={b.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
