import api from '@/lib/api'
import type { ApiResponse, Tontine } from '@/types/tontine'

export const tontineService = {
  // Récupérer toutes les tontines
  async getAllTontines(): Promise<Tontine[]> {
    const response = await api.get<ApiResponse<Tontine[]>>('/api/tontines')
    return response.data.data
  },
}
