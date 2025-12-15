import { tontineService } from '@/services/tontine-service'
import type { Tontine } from '@/types/tontine'
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface TontineState {
  tontines: Tontine[]
  currentTontine: Tontine | null
  loading: boolean
  error: string | null
}

interface TontineActions {
  fetchTontines: () => Promise<void>
  setCurrentTontine: (tontine: Tontine | null) => void
  clearError: () => void
}

export type TontineStore = TontineState & TontineActions

export const useTontineStore = create<TontineStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // État initial
      tontines: [],
      currentTontine: null,
      loading: false,
      error: null,

      // Actions avec gestion d'erreur améliorée
      fetchTontines: async () => {
        const { loading } = get()
        if (loading) return // Évite les appels multiples

        set({ loading: true, error: null })
        try {
          const tontines = await tontineService.getAllTontines()
          console.log('Tontines fetched:', tontines)

          set({ tontines: tontines, loading: false })
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Une erreur est survenue lors du chargement des tontines'
          set({
            error: errorMessage,
            loading: false,
          })
        }
      },

      setCurrentTontine: (tontine: Tontine | null) => {
        set({ currentTontine: tontine })
      },

      clearError: () => {
        set({ error: null })
      },
    })),
    { name: 'tontine-store' },
  ),
)
