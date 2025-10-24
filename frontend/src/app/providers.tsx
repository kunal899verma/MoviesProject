'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/components/providers/AuthProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}
