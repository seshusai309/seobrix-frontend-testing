'use client';
import { Suspense } from 'react';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api/auth.api';
import { api } from '@/lib/api/client';
import { homeForRole } from '@/lib/roles';
import { Spinner } from '@/components/ui';

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { setTokens } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const at = params.get('accessToken');
    const rt = params.get('refreshToken');

    if (!at || !rt) {
      router.replace('/login?error=oauth_failed');
      return;
    }

    setTokens(at, rt);
    api.defaults.headers.common['Authorization'] = `Bearer ${at}`;

    authApi
      .me()
      .then((user) => {
        if (user.role === 'AGENCY_ADMIN' && !user.agencyId) {
          router.replace('/setup-agency');
        } else {
          router.replace(homeForRole(user.role));
        }
      })
      .catch(() => router.replace('/login?error=oauth_failed'));
  }, [params, router, setTokens]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Spinner size={28} />
      <p className="text-[13.5px] text-ink-2">Signing you in…</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Suspense fallback={<Spinner size={28} />}>
        <CallbackInner />
      </Suspense>
    </div>
  );
}
