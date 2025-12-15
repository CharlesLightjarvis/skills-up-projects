import { countryService } from '@/services/country-service'
import type { Country } from '@/types/country'
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface CountryState {
  countries: Country[]
  currentCountry: Country | null
  loading: boolean
  error: string | null
}

interface CountryActions {
  fetchCountries: () => Promise<void>
  setCurrentCountry: (country: Country | null) => void
  clearError: () => void
}

export type CountryStore = CountryState & CountryActions

export const useCountryStore = create<CountryStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // État initial
      countries: [],
      currentCountry: null,
      loading: false,
      error: null,

      // Actions avec gestion d'erreur améliorée
      fetchCountries: async () => {
        const { loading } = get()
        if (loading) return // Évite les appels multiples

        set({ loading: true, error: null })
        try {
          const countries = await countryService.getAllCountries()
          console.log(countries)

          set({ countries: countries, loading: false })
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Une erreur est survenue lors du chargement des pays'
          set({
            error: errorMessage,
            loading: false,
          })
        }
      },

      setCurrentCountry: (country: Country | null) => {
        set({ currentCountry: country })
      },

      clearError: () => {
        set({ error: null })
      },
    })),
    { name: 'country-store' },
  ),
)
