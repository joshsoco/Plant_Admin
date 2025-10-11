import { Outlet, useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics"
import { DashboardCharts } from "@/components/dashboard/DashboardCharts"

export default function Page() {
  const location = useLocation()

  const getBreadcrumbTitle = () => {
    const path = location.pathname
    if (path.includes('/reports')) return 'Reports'
    if (path.includes('/analytics-plants')) return 'Analytics'
    if (path.includes('/identifications')) return 'Identifications'
    if (path.includes('/help')) return 'Help'
    if (path.includes('/about')) return 'About'
    return 'Plant-Identifier Dashboard'
  }

  const isRootDashboard = location.pathname === '/dashboard'

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="!text-gray-900 dark:!text-white">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        {isRootDashboard ? (
          <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4 pt-0 space-y-6">
            <DashboardMetrics />
            <DashboardCharts />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4 pt-0 min-h-0">
            <Outlet />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}