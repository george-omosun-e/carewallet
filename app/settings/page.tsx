'use client'

import { useEffect, useState } from 'react'
import { User, Lock, Bell, CheckCircle } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { apiClient } from '@/lib/api/client'
import { User as UserType } from '@/lib/types'

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Failed to load user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordErrors({})
    setPasswordSuccess(false)

    const errors: Record<string, string> = {}
    if (!passwordForm.currentPassword) errors.currentPassword = 'Required'
    if (!passwordForm.newPassword) errors.newPassword = 'Required'
    if (passwordForm.newPassword.length < 8) errors.newPassword = 'Min 8 characters'
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setIsChangingPassword(true)
    try {
      await apiClient.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordSuccess(true)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      setPasswordErrors({ general: error.message || 'Failed to change password' })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-3 text-[13px] text-gray-400">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your account preferences</p>
        </div>

        <div className="space-y-4">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-pink-500" />
                </div>
                <h2 className="text-[13px] font-semibold text-gray-900">Profile Information</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Full Name</label>
                  <p className="px-3 py-2 text-[13px] bg-gray-50/80 rounded-lg text-gray-900">{user?.fullName || '-'}</p>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Email</label>
                  <div className="flex items-center space-x-2">
                    <p className="flex-1 px-3 py-2 text-[13px] bg-gray-50/80 rounded-lg text-gray-900">{user?.email || '-'}</p>
                    {user?.verified && (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                {user?.phone && (
                  <div>
                    <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Phone</label>
                    <p className="px-3 py-2 text-[13px] bg-gray-50/80 rounded-lg text-gray-900">{user.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-rose-500" />
                </div>
                <h2 className="text-[13px] font-semibold text-gray-900">Change Password</h2>
              </div>
            </div>
            <div className="p-5">
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
                {passwordErrors.general && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-[13px]">
                    {passwordErrors.general}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-lg text-[13px] flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Password changed successfully
                  </div>
                )}
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
                  />
                  {passwordErrors.currentPassword && <p className="mt-1 text-[11px] text-red-500">{passwordErrors.currentPassword}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">New Password</label>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
                  />
                  {passwordErrors.newPassword && <p className="mt-1 text-[11px] text-red-500">{passwordErrors.newPassword}</p>}
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-300 transition-all duration-150"
                  />
                  {passwordErrors.confirmPassword && <p className="mt-1 text-[11px] text-red-500">{passwordErrors.confirmPassword}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-4 py-2 text-[13px] font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Notification Preferences Section */}
          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-[13px] font-semibold text-gray-900">Notification Preferences</h2>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 rounded-lg">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">Email Notifications</p>
                    <p className="text-[11px] text-gray-400">Receive updates about your wallets via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 rounded-lg">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">Contribution Alerts</p>
                    <p className="text-[11px] text-gray-400">Get notified when someone contributes to your wallets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 rounded-lg">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">Withdrawal Alerts</p>
                    <p className="text-[11px] text-gray-400">Get notified about withdrawal activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-4">
                Note: Notification preferences are placeholders and will be fully implemented in a future update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
