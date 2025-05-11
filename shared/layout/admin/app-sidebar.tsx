'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import {
  BadgeCheck,
  ChevronRight,
  ChevronsUpDown,
  GalleryVerticalEnd,
  LogOut,
  ShoppingBag,
  ShoppingBasket,
  User2Icon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { navItems } from '@/shared/lib/constants/app.constant';
import { Icons } from '@/components/ui/icons';
import { authClient } from '@/auth-client';
import { Session } from 'better-auth';

export const company = {
  name: 'Acme Inc',
  logo: GalleryVerticalEnd,
  plan: 'Enterprise'
};

export default function AppSidebar({ session }: { session: Session }) {
  const router = useRouter();
  const pathname = usePathname();
  //const { state, isMobile } = useSidebar();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push('/login') },
    });
  };
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex gap-2 py-2 text-sidebar-accent-foreground'>
          <div className='flex justify-center items-center bg-sidebar-primary rounded-lg size-8 aspect-square text-sidebar-primary-foreground'>
            <company.logo className='size-4' />
          </div>
          <div className='flex-1 grid text-sm text-left leading-tight'>
            <span className='font-semibold truncate'>{company.name}</span>
            <span className='text-xs truncate'>{company.plan}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <ChevronRight className='ml-auto group-data-[state=open]/collapsible:rotate-90 transition-transform duration-200' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
          <SidebarGroupLabel>Orders</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={'Orders'}
                isActive={pathname === "/d/master/orders"}
              >
                <Link href={'/d/master/orders'}>
                  <ShoppingBasket />
                  <span>Command List</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='rounded-lg w-8 h-8'>
                    <AvatarImage
                      src={session?.user?.image || ''}
                      alt={session?.user?.name || ''}
                    />
                    <AvatarFallback className='rounded-lg'>
                      {session?.user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 grid text-sm text-left leading-tight'>
                    <span className='font-semibold truncate'>
                      {session?.user?.name || ''}
                    </span>
                    <span className='text-xs truncate'>
                      {session?.user?.email || ''}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='rounded-lg w-[--radix-dropdown-menu-trigger-width] min-w-56'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-sm text-left'>
                    <Avatar className='rounded-lg w-8 h-8'>
                      <AvatarImage
                        src={session?.user?.image || ''}
                        alt={session?.user?.name || ''}
                        className='rounded-full'
                      />
                      <AvatarFallback className='rounded-lg'>
                        {session?.user?.name?.slice(0, 2)?.toUpperCase() ||
                          'CN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 grid text-sm text-left leading-tight'>
                      <span className='font-semibold truncate'>
                        {session?.user?.name || ''}
                      </span>
                      <span className='text-xs truncate'>
                        {' '}
                        {session?.user?.email || ''}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <Link href="/account" passHref>
                    <DropdownMenuItem>
                      <User2Icon /> My profile
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
