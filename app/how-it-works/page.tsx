'use client'

import Link from 'next/link'
import { Heart, Wallet, Share2, CreditCard, ShieldCheck, Users, ArrowRight, CheckCircle } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: Wallet,
      title: 'Create a Health Wallet',
      description: 'Sign up and create a wallet for your loved one in under 2 minutes. Add their story, set a funding goal, and personalize it with their details.',
      details: [
        'No upfront costs to create a wallet',
        'Add a description to share your story',
        'Set an optional funding goal',
        'Assign a beneficiary who can spend the funds'
      ]
    },
    {
      number: 2,
      icon: Share2,
      title: 'Share with Your Community',
      description: 'Get a unique shareable link and QR code. Share it with family, friends, colleagues, and community members who want to help.',
      details: [
        'Unique shareable code for each wallet',
        'Share via WhatsApp, email, or social media',
        'QR code for easy mobile contributions',
        'Contributors don\'t need an account'
      ]
    },
    {
      number: 3,
      icon: CreditCard,
      title: 'Receive Contributions',
      description: 'Contributors can securely donate any amount using card payments. All transactions are processed through Paystack for maximum security.',
      details: [
        'Accept Visa, Mastercard, and more',
        'Instant contribution confirmation',
        'Contributors can leave messages of support',
        'Real-time balance updates'
      ]
    },
    {
      number: 4,
      icon: ShieldCheck,
      title: 'Spend at Verified Pharmacies',
      description: 'Funds can only be spent at verified pharmacies, ensuring every rand goes directly toward healthcare. OTP verification protects against fraud.',
      details: [
        'Network of verified pharmacy partners',
        'OTP verification for withdrawals',
        'Direct payment to pharmacy',
        'Full transaction history and receipts'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />

      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Heart className="w-4 h-4" fill="currentColor" />
              <span>Simple &amp; Transparent</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How CareWallet Works
            </h1>
            <p className="text-xl text-gray-600">
              Four simple steps to support your loved one&apos;s healthcare journey.
              From creating a wallet to spending at pharmacies—we&apos;ve made it easy.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.number}
                    </div>
                    <step.icon className="w-8 h-8 text-pink-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h2>
                  <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`bg-white rounded-3xl shadow-xl p-8 border border-gray-100 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="aspect-video bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-24 h-24 text-pink-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built on Trust</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every feature is designed with transparency and security in mind
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
              <p className="text-gray-600">Bank-grade encryption via Paystack. Your data is never stored on our servers.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Pharmacies</h3>
              <p className="text-gray-600">Funds can only be spent at our network of verified pharmacy partners.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Full Transparency</h3>
              <p className="text-gray-600">Track every contribution and withdrawal with complete transaction history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Create your first health wallet in under 2 minutes.
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

      <Footer />
    </div>
  )
}
