'use client';

import KBar from '@/components/ui/kbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import Providers from './Providers';

interface ProviderProps {
  readonly children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Provider({ children }: ProviderProps) {
  return (
    <KBar>
      <Providers>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <QueryClientProvider client={queryClient}>
            <NuqsAdapter>{children}</NuqsAdapter>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ThemeProvider>
      </Providers>
    </KBar>
  );
}
