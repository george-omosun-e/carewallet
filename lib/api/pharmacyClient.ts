import { Pharmacy, WalletLookup, WithdrawalInitResponse, Transaction } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Token storage key for pharmacy
const PHARMACY_TOKEN_KEY = 'carewallet_pharmacy_token'

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

// API response wrapper type
interface ApiResponseWrapper<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

// Auth response from backend
interface PharmacyAuthResponse {
  token: string
  pharmacy: Pharmacy
}

class PharmacyAPIClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_URL
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(PHARMACY_TOKEN_KEY)
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PHARMACY_TOKEN_KEY, token)
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PHARMACY_TOKEN_KEY)
    }
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

  // Auth
  async login(shortCode: string, password: string): Promise<Pharmacy> {
    const response = await fetch(`${this.baseURL}/pharmacy/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ short_code: shortCode, password }),
    })

    const json = await response.json() as ApiResponseWrapper<PharmacyAuthResponse>

    if (!response.ok || !json.success || !json.data) {
      throw new Error(json.error?.message || 'Login failed')
    }

    this.setToken(json.data.token)
    return transformKeys<Pharmacy>(json.data.pharmacy)
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>('/pharmacy/auth/logout', { method: 'POST' })
    } finally {
      this.removeToken()
    }
  }

  async getCurrentPharmacy(): Promise<Pharmacy | null> {
    const token = this.getToken()
    if (!token) return null

    try {
      return await this.request<Pharmacy>('/pharmacy/auth/me')
    } catch {
      this.removeToken()
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Wallet operations
  async lookupWallet(walletCode: string): Promise<WalletLookup> {
    return this.request<WalletLookup>(`/pharmacy/wallets/${walletCode}`)
  }

  // Withdrawal operations
  async initiateWithdrawal(walletCode: string, amount: number): Promise<WithdrawalInitResponse> {
    return this.request<WithdrawalInitResponse>('/pharmacy/withdrawals/initiate', {
      method: 'POST',
      body: JSON.stringify({ wallet_code: walletCode, amount }),
    })
  }

  async completeWithdrawal(withdrawalId: string, otpCode: string): Promise<Transaction> {
    return this.request<Transaction>('/pharmacy/withdrawals/complete', {
      method: 'POST',
      body: JSON.stringify({ withdrawal_id: withdrawalId, otp_code: otpCode }),
    })
  }

  // Transaction history
  async getTransactions(page: number = 1, limit: number = 20): Promise<{ transactions: Transaction[]; total: number }> {
    return this.request<{ transactions: Transaction[]; total: number }>(
      `/pharmacy/transactions?page=${page}&limit=${limit}`
    )
  }
}

export const pharmacyClient = new PharmacyAPIClient()
