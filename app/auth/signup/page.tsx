'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { apiClient } from '@/lib/api/client'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await apiClient.getCurrentUser()
        if (user) {
          if (user.role === 'admin') {
            router.replace('/admin')
          } else {
            router.replace('/dashboard')
          }
        }
      } catch {
        // Not logged in, stay on page
      } finally {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!formData.fullName) newErrors.fullName = 'Required'
    if (!formData.email) newErrors.email = 'Required'
    if (!formData.password) newErrors.password = 'Required'
    if (formData.password.length < 8) newErrors.password = 'Min 8 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const user = await apiClient.signup(formData.email, formData.password, formData.fullName)
      if (!user.verified) {
        try {
          await apiClient.sendOTP(formData.email, 'email_verification')
        } catch (otpError) {
          console.error('Failed to send verification OTP:', otpError)
        }
        router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`)
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fafafa]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="bg-pink-500 p-1.5 rounded-lg">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight">
              CareWallet
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Create your account</h1>
          <p className="text-sm text-gray-400 mt-1">Start supporting healthcare together</p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-[13px]">
                {errors.general}
              </div>
            )}

            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
              />
              {errors.fullName && <p className="mt-1 text-[11px] text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
              />
              {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
              />
              {errors.password && <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
              />
              {errors.confirmPassword && <p className="mt-1 text-[11px] text-red-500">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2.5 text-[13px] font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-[13px] text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-pink-500 font-medium hover:text-pink-600 transition-colors duration-150">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-pink-500 hover:text-pink-600 transition-colors duration-150">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-pink-500 hover:text-pink-600 transition-colors duration-150">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
