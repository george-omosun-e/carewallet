'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Building2, Plus, Search } from 'lucide-react'
import { adminClient } from '@/lib/api/adminClient'
import { AdminPharmacy } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

export default function AdminPharmaciesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || ''

  const [pharmacies, setPharmacies] = useState<AdminPharmacy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeAction, setActiveAction] = useState<string | null>(null)

  useEffect(() => {
    loadPharmacies()
  }, [statusFilter])

  const loadPharmacies = async () => {
    setIsLoading(true)
    try {
      const filter: any = {}
      if (statusFilter) filter.status = statusFilter
      if (search) filter.search = search

      const { items } = await adminClient.getPharmacies(filter)
      setPharmacies(items || [])
    } catch (error) {
      console.error('Failed to load pharmacies:', error)
      setPharmacies([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadPharmacies()
  }

  const handleApprove = async (id: string) => {
    setActiveAction(id)
    try {
      await adminClient.approvePharmacy(id)
      loadPharmacies()
    } catch (error: any) {
      alert(error.message || 'Failed to approve pharmacy')
    } finally {
      setActiveAction(null)
    }
  }

  const handleSuspend = async (id: string) => {
    if (!confirm('Are you sure you want to suspend this pharmacy?')) return

    setActiveAction(id)
    try {
      await adminClient.suspendPharmacy(id)
      loadPharmacies()
    } catch (error: any) {
      alert(error.message || 'Failed to suspend pharmacy')
    } finally {
      setActiveAction(null)
    }
  }

  const handleReactivate = async (id: string) => {
    setActiveAction(id)
    try {
      await adminClient.reactivatePharmacy(id)
      loadPharmacies()
    } catch (error: any) {
      alert(error.message || 'Failed to reactivate pharmacy')
    } finally {
      setActiveAction(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-600">
            Active
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-600">
            Suspended
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-600">
            Pending
          </span>
        )
      default:
        return status
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Pharmacies</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage registered pharmacies</p>
        </div>
        <Link href="/admin/pharmacies/new">
          <button className="inline-flex items-center px-3.5 py-2 text-[13px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150 shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Pharmacy
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search pharmacies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-150"
            />
          </div>
        </form>

        <div className="flex gap-1.5 p-1 bg-gray-100/80 rounded-lg">
          {[
            { value: '', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'inactive', label: 'Suspended' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => router.push(tab.value ? `/admin/pharmacies?status=${tab.value}` : '/admin/pharmacies')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150 ${
                statusFilter === tab.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pharmacies List */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No pharmacies found</h3>
            <p className="text-[13px] text-gray-400 mb-5">
              {statusFilter
                ? `No ${statusFilter} pharmacies`
                : 'Add your first pharmacy to get started'}
            </p>
            <Link href="/admin/pharmacies/new">
              <button className="inline-flex items-center px-3 py-1.5 text-[12px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-150">
                <Plus className="w-3 h-3 mr-1" />
                Add Pharmacy
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    Pharmacy
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    Code
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    Txns
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    Withdrawn
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] font-medium text-gray-400 uppercase tracking-wide">

                  </th>
                </tr>
              </thead>
              <tbody>
                {pharmacies.map((pharmacy, idx) => (
                  <tr
                    key={pharmacy.id}
                    className={`group hover:bg-gray-50/50 transition-colors duration-150 ${
                      idx !== pharmacies.length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-[13px] font-medium text-gray-900">{pharmacy.name}</p>
                        <p className="text-[11px] text-gray-400">{pharmacy.email || pharmacy.phone || '-'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                        {pharmacy.shortCode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(pharmacy.status || 'active')}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500 tabular-nums">{pharmacy.totalTransactions || 0}</td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-gray-900 tabular-nums">
                      {formatCurrency(pharmacy.totalWithdrawn || 0)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {pharmacy.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(pharmacy.id)}
                            disabled={activeAction === pharmacy.id}
                            className="px-2.5 py-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {pharmacy.status === 'active' && (
                          <button
                            onClick={() => handleSuspend(pharmacy.id)}
                            disabled={activeAction === pharmacy.id}
                            className="px-2.5 py-1 text-[11px] font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Suspend
                          </button>
                        )}
                        {pharmacy.status === 'inactive' && (
                          <button
                            onClick={() => handleReactivate(pharmacy.id)}
                            disabled={activeAction === pharmacy.id}
                            className="px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
