import { useCountryStore, type CountryStore } from '@/stores/country-store'

// Selectors pour éviter les re-renders inutiles
const countriesSelector = (state: CountryStore) => state.countries
const currentCountrySelector = (state: CountryStore) => state.currentCountry
const loadingSelector = (state: CountryStore) => state.loading
const errorSelector = (state: CountryStore) => state.error

export const useCountry = () => {
  const countries = useCountryStore(countriesSelector)
  const currentCountry = useCountryStore(currentCountrySelector)
  const loading = useCountryStore(loadingSelector)
  const error = useCountryStore(errorSelector)

  // Access the entire store for actions to avoid creating new objects
  const { fetchCountries, setCurrentCountry, clearError } =
    useCountryStore.getState()

  return {
    // État
    countries,
    currentCountry,
    loading,
    error,
    // Actions
    fetchCountries,
    setCurrentCountry,
    clearError,
  }
}
