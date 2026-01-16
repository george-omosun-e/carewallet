'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Heart, Users, TrendingUp, Check } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { apiClient } from '@/lib/api/client'
import { Wallet, Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PublicWalletPage() {
  const params = useParams()
  const code = params.code as string

  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [contributorEmail, setContributorEmail] = useState('')
  const [contributorMessage, setContributorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (code) {
      loadWallet()
    }
  }, [code])

  const loadWallet = async () => {
    try {
      const walletData = await apiClient.getWalletByCode(code)
      setWallet(walletData)
      const txData = await apiClient.getTransactions(walletData.id)
      setTransactions(txData.filter(t => t.type === 'deposit').slice(0, 3))
    } catch (error) {
      console.error('Failed to load wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wallet) return

    setIsProcessing(true)
    try {
      await apiClient.deposit(wallet.id, {
        amount: parseFloat(depositAmount),
        contributorEmail: contributorEmail || undefined,
        contributorMessage: contributorMessage || undefined,
      })
      setShowSuccess(true)
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (error) {
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wallet...</p>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Found</h2>
            <p className="text-gray-600">This wallet doesn&apos;t exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Card className="max-w-md animate-scale-in">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank you! 💚</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your contribution of {formatCurrency(parseFloat(depositAmount))} has been added to {wallet.walletName}
            </p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = wallet.fundingGoal ? (wallet.balance / wallet.fundingGoal) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-12 text-white">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Heart className="w-10 h-10" fill="white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{wallet.walletName}</h1>
                  <p className="text-pink-50">Created by {wallet.creator?.fullName}</p>
                </div>
              </div>
            </div>

            {wallet.description && (
              <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
                {wallet.description}
              </p>
            )}
          </div>

          {/* Progress */}
          <CardContent className="px-8 py-8">
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{formatCurrency(wallet.balance)}</p>
                  <p className="text-gray-600 mt-1">raised</p>
                </div>
                {wallet.fundingGoal && (
                  <p className="text-lg text-gray-600">
                    of {formatCurrency(wallet.fundingGoal)} goal
                  </p>
                )}
              </div>
              {wallet.fundingGoal && (
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>

            {!showDepositForm ? (
              <>
                <Button 
                  size="lg" 
                  className="w-full mb-6"
                  onClick={() => setShowDepositForm(true)}
                >
                  <Heart className="w-5 h-5 mr-2" fill="white" />
                  Make a Contribution
                </Button>

                {transactions.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-pink-600" />
                      Recent Contributors
                    </h3>
                    <div className="space-y-3">
                      {transactions.map((tx) => (
                        <div 
                          key={tx.id}
                          className="flex items-center justify-between p-4 bg-pink-50 rounded-xl"
                        >
                          <div className="flex items-center space-x-3">
                            <Heart className="w-5 h-5 text-pink-600" fill="currentColor" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {tx.contributorEmail?.split('@')[0] || 'Anonymous'}
                              </p>
                              {tx.contributorMessage && (
                                <p className="text-sm text-gray-600">&quot;{tx.contributorMessage}&quot;</p>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-pink-600">{formatCurrency(tx.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleDeposit} className="space-y-6">
                <Input
                  label="Contribution Amount (ZAR)"
                  type="number"
                  placeholder="500"
                  min="10"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                />

                <Input
                  label="Your Email (Optional, for receipt)"
                  type="email"
                  placeholder="you@example.com"
                  value={contributorEmail}
                  onChange={(e) => setContributorEmail(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Leave a message (Optional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-200"
                    placeholder="Add words of encouragement..."
                    rows={3}
                    value={contributorMessage}
                    onChange={(e) => setContributorMessage(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowDepositForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    isLoading={isProcessing}
                  >
                    Contribute {depositAmount && formatCurrency(parseFloat(depositAmount))}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
