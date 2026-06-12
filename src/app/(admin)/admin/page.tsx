'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';
import { adminApi } from '@/lib/api/admin.api';
import { extractError } from '@/lib/api/client';
import { Agency } from '@/types';
import { Card, PageHeader, Pill, Spinner, EmptyState, Btn } from '@/components/ui';

export default function AdminOverviewPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.listAgencies()
      .then(setAgencies)
      .catch((e) => setError(extractError(e)))
      .finally(() => setLoading(false));
  }, []);

  const active = agencies.filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Platform Overview"
        desc="Manage every agency on SEO Brix."
        actions={<Link href="/admin/agencies"><Btn icon={<Building2 size={15} />}>Manage Agencies</Btn></Link>}
      />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={26} /></div>
      ) : error ? (
        <Card className="p-6 text-[13px] text-red">{error}</Card>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-5">
              <p className="text-[12px] text-muted">Total Agencies</p>
              <p className="text-[28px] font-semibold text-ink mt-1">{agencies.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-[12px] text-muted">Active</p>
              <p className="text-[28px] font-semibold text-brand mt-1">{active}</p>
            </Card>
            <Card className="p-5">
              <p className="text-[12px] text-muted">Suspended</p>
              <p className="text-[28px] font-semibold text-red mt-1">{agencies.length - active}</p>
            </Card>
          </div>

          <Card>
            <div className="px-5 py-3 border-b border-surface-3 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-ink">Recent Agencies</h2>
              <Link href="/admin/agencies" className="text-[12.5px] text-brand hover:underline flex items-center gap-1">
                View all <ArrowRight size={13} />
              </Link>
            </div>
            {agencies.length === 0 ? (
              <EmptyState title="No agencies yet" desc="Create the first agency to get started." />
            ) : (
              <div className="divide-y divide-surface-3">
                {agencies.slice(0, 6).map((a) => (
                  <Link key={a.id} href={`/admin/agencies/${a.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-2 transition-colors">
                    <Building2 size={16} className="text-muted shrink-0" />
                    <span className="text-[13.5px] font-medium text-ink flex-1">{a.name}</span>
                    <Pill status={a.status} />
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
