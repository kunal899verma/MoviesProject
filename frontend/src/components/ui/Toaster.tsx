'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgb(34, 73, 87)', // bg-input
          color: 'rgb(255, 255, 255)', // text-white
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        success: {
          iconTheme: {
            primary: 'rgb(34, 193, 94)', // green-500
            secondary: 'rgb(255, 255, 255)', // text-white
          },
        },
        error: {
          iconTheme: {
            primary: 'rgb(239, 68, 68)', // red-500
            secondary: 'rgb(255, 255, 255)', // text-white
          },
        },
      }}
    />
  );
}
