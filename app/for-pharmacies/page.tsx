'use client'

import Link from 'next/link'
import { Heart, Building2, Shield, Zap, TrendingUp, Users, CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

export default function ForPharmaciesPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increased Revenue',
      description: 'Tap into a new customer base of CareWallet users who have funds allocated specifically for pharmacy purchases.'
    },
    {
      icon: Shield,
      title: 'Guaranteed Payments',
      description: 'All transactions are pre-funded. No credit risk—payments are instant and guaranteed.'
    },
    {
      icon: Zap,
      title: 'Quick Onboarding',
      description: 'Get set up in as little as 48 hours. Our team handles the technical integration for you.'
    },
    {
      icon: Users,
      title: 'Customer Loyalty',
      description: 'Become the preferred pharmacy for families using CareWallet, building long-term customer relationships.'
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Register Your Pharmacy',
      description: 'Complete our simple registration form with your pharmacy details and documentation.'
    },
    {
      step: 2,
      title: 'Get Verified',
      description: 'Our team verifies your pharmacy registration and sets up your merchant account.'
    },
    {
      step: 3,
      title: 'Receive Your Code',
      description: 'Get a unique pharmacy code that customers use to pay from their CareWallet.'
    },
    {
      step: 4,
      title: 'Accept Payments',
      description: 'Customers pay using their CareWallet. Funds are transferred directly to your account.'
    },
  ]

  const requirements = [
    'Valid pharmacy license',
    'SAPC registration number',
    'Business bank account',
    'Tax clearance certificate',
    'Proof of physical location',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />

      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Building2 className="w-4 h-4" />
                <span>Partner With Us</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Join South Africa&apos;s Healthcare Payment Network
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Become a verified CareWallet pharmacy partner and access a growing network of patients with pre-funded healthcare wallets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg">
                    Apply to Join
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="secondary" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Pharmacy Partners</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                  <span className="font-medium text-gray-700">No setup fees</span>
                  <CheckCircle className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                  <span className="font-medium text-gray-700">No monthly fees</span>
                  <CheckCircle className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                  <span className="font-medium text-gray-700">Instant payments</span>
                  <CheckCircle className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                  <span className="font-medium text-gray-700">Dedicated support</span>
                  <CheckCircle className="w-5 h-5 text-pink-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner With CareWallet?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a network that puts healthcare accessibility first while growing your business.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your pharmacy onboarded in four simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Requirements</h2>
            <p className="text-gray-600 text-center mb-8">
              To become a verified CareWallet pharmacy partner, you&apos;ll need:
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  <span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to join our network?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Contact us today to start the registration process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="!bg-white !from-white !to-white text-pink-600 hover:!bg-gray-50 shadow-xl"
              >
                <Mail className="mr-2 w-5 h-5" />
                Contact Us
              </Button>
            </Link>
            <a href="tel:+27123456789">
              <Button
                size="lg"
                variant="secondary"
                className="!bg-transparent !border-2 !border-white text-white hover:!bg-white/10"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
