'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, Shield, Zap, ArrowRight, Check } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navigation />

      {/* Hero Section - Full Width Banner */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/7659873/pexels-photo-7659873.jpeg"
            alt="Healthcare support"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-[13px] font-medium border border-white/20">
              <Heart className="w-3.5 h-3.5" fill="currentColor" />
              <span>Healthcare funding made simple</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Support loved ones&apos;
              <span className="text-pink-400">
                {' '}healthcare
              </span>
              {' '}journey
            </h1>

            <p className="text-lg text-white/80 leading-relaxed max-w-xl">
              Create health wallets for family and friends to contribute toward medication and care.
              Transparent, secure, and filled with love.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/auth/signup">
                <button className="inline-flex items-center justify-center px-6 py-3 text-[14px] font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors duration-150 shadow-lg shadow-pink-500/25">
                  Create Your Wallet
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="inline-flex items-center justify-center px-6 py-3 text-[14px] font-medium text-white bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-150 border border-white/20">
                  See How It Works
                </button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-6">
              <div>
                <p className="text-2xl font-bold text-white">R2.4M+</p>
                <p className="text-[12px] text-white/60">Funds raised</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div>
                <p className="text-2xl font-bold text-white">1,200+</p>
                <p className="text-[12px] text-white/60">Active wallets</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div>
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-[12px] text-white/60">Success rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
              Simple, transparent, effective
            </h2>
            <p className="text-[15px] text-gray-500">
              Three steps to support healthcare for those you care about
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-[#fafafa] hover:bg-pink-50/50 transition-colors duration-200">
              <div className="w-12 h-12 bg-pink-500 rounded-xl mx-auto flex items-center justify-center text-white text-lg font-bold mb-4">
                1
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Create a Wallet</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Set up a health wallet in under 2 minutes. Add their story and set a funding goal.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-[#fafafa] hover:bg-rose-50/50 transition-colors duration-200">
              <div className="w-12 h-12 bg-rose-500 rounded-xl mx-auto flex items-center justify-center text-white text-lg font-bold mb-4">
                2
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Share with Community</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Share the link with family and friends. Anyone can contribute securely.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-[#fafafa] hover:bg-pink-50/50 transition-colors duration-200">
              <div className="w-12 h-12 bg-pink-500 rounded-xl mx-auto flex items-center justify-center text-white text-lg font-bold mb-4">
                3
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Spend at Pharmacy</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Funds go directly to verified pharmacies. Full transparency guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Built for trust
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80">
                  <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Secure Payments</h3>
                    <p className="text-[13px] text-gray-500">
                      Bank-grade security with Paystack. Your data is never stored.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80">
                  <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Family Control</h3>
                    <p className="text-[13px] text-gray-500">
                      Set beneficiaries with OTP verification. Only verified pharmacies receive payments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80">
                  <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Instant Impact</h3>
                    <p className="text-[13px] text-gray-500">
                      Funds available immediately. No waiting periods.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 p-6">
                <div className="space-y-3">
                  {[
                    'Transparency',
                    'Zero Hidden Fees',
                    'Real-time Updates',
                    'Verified Pharmacies',
                    '24/7 Support'
                  ].map((item, index) => (
                    <div key={item} className={`flex items-center justify-between px-4 py-3 rounded-lg ${index % 2 === 0 ? 'bg-pink-50/50' : 'bg-rose-50/50'}`}>
                      <span className="text-[13px] font-medium text-gray-700">{item}</span>
                      <Check className={`w-4 h-4 ${index % 2 === 0 ? 'text-pink-500' : 'text-rose-500'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Ready to make a difference?
          </h2>
          <p className="text-[15px] text-white/80 mb-6">
            Join thousands of families supporting each other&apos;s healthcare journey.
          </p>
          <Link href="/auth/signup">
            <button className="inline-flex items-center px-6 py-3 text-[14px] font-medium text-pink-600 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-150 shadow-lg">
              Create Your Free Wallet
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
                <span className="text-base font-semibold text-white">CareWallet</span>
              </div>
              <p className="text-[12px] leading-relaxed">
                Healthcare funding made simple, transparent, and filled with love.
              </p>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-white uppercase tracking-wide mb-3">Product</h4>
              <ul className="space-y-2 text-[13px]">
                <li><Link href="/how-it-works" className="hover:text-pink-400 transition-colors">How it Works</Link></li>
                <li><Link href="/pricing" className="hover:text-pink-400 transition-colors">Pricing</Link></li>
                <li><Link href="/for-pharmacies" className="hover:text-pink-400 transition-colors">For Pharmacies</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-white uppercase tracking-wide mb-3">Company</h4>
              <ul className="space-y-2 text-[13px]">
                <li><Link href="/about" className="hover:text-pink-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-pink-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-white uppercase tracking-wide mb-3">Legal</h4>
              <ul className="space-y-2 text-[13px]">
                <li><Link href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-[12px] text-center text-gray-500">
            <p>&copy; 2026 CareWallet. Made with love in South Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
