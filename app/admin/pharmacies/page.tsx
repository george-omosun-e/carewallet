'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Building2, Plus, Search, CheckCircle, XCircle, Clock, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { adminClient } from '@/lib/api/adminClient'
import { AdminPharmacy } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Suspended
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
      default:
        return status
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pharmacies</h1>
          <p className="text-gray-600">Manage registered pharmacies</p>
        </div>
        <Link href="/admin/pharmacies/new">
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Pharmacy
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <form onSubmit={handleSearch} className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                />
              </div>
            </form>

            <div className="flex gap-2">
              <button
                onClick={() => router.push('/admin/pharmacies')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  !statusFilter ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => router.push('/admin/pharmacies?status=active')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  statusFilter === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => router.push('/admin/pharmacies?status=pending')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  statusFilter === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => router.push('/admin/pharmacies?status=inactive')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  statusFilter === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Suspended
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pharmacies List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading pharmacies...</p>
            </div>
          ) : pharmacies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No pharmacies found</h3>
              <p className="text-gray-600 mb-6">
                {statusFilter
                  ? `No ${statusFilter} pharmacies at the moment`
                  : 'Get started by adding your first pharmacy'}
              </p>
              <Link href="/admin/pharmacies/new">
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pharmacy
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Pharmacy
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Withdrawn
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pharmacies.map((pharmacy) => (
                    <tr key={pharmacy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{pharmacy.name}</p>
                          <p className="text-sm text-gray-500">{pharmacy.email || pharmacy.phone || '-'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {pharmacy.shortCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(pharmacy.status || 'active')}</td>
                      <td className="px-6 py-4 text-gray-600">{pharmacy.totalTransactions || 0}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatCurrency(pharmacy.totalWithdrawn || 0)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {pharmacy.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleApprove(pharmacy.id)}
                              disabled={activeAction === pharmacy.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                          )}
                          {pharmacy.status === 'active' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSuspend(pharmacy.id)}
                              disabled={activeAction === pharmacy.id}
                              className="text-red-600 hover:bg-red-50"
                            >
                              Suspend
                            </Button>
                          )}
                          {pharmacy.status === 'inactive' && (
                            <Button
                              size="sm"
                              onClick={() => handleReactivate(pharmacy.id)}
                              disabled={activeAction === pharmacy.id}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Reactivate
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
