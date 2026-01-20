'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Users, Check, AlertCircle, Wallet } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { apiClient } from '@/lib/api/client'
import { Wallet as WalletType, Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { initializePayment, toSmallestUnit, getPaystackPublicKey } from '@/lib/paystack'

export default function PublicWalletPage() {
  const params = useParams()
  const code = params.code as string

  const [wallet, setWallet] = useState<WalletType | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [contributorEmail, setContributorEmail] = useState('')
  const [contributorMessage, setContributorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

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
      setTransactions((txData || []).filter(t => t.type === 'deposit').slice(0, 3))
    } catch (error) {
      console.error('Failed to load wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wallet) return

    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount < 10) {
      setPaymentError('Please enter a valid amount (minimum R10)')
      return
    }

    if (!contributorEmail) {
      setPaymentError('Email is required for payment')
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    try {
      const { reference } = await apiClient.initializePayment(
        wallet.id,
        amount,
        contributorEmail,
        contributorMessage || undefined
      )

      await initializePayment({
        publicKey: getPaystackPublicKey(),
        email: contributorEmail,
        amount: toSmallestUnit(amount),
        currency: 'ZAR',
        reference,
        metadata: {
          walletId: wallet.id,
          walletName: wallet.walletName,
          message: contributorMessage,
        },
        onSuccess: async (response) => {
          try {
            await apiClient.verifyPayment(response.reference)
            setShowSuccess(true)
            setTimeout(() => {
              window.location.reload()
            }, 3000)
          } catch (error) {
            setPaymentError('Payment verification failed. Please contact support.')
          } finally {
            setIsProcessing(false)
          }
        },
        onCancel: () => {
          setPaymentError('Payment was cancelled')
          setIsProcessing(false)
        },
      })
    } catch (error: any) {
      setPaymentError(error.message || 'Failed to initialize payment. Please try again.')
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3 text-[13px] text-gray-400">Loading wallet...</p>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-10 text-center max-w-md">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-5 h-5 text-gray-300" />
          </div>
          <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Wallet Not Found</h2>
          <p className="text-[13px] text-gray-400 mb-5">This wallet doesn&apos;t exist or has been removed.</p>
          <Link href="/">
            <button className="px-4 py-2 text-[13px] font-medium text-pink-500 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-150">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-10 text-center max-w-md">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-[13px] text-gray-500 mb-4">
            Your contribution of {formatCurrency(parseFloat(depositAmount))} has been added to {wallet.walletName}
          </p>
          <p className="text-[11px] text-gray-400">Redirecting...</p>
        </div>
      </div>
    )
  }

  const progress = wallet.fundingGoal ? (wallet.balance / wallet.fundingGoal) * 100 : 0

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-8 text-white">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-7 h-7" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold mb-1">{wallet.walletName}</h1>
                <p className="text-[13px] text-pink-100">Created by {wallet.creator?.fullName}</p>
              </div>
            </div>

            {wallet.description && (
              <p className="text-[14px] text-white/90 leading-relaxed">
                {wallet.description}
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="px-6 py-6">
            <div className="mb-6">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-2xl font-semibold text-gray-900 tabular-nums">{formatCurrency(wallet.balance)}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">raised</p>
                </div>
                {wallet.fundingGoal && (
                  <p className="text-[13px] text-gray-500 tabular-nums">
                    of {formatCurrency(wallet.fundingGoal)} goal
                  </p>
                )}
              </div>
              {wallet.fundingGoal && (
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>

            {!showDepositForm ? (
              <>
                <button
                  onClick={() => setShowDepositForm(true)}
                  className="w-full inline-flex items-center justify-center px-4 py-3 text-[13px] font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors duration-150 mb-6"
                >
                  <Heart className="w-4 h-4 mr-2" fill="white" />
                  Make a Contribution
                </button>

                {transactions.length > 0 && (
                  <div>
                    <h3 className="text-[13px] font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-1.5 text-pink-500" />
                      Recent Contributors
                    </h3>
                    <div className="space-y-2">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between px-4 py-3 bg-pink-50/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
                            <div>
                              <p className="text-[13px] font-medium text-gray-900">
                                {tx.contributorEmail?.split('@')[0] || 'Anonymous'}
                              </p>
                              {tx.contributorMessage && (
                                <p className="text-[11px] text-gray-400">&quot;{tx.contributorMessage}&quot;</p>
                              )}
                            </div>
                          </div>
                          <span className="text-[13px] font-semibold text-pink-500 tabular-nums">{formatCurrency(tx.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleDeposit} className="space-y-4">
                {paymentError && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-[13px] flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Contribution Amount (ZAR)</label>
                  <input
                    type="number"
                    placeholder="500"
                    min="10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Your Email (for payment receipt)</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={contributorEmail}
                    onChange={(e) => setContributorEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
                    Leave a message <span className="text-gray-300">(optional)</span>
                  </label>
                  <textarea
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150 resize-none"
                    placeholder="Add words of encouragement..."
                    rows={3}
                    value={contributorMessage}
                    onChange={(e) => setContributorMessage(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDepositForm(false)}
                    className="flex-1 px-4 py-2.5 text-[13px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 text-[13px] font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : `Contribute ${depositAmount ? formatCurrency(parseFloat(depositAmount)) : ''}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
