'use client';
import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader, Avatar } from '@/components/ui';
import { roleLabel } from '@/lib/roles';

export default function PortalSettingsPage() {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader title="Settings" desc="Your account details." />
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} size={52} />
          <div>
            <p className="text-[14px] font-semibold text-ink">{user?.name}</p>
            <p className="text-[12.5px] text-muted">{user?.email}</p>
            <p className="text-[12px] text-ink-2 mt-0.5">{user ? roleLabel[user.role] : ''}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
