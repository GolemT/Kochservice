import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={'flex h-screen w-screen'}>
      <SidebarProvider>
        <AppSidebar />
        <main className={'flex-1'}>
          <SidebarTrigger className={'fixed'} />
          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}
