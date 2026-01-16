import React from 'react';
import Link from 'next/link';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-xl">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                HealthWallet
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Making healthcare accessible through community support and transparent funding.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/signup" className="hover:text-pink-400 transition-colors">
                  Create Wallet
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-pink-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-pink-400 transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-pink-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-pink-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-pink-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400" />
                <a href="mailto:hello@healthwallet.co.za" className="hover:text-pink-400 transition-colors">
                  hello@healthwallet.co.za
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-400" />
                <a href="tel:+27123456789" className="hover:text-pink-400 transition-colors">
                  +27 12 345 6789
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-400 mt-1" />
                <span>Johannesburg, South Africa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} HealthWallet. All rights reserved.</p>
            <p>Made with ❤️ for healthier communities</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
