import { useEffect, useState } from 'react'
import { useAuthStore, type AuthStore } from '@/stores/auth-store'

// Selectors pour éviter les re-renders inutiles
const userSelector = (state: AuthStore) => state.user
const isAuthenticatedSelector = (state: AuthStore) => state.isAuthenticated
const loadingSelector = (state: AuthStore) => state.loading
const errorSelector = (state: AuthStore) => state.error

export const useAuth = () => {
  const user = useAuthStore(userSelector)
  const isAuthenticated = useAuthStore(isAuthenticatedSelector)
  const loading = useAuthStore(loadingSelector)
  const error = useAuthStore(errorSelector)

  // Access the entire store for actions to avoid creating new objects
  const { login, logout, fetchUser, setUser, clearError } = useAuthStore.getState()

  return {
    // État
    user,
    isAuthenticated,
    loading,
    error,
    // Actions
    login,
    logout,
    fetchUser,
    setUser,
    clearError,
  }
}

/**
 * Hook pour initialiser l'authentification au démarrage de l'app
 * Retourne true quand l'initialisation est terminée
 */
export const useAuthInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const fetchUser = useAuthStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser().finally(() => {
      setIsInitialized(true)
    })
  }, [fetchUser])

  return isInitialized
}
