'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, FileText, ExternalLink } from 'lucide-react';
import { projectApi } from '@/lib/api/project.api';
import { blogsApi } from '@/lib/api/blogs.api';
import { extractError } from '@/lib/api/client';
import { Project, Blog } from '@/types';
import { Card, PageHeader, Spinner, EmptyState, Btn, Pill } from '@/components/ui';

export default function PortalProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([projectApi.getById(id), blogsApi.list(id)])
      .then(([p, b]) => { setProject(p); setBlogs(b); })
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size={26} /></div>;
  if (!project) return <Card className="p-6 text-[13px] text-red max-w-3xl mx-auto">{error || 'Project not found'}</Card>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/portal/projects" className="inline-flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink"><ArrowLeft size={14} /> My Projects</Link>
      <PageHeader title={project.name} desc={project.description || undefined}
        actions={<a href={project.websiteUrl} target="_blank" rel="noreferrer"><Btn variant="secondary" size="sm" icon={<Globe size={14} />} iconR={<ExternalLink size={12} />}>Visit site</Btn></a>} />

      <Card>
        <div className="px-5 py-3 border-b border-surface-3"><h2 className="text-[14px] font-semibold text-ink">Published Content</h2></div>
        {blogs.length === 0 ? (
          <EmptyState title="Nothing published yet" desc="Published blog posts will appear here." />
        ) : (
          <div className="divide-y divide-surface-3">
            {blogs.map((b) => (
              <div key={b.id} className="flex items-center gap-3 px-5 py-3.5">
                <FileText size={15} className="text-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium text-ink truncate">{b.title}</p>
                  {b.publishedAt && <p className="text-[11.5px] text-muted">Published {new Date(b.publishedAt).toLocaleDateString()}</p>}
                </div>
                {b.livePostUrl && <a href={b.livePostUrl} target="_blank" rel="noreferrer" className="text-brand hover:text-brand-dark p-1.5"><ExternalLink size={14} /></a>}
                <Pill status={b.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
