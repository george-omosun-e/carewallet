'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { adminClient } from '@/lib/api/adminClient'
import { CreatePharmacyInput } from '@/lib/types'

export default function NewPharmacyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreatePharmacyInput>({
    name: '',
    shortCode: '',
    registrationNumber: '',
    address: '',
    phone: '',
    email: '',
    password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Required'
    if (!formData.shortCode) newErrors.shortCode = 'Required'
    if (formData.shortCode && !/^[A-Z0-9]{2,10}$/.test(formData.shortCode)) {
      newErrors.shortCode = '2-10 uppercase letters/numbers'
    }
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Required'
    if (!formData.password) newErrors.password = 'Required'
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Min 8 characters'
    }
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await adminClient.createPharmacy(formData)
      setSuccess(true)
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to create pharmacy' })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 lg:p-10 max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
          <div className="py-12 px-6 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Pharmacy Created</h2>
            <p className="text-[13px] text-gray-400 mb-6">
              Ready to process withdrawals
            </p>
            <div className="bg-gray-50/80 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-gray-400">Name</span>
                  <span className="text-[13px] font-medium text-gray-900">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-gray-400">Code</span>
                  <span className="font-mono text-[12px] font-medium text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-100">{formData.shortCode}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/admin/pharmacies">
                <button className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150">
                  View All
                </button>
              </Link>
              <button
                className="px-4 py-2 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150"
                onClick={() => {
                  setFormData({
                    name: '',
                    shortCode: '',
                    registrationNumber: '',
                    address: '',
                    phone: '',
                    email: '',
                    password: '',
                  })
                  setConfirmPassword('')
                  setSuccess(false)
                }}
              >
                Add Another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/pharmacies"
          className="inline-flex items-center text-[13px] text-gray-400 hover:text-gray-600 mb-4 transition-colors duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">New Pharmacy</h1>
        <p className="text-sm text-gray-400 mt-0.5">Add a pharmacy to the platform</p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {errors.general && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-[13px]">
                {errors.general}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Pharmacy Name</label>
                <input
                  type="text"
                  placeholder="HealthPlus Pharmacy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150"
                />
                {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Short Code</label>
                <input
                  type="text"
                  placeholder="HP001"
                  value={formData.shortCode}
                  onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150 font-mono"
                />
                {errors.shortCode && <p className="mt-1 text-[11px] text-red-500">{errors.shortCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Registration Number</label>
              <input
                type="text"
                placeholder="License or registration number"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150"
              />
              {errors.registrationNumber && <p className="mt-1 text-[11px] text-red-500">{errors.registrationNumber}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Address <span className="text-gray-300">(optional)</span></label>
              <input
                type="text"
                placeholder="Full address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Phone <span className="text-gray-300">(optional)</span></label>
                <input
                  type="tel"
                  placeholder="+27 XX XXX XXXX"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Email <span className="text-gray-300">(optional)</span></label>
                <input
                  type="email"
                  placeholder="pharmacy@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150"
                />
                {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-[12px] font-medium text-gray-500 mb-4">Login Credentials</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Password</label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150"
                  />
                  {errors.password && <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-[11px] text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Pharmacy uses short code + password to login
              </p>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-3 justify-end">
            <Link href="/admin/pharmacies">
              <button type="button" className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Pharmacy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
