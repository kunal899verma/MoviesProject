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
    // Small delay to ensure Redux store is fully initialized
    const timer = setTimeout(() => {
      // Check auth on app load to restore authentication state from localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Decode JWT token to get user info
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            
            // Check if token is not expired
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (payload.exp && payload.exp > currentTime) {
              // Token is valid, restore auth state
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
        // No token found, set loading to false
        dispatch(setAuthLoading(false));
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return <>{children}</>;
}
