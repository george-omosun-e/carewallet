'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, TrendingUp, Clock, CheckCircle, Plus, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { adminClient } from '@/lib/api/adminClient'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalPharmacies: number
  activePharmacies: number
  pendingPharmacies: number
  totalTransactions: number
  totalWithdrawals: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await adminClient.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
      // Set default stats if API fails
      setStats({
        totalPharmacies: 0,
        activePharmacies: 0,
        pendingPharmacies: 0,
        totalTransactions: 0,
        totalWithdrawals: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of the CareWallet platform</p>
        </div>
        <Link href="/admin/pharmacies/new">
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Pharmacy
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stats...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Pharmacies</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalPharmacies || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Pharmacies</p>
                    <p className="text-3xl font-bold text-green-600">{stats?.activePharmacies || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                    <p className="text-3xl font-bold text-amber-600">{stats?.pendingPharmacies || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Withdrawals</p>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(stats?.totalWithdrawals || 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/pharmacies?status=pending">
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-gray-900">Review Pending Pharmacies</span>
                      </div>
                      <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-sm font-semibold">
                        {stats?.pendingPharmacies || 0}
                      </span>
                    </div>
                  </Link>

                  <Link href="/admin/pharmacies/new">
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Plus className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-900">Register New Pharmacy</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-600" />
                    </div>
                  </Link>

                  <Link href="/admin/pharmacies">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">View All Pharmacies</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="font-bold text-gray-900">{stats?.totalTransactions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Active Rate</span>
                    <span className="font-bold text-green-600">
                      {stats?.totalPharmacies
                        ? Math.round((stats.activePharmacies / stats.totalPharmacies) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
