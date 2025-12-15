import type { RouterContext } from '@/routes/__root'
import { useAuthStore } from '@/stores/auth-store'

export function useRouterContextState(): RouterContext {
  const { user, isAuthenticated, logout: logoutFromStore } = useAuthStore()

  const logout = async () => {
    console.log('🚪 Router context logout triggered')
    await logoutFromStore()
    // Navigation will be handled by the calling component
  }

  return {
    user,
    logout,
    isAuthenticated,
  }
}
