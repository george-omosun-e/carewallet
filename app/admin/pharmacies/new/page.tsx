'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
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

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Pharmacy name is required'
    if (!formData.shortCode) newErrors.shortCode = 'Short code is required'
    if (formData.shortCode && !/^[A-Z0-9]{2,10}$/.test(formData.shortCode)) {
      newErrors.shortCode = 'Code must be 2-10 uppercase letters/numbers'
    }
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
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
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pharmacy Created!</h2>
              <p className="text-gray-600 mb-6">
                The pharmacy has been successfully registered and is ready to process withdrawals.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-semibold">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code</span>
                    <span className="font-mono font-semibold">{formData.shortCode}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Link href="/admin/pharmacies">
                  <Button variant="secondary">View All Pharmacies</Button>
                </Link>
                <Button onClick={() => {
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
                }}>
                  Add Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/pharmacies"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pharmacies
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Register New Pharmacy</h1>
        <p className="text-gray-600">Add a new pharmacy to the platform</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle>Pharmacy Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                  {errors.general}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Pharmacy Name"
                  type="text"
                  placeholder="e.g., HealthPlus Pharmacy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                />

                <Input
                  label="Short Code"
                  type="text"
                  placeholder="e.g., HP001"
                  value={formData.shortCode}
                  onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                  error={errors.shortCode}
                />
              </div>

              <Input
                label="Registration Number"
                type="text"
                placeholder="Pharmacy registration/license number"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                error={errors.registrationNumber}
              />

              <Input
                label="Address"
                type="text"
                placeholder="Full pharmacy address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={errors.address}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+27 XX XXX XXXX"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="pharmacy@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Login Credentials</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  The pharmacy will use their short code and this password to log in.
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/admin/pharmacies" className="flex-1">
                  <Button type="button" variant="secondary" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500"
                  isLoading={isLoading}
                >
                  Create Pharmacy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
