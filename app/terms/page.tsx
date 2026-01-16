'use client'

import { Heart, FileText } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Navigation />

      {/* Hero */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <FileText className="w-4 h-4" />
              <span>Legal</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600">Last updated: January 2026</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing or using CareWallet, operated by OMNIHEALTH GROUP (Pty) Ltd, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-6">
                CareWallet is a healthcare funding platform that allows users to create health wallets, receive contributions from others, and spend funds at verified pharmacies. The platform facilitates transparent, community-driven healthcare funding.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">To use certain features of CareWallet, you must:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Health Wallets</h2>
              <p className="text-gray-600 mb-4">When creating a health wallet, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Provide truthful information about the purpose of the wallet</li>
                <li>Use funds only for legitimate healthcare purposes</li>
                <li>Not use the platform for fraudulent or illegal activities</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contributions</h2>
              <p className="text-gray-600 mb-6">
                Contributions made through CareWallet are voluntary and non-refundable unless required by law. Contributors acknowledge that funds will be used by the wallet holder for healthcare-related expenses at verified pharmacies.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Fees</h2>
              <p className="text-gray-600 mb-6">
                CareWallet charges a platform fee of 3-5% on withdrawals to pharmacies. This fee covers payment processing, platform maintenance, and operational costs. Creating wallets and receiving contributions is free.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Withdrawals</h2>
              <p className="text-gray-600 mb-4">Withdrawals are subject to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>OTP verification for security</li>
                <li>Availability of funds in the wallet</li>
                <li>Verification of the receiving pharmacy</li>
                <li>Compliance with our fraud prevention measures</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Prohibited Activities</h2>
              <p className="text-gray-600 mb-4">You may not use CareWallet to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Engage in fraudulent, deceptive, or misleading activities</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Interfere with the operation of the platform</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the platform for money laundering or terrorist financing</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-600 mb-6">
                We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason at our discretion. Upon termination, any remaining funds will be handled in accordance with applicable laws.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                To the maximum extent permitted by law, OMNIHEALTH GROUP (Pty) Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of CareWallet.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-600 mb-6">
                These Terms shall be governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes shall be subject to the exclusive jurisdiction of the courts of South Africa.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-600 mb-6">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the platform. Continued use of CareWallet after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For questions about these Terms, please contact us:
              </p>
              <div className="bg-pink-50 rounded-xl p-6 text-gray-700">
                <p><strong>OMNIHEALTH GROUP (Pty) Ltd</strong></p>
                <p>30 Gesternte Road, Boksburg, 1459, Gauteng, South Africa</p>
                <p>Email: legal@carewallet.co.za</p>
                <p>CIPC Registration: 2025/330711/07</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
