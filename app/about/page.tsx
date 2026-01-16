'use client'

import Link from 'next/link'
import { Heart, Target, Eye, Users, Building2, ArrowRight } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We believe everyone deserves access to healthcare, regardless of their financial situation.'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Every transaction is tracked and visible. We have nothing to hide and everything to share.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Healthcare is a collective responsibility. We enable communities to support each other.'
    },
    {
      icon: Target,
      title: 'Impact',
      description: 'Every feature we build is designed to maximize the positive impact on people\'s lives.'
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
              <span>Our Story</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Making Healthcare Accessible Through Community
            </h1>
            <p className="text-xl text-gray-600">
              CareWallet was born from a simple belief: no one should have to choose between their health and their financial wellbeing.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We&apos;re on a mission to transform how South Africans fund healthcare for their loved ones. By creating a transparent, secure platform that connects families with their communities, we enable collective support for individual healthcare needs.
              </p>
              <p className="text-lg text-gray-600">
                Every family should have the peace of mind that comes with knowing their loved ones can access the medication they need. CareWallet makes that possible by removing barriers and building bridges of support.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-white" fill="white" />
                </div>
                <blockquote className="text-xl font-medium text-gray-900 italic">
                  &ldquo;Healthcare funding should be transparent, accessible, and community-driven.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at CareWallet
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-pink-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 lg:p-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
                <p className="text-gray-600">CareWallet is a product by OMNIHEALTH GROUP</p>
              </div>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="font-semibold">Legal Name:</span>
                <span>OMNIHEALTH GROUP (Pty) Ltd</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="font-semibold">CIPC Registration:</span>
                <span>2025/330711/07</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-2">
                <span className="font-semibold">Registered Address:</span>
                <span>30 Gesternte Road, Boksburg, 1459, Gauteng, South Africa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join us in making healthcare accessible
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Create your first health wallet and start supporting your loved ones today.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="!bg-white !from-white !to-white text-pink-600 hover:!bg-gray-50 shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
