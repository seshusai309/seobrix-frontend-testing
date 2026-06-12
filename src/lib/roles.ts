import { Role } from '@/types';

// The three app areas, kept strictly separate so roles never overlap.
//   /admin     → SUPER_ADMIN
//   /dashboard → AGENCY_ADMIN, SEO_MANAGER, SEO_EXPERT
//   /portal    → CLIENT
export function homeForRole(role: Role): string {
  if (role === 'SUPER_ADMIN') return '/admin';
  if (role === 'CLIENT') return '/portal';
  return '/dashboard';
}

export function areaForRole(role: Role): 'admin' | 'dashboard' | 'portal' {
  if (role === 'SUPER_ADMIN') return 'admin';
  if (role === 'CLIENT') return 'portal';
  return 'dashboard';
}

export const roleLabel: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  AGENCY_ADMIN: 'Agency Admin',
  SEO_MANAGER: 'SEO Manager',
  SEO_EXPERT: 'SEO Expert',
  CLIENT: 'Client',
};

// Roles that an agency admin is allowed to invite.
export const INVITABLE_ROLES: Role[] = ['SEO_MANAGER', 'SEO_EXPERT', 'CLIENT'];

export function isStaff(role: Role): boolean {
  return role === 'SEO_MANAGER' || role === 'SEO_EXPERT';
}
