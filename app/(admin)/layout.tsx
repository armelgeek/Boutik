import AppSidebar  from '@/shared/layout/admin/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/shared/components/molecules/layout/app-header';
import { cookies, headers } from 'next/headers';
import { auth } from '@/auth';

interface AdminLayoutProps {
  readonly children: React.ReactNode;
}
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar session={session}/>
      <SidebarInset>
      <Header />
      <div className='flex flex-1 flex-col space-y-4 px-4 py-4'>
        {children}
      </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
