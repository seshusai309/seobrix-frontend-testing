'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Spinner } from '@/components/ui';
import { Role } from '@/types';

import { homeForRole } from '@/lib/roles';

const ROUTE_ACCESS: { path: string; roles: Role[] }[] = [
  { path: '/workspaces',  roles: ['AGENCY_ADMIN'] },
  { path: '/clients',     roles: ['AGENCY_ADMIN'] },
  { path: '/projects',    roles: ['AGENCY_ADMIN', 'SEO_MANAGER', 'SEO_EXPERT'] },
  { path: '/my-projects', roles: ['SEO_MANAGER', 'SEO_EXPERT'] },
  { path: '/reviews',     roles: ['AGENCY_ADMIN', 'SEO_MANAGER'] },
  { path: '/team',        roles: ['AGENCY_ADMIN'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isLoading || !user) return;

    // SUPER_ADMIN and CLIENT belong to their own areas, not the agency dashboard
    if (user.role === 'SUPER_ADMIN' || user.role === 'CLIENT') {
      router.replace(homeForRole(user.role));
      return;
    }

    // AGENCY_ADMIN without an agency → must set up first
    if (user.role === 'AGENCY_ADMIN' && !user.agencyId) {
      router.replace('/setup-agency');
      return;
    }

    // Check route-level access
    const rule = ROUTE_ACCESS.find((r) => pathname.startsWith(r.path));
    if (rule && !rule.roles.includes(user.role)) {
      router.replace(homeForRole(user.role));
    }
  }, [user, isLoading, pathname, router]);

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Spinner size={28} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
