import { 
  User, 
  Wallet, 
  Transaction, 
  Pharmacy, 
  ApiResponse,
  SignupForm,
  LoginForm,
  CreateWalletForm,
  DepositForm,
  WithdrawalForm,
  WalletStats
} from '@/lib/types';
import { sleep, generateShortCode, generateOTP } from '@/lib/utils';

// Mock data storage (simulating backend)
const mockStorage = {
  users: [] as User[],
  wallets: [] as Wallet[],
  transactions: [] as Transaction[],
  pharmacies: [] as Pharmacy[],
  currentUser: null as User | null,
  otpCodes: new Map<string, string>(), // email -> OTP
};

// Initialize with some sample data
const initMockData = () => {
  // Sample pharmacies
  mockStorage.pharmacies = [
    {
      id: 'pharm-1',
      name: 'HealthPlus Pharmacy',
      shortCode: 'HP2847',
      registrationNumber: 'PHM-2024-001',
      status: 'active',
    },
    {
      id: 'pharm-2',
      name: 'CareWell Pharmacy',
      shortCode: 'CW5931',
      registrationNumber: 'PHM-2024-002',
      status: 'active',
    },
    {
      id: 'pharm-3',
      name: 'MediLife Pharmacy',
      shortCode: 'ML7462',
      registrationNumber: 'PHM-2024-003',
      status: 'active',
    },
  ];
};

initMockData();

// Auth API
export const authApi = {
  async signup(data: SignupForm): Promise<ApiResponse<User>> {
    await sleep(800);
    
    const existing = mockStorage.users.find(u => u.email === data.email);
    if (existing) {
      return {
        success: false,
        error: 'Email already registered',
      };
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      createdAt: new Date().toISOString(),
      verified: false,
    };

    mockStorage.users.push(user);
    
    return {
      success: true,
      data: user,
      message: 'Verification email sent to ' + data.email,
    };
  },

  async login(data: LoginForm): Promise<ApiResponse<User>> {
    await sleep(600);
    
    const user = mockStorage.users.find(u => u.email === data.email);
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    mockStorage.currentUser = user;
    
    return {
      success: true,
      data: user,
    };
  },

  async verifyEmail(token: string): Promise<ApiResponse> {
    await sleep(400);
    
    if (mockStorage.currentUser) {
      mockStorage.currentUser.verified = true;
    }
    
    return {
      success: true,
      message: 'Email verified successfully',
    };
  },

  async logout(): Promise<ApiResponse> {
    await sleep(200);
    mockStorage.currentUser = null;
    
    return {
      success: true,
    };
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await sleep(300);
    
    if (!mockStorage.currentUser) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }
    
    return {
      success: true,
      data: mockStorage.currentUser,
    };
  },

  async requestPasswordReset(email: string): Promise<ApiResponse> {
    await sleep(500);
    
    return {
      success: true,
      message: 'Password reset link sent to ' + email,
    };
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    await sleep(600);
    
    return {
      success: true,
      message: 'Password reset successfully',
    };
  },
};

// Wallet API
export const walletApi = {
  async createWallet(data: CreateWalletForm): Promise<ApiResponse<Wallet>> {
    await sleep(800);
    
    if (!mockStorage.currentUser) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const wallet: Wallet = {
      id: `wallet-${Date.now()}`,
      creatorId: mockStorage.currentUser.id,
      walletName: data.walletName,
      description: data.description,
      photoUrl: data.photoUrl,
      balance: 0,
      fundingGoal: data.fundingGoal,
      shareableCode: generateShortCode(8),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStorage.wallets.push(wallet);
    
    return {
      success: true,
      data: wallet,
      message: 'Wallet created successfully',
    };
  },

  async getWallets(): Promise<ApiResponse<Wallet[]>> {
    await sleep(500);
    
    if (!mockStorage.currentUser) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const userWallets = mockStorage.wallets.filter(
      w => w.creatorId === mockStorage.currentUser!.id || 
           w.beneficiaryId === mockStorage.currentUser!.id
    );
    
    return {
      success: true,
      data: userWallets,
    };
  },

  async getWallet(id: string): Promise<ApiResponse<Wallet>> {
    await sleep(400);
    
    const wallet = mockStorage.wallets.find(w => w.id === id);
    
    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }
    
    return {
      success: true,
      data: wallet,
    };
  },

  async getWalletByCode(code: string): Promise<ApiResponse<Wallet>> {
    await sleep(400);
    
    const wallet = mockStorage.wallets.find(w => w.shareableCode === code);
    
    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }
    
    return {
      success: true,
      data: wallet,
    };
  },

  async updateWallet(id: string, data: Partial<Wallet>): Promise<ApiResponse<Wallet>> {
    await sleep(600);
    
    const walletIndex = mockStorage.wallets.findIndex(w => w.id === id);
    
    if (walletIndex === -1) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    mockStorage.wallets[walletIndex] = {
      ...mockStorage.wallets[walletIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: mockStorage.wallets[walletIndex],
      message: 'Wallet updated successfully',
    };
  },

  async deleteWallet(id: string): Promise<ApiResponse> {
    await sleep(500);
    
    const wallet = mockStorage.wallets.find(w => w.id === id);
    
    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    if (wallet.balance > 0) {
      return {
        success: false,
        error: 'Cannot delete wallet with balance. Please withdraw funds first.',
      };
    }

    mockStorage.wallets = mockStorage.wallets.filter(w => w.id !== id);
    
    return {
      success: true,
      message: 'Wallet deleted successfully',
    };
  },

  async setBeneficiary(walletId: string, beneficiaryEmail: string): Promise<ApiResponse> {
    await sleep(700);
    
    // Generate and store OTP
    const otp = generateOTP();
    mockStorage.otpCodes.set(beneficiaryEmail, otp);
    
    console.log(`OTP for ${beneficiaryEmail}: ${otp}`);
    
    return {
      success: true,
      message: `OTP sent to ${beneficiaryEmail}`,
    };
  },

  async verifyBeneficiary(walletId: string, email: string, otp: string): Promise<ApiResponse> {
    await sleep(600);
    
    const storedOtp = mockStorage.otpCodes.get(email);
    
    if (!storedOtp || storedOtp !== otp) {
      return {
        success: false,
        error: 'Invalid OTP',
      };
    }

    // Find or create beneficiary user
    let beneficiary = mockStorage.users.find(u => u.email === email);
    if (!beneficiary) {
      beneficiary = {
        id: `user-${Date.now()}`,
        email,
        fullName: 'Beneficiary User',
        createdAt: new Date().toISOString(),
        verified: true,
      };
      mockStorage.users.push(beneficiary);
    }

    // Update wallet
    const walletIndex = mockStorage.wallets.findIndex(w => w.id === walletId);
    if (walletIndex !== -1) {
      mockStorage.wallets[walletIndex].beneficiaryId = beneficiary.id;
      mockStorage.wallets[walletIndex].beneficiary = beneficiary;
    }

    mockStorage.otpCodes.delete(email);
    
    return {
      success: true,
      message: 'Beneficiary set successfully',
    };
  },
};

// Transaction API
export const transactionApi = {
  async deposit(walletId: string, data: DepositForm): Promise<ApiResponse<Transaction>> {
    await sleep(1200);
    
    const wallet = mockStorage.wallets.find(w => w.id === walletId);
    
    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      walletId,
      type: 'deposit',
      amount: data.amount,
      status: 'completed',
      contributorEmail: data.contributorEmail,
      contributorMessage: data.message,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    mockStorage.transactions.push(transaction);
    
    // Update wallet balance
    wallet.balance += data.amount;
    
    return {
      success: true,
      data: transaction,
      message: 'Deposit successful',
    };
  },

  async withdraw(data: WithdrawalForm): Promise<ApiResponse<Transaction>> {
    await sleep(1000);
    
    const wallet = mockStorage.wallets.find(w => w.id === data.walletId);
    
    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    if (wallet.balance < data.amount) {
      return {
        success: false,
        error: 'Insufficient funds',
      };
    }

    const pharmacy = mockStorage.pharmacies.find(p => p.shortCode === data.pharmacyCode);
    
    if (!pharmacy) {
      return {
        success: false,
        error: 'Invalid pharmacy code',
      };
    }

    // Verify OTP (in real app, this would be checked against stored OTP)
    if (data.otp.length !== 6) {
      return {
        success: false,
        error: 'Invalid OTP',
      };
    }

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      walletId: data.walletId,
      type: 'withdrawal',
      amount: data.amount,
      status: 'completed',
      pharmacyId: pharmacy.id,
      pharmacy,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    mockStorage.transactions.push(transaction);
    
    // Update wallet balance
    wallet.balance -= data.amount;
    
    return {
      success: true,
      data: transaction,
      message: 'Withdrawal successful',
    };
  },

  async getTransactions(walletId: string): Promise<ApiResponse<Transaction[]>> {
    await sleep(400);
    
    const transactions = mockStorage.transactions
      .filter(t => t.walletId === walletId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      success: true,
      data: transactions,
    };
  },

  async requestWithdrawalOTP(walletId: string): Promise<ApiResponse> {
    await sleep(500);
    
    const wallet = mockStorage.wallets.find(w => w.id === walletId);
    
    if (!wallet || !wallet.beneficiary) {
      return {
        success: false,
        error: 'Beneficiary not set',
      };
    }

    const otp = generateOTP();
    mockStorage.otpCodes.set(wallet.beneficiary.email, otp);
    
    console.log(`Withdrawal OTP for ${wallet.beneficiary.email}: ${otp}`);
    
    return {
      success: true,
      message: `OTP sent to ${wallet.beneficiary.email}`,
    };
  },
};

// Pharmacy API
export const pharmacyApi = {
  async getPharmacies(): Promise<ApiResponse<Pharmacy[]>> {
    await sleep(300);
    
    return {
      success: true,
      data: mockStorage.pharmacies,
    };
  },

  async verifyPharmacyCode(code: string): Promise<ApiResponse<Pharmacy>> {
    await sleep(400);
    
    const pharmacy = mockStorage.pharmacies.find(p => p.shortCode === code);
    
    if (!pharmacy) {
      return {
        success: false,
        error: 'Invalid pharmacy code',
      };
    }
    
    return {
      success: true,
      data: pharmacy,
    };
  },
};

// Stats API
export const statsApi = {
  async getWalletStats(walletId: string): Promise<ApiResponse<WalletStats>> {
    await sleep(500);
    
    const transactions = mockStorage.transactions.filter(t => t.walletId === walletId);
    
    const deposits = transactions.filter(t => t.type === 'deposit');
    const withdrawals = transactions.filter(t => t.type === 'withdrawal');
    
    const totalDeposited = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawn = withdrawals.reduce((sum, t) => sum + t.amount, 0);
    const contributorCount = new Set(deposits.map(t => t.contributorEmail).filter(Boolean)).size;
    const averageDeposit = deposits.length > 0 ? totalDeposited / deposits.length : 0;
    
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
    
    const stats: WalletStats = {
      totalDeposited,
      totalWithdrawn,
      contributorCount,
      averageDeposit,
      recentTransactions,
    };
    
    return {
      success: true,
      data: stats,
    };
  },
};
