'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Copy, Share2, Trash2, Edit, TrendingDown, TrendingUp, QrCode } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { apiClient } from '@/lib/api/client'
import { Wallet, Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function WalletDetailPage() {
  const params = useParams()
  const router = useRouter()
  const walletId = params.id as string

  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    if (walletId) {
      loadWalletData()
    }
  }, [walletId])

  const loadWalletData = async () => {
    try {
      const [walletData, txData] = await Promise.all([
        apiClient.getWallet(walletId),
        apiClient.getTransactions(walletId),
      ])
      setWallet(walletData)
      setTransactions(txData || [])
    } catch (error) {
      console.error('Failed to load wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyShareLink = () => {
    if (!wallet) return
    const url = `${window.location.origin}/wallet/${wallet.shareableCode}`
    navigator.clipboard.writeText(url)
    alert('Share link copied to clipboard!')
  }

  const handleDelete = async () => {
    if (!wallet) return
    if (wallet.balance > 0) {
      alert('Cannot delete wallet with balance. Please withdraw all funds first.')
      return
    }
    if (confirm('Are you sure you want to delete this wallet?')) {
      try {
        await apiClient.deleteWallet(wallet.id)
        router.push('/dashboard')
      } catch (error: any) {
        alert(error.message || 'Failed to delete wallet')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Wallet Not Found</h2>
            <Link href="/dashboard">
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const txList = Array.isArray(transactions) ? transactions : []
  const deposits = txList.filter(t => t.type === 'deposit')
  const withdrawals = txList.filter(t => t.type === 'withdrawal')
  const totalDeposited = deposits.reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawn = withdrawals.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-pink-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{wallet.walletName}</h1>
                  {wallet.beneficiary && (
                    <p className="text-gray-600">
                      Beneficiary: <span className="font-semibold">{wallet.beneficiary.fullName}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={copyShareLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => alert('Edit feature coming soon')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {wallet.description && (
                <p className="text-gray-600 mb-6">{wallet.description}</p>
              )}

              <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                    <p className="text-4xl font-bold text-pink-600">{formatCurrency(wallet.balance)}</p>
                  </div>
                  {wallet.fundingGoal && (
                    <p className="text-gray-600">of {formatCurrency(wallet.fundingGoal)}</p>
                  )}
                </div>
                {wallet.fundingGoal && (
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                      style={{ width: `${Math.min((wallet.balance / wallet.fundingGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={copyShareLink}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
                <Button variant="secondary" onClick={() => window.open(`/wallet/${wallet.shareableCode}`, '_blank')}>
                  View Public Page
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Deposited</span>
                  <TrendingUp className="w-5 h-5 text-pink-600" />
                </div>
                <p className="text-2xl font-bold text-pink-600">{formatCurrency(totalDeposited)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Withdrawn</span>
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                </div>
                <p className="text-2xl font-bold text-rose-500">{formatCurrency(totalWithdrawn)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-2">Share Code</p>
                  <p className="text-lg font-mono font-bold text-pink-600 bg-pink-50 px-4 py-2 rounded-lg">
                    {wallet.shareableCode}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {txList.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {txList.map((tx) => (
                  <div 
                    key={tx.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      tx.type === 'deposit' ? 'bg-pink-50' : 'bg-rose-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-pink-100' : 'bg-rose-100'
                      }`}>
                        {tx.type === 'deposit' ? (
                          <TrendingUp className={`w-5 h-5 ${
                            tx.type === 'deposit' ? 'text-pink-600' : 'text-rose-500'
                          }`} />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-rose-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {tx.type === 'deposit' 
                            ? `Deposit from ${tx.contributorEmail?.split('@')[0] || 'Anonymous'}`
                            : `Withdrawal to ${tx.pharmacyName || 'Pharmacy'}`
                          }
                        </p>
                        <p className="text-sm text-gray-600">{formatDate(tx.createdAt)}</p>
                        {tx.contributorMessage && (
                          <p className="text-sm text-gray-600 italic mt-1">&quot;{tx.contributorMessage}&quot;</p>
                        )}
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${
                      tx.type === 'deposit' ? 'text-pink-600' : 'text-rose-500'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
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
