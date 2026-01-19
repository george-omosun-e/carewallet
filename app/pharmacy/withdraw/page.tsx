'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Search, User, Wallet, ShieldCheck, CheckCircle, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import OTPInput from '@/components/ui/OTPInput'
import { pharmacyClient } from '@/lib/api/pharmacyClient'
import { WalletLookup, WithdrawalInitResponse, Pharmacy } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

type Step = 'lookup' | 'confirm' | 'amount' | 'otp' | 'success'

export default function PharmacyWithdrawPage() {
  const router = useRouter()
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [step, setStep] = useState<Step>('lookup')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [walletCode, setWalletCode] = useState('')
  const [walletInfo, setWalletInfo] = useState<WalletLookup | null>(null)
  const [amount, setAmount] = useState('')
  const [withdrawalInfo, setWithdrawalInfo] = useState<WithdrawalInitResponse | null>(null)
  const [otpCode, setOtpCode] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentPharmacy = await pharmacyClient.getCurrentPharmacy()
      if (!currentPharmacy) {
        router.push('/pharmacy/login')
        return
      }
      setPharmacy(currentPharmacy)
    } catch (error) {
      router.push('/pharmacy/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletCode.trim()) {
      setError('Please enter a wallet code')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const wallet = await pharmacyClient.lookupWallet(walletCode.trim())
      setWalletInfo(wallet)
      setStep('confirm')
    } catch (error: any) {
      setError(error.message || 'Wallet not found')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirm = () => {
    setStep('amount')
    setError(null)
  }

  const handleAmountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = parseFloat(amount)

    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (walletInfo && amountNum > walletInfo.balance) {
      setError('Amount exceeds wallet balance')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const withdrawal = await pharmacyClient.initiateWithdrawal(walletCode, amountNum)
      setWithdrawalInfo(withdrawal)
      setStep('otp')
    } catch (error: any) {
      setError(error.message || 'Failed to initiate withdrawal')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    if (!withdrawalInfo) {
      setError('Withdrawal session expired. Please start over.')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      await pharmacyClient.completeWithdrawal(withdrawalInfo.withdrawalId, otpCode)
      setStep('success')
    } catch (error: any) {
      setError(error.message || 'Invalid OTP')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNewWithdrawal = () => {
    setStep('lookup')
    setWalletCode('')
    setWalletInfo(null)
    setAmount('')
    setWithdrawalInfo(null)
    setOtpCode('')
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { key: 'lookup', label: 'Lookup', icon: Search },
    { key: 'confirm', label: 'Confirm', icon: User },
    { key: 'amount', label: 'Amount', icon: Wallet },
    { key: 'otp', label: 'Verify', icon: ShieldCheck },
    { key: 'success', label: 'Done', icon: CheckCircle },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === step)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center h-16">
            <Link href="/pharmacy/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Process Withdrawal</h1>
          <p className="text-gray-600">{pharmacy?.name}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((s, index) => {
            const Icon = s.icon
            const isActive = index === currentStepIndex
            const isCompleted = index < currentStepIndex

            return (
              <div key={s.key} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isActive ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start mb-6">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Lookup */}
            {step === 'lookup' && (
              <form onSubmit={handleLookup} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Enter Wallet Code</h2>
                  <p className="text-gray-600 text-sm">Ask the customer for their wallet code</p>
                </div>

                <Input
                  label="Wallet Code"
                  type="text"
                  placeholder="e.g., CARE-ABC123"
                  value={walletCode}
                  onChange={(e) => setWalletCode(e.target.value.toUpperCase())}
                  autoFocus
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  size="lg"
                  isLoading={isProcessing}
                >
                  Look Up Wallet
                </Button>
              </form>
            )}

            {/* Step 2: Confirm */}
            {step === 'confirm' && walletInfo && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Confirm Details</h2>
                  <p className="text-gray-600 text-sm">Verify with the customer before proceeding</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wallet Name</span>
                    <span className="font-semibold">{walletInfo.walletName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beneficiary</span>
                    <span className="font-semibold">{walletInfo.beneficiaryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Balance</span>
                    <span className="font-bold text-green-600">{formatCurrency(walletInfo.balance)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleNewWithdrawal}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500"
                    onClick={handleConfirm}
                  >
                    Confirm
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Amount */}
            {step === 'amount' && walletInfo && (
              <form onSubmit={handleAmountSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Enter Amount</h2>
                  <p className="text-gray-600 text-sm">
                    Available balance: <span className="font-semibold text-green-600">{formatCurrency(walletInfo.balance)}</span>
                  </p>
                </div>

                <Input
                  label="Withdrawal Amount (ZAR)"
                  type="number"
                  placeholder="0.00"
                  min="1"
                  max={walletInfo.balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setStep('confirm')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500"
                    isLoading={isProcessing}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 4: OTP */}
            {step === 'otp' && withdrawalInfo && (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Enter OTP</h2>
                  <p className="text-gray-600 text-sm">
                    A code was sent to {withdrawalInfo.otpSentTo}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 text-center mb-4">
                  <p className="text-sm text-blue-800">
                    Withdrawing <span className="font-bold">{formatCurrency(withdrawalInfo.amount)}</span> from{' '}
                    <span className="font-semibold">{withdrawalInfo.walletName}</span>
                  </p>
                </div>

                <OTPInput
                  value={otpCode}
                  onChange={setOtpCode}
                  disabled={isProcessing}
                  autoFocus
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setStep('amount')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500"
                    isLoading={isProcessing}
                    disabled={otpCode.length !== 6}
                  >
                    Complete
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 5: Success */}
            {step === 'success' && withdrawalInfo && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Complete!</h2>
                  <p className="text-gray-600">The transaction was successful</p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-bold text-green-600">{formatCurrency(withdrawalInfo.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wallet</span>
                    <span className="font-semibold">{withdrawalInfo.walletName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beneficiary</span>
                    <span className="font-semibold">{withdrawalInfo.beneficiaryName}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => router.push('/pharmacy/dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500"
                    onClick={handleNewWithdrawal}
                  >
                    New Withdrawal
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
