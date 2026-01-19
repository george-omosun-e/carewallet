import { AdminPharmacy, AdminPharmacyFilter, CreatePharmacyInput, UserWithRole } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Use the same token as regular user (admin is a role)
const TOKEN_KEY = 'carewallet_auth_token'

// Helper to convert snake_case to camelCase
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

// Recursively transform object keys from snake_case to camelCase
function transformKeys<T>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item)) as T
  }

  if (typeof obj === 'object') {
    const transformed: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      transformed[snakeToCamel(key)] = transformKeys(value)
    }
    return transformed as T
  }

  return obj as T
}

// Helper to convert camelCase to snake_case
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

// Recursively transform object keys from camelCase to snake_case
function transformKeysToSnake<T>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformKeysToSnake(item)) as T
  }

  if (typeof obj === 'object') {
    const transformed: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      transformed[camelToSnake(key)] = transformKeysToSnake(value)
    }
    return transformed as T
  }

  return obj as T
}

// API response wrapper type
interface ApiResponseWrapper<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

class AdminAPIClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_URL
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    const json = await response.json().catch(() => ({ success: false, error: { message: 'An error occurred' } })) as ApiResponseWrapper<T>

    if (!response.ok || !json.success) {
      const errorMessage = json.error?.message || 'Request failed'
      throw new Error(errorMessage)
    }

    return transformKeys<T>(json.data)
  }

  // Check if current user is admin
  async getCurrentAdmin(): Promise<UserWithRole | null> {
    const token = this.getToken()
    if (!token) return null

    try {
      const user = await this.request<UserWithRole>('/auth/me')
      if (user.role !== 'admin') {
        return null
      }
      return user
    } catch {
      return null
    }
  }

  // Pharmacy management
  async getPharmacies(filter?: AdminPharmacyFilter): Promise<PaginatedResponse<AdminPharmacy>> {
    const params = new URLSearchParams()
    if (filter?.status) params.append('status', filter.status)
    if (filter?.search) params.append('search', filter.search)
    if (filter?.page) params.append('page', filter.page.toString())
    if (filter?.limit) params.append('limit', filter.limit.toString())

    const queryString = params.toString()
    return this.request<PaginatedResponse<AdminPharmacy>>(
      `/admin/pharmacies${queryString ? `?${queryString}` : ''}`
    )
  }

  async getPharmacy(id: string): Promise<AdminPharmacy> {
    return this.request<AdminPharmacy>(`/admin/pharmacies/${id}`)
  }

  async createPharmacy(data: CreatePharmacyInput): Promise<AdminPharmacy> {
    return this.request<AdminPharmacy>('/admin/pharmacies', {
      method: 'POST',
      body: JSON.stringify(transformKeysToSnake(data)),
    })
  }

  async updatePharmacy(id: string, data: Partial<CreatePharmacyInput>): Promise<AdminPharmacy> {
    return this.request<AdminPharmacy>(`/admin/pharmacies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformKeysToSnake(data)),
    })
  }

  async approvePharmacy(id: string): Promise<AdminPharmacy> {
    return this.request<AdminPharmacy>(`/admin/pharmacies/${id}/approve`, {
      method: 'PUT',
    })
  }

  async suspendPharmacy(id: string): Promise<AdminPharmacy> {
    return this.request<AdminPharmacy>(`/admin/pharmacies/${id}/suspend`, {
      method: 'PUT',
    })
  }

  async reactivatePharmacy(id: string): Promise<AdminPharmacy> {
    return this.request<AdminPharmacy>(`/admin/pharmacies/${id}/reactivate`, {
      method: 'PUT',
    })
  }

  async deletePharmacy(id: string): Promise<void> {
    return this.request<void>(`/admin/pharmacies/${id}`, {
      method: 'DELETE',
    })
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalPharmacies: number
    activePharmacies: number
    pendingPharmacies: number
    totalTransactions: number
    totalWithdrawals: number
  }> {
    return this.request<{
      totalPharmacies: number
      activePharmacies: number
      pendingPharmacies: number
      totalTransactions: number
      totalWithdrawals: number
    }>('/admin/dashboard/stats')
  }
}

export const adminClient = new AdminAPIClient()
