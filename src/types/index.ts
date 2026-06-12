export type Role = 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'SEO_MANAGER' | 'SEO_EXPERT' | 'CLIENT';

export type BlogStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED';

export interface User {
  id: string;
  email: string | null;
  phone?: string | null;
  name: string;
  role: Role;
  agencyId?: string | null;
  clientId?: string | null;
  isActive: boolean;
  provider?: string | null;
  createdAt: string;
}

export interface Agency {
  id: string;
  name: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface AgencyStats {
  users: number;
  clients: number;
  blogs: number;
}

export interface Workspace {
  id: string;
  agencyId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  createdAt: string;
  user: User;
}

// A Client is a customer business; it lives in exactly one workspace.
export interface Client {
  id: string;
  agencyId: string;
  workspaceId: string;
  name: string;
  industry?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// A Project = one website property. Created by the CLIENT user.
export interface Project {
  id: string;
  clientId: string;
  name: string;
  websiteUrl: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectAssignment {
  id: string;
  projectId: string;
  userId: string;
  createdAt: string;
  user: User;
}

export interface Integration {
  id: string;
  projectId: string;
  type: 'WORDPRESS' | 'SHOPIFY';
  siteUrl: string;
  username?: string | null;
  status: 'CONNECTED' | 'BROKEN' | 'DISCONNECTED';
  lastTestedAt?: string | null;
  createdAt: string;
}

export interface Blog {
  id: string;
  projectId: string;
  authorId: string;
  reviewerId?: string | null;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  featuredImageUrl?: string | null;
  status: BlogStatus;
  cmsType?: 'WORDPRESS' | 'SHOPIFY' | null;
  cmsPostId?: string | null;
  livePostUrl?: string | null;
  publishedAt?: string | null;
  reviewerNote?: string | null;
  createdAt: string;
  updatedAt: string;
  // present on review-queue / relation includes
  author?: { id: string; name: string; email: string | null };
  project?: Project & { client?: Client };
}

export interface BlogHistory {
  id: string;
  blogId: string;
  actorId: string;
  action: string;
  note?: string | null;
  createdAt: string;
  actor?: { id: string; name: string; role: Role };
}

export interface PendingInvite {
  id: string;
  email: string;
  name: string;
  role: Role;
  expiresAt: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
