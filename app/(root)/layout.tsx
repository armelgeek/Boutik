import React from 'react';

import "@uploadthing/react/styles.css";
import '@/shared/styles/globals.css';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { UserAvatar } from '@/shared/components/molecules/user-avatar';
import Link from 'next/link';
import { AppLogo } from '@/shared/components/molecules/layout/app-logo';
import AppFooter from '@/shared/components/molecules/layout/app-footer';
import AppNav from '@/shared/components/molecules/layout/app-nav';
import ThemeToggle from '@/components/ui/theme-toggle';
import CartMenu from '@/features/cart/molecules/cart-menu';

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default async function BaseLayout({ children }: RootLayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <header className="flex items-center justify-between py-5 font-medium">
        <div className="flex gap-1 sm:gap-2 md:gap-3 items-center">
          <AppLogo/>
        </div>
        <AppNav/>
        <div className="flex items-center space-x-3 sm:gap-2">
           <ThemeToggle />
           <CartMenu/>
          {session ? (
            <UserAvatar
              isAnonymous={session.user.isAnonymous ?? false}
              user={{
                name: session.user.name,
                email: session.user.email,
                avatar: session.user.image,
              }}
            />
          ) : (
            <Link href="/login" passHref>
              Sign in
            </Link>
          )}
        </div>
       

      </header>
      <main>
        {children}
      </main>
      <AppFooter/>
    </div>
  );
}
