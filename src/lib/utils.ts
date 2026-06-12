import { clsx, type ClassValue } from 'clsx';

export function cx(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + 'k';
  return String(n);
}

export function rel(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    AGENCY_ADMIN: 'Agency Admin',
    SEO_MANAGER: 'SEO Manager',
    SEO_EXPERT: 'SEO Expert',
    CLIENT: 'Client',
  };
  return map[role] ?? role;
}

export function getBlogStatusColor(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'var(--ink-2)',
    IN_REVIEW: 'var(--amber)',
    CHANGES_REQUESTED: 'var(--accent)',
    APPROVED: 'var(--green-pos)',
    PUBLISHED: 'var(--brand)',
    REJECTED: 'var(--red)',
  };
  return map[status] ?? 'var(--muted)';
}
