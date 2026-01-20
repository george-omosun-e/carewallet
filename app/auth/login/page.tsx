'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { apiClient } from '@/lib/api/client'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Required'
    if (!formData.password) newErrors.password = 'Required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const user = await apiClient.login(formData.email, formData.password)
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Invalid email or password' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    )
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
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to manage your wallets</p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-[13px]">
                {errors.general}
              </div>
            )}

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
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
              />
              {errors.password && <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>}
              <div className="text-right mt-1.5">
                <Link href="/auth/forgot-password" className="text-[12px] text-pink-500 hover:text-pink-600 transition-colors duration-150">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2.5 text-[13px] font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-[13px] text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-pink-500 font-medium hover:text-pink-600 transition-colors duration-150">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors duration-150">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
