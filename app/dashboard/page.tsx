'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, TrendingUp, Heart, ExternalLink, Copy } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { apiClient } from '@/lib/api/client'
import { Wallet } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWallets()
  }, [])

  const loadWallets = async () => {
    try {
      const data = await apiClient.getWallets()
      setWallets(data)
    } catch (error) {
      console.error('Failed to load wallets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyShareLink = (code: string) => {
    const url = `${window.location.origin}/wallet/${code}`
    navigator.clipboard.writeText(url)
    alert('Share link copied to clipboard!')
  }

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)
  const activeWallets = wallets.filter(w => w.status === 'active').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Health Wallets</h1>
          <p className="text-gray-600">Manage and track all your healthcare funding</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-3xl font-bold text-pink-600">{formatCurrency(totalBalance)}</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Wallets</p>
                  <p className="text-3xl font-bold text-rose-500">{activeWallets}</p>
                </div>
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-rose-500" fill="currentColor" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Link href="/dashboard/create">
                <Button className="w-full h-full" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Wallets List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Wallets</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading wallets...</p>
            </div>
          ) : wallets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No wallets yet</h3>
                <p className="text-gray-600 mb-6">Create your first health wallet to get started</p>
                <Link href="/dashboard/create">
                  <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Wallet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {wallets.map((wallet) => (
                <Card key={wallet.id} className="hover:shadow-2xl transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex-shrink-0"></div>
                        <div>
                          <CardTitle>{wallet.walletName}</CardTitle>
                          {wallet.beneficiary && (
                            <p className="text-sm text-gray-600 mt-1">
                              Beneficiary: {wallet.beneficiary.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                      <Link href={`/dashboard/wallet/${wallet.id}`}>
                        <ExternalLink className="w-5 h-5 text-gray-400 hover:text-pink-600" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {wallet.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{wallet.description}</p>
                    )}
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-700">
                          {formatCurrency(wallet.balance)}
                        </span>
                        {wallet.fundingGoal && (
                          <span className="text-gray-600">
                            of {formatCurrency(wallet.fundingGoal)}
                          </span>
                        )}
                      </div>
                      {wallet.fundingGoal && (
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                            style={{ width: `${Math.min((wallet.balance / wallet.fundingGoal) * 100, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => copyShareLink(wallet.shareableCode)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Share Link
                      </Button>
                      <Link href={`/dashboard/wallet/${wallet.id}`} className="flex-1">
                        <Button variant="ghost" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
