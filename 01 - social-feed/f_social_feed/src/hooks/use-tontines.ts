import { useTontineStore, type TontineStore } from '@/stores/tontine-store'

// Selectors pour éviter les re-renders inutiles
const tontinesSelector = (state: TontineStore) => state.tontines
const currentTontineSelector = (state: TontineStore) => state.currentTontine
const loadingSelector = (state: TontineStore) => state.loading
const errorSelector = (state: TontineStore) => state.error

export const useTontines = () => {
  const tontines = useTontineStore(tontinesSelector)
  const currentTontine = useTontineStore(currentTontineSelector)
  const loading = useTontineStore(loadingSelector)
  const error = useTontineStore(errorSelector)

  // Access the entire store for actions to avoid creating new objects
  const { fetchTontines, setCurrentTontine, clearError } =
    useTontineStore.getState()

  return {
    // État
    tontines,
    currentTontine,
    loading,
    error,
    // Actions
    fetchTontines,
    setCurrentTontine,
    clearError,
  }
}
