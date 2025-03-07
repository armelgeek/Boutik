'use client';

import { ReactNode } from 'react';
import ShopContextProvider from '@/features/home/context/ShopContext';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ShopContextProvider>
      <Toaster position="bottom-right" />
      {children}
    </ShopContextProvider>
  );
}
