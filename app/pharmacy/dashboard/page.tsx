'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Wallet, LogOut, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
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

      // Load recent transactions
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const totalWithdrawn = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Pharmacy Portal
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">{pharmacy?.name}</span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {pharmacy?.name}</h1>
          <p className="text-gray-600">Process wallet withdrawals for customers</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/pharmacy/withdraw">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <Wallet className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Process Withdrawal</h3>
                    <p className="text-gray-600 text-sm">Help a customer withdraw from their wallet</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pharmacy Code</p>
                  <p className="text-3xl font-bold text-indigo-600">{pharmacy?.shortCode}</p>
                  <p className="text-sm text-gray-500 mt-2">Share with customers</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Today&apos;s Withdrawals</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(totalWithdrawn)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transactions Today</p>
                  <p className="text-3xl font-bold text-blue-600">{transactions.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No transactions yet today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{tx.id.slice(0, 8)}...</p>
                      <p className="text-sm text-gray-600">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(tx.amount)}</p>
                      <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
