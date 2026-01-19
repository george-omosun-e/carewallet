'use client'

import { useEffect, useState } from 'react'
import { User, Lock, Bell, CheckCircle } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
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
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required'
    if (!passwordForm.newPassword) errors.newPassword = 'New password is required'
    if (passwordForm.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters'
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
                <CardTitle>Profile Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user?.fullName || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="flex items-center space-x-2">
                    <p className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user?.email || '-'}</p>
                    {user?.verified && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                {user?.phone && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Change Password Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-rose-600" />
                </div>
                <CardTitle>Change Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                {passwordErrors.general && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                    {passwordErrors.general}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Password changed successfully
                  </div>
                )}
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  error={passwordErrors.currentPassword}
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  error={passwordErrors.newPassword}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  error={passwordErrors.confirmPassword}
                />
                <Button type="submit" isLoading={isChangingPassword}>
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Preferences Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <CardTitle>Notification Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates about your wallets via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Contribution Alerts</p>
                    <p className="text-sm text-gray-600">Get notified when someone contributes to your wallets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Withdrawal Alerts</p>
                    <p className="text-sm text-gray-600">Get notified about withdrawal activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Note: Notification preferences are placeholders and will be fully implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
