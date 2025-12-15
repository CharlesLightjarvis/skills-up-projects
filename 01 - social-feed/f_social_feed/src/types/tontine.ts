export enum TontineFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
}

export enum TontineStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Tontine {
  id: number
  name: string
  slogan?: string
  description?: string
  created_by: number
  country_id: number
  contribution_amount: number
  frequency: TontineFrequency
  membership_fee: number
  late_penalty_percent: number
  max_members: number
  status: TontineStatus
  rules?: string
  start_date?: string
  current_cycle: number
  total_cycles: number
  created_at: string
  updated_at: string
  // Relations optionnelles
  country?: {
    id: number
    name: string
    code: string
  }
  creator?: {
    id: number
    name: string
    email: string
  }
}

export interface CreateTontineData {
  name: string
  slogan?: string
  description?: string
  country_id: number
  contribution_amount: number
  frequency: TontineFrequency
  membership_fee?: number
  late_penalty_percent?: number
  max_members: number
  rules?: string
  start_date?: string
  total_cycles: number
}

export interface UpdateTontineData extends Partial<CreateTontineData> {
  status?: TontineStatus
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors: Record<string, string[]>
}
