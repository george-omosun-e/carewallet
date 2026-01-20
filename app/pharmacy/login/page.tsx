'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2 } from 'lucide-react'
import { pharmacyClient } from '@/lib/api/pharmacyClient'

export default function PharmacyLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    shortCode: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!formData.shortCode) newErrors.shortCode = 'Required'
    if (!formData.password) newErrors.password = 'Required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await pharmacyClient.login(formData.shortCode, formData.password)
      router.push('/pharmacy/dashboard')
    } catch (error: any) {
      setErrors({ general: error.message || 'Invalid credentials' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fafafa]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gray-900 p-1.5 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight">
              CareWallet
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Pharmacy Portal</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to process withdrawals</p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-[13px]">
                {errors.general}
              </div>
            )}

            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Pharmacy Code</label>
              <input
                type="text"
                placeholder="PH001"
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150 font-mono"
              />
              {errors.shortCode && <p className="mt-1 text-[11px] text-red-500">{errors.shortCode}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150"
              />
              {errors.password && <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2.5 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-gray-400 mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors duration-150">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
