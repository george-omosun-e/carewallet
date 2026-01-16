export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  createdAt: string
  verified: boolean
}

export interface Wallet {
  id: string
  creatorId: string
  beneficiaryId?: string
  walletName: string
  description?: string
  photoUrl?: string
  balance: number
  fundingGoal?: number
  shareableCode: string
  status: 'active' | 'suspended' | 'deleted'
  createdAt: string
  updatedAt: string
  beneficiary?: User
  creator?: User
}

export interface Transaction {
  id: string
  walletId: string
  type: 'deposit' | 'withdrawal'
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  contributorEmail?: string
  contributorMessage?: string
  pharmacyId?: string
  pharmacyName?: string
  pharmacy?: Pharmacy
  createdAt: string
  completedAt?: string
}

export interface Pharmacy {
  id: string
  name: string
  shortCode: string
  registrationNumber: string
  status?: 'active' | 'inactive'
}

export interface CreateWalletInput {
  walletName: string
  description?: string
  photoUrl?: string
  fundingGoal?: number
  beneficiaryEmail?: string
}

export interface DepositInput {
  amount: number
  contributorEmail?: string
  contributorMessage?: string
}

export interface WithdrawalInput {
  walletId: string
  pharmacyCode: string
  amount: number
  otp: string
}

export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface SignupForm {
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface CreateWalletForm {
  walletName: string
  description?: string
  photoUrl?: string
  fundingGoal?: number
  beneficiaryEmail?: string
}

export interface DepositForm {
  amount: number
  contributorEmail?: string
  message?: string
}

export interface WithdrawalForm {
  walletId: string
  pharmacyCode: string
  amount: number
  otp: string
}

export interface WalletStats {
  totalDeposited: number
  totalWithdrawn: number
  contributorCount: number
  averageDeposit: number
  recentTransactions: Transaction[]
}
