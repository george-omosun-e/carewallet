'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, Shield, Zap, ArrowRight, Check } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50 opacity-70"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(244, 63, 94, 0.1) 0%, transparent 50%)`
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Heart className="w-4 h-4" fill="currentColor" />
                <span>Healthcare funding made simple</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Support loved ones&apos;
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  {' '}healthcare
                </span>
                {' '}together
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Create health wallets that allow family and friends to contribute toward medication and care.
                Every rand goes directly to verified pharmacies—transparent, secure, and filled with love.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Your First Wallet
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-pink-600">R2.4M+</p>
                  <p className="text-sm text-gray-600">Funds raised</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-rose-500">1,200+</p>
                  <p className="text-sm text-gray-600">Active wallets</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-pink-600">98%</p>
                  <p className="text-sm text-gray-600">Success rate</p>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                  R4,750 / R5,000
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src="https://images.pexels.com/photos/4034262/pexels-photo-4034262.jpeg"
                      alt="Person receiving care"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Mom&apos;s Medicine Fund</h3>
                    <p className="text-sm text-gray-600">Supporting chronic medication</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <span className="font-medium">John M.</span>
                    </div>
                    <span className="font-bold text-pink-600">R500</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-rose-500" />
                      <span className="font-medium">Sarah K.</span>
                    </div>
                    <span className="font-bold text-rose-500">R1,000</span>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Contribute Now
                </Button>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Payment sent!</p>
                    <p className="text-xs text-gray-600">To Clicks Pharmacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent, effective
            </h2>
            <p className="text-xl text-gray-600">
              Three steps to support healthcare for those you care about
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 rounded-2xl hover:bg-pink-50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Create a Wallet</h3>
              <p className="text-gray-600">
                Set up a health wallet for your loved one in under 2 minutes. Add their story and set a funding goal.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl hover:bg-rose-50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Share with Community</h3>
              <p className="text-gray-600">
                Share the link with family and friends. Anyone can contribute securely via card or EFT.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl hover:bg-pink-50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Spend at Pharmacy</h3>
              <p className="text-gray-600">
                Funds go directly to verified pharmacies. Track every transaction with full transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">
                Built for trust and transparency
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
                    <p className="text-gray-600">
                      Bank-grade security with Paystack. Your financial data is never stored on our servers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Family Control</h3>
                    <p className="text-gray-600">
                      Set beneficiaries with OTP verification. Only verified pharmacies receive payments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Instant Impact</h3>
                    <p className="text-gray-600">
                      Funds are available immediately. No waiting periods, no complicated processes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 rounded-3xl overflow-hidden shadow-2xl hidden md:block">
                <Image
                  src="https://images.pexels.com/photos/7659869/pexels-photo-7659869.jpeg"
                  alt="Healthcare support"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative md:ml-20 md:mt-20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                    <span className="font-semibold">Transparency</span>
                    <Check className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl">
                    <span className="font-semibold">Zero Hidden Fees</span>
                    <Check className="w-6 h-6 text-rose-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                    <span className="font-semibold">Real-time Updates</span>
                    <Check className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl">
                    <span className="font-semibold">Verified Pharmacies</span>
                    <Check className="w-6 h-6 text-rose-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                    <span className="font-semibold">24/7 Support</span>
                    <Check className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to make a difference?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Join thousands of families supporting each other&apos;s healthcare journey.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="!bg-white !from-white !to-white text-pink-600 hover:!bg-gray-50 shadow-xl"
            >
              Create Your Free Wallet
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
                <span className="text-xl font-bold text-white">CareWallet</span>
              </div>
              <p className="text-sm">
                Healthcare funding made simple, transparent, and filled with love.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-pink-400 transition-colors">How it Works</Link></li>
                <li><Link href="#" className="hover:text-pink-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-pink-400 transition-colors">For Pharmacies</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-pink-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-pink-400 transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-pink-400 transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-pink-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-pink-400 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; 2026 CareWallet. Made with love in South Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
