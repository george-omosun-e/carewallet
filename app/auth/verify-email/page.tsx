'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Heart, Mail, CheckCircle, RefreshCw } from 'lucide-react'
import Button from '@/components/ui/Button'
import OTPInput from '@/components/ui/OTPInput'
import { apiClient } from '@/lib/api/client'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otpCode, setOtpCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      await apiClient.verifyEmail(otpCode)
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      setError(error.message || 'Invalid verification code')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)
    setError(null)

    try {
      await apiClient.resendVerificationEmail()
      setResendCooldown(60)
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-600 mb-4">
              Your email has been verified successfully. Redirecting to dashboard...
            </p>
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-xl">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              CareWallet
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h1>
          <p className="text-gray-600">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-pink-600">{email || 'your email'}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-pink-600" />
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <OTPInput
              value={otpCode}
              onChange={setOtpCode}
              disabled={isVerifying}
              error={undefined}
              autoFocus
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isVerifying}
              disabled={otpCode.length !== 6}
            >
              Verify Email
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : isResending
                ? 'Sending...'
                : 'Resend Code'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/auth/login" className="text-pink-600 hover:text-pink-700 font-semibold">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
