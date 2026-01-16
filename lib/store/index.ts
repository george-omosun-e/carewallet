import { create } from 'zustand';
import { User, Wallet, Transaction } from '@/lib/types';
import { authApi, walletApi } from '@/lib/api/mock-client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (response.success && response.data) {
      set({ user: response.data, isAuthenticated: true });
      return true;
    }
    return false;
  },

  signup: async (data: any) => {
    const response = await authApi.signup(data);
    if (response.success && response.data) {
      set({ user: response.data, isAuthenticated: false });
      return true;
    }
    return false;
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const response = await authApi.getCurrentUser();
    if (response.success && response.data) {
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

interface WalletState {
  wallets: Wallet[];
  currentWallet: Wallet | null;
  isLoading: boolean;
  fetchWallets: () => Promise<void>;
  fetchWallet: (id: string) => Promise<void>;
  createWallet: (data: any) => Promise<Wallet | null>;
  updateWallet: (id: string, data: any) => Promise<boolean>;
  deleteWallet: (id: string) => Promise<boolean>;
  setCurrentWallet: (wallet: Wallet | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],
  currentWallet: null,
  isLoading: false,

  fetchWallets: async () => {
    set({ isLoading: true });
    const response = await walletApi.getWallets();
    if (response.success && response.data) {
      set({ wallets: response.data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  fetchWallet: async (id: string) => {
    set({ isLoading: true });
    const response = await walletApi.getWallet(id);
    if (response.success && response.data) {
      set({ currentWallet: response.data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  createWallet: async (data: any) => {
    const response = await walletApi.createWallet(data);
    if (response.success && response.data) {
      set((state) => ({ wallets: [...state.wallets, response.data!] }));
      return response.data;
    }
    return null;
  },

  updateWallet: async (id: string, data: any) => {
    const response = await walletApi.updateWallet(id, data);
    if (response.success && response.data) {
      set((state) => ({
        wallets: state.wallets.map((w) => (w.id === id ? response.data! : w)),
        currentWallet: state.currentWallet?.id === id ? response.data : state.currentWallet,
      }));
      return true;
    }
    return false;
  },

  deleteWallet: async (id: string) => {
    const response = await walletApi.deleteWallet(id);
    if (response.success) {
      set((state) => ({
        wallets: state.wallets.filter((w) => w.id !== id),
        currentWallet: state.currentWallet?.id === id ? null : state.currentWallet,
      }));
      return true;
    }
    return false;
  },

  setCurrentWallet: (wallet: Wallet | null) => {
    set({ currentWallet: wallet });
  },
}));

interface UIState {
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toast: null,

  showToast: (message: string, type: 'success' | 'error' | 'info') => {
    set({ toast: { message, type, show: true } });
    setTimeout(() => {
      set({ toast: null });
    }, 5000);
  },

  hideToast: () => {
    set({ toast: null });
  },
}));
