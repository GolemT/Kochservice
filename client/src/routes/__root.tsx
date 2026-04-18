import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/ui/app-sidebar.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarProvider >
        <AppSidebar />

        <Outlet />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            }
          ]}
        />
      </SidebarProvider>
    </>
  ),
})
