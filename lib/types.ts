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
  address?: string
  phone?: string
  email?: string
  status?: 'active' | 'inactive' | 'pending'
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

// Payment types
export interface PaymentInitResponse {
  reference: string
  accessCode: string
  authorizationUrl: string
}

export interface PaymentVerifyResponse {
  status: 'success' | 'failed' | 'pending'
  amount: number
  transactionId: string
}

// Pharmacy Portal types
export interface PharmacyAuth {
  token: string
  pharmacy: Pharmacy
}

export interface PharmacyLoginForm {
  shortCode: string
  password: string
}

export interface WalletLookup {
  walletId: string
  walletName: string
  balance: number
  beneficiaryName: string
}

export interface WithdrawalInitRequest {
  walletCode: string
  amount: number
}

export interface WithdrawalInitResponse {
  withdrawalId: string
  walletName: string
  beneficiaryName: string
  amount: number
  otpSentTo: string
}

export interface WithdrawalCompleteRequest {
  withdrawalId: string
  otpCode: string
}

// Admin types
export interface AdminPharmacyFilter {
  status?: 'active' | 'inactive' | 'pending'
  search?: string
  page?: number
  limit?: number
}

export interface AdminPharmacy extends Pharmacy {
  totalTransactions: number
  totalWithdrawn: number
  createdAt: string
  password?: string
}

export interface CreatePharmacyInput {
  name: string
  shortCode: string
  registrationNumber: string
  address?: string
  phone?: string
  email?: string
  password: string
}

// User with role
export interface UserWithRole extends User {
  role: 'user' | 'pharmacy' | 'admin'
}
