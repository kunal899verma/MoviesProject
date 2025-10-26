'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth, setCredentials, setAuthLoading } from '@/store/slices/authSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === 'undefined') {
        dispatch(setAuthLoading(false));
        return;
      }
      
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (payload.exp && payload.exp > currentTime) {
              dispatch(setCredentials({
                user: { id: payload.sub, email: payload.email },
                token: token
              }));
            } else {
              localStorage.removeItem('token');
              dispatch(setAuthLoading(false));
            }
          } else {
            localStorage.removeItem('token');
            dispatch(setAuthLoading(false));
          }
        } catch (e) {
          localStorage.removeItem('token');
          dispatch(setAuthLoading(false));
        }
      } else {
        dispatch(setAuthLoading(false));
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return <>{children}</>;
}
