'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Building2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
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
    if (!formData.shortCode) newErrors.shortCode = 'Pharmacy code is required'
    if (!formData.password) newErrors.password = 'Password is required'

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              CareWallet
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pharmacy Portal</h1>
          <p className="text-gray-600">Sign in to process withdrawals</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                {errors.general}
              </div>
            )}

            <Input
              label="Pharmacy Code"
              type="text"
              placeholder="e.g., PH001"
              value={formData.shortCode}
              onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
              error={errors.shortCode}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600" size="lg" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
