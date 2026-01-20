'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, User, Wallet, ShieldCheck, CheckCircle, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
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
      setError('Enter a wallet code')
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
      setError('Enter a valid amount')
      return
    }

    if (walletInfo && amountNum > walletInfo.balance) {
      setError('Exceeds balance')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const withdrawal = await pharmacyClient.initiateWithdrawal(walletCode, amountNum)
      setWithdrawalInfo(withdrawal)
      setStep('otp')
    } catch (error: any) {
      setError(error.message || 'Failed to initiate')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length !== 6) {
      setError('Enter complete 6-digit OTP')
      return
    }

    if (!withdrawalInfo) {
      setError('Session expired. Start over.')
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
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full"></div>
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
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center h-14">
            <Link href="/pharmacy/dashboard" className="flex items-center text-[13px] text-gray-400 hover:text-gray-600 transition-colors duration-150">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Process Withdrawal</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">{pharmacy?.name}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 px-2">
          {steps.map((s, index) => {
            const Icon = s.icon
            const isActive = index === currentStepIndex
            const isCompleted = index < currentStepIndex

            return (
              <div key={s.key} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isCompleted ? 'bg-emerald-500 text-white' :
                  isActive ? 'bg-gray-900 text-white shadow-sm' :
                  'bg-gray-100 text-gray-300'
                }`}>
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-[13px] flex items-center mb-5">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
          <div className="p-6">
            {/* Step 1: Lookup */}
            {step === 'lookup' && (
              <form onSubmit={handleLookup} className="space-y-5">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Enter Wallet Code</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Ask customer for their code</p>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Wallet Code</label>
                  <input
                    type="text"
                    placeholder="CARE-ABC123"
                    value={walletCode}
                    onChange={(e) => setWalletCode(e.target.value.toUpperCase())}
                    autoFocus
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full px-4 py-2.5 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150 disabled:opacity-50"
                >
                  {isProcessing ? 'Looking up...' : 'Look Up Wallet'}
                </button>
              </form>
            )}

            {/* Step 2: Confirm */}
            {step === 'confirm' && walletInfo && (
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Confirm Details</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Verify with customer</p>
                </div>

                <div className="bg-gray-50/80 rounded-lg p-4 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-gray-400">Wallet</span>
                    <span className="text-[13px] font-medium text-gray-900">{walletInfo.walletName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-gray-400">Beneficiary</span>
                    <span className="text-[13px] font-medium text-gray-900">{walletInfo.beneficiaryName}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <span className="text-[12px] text-gray-400">Balance</span>
                    <span className="text-[14px] font-semibold text-emerald-600">{formatCurrency(walletInfo.balance)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleNewWithdrawal}
                    className="flex-1 px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-2 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150 inline-flex items-center justify-center"
                  >
                    Confirm
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Amount */}
            {step === 'amount' && walletInfo && (
              <form onSubmit={handleAmountSubmit} className="space-y-5">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wallet className="w-5 h-5 text-gray-400" />
                  </div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Enter Amount</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    Balance: <span className="font-medium text-emerald-600">{formatCurrency(walletInfo.balance)}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Amount (ZAR)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="1"
                    max={walletInfo.balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    autoFocus
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150 tabular-nums"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('confirm')}
                    className="flex-1 px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150 disabled:opacity-50 inline-flex items-center justify-center"
                  >
                    {isProcessing ? 'Processing...' : 'Continue'}
                    {!isProcessing && <ArrowRight className="w-3.5 h-3.5 ml-1.5" />}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: OTP */}
            {step === 'otp' && withdrawalInfo && (
              <form onSubmit={handleOTPSubmit} className="space-y-5">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-[15px] font-semibold text-gray-900">Enter OTP</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    Code sent to {withdrawalInfo.otpSentTo}
                  </p>
                </div>

                <div className="bg-gray-50/80 rounded-lg px-4 py-3 text-center">
                  <p className="text-[12px] text-gray-500">
                    Withdrawing <span className="font-semibold text-gray-900">{formatCurrency(withdrawalInfo.amount)}</span> from{' '}
                    <span className="font-medium text-gray-700">{withdrawalInfo.walletName}</span>
                  </p>
                </div>

                <OTPInput
                  value={otpCode}
                  onChange={setOtpCode}
                  disabled={isProcessing}
                  autoFocus
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('amount')}
                    className="flex-1 px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || otpCode.length !== 6}
                    className="flex-1 px-4 py-2 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150 disabled:opacity-50 inline-flex items-center justify-center"
                  >
                    {isProcessing ? 'Verifying...' : 'Complete'}
                    {!isProcessing && <CheckCircle className="w-3.5 h-3.5 ml-1.5" />}
                  </button>
                </div>
              </form>
            )}

            {/* Step 5: Success */}
            {step === 'success' && withdrawalInfo && (
              <div className="text-center space-y-5">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Withdrawal Complete</h2>
                  <p className="text-[13px] text-gray-400">Transaction successful</p>
                </div>

                <div className="bg-gray-50/80 rounded-lg p-4 space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-gray-400">Amount</span>
                    <span className="text-[14px] font-semibold text-emerald-600">{formatCurrency(withdrawalInfo.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-gray-400">Wallet</span>
                    <span className="text-[13px] font-medium text-gray-900">{withdrawalInfo.walletName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-gray-400">Beneficiary</span>
                    <span className="text-[13px] font-medium text-gray-900">{withdrawalInfo.beneficiaryName}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push('/pharmacy/dashboard')}
                    className="flex-1 px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleNewWithdrawal}
                    className="flex-1 px-4 py-2 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150"
                  >
                    New Withdrawal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
