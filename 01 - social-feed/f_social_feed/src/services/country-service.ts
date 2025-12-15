import api from '@/lib/api'
import type { ApiResponse, Country } from '@/types/country'

export const countryService = {
  // Récupérer tous les pays

  async getAllCountries(): Promise<Country[]> {
    const response = await api.get<ApiResponse<Country[]>>('/api/countries')
    return response.data.data
  },
}
