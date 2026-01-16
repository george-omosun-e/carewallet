import { User, Wallet, Transaction, CreateWalletInput, DepositInput, WithdrawalInput } from '../types'
import { mockAPI } from './mockAPI'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

class APIClient {
  private baseURL: string
  private useMock: boolean

  constructor() {
    this.baseURL = API_URL
    this.useMock = USE_MOCK
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // For cookies/sessions
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      throw new Error(error.message || 'Request failed')
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string): Promise<User> {
    if (this.useMock) return mockAPI.login(email, password)
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async signup(email: string, password: string, fullName: string): Promise<User> {
    if (this.useMock) return mockAPI.signup(email, password, fullName)
    return this.request<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    })
  }

  async logout(): Promise<void> {
    if (this.useMock) return mockAPI.logout()
    return this.request<void>('/auth/logout', { method: 'POST' })
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.useMock) return mockAPI.getCurrentUser()
    try {
      return await this.request<User>('/auth/me')
    } catch {
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
      body: JSON.stringify(input),
    })
  }

  async updateWallet(id: string, input: Partial<CreateWalletInput>): Promise<Wallet> {
    if (this.useMock) return mockAPI.updateWallet(id, input)
    return this.request<Wallet>(`/wallets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
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
      body: JSON.stringify(input),
    })
  }

  async withdraw(input: WithdrawalInput): Promise<Transaction> {
    if (this.useMock) return mockAPI.withdraw(input)
    return this.request<Transaction>('/withdrawals', {
      method: 'POST',
      body: JSON.stringify(input),
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

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    if (this.useMock) return mockAPI.verifyOTP(email, otp)
    const result = await this.request<{ verified: boolean }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
    return result.verified
  }
}

export const apiClient = new APIClient()
