'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isPublicPage = pathname === '/' || pathname.startsWith('/wallet/')
  const isDashboard = pathname.startsWith('/dashboard')

  if (isPublicPage) {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-teal-500 to-coral-500 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-coral-600 bg-clip-text text-transparent">
                CareWallet
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/auth/login" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
              >
                Get Started
              </Link>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link 
                href="/auth/login" 
                className="block text-gray-700 hover:text-teal-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    )
  }

  if (isDashboard) {
    return (
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-teal-500 to-coral-500 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-coral-600 bg-clip-text text-transparent">
                CareWallet
              </span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard' ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/settings" 
                className={`text-sm font-medium transition-colors ${
                  pathname === '/settings' ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Settings
              </Link>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-teal-600">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return null
}
