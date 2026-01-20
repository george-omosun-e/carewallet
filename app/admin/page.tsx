'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, TrendingUp, Clock, CheckCircle, Plus, ArrowUpRight } from 'lucide-react'
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
    <div className="p-6 lg:p-10 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Platform overview</p>
        </div>
        <Link href="/admin/pharmacies/new">
          <button className="inline-flex items-center px-3.5 py-2 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150 shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Pharmacy
          </button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Pharmacies</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1 tracking-tight">{stats?.totalPharmacies || 0}</p>
                </div>
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Active</p>
                  <p className="text-2xl font-semibold text-emerald-600 mt-1 tracking-tight">{stats?.activePharmacies || 0}</p>
                </div>
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Pending</p>
                  <p className="text-2xl font-semibold text-amber-600 mt-1 tracking-tight">{stats?.pendingPharmacies || 0}</p>
                </div>
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Withdrawals</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1 tracking-tight">{formatCurrency(stats?.totalWithdrawals || 0)}</p>
                </div>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Overview */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-[13px] font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-2">
                <Link href="/admin/pharmacies?status=pending" className="block">
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50/80 transition-colors duration-150 group">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 bg-amber-50 rounded-md flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Review Pending</span>
                    </div>
                    {(stats?.pendingPharmacies || 0) > 0 && (
                      <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        {stats?.pendingPharmacies}
                      </span>
                    )}
                  </div>
                </Link>

                <Link href="/admin/pharmacies/new" className="block">
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50/80 transition-colors duration-150 group">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                        <Plus className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Register Pharmacy</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </div>
                </Link>

                <Link href="/admin/pharmacies" className="block">
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50/80 transition-colors duration-150 group">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 bg-blue-50 rounded-md flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">All Pharmacies</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-[13px] font-semibold text-gray-900">Overview</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between px-3 py-3 bg-gray-50/60 rounded-lg">
                  <span className="text-[13px] text-gray-500">Total Transactions</span>
                  <span className="text-[13px] font-semibold text-gray-900 tabular-nums">{stats?.totalTransactions || 0}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-3 bg-gray-50/60 rounded-lg">
                  <span className="text-[13px] text-gray-500">Active Rate</span>
                  <span className="text-[13px] font-semibold text-emerald-600 tabular-nums">
                    {stats?.totalPharmacies
                      ? Math.round((stats.activePharmacies / stats.totalPharmacies) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
