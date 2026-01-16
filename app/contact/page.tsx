'use client'

import { useState } from 'react'
import { Heart, Mail, Phone, MapPin, Send, Building2 } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@carewallet.co.za',
      href: 'mailto:hello@carewallet.co.za'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+27 12 345 6789',
      href: 'tel:+27123456789'
    },
    {
      icon: MapPin,
      label: 'Address',
      value: '30 Gesternte Road, Boksburg, 1459, Gauteng, South Africa',
      href: null
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
              <span>Get in Touch</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              We&apos;d Love to Hear From You
            </h1>
            <p className="text-xl text-gray-600">
              Have questions about CareWallet? Want to partner with us? We&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label="Your Name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Subject"
                      type="text"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-200 min-h-[150px]"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-pink-600 hover:text-pink-700 transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-gray-600">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-8 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <Building2 className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Company Details</h3>
                </div>
                <div className="space-y-2 text-pink-100">
                  <p><span className="text-white font-medium">Legal Name:</span> OMNIHEALTH GROUP (Pty) Ltd</p>
                  <p><span className="text-white font-medium">CIPC Registration:</span> 2025/330711/07</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium text-gray-900">Monday - Friday:</span> 8:00 AM - 5:00 PM</p>
                  <p><span className="font-medium text-gray-900">Saturday:</span> 9:00 AM - 1:00 PM</p>
                  <p><span className="font-medium text-gray-900">Sunday:</span> Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
