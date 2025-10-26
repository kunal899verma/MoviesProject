'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      if (window.location.pathname === '/') {
        if (isAuthenticated) {
          router.push('/movies');
        } else {
          router.push('/login');
        }
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <LoadingScreen />;
}
