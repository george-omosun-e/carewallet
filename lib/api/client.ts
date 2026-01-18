import { User, Wallet, Transaction, CreateWalletInput, DepositInput, WithdrawalInput } from '../types'
import { mockAPI } from './mockAPI'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

// Token storage key
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

// Auth response from backend
interface AuthResponseData {
  token: string
  user: {
    id: string
    email: string
    full_name: string
    phone?: string
    verified: boolean
  }
}

class APIClient {
  private baseURL: string
  private useMock: boolean

  constructor() {
    this.baseURL = API_URL
    this.useMock = USE_MOCK
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
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

    // Transform snake_case keys to camelCase
    return transformKeys<T>(json.data)
  }

  // Auth
  async login(email: string, password: string): Promise<User> {
    if (this.useMock) return mockAPI.login(email, password)

    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const json = await response.json() as ApiResponseWrapper<AuthResponseData>

    if (!response.ok || !json.success || !json.data) {
      throw new Error(json.error?.message || 'Login failed')
    }

    // Store the token
    this.setToken(json.data.token)

    // Transform and return user
    return transformKeys<User>(json.data.user)
  }

  async signup(email: string, password: string, fullName: string): Promise<User> {
    if (this.useMock) return mockAPI.signup(email, password, fullName)

    const response = await fetch(`${this.baseURL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    })

    const json = await response.json() as ApiResponseWrapper<AuthResponseData>

    if (!response.ok || !json.success || !json.data) {
      throw new Error(json.error?.message || 'Signup failed')
    }

    // Store the token
    this.setToken(json.data.token)

    // Transform and return user
    return transformKeys<User>(json.data.user)
  }

  async logout(): Promise<void> {
    if (this.useMock) return mockAPI.logout()

    try {
      await this.request<void>('/auth/logout', { method: 'POST' })
    } finally {
      // Always remove the token, even if the request fails
      this.removeToken()
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.useMock) return mockAPI.getCurrentUser()

    const token = this.getToken()
    if (!token) return null

    try {
      return await this.request<User>('/auth/me')
    } catch {
      // If the token is invalid, remove it
      this.removeToken()
      return null
    }
  }

  // Wallets
  async getWallets(): Promise<Wallet[]> {
    if (this.useMock) return mockAPI.getWallets()
    return this.request<Wallet[]>('/wallets')
  }

  async getWallet(id: string): Promise<Wallet> {
    if (this.useMock) return mockAPI.getWallet(id)
    return this.request<Wallet>(`/wallets/${id}`)
  }

  async getWalletByCode(code: string): Promise<Wallet> {
    if (this.useMock) return mockAPI.getWalletByCode(code)
    return this.request<Wallet>(`/wallets/code/${code}`)
  }

  async createWallet(input: CreateWalletInput): Promise<Wallet> {
    if (this.useMock) return mockAPI.createWallet(input)
    return this.request<Wallet>('/wallets', {
      method: 'POST',
      body: JSON.stringify(transformKeysToSnake(input)),
    })
  }

  async updateWallet(id: string, input: Partial<CreateWalletInput>): Promise<Wallet> {
    if (this.useMock) return mockAPI.updateWallet(id, input)
    return this.request<Wallet>(`/wallets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformKeysToSnake(input)),
    })
  }

  async deleteWallet(id: string): Promise<void> {
    if (this.useMock) return mockAPI.deleteWallet(id)
    return this.request<void>(`/wallets/${id}`, { method: 'DELETE' })
  }

  // Transactions
  async getTransactions(walletId: string): Promise<Transaction[]> {
    if (this.useMock) return mockAPI.getTransactions(walletId)
    return this.request<Transaction[]>(`/wallets/${walletId}/transactions`)
  }

  async deposit(walletId: string, input: DepositInput): Promise<Transaction> {
    if (this.useMock) return mockAPI.deposit(walletId, input)
    return this.request<Transaction>(`/wallets/${walletId}/deposit`, {
      method: 'POST',
      body: JSON.stringify(transformKeysToSnake(input)),
    })
  }

  async withdraw(input: WithdrawalInput): Promise<Transaction> {
    if (this.useMock) return mockAPI.withdraw(input)
    return this.request<Transaction>('/withdrawals', {
      method: 'POST',
      body: JSON.stringify({
        wallet_id: input.walletId,
        pharmacy_code: input.pharmacyCode,
        amount: input.amount,
        otp_code: input.otp,
      }),
    })
  }

  // OTP
  async sendOTP(email: string, purpose: string): Promise<void> {
    if (this.useMock) return mockAPI.sendOTP(email, purpose)
    return this.request<void>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    })
  }

  async verifyOTP(email: string, code: string, purpose: string): Promise<boolean> {
    if (this.useMock) return mockAPI.verifyOTP(email, code)
    const result = await this.request<{ valid: boolean }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code, purpose }),
    })
    return result.valid
  }
}

export const apiClient = new APIClient()
