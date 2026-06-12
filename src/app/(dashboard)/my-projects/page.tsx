'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, Globe } from 'lucide-react';
import { projectApi } from '@/lib/api/project.api';
import { extractError } from '@/lib/api/client';
import { Project } from '@/types';
import { Card, PageHeader, Spinner, EmptyState, Pill } from '@/components/ui';

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    projectApi.mine().then(setProjects).catch((e) => setError(extractError(e))).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title="My Projects" desc="Projects you're assigned to." />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={26} /></div>
      ) : error ? (
        <Card className="p-6 text-[13px] text-red">{error}</Card>
      ) : projects.length === 0 ? (
        <Card><EmptyState title="No projects assigned" desc="An agency admin will assign you to projects to work on." /></Card>
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
  );
}
