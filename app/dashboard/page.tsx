'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, TrendingUp, Heart, ExternalLink, Copy, Wallet as WalletIcon } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { apiClient } from '@/lib/api/client'
import { Wallet } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    loadWallets()
  }, [])

  const loadWallets = async () => {
    try {
      const data = await apiClient.getWallets()
      setWallets(data)
    } catch (error) {
      console.error('Failed to load wallets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyShareLink = (code: string) => {
    const url = `${window.location.origin}/wallet/${code}`
    navigator.clipboard.writeText(url)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)
  const activeWallets = wallets.filter(w => w.status === 'active').length

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Your Health Wallets</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage and track all your healthcare funding</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Total Balance</p>
                <p className="text-2xl font-semibold text-pink-500 mt-1 tracking-tight">{formatCurrency(totalBalance)}</p>
              </div>
              <div className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-pink-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Active Wallets</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1 tracking-tight">{activeWallets}</p>
              </div>
              <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-500" fill="currentColor" />
              </div>
            </div>
          </div>

          <Link href="/dashboard/create" className="block">
            <div className="bg-pink-500 rounded-xl p-5 hover:bg-pink-600 transition-colors duration-150 h-full flex items-center justify-center group">
              <div className="flex items-center space-x-2 text-white">
                <Plus className="w-4 h-4" />
                <span className="text-[13px] font-medium">Create New Wallet</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Wallets List */}
        <div className="space-y-4">
          <h2 className="text-[13px] font-semibold text-gray-900">Your Wallets</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-3 text-[13px] text-gray-400">Loading wallets...</p>
            </div>
          ) : wallets.length === 0 ? (
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-10 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <WalletIcon className="w-5 h-5 text-gray-300" />
              </div>
              <h3 className="text-[14px] font-semibold text-gray-900 mb-1">No wallets yet</h3>
              <p className="text-[13px] text-gray-400 mb-5">Create your first health wallet to get started</p>
              <Link href="/dashboard/create">
                <button className="inline-flex items-center px-4 py-2 text-[13px] font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors duration-150">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Your First Wallet
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex-shrink-0"></div>
                        <div>
                          <h3 className="text-[14px] font-semibold text-gray-900">{wallet.walletName}</h3>
                          {wallet.beneficiary && (
                            <p className="text-[12px] text-gray-400 mt-0.5">
                              {wallet.beneficiary.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                      <Link href={`/dashboard/wallet/${wallet.id}`}>
                        <ExternalLink className="w-4 h-4 text-gray-300 hover:text-pink-500 transition-colors duration-150" />
                      </Link>
                    </div>

                    {wallet.description && (
                      <p className="text-[12px] text-gray-400 mb-4 line-clamp-2">{wallet.description}</p>
                    )}

                    <div className="mb-4">
                      <div className="flex justify-between text-[13px] mb-2">
                        <span className="font-semibold text-gray-900 tabular-nums">
                          {formatCurrency(wallet.balance)}
                        </span>
                        {wallet.fundingGoal && (
                          <span className="text-gray-400 tabular-nums">
                            of {formatCurrency(wallet.fundingGoal)}
                          </span>
                        )}
                      </div>
                      {wallet.fundingGoal && (
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            style={{ width: `${Math.min((wallet.balance / wallet.fundingGoal) * 100, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copyShareLink(wallet.shareableCode)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-[12px] font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        {copiedCode === wallet.shareableCode ? 'Copied!' : 'Share Link'}
                      </button>
                      <Link href={`/dashboard/wallet/${wallet.id}`} className="flex-1">
                        <button className="w-full px-3 py-2 text-[12px] font-medium text-pink-500 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-150">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
