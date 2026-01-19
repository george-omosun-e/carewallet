'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Shield, LayoutDashboard, Building2, LogOut, ChevronRight } from 'lucide-react'
import { adminClient } from '@/lib/api/adminClient'
import { apiClient } from '@/lib/api/client'
import { UserWithRole } from '@/lib/types'

const sidebarLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/pharmacies', icon: Building2, label: 'Pharmacies' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [admin, setAdmin] = useState<UserWithRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await adminClient.getCurrentAdmin()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setAdmin(user)
    } catch (error) {
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await apiClient.logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900">
        {/* Logo */}
        <div className="flex items-center space-x-2 px-6 py-5 border-b border-gray-800">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href ||
                (link.href !== '/admin' && pathname.startsWith(link.href))

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium text-sm">{admin?.fullName}</p>
              <p className="text-gray-500 text-xs">{admin?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  )
}
