import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

// import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

// interface MyRouterContext {
//   queryClient: QueryClient
// }

import type { User } from '@/types/user'

export type RouterContext = {
  user: User | null
  logout: () => void
  isAuthenticated: boolean
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>

      <Toaster position="top-center" richColors />
    </>
  ),
})
