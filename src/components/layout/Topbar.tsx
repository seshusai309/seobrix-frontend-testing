'use client';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui';
import { getRoleLabel } from '@/lib/utils';

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients':   'Clients',
  '/blogs':     'Blogs',
  '/reviews':   'Review Queue',
  '/team':      'Team',
  '/portal':    'Client Portal',
  '/settings':  'Settings',
};

export function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const label = Object.entries(ROUTE_LABELS).find(([k]) => pathname.startsWith(k))?.[1] ?? '';

  return (
    <header className="h-[56px] flex items-center justify-between px-6 border-b border-surface-3 bg-surface shrink-0">
      <p className="text-[15px] font-semibold text-ink">{label}</p>

      <div className="flex items-center gap-3">
        {/* Notification bell (static for now) */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-btn text-muted hover:bg-surface-2 hover:text-ink transition-colors">
          <Bell size={16} />
        </button>

        {/* User pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-surface-3">
          <Avatar name={user?.name} size={28} />
          <div className="hidden sm:block">
            <p className="text-[12.5px] font-semibold text-ink leading-none">{user?.name}</p>
            <p className="text-[11px] text-muted mt-0.5">{user ? getRoleLabel(user.role) : ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
