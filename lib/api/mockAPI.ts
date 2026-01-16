import { User, Wallet, Transaction, CreateWalletInput, DepositInput, WithdrawalInput } from '../types'
import { mockUsers, mockWallets, mockTransactions } from './mockData'
import { generateShareableCode } from '../utils'

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class MockAPI {
  private currentUser: User | null = null
  private wallets: Wallet[] = [...mockWallets]
  private transactions: Transaction[] = [...mockTransactions]

  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay(800)
    const user = mockUsers.find(u => u.email === email)
    if (!user) throw new Error('Invalid credentials')
    this.currentUser = user
    return user
  }

  async signup(email: string, password: string, fullName: string): Promise<User> {
    await delay(1000)
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      createdAt: new Date().toISOString(),
      verified: false,
    }
    this.currentUser = newUser
    return newUser
  }

  async logout(): Promise<void> {
    await delay(300)
    this.currentUser = null
  }

  async getCurrentUser(): Promise<User | null> {
    await delay(300)
    return this.currentUser || mockUsers[0] // Default to first user for demo
  }

  // Wallets
  async getWallets(): Promise<Wallet[]> {
    await delay(500)
    return this.wallets.filter(w => w.creatorId === (this.currentUser?.id || '1'))
  }

  async getWallet(id: string): Promise<Wallet> {
    await delay(400)
    const wallet = this.wallets.find(w => w.id === id)
    if (!wallet) throw new Error('Wallet not found')
    return wallet
  }

  async getWalletByCode(code: string): Promise<Wallet> {
    await delay(400)
    const wallet = this.wallets.find(w => w.shareableCode === code)
    if (!wallet) throw new Error('Wallet not found')
    return wallet
  }

  async createWallet(input: CreateWalletInput): Promise<Wallet> {
    await delay(1000)
    const newWallet: Wallet = {
      id: `w${this.wallets.length + 1}`,
      creatorId: this.currentUser?.id || '1',
      walletName: input.walletName,
      description: input.description,
      photoUrl: input.photoUrl,
      fundingGoal: input.fundingGoal,
      balance: 0,
      shareableCode: generateShareableCode(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: this.currentUser || mockUsers[0],
    }
    this.wallets.push(newWallet)
    return newWallet
  }

  async updateWallet(id: string, input: Partial<CreateWalletInput>): Promise<Wallet> {
    await delay(800)
    const walletIndex = this.wallets.findIndex(w => w.id === id)
    if (walletIndex === -1) throw new Error('Wallet not found')
    
    this.wallets[walletIndex] = {
      ...this.wallets[walletIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    return this.wallets[walletIndex]
  }

  async deleteWallet(id: string): Promise<void> {
    await delay(600)
    const walletIndex = this.wallets.findIndex(w => w.id === id)
    if (walletIndex === -1) throw new Error('Wallet not found')
    if (this.wallets[walletIndex].balance > 0) {
      throw new Error('Cannot delete wallet with balance')
    }
    this.wallets = this.wallets.filter(w => w.id !== id)
  }

  // Transactions
  async getTransactions(walletId: string): Promise<Transaction[]> {
    await delay(500)
    return this.transactions.filter(t => t.walletId === walletId)
  }

  async deposit(walletId: string, input: DepositInput): Promise<Transaction> {
    await delay(1500) // Simulate payment processing
    
    const wallet = this.wallets.find(w => w.id === walletId)
    if (!wallet) throw new Error('Wallet not found')

    const transaction: Transaction = {
      id: `t${this.transactions.length + 1}`,
      walletId,
      type: 'deposit',
      amount: input.amount,
      status: 'completed',
      contributorEmail: input.contributorEmail,
      contributorMessage: input.contributorMessage,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }

    // Update wallet balance
    wallet.balance += input.amount

    this.transactions.push(transaction)
    return transaction
  }

  async withdraw(input: WithdrawalInput): Promise<Transaction> {
    await delay(1500)
    
    const wallet = this.wallets.find(w => w.id === input.walletId)
    if (!wallet) throw new Error('Wallet not found')
    if (wallet.balance < input.amount) throw new Error('Insufficient funds')

    const transaction: Transaction = {
      id: `t${this.transactions.length + 1}`,
      walletId: input.walletId,
      type: 'withdrawal',
      amount: input.amount,
      status: 'completed',
      pharmacyName: 'Clicks Pharmacy', // Mock pharmacy
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }

    // Update wallet balance
    wallet.balance -= input.amount

    this.transactions.push(transaction)
    return transaction
  }

  // OTP
  async sendOTP(email: string, purpose: string): Promise<void> {
    await delay(800)
    console.log(`OTP sent to ${email} for ${purpose}`)
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    await delay(600)
    // Mock: any 6-digit code works
    return otp.length === 6
  }
}

export const mockAPI = new MockAPI()
