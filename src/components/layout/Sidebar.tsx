'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CheckSquare, Settings,
  ChevronLeft, ChevronRight, LogOut, Briefcase, Layers, FolderKanban,
  type LucideIcon,
} from 'lucide-react';
import { cx } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { roleLabel } from '@/lib/roles';
import { Role } from '@/types';
import { Logo } from './Logo';
import { Avatar } from '@/components/ui';

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  roles: Role[];
}

// Default nav = Dashboard area (agency staff). /admin and /portal pass their own.
export const DASHBOARD_NAV: NavItem[] = [
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',   roles: ['AGENCY_ADMIN', 'SEO_MANAGER', 'SEO_EXPERT'] },
  { href: '/workspaces',  icon: Layers,          label: 'Workspaces',  roles: ['AGENCY_ADMIN'] },
  { href: '/clients',     icon: Briefcase,       label: 'Clients',     roles: ['AGENCY_ADMIN'] },
  { href: '/my-projects', icon: FolderKanban,    label: 'My Projects', roles: ['SEO_MANAGER', 'SEO_EXPERT'] },
  { href: '/reviews',     icon: CheckSquare,     label: 'Reviews',     roles: ['AGENCY_ADMIN', 'SEO_MANAGER'] },
  { href: '/team',        icon: Users,           label: 'Team',        roles: ['AGENCY_ADMIN'] },
  { href: '/settings',    icon: Settings,        label: 'Settings',    roles: ['AGENCY_ADMIN', 'SEO_MANAGER', 'SEO_EXPERT'] },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  items?: NavItem[];
}

export function Sidebar({ collapsed, onToggle, items = DASHBOARD_NAV }: Props) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const allowed = items.filter((item) => !user?.role || item.roles.includes(user.role));

  return (
    <aside
      className={cx(
        'relative flex flex-col bg-surface hairline-r h-screen transition-all duration-200 shrink-0',
        collapsed ? 'w-[56px]' : 'w-[220px]'
      )}
    >
      <div className="flex items-center gap-2 px-4 h-[56px] border-b border-surface-3 shrink-0">
        <Logo collapsed={collapsed} />
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-[68px] w-6 h-6 rounded-full bg-surface hairline flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <nav className="flex flex-col gap-0.5 px-2 pt-3 flex-1 overflow-y-auto no-scrollbar">
        {allowed.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                'flex items-center gap-3 px-2.5 h-9 rounded-btn text-[13px] font-medium transition-all',
                collapsed && 'justify-center',
                active ? 'bg-brand/10 text-brand' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={16} className="shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className={cx('border-t border-surface-3 px-2 py-3 shrink-0', collapsed ? 'flex justify-center' : '')}>
        {collapsed ? (
          <button
            onClick={logout}
            className="w-9 h-9 flex items-center justify-center rounded-btn text-muted hover:text-red hover:bg-red/10 transition-colors"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        ) : (
          <div className="flex items-center gap-2.5 px-1.5">
            <Avatar name={user?.name} size={30} />
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-ink truncate">{user?.name}</p>
              <p className="text-[11px] text-muted truncate">{user?.role ? roleLabel[user.role] : ''}</p>
            </div>
            <button
              onClick={logout}
              className="text-muted hover:text-red hover:bg-red/10 rounded-btn p-1.5 transition-colors"
              title="Sign out"
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
