'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Wallet, LogOut, TrendingUp, Clock, ArrowUpRight } from 'lucide-react'
import { pharmacyClient } from '@/lib/api/pharmacyClient'
import { Pharmacy, Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PharmacyDashboardPage() {
  const router = useRouter()
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const currentPharmacy = await pharmacyClient.getCurrentPharmacy()
      if (!currentPharmacy) {
        router.push('/pharmacy/login')
        return
      }
      setPharmacy(currentPharmacy)

      try {
        const { transactions: txs } = await pharmacyClient.getTransactions(1, 5)
        setTransactions(txs || [])
      } catch (error) {
        console.error('Failed to load transactions:', error)
      }
    } catch (error) {
      console.error('Failed to load pharmacy:', error)
      router.push('/pharmacy/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await pharmacyClient.logout()
      router.push('/pharmacy/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  const totalWithdrawn = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-900 p-1.5 rounded-md">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] font-semibold text-gray-900 tracking-tight">
                Pharmacy
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-[12px] text-gray-500">{pharmacy?.name}</span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-1.5 text-gray-300 hover:text-red-500 transition-colors duration-150 disabled:opacity-50"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-0.5">Process wallet withdrawals for customers</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Link href="/pharmacy/withdraw" className="block">
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center mb-3">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-gray-900 mb-0.5">Process Withdrawal</h3>
                  <p className="text-[12px] text-gray-400">Help a customer withdraw</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Your Code</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1 font-mono tracking-tight">{pharmacy?.shortCode}</p>
                <p className="text-[11px] text-gray-400 mt-1">Share with customers</p>
              </div>
              <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Today</p>
                <p className="text-2xl font-semibold text-emerald-600 mt-1 tracking-tight">{formatCurrency(totalWithdrawn)}</p>
              </div>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Transactions</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1 tracking-tight">{transactions.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-[13px] font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="p-2">
            {transactions.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-[13px] text-gray-400">No transactions today</p>
              </div>
            ) : (
              <div className="space-y-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-gray-900 font-mono">{tx.id.slice(0, 8)}</p>
                      <p className="text-[11px] text-gray-400">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-emerald-600 tabular-nums">{formatCurrency(tx.amount)}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        tx.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
