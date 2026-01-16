'use client'

import { Heart, Shield, Lock, Eye, Smartphone, Server, CheckCircle } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Bank-Grade Encryption',
      description: 'All data is encrypted using AES-256 encryption, the same standard used by banks worldwide.'
    },
    {
      icon: Shield,
      title: 'PCI DSS Compliant',
      description: 'Payment processing through Paystack meets the highest security standards for handling card data.'
    },
    {
      icon: Smartphone,
      title: 'OTP Verification',
      description: 'Every withdrawal requires one-time password verification sent to your registered phone number.'
    },
    {
      icon: Eye,
      title: 'Fraud Monitoring',
      description: '24/7 automated fraud detection systems monitor all transactions for suspicious activity.'
    },
    {
      icon: Server,
      title: 'Secure Infrastructure',
      description: 'Our servers are hosted in secure, SOC 2 compliant data centers with multiple redundancies.'
    },
    {
      icon: CheckCircle,
      title: 'Verified Pharmacies',
      description: 'Funds can only be spent at pharmacies that have been verified through our strict vetting process.'
    },
  ]

  const practices = [
    'We never store your full card details on our servers',
    'All passwords are hashed using industry-standard algorithms',
    'Regular security audits and penetration testing',
    'Employee access is strictly controlled and logged',
    'Automatic session timeouts for inactive users',
    'Two-factor authentication available for all accounts',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />

      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              <span>Your Security is Our Priority</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Security at CareWallet
            </h1>
            <p className="text-xl text-gray-600">
              We take the security of your personal information and funds seriously. Learn about the measures we take to keep you safe.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How We Protect You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Security Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {practices.map((practice, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{practice}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Security */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Security</h2>
            <p className="text-lg text-gray-600">
              Your payment information is handled with the highest level of security
            </p>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Powered by Paystack</h3>
                <p className="text-pink-100 mb-4">
                  All payments are processed through Paystack, Africa&apos;s leading payment processor. Paystack is:
                </p>
                <ul className="space-y-2 text-pink-100">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>PCI DSS Level 1 certified</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>ISO 27001 certified</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Trusted by over 100,000 businesses</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Your Data is Safe</h3>
                <p className="text-pink-100">
                  We never have access to your full card details. When you make a payment, your card information goes directly to Paystack&apos;s secure servers. We only receive a tokenized reference that cannot be used to make unauthorized charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Security Issues */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100 text-center">
            <Shield className="w-16 h-16 text-pink-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Report a Security Issue</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you discover a security vulnerability or suspicious activity, please report it immediately. We take all reports seriously and will investigate promptly.
            </p>
            <div className="bg-pink-50 rounded-xl p-6 inline-block">
              <p className="text-gray-700">
                <strong>Security Team:</strong> security@carewallet.co.za
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
