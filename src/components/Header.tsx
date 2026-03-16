'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Wallet, Menu, X } from 'lucide-react';
import { SuiWalletButton } from '@/components/SuiWallet';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/box', label: '🎁 盲盒' },
  { href: '/craft', label: '⚗️ 合成' },
  { href: '/market', label: '💰 交易' },
  { href: '/governance', label: '🏛️ DAO' },
  { href: '/invite', label: '邀请' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            SUIBOX
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <SuiWalletButton />
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            {navItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href}
                className="block py-2 text-gray-400 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
