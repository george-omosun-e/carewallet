'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Shield, LayoutDashboard, Building2, LogOut } from 'lucide-react'
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
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3 text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-60 bg-white/80 backdrop-blur-xl border-r border-gray-100">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 px-5 py-6">
          <div className="bg-gray-900 p-1.5 rounded-md">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-semibold text-gray-900 tracking-tight">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="px-3 mt-2">
          <ul className="space-y-0.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href ||
                (link.href !== '/admin' && pathname.startsWith(link.href))

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-gray-50/80">
            <div className="min-w-0 flex-1">
              <p className="text-gray-900 font-medium text-xs truncate">{admin?.fullName}</p>
              <p className="text-gray-400 text-[11px] truncate">{admin?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 text-gray-300 hover:text-red-500 transition-colors duration-150 disabled:opacity-50 flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-60">
        {children}
      </div>
    </div>
  )
}
