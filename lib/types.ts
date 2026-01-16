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
  createdAt: string
  completedAt?: string
}

export interface Pharmacy {
  id: string
  name: string
  shortCode: string
  registrationNumber: string
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
