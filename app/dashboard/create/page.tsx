'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { apiClient } from '@/lib/api/client'

export default function CreateWalletPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    walletName: '',
    description: '',
    fundingGoal: '',
    beneficiaryEmail: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!formData.walletName) newErrors.walletName = 'Wallet name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const wallet = await apiClient.createWallet({
        walletName: formData.walletName,
        description: formData.description || undefined,
        fundingGoal: formData.fundingGoal ? parseFloat(formData.fundingGoal) : undefined,
        beneficiaryEmail: formData.beneficiaryEmail || undefined,
      })
      router.push(`/dashboard/wallet/${wallet.id}`)
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to create wallet' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-pink-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Health Wallet</h1>
          <p className="text-gray-600">Set up a wallet to receive healthcare contributions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                  {errors.general}
                </div>
              )}

              <Input
                label="Wallet Name"
                type="text"
                placeholder="e.g., Mom's Medicine Fund"
                value={formData.walletName}
                onChange={(e) => setFormData({ ...formData, walletName: e.target.value })}
                error={errors.walletName}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-200 min-h-[120px]"
                  placeholder="Share why you're raising funds and how it will help..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Input
                label="Funding Goal (Optional)"
                type="number"
                placeholder="5000"
                value={formData.fundingGoal}
                onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
              />

              <Input
                label="Beneficiary Email (Optional)"
                type="email"
                placeholder="beneficiary@example.com"
                value={formData.beneficiaryEmail}
                onChange={(e) => setFormData({ ...formData, beneficiaryEmail: e.target.value })}
              />

              <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-pink-900">
                    <p className="font-semibold mb-1">Setting a beneficiary</p>
                    <p className="text-pink-700">
                      The beneficiary will receive an OTP to confirm their role. They&apos;ll be able to spend from this wallet at verified pharmacies. You can set this up later if you prefer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={isLoading}>
                  Create Wallet
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
