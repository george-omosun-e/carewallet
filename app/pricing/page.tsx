'use client'

import Link from 'next/link'
import { Heart, Check, HelpCircle, ArrowRight } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

export default function PricingPage() {
  const features = [
    'Unlimited health wallets',
    'Shareable links & QR codes',
    'Real-time contribution tracking',
    'OTP-protected withdrawals',
    'Transaction history & receipts',
    'Verified pharmacy network',
    'Email notifications',
    'Mobile-friendly experience',
    '24/7 customer support',
  ]

  const faqs = [
    {
      question: 'When is the fee charged?',
      answer: 'The platform fee is only deducted when funds are withdrawn from a wallet to a pharmacy. There are no fees for creating wallets or receiving contributions.'
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No hidden fees. The 3-5% platform fee is the only charge. Payment processor fees (if any) are included in this percentage.'
    },
    {
      question: 'Why is there a fee range (3-5%)?',
      answer: 'The exact fee depends on the payment method used and transaction size. Smaller transactions may have a slightly higher percentage due to fixed processing costs.'
    },
    {
      question: 'Is creating a wallet free?',
      answer: 'Yes, creating a wallet is completely free. You only pay when you withdraw funds to a pharmacy.'
    },
    {
      question: 'Can I see a breakdown of fees?',
      answer: 'Yes, every withdrawal shows a clear breakdown of the amount, platform fee, and net amount sent to the pharmacy.'
    },
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
              <span>Simple Pricing</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Transparent, Fair Pricing
            </h1>
            <p className="text-xl text-gray-600">
              No subscriptions. No hidden fees. Only pay when funds are used for healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-12 text-center text-white">
              <h2 className="text-2xl font-semibold mb-2">Platform Fee</h2>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-6xl font-bold">3-5</span>
                <span className="text-3xl">%</span>
              </div>
              <p className="mt-4 text-pink-100">per withdrawal to pharmacy</p>
            </div>

            <div className="px-8 py-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Everything included, no surprises
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link href="/auth/signup">
                  <Button size="lg">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-gray-500">
                  Free to create. Only pay when you withdraw.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Fees Work */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How Fees Work
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Creating a wallet</h3>
                  <p className="text-gray-600">Always free. Create as many wallets as you need.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Receiving contributions</h3>
                  <p className="text-gray-600">No fees on incoming contributions. 100% goes to the wallet.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold text-sm">%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Withdrawing to pharmacy</h3>
                  <p className="text-gray-600">3-5% platform fee is deducted. The rest goes directly to the pharmacy.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-pink-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3">Example</h4>
              <p className="text-gray-700">
                If you withdraw <span className="font-semibold">R1,000</span> to a pharmacy with a 4% fee:
              </p>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>Platform fee: R40</li>
                <li>Amount to pharmacy: <span className="font-semibold text-pink-600">R960</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start for free today
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Create your first health wallet in under 2 minutes. No credit card required.
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
