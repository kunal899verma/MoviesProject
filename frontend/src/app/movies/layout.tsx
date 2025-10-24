'use client';

import { ProtectedRoute } from '@/components/providers/ProtectedRoute';

interface MoviesLayoutProps {
  children: React.ReactNode;
}

export default function MoviesLayout({ children }: MoviesLayoutProps) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
