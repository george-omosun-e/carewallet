import { User, Wallet, Transaction, Pharmacy } from '../types'
import { generateShareableCode } from '../utils'

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    fullName: 'Sarah Nkosi',
    phone: '+27821234567',
    createdAt: new Date().toISOString(),
    verified: true,
  },
  {
    id: '2',
    email: 'thandi@example.com',
    fullName: 'Thandi Dlamini',
    createdAt: new Date().toISOString(),
    verified: true,
  },
]

export const mockWallets: Wallet[] = [
  {
    id: 'w1',
    creatorId: '1',
    beneficiaryId: '2',
    walletName: "Mom's Medicine Fund",
    description: 'Supporting my mother with her chronic medication costs. Every contribution helps ensure she never has to choose between health and bills.',
    balance: 4750.00,
    fundingGoal: 5000.00,
    shareableCode: generateShareableCode(),
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    beneficiary: mockUsers[1],
    creator: mockUsers[0],
  },
  {
    id: 'w2',
    creatorId: '1',
    walletName: "Sipho's Asthma Care",
    description: 'Helping my nephew manage his asthma medication.',
    balance: 1250.00,
    fundingGoal: 2000.00,
    shareableCode: generateShareableCode(),
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    creator: mockUsers[0],
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    walletId: 'w1',
    type: 'deposit',
    amount: 500.00,
    status: 'completed',
    contributorEmail: 'john@example.com',
    contributorMessage: 'Get well soon! 💙',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't2',
    walletId: 'w1',
    type: 'withdrawal',
    amount: 250.00,
    status: 'completed',
    pharmacyId: 'p1',
    pharmacyName: 'Clicks Pharmacy',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't3',
    walletId: 'w1',
    type: 'deposit',
    amount: 1000.00,
    status: 'completed',
    contributorEmail: 'mary@example.com',
    contributorMessage: 'For Mama Thandi ❤️',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockPharmacies: Pharmacy[] = [
  {
    id: 'p1',
    name: 'Clicks Pharmacy',
    shortCode: '123456',
    registrationNumber: 'PHM001',
  },
  {
    id: 'p2',
    name: 'Dis-Chem Pharmacy',
    shortCode: '234567',
    registrationNumber: 'PHM002',
  },
]
