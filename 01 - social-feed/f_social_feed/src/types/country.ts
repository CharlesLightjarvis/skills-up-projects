export interface Country {
  code: string
  name: string
  currency: string
  currencySymbol: string
  nkapRate: string // 1 Nkap = X local currency
  flag: string
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
