'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, FolderKanban, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar, NavItem } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Spinner } from '@/components/ui';
import { homeForRole } from '@/lib/roles';

const PORTAL_NAV: NavItem[] = [
  { href: '/portal', icon: Home, label: 'Overview', roles: ['CLIENT'] },
  { href: '/portal/projects', icon: FolderKanban, label: 'My Projects', roles: ['CLIENT'] },
  { href: '/portal/settings', icon: Settings, label: 'Settings', roles: ['CLIENT'] },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== 'CLIENT') router.replace(homeForRole(user.role));
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Spinner size={28} />
      </div>
    );
  }
  if (user.role !== 'CLIENT') return null;

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} items={PORTAL_NAV} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
