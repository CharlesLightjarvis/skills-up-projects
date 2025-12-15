import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { Outlet, useMatches } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import React, { useMemo } from 'react'

export const Route = createFileRoute('/_protected')({
  component: ProtectedRouteComponent,
  beforeLoad: async ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function ProtectedRouteComponent() {
  const matches = useMatches()

  // Generate breadcrumb from current route
  const breadcrumbs = useMemo(() => {
    const currentRoute = matches[matches.length - 1]
    const pathname = currentRoute?.pathname || ''

    const parts = pathname.split('/').filter(Boolean)

    if (parts.length === 0) return []

    const crumbs = parts.map((part: string, index: number) => {
      const path = '/' + parts.slice(0, index + 1).join('/')
      // Capitalize and replace hyphens with spaces
      const label = part
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      return { label, path, isLast: index === parts.length - 1 }
    })

    return crumbs
  }, [matches])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-sm bg-background/75 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to="/dashboard">
                        Accueil
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((crumb) => (
                    <React.Fragment key={crumb.path}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem key={crumb.path}>
                        {crumb.isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
