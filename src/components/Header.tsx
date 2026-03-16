'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Wallet, Menu, X, Bell, Globe } from 'lucide-react';
import { SuiWalletButton } from '@/components/SuiWallet';

const navItems = [
  { href: '/', label: '首页', highlight: false },
  { href: '/box', label: '🎁 盲盒', highlight: false },
  { href: '/craft', label: '⚗️ 合成', highlight: false },
  { href: '/market', label: '💰 交易', highlight: false },
  { href: '/governance', label: '🏛️ DAO', highlight: false },
  { href: '/invite', label: '邀请', highlight: false },
  { href: '/join', label: '入驻', highlight: false },
];

const languages = [
  { code: 'CN', name: '中文', flag: '🇨🇳' },
  { code: 'EN', name: 'English', flag: '🇺🇸' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);

  const switchLanguage = (code: string) => {
    const lang = languages.find(l => l.code === code);
    if (lang) {
      setCurrentLang(lang);
      setLangMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            SUIBOX
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  item.highlight 
                    ? 'text-amber-400 font-bold hover:scale-105' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* 通知 */}
            <button className="relative p-2 text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 语言切换 */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-800 rounded-lg text-sm text-gray-400"
              >
                <span>{currentLang.flag}</span>
                <Globe className="w-4 h-4" />
              </button>
              
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 ${
                        currentLang.code === lang.code ? 'text-white bg-gray-700' : 'text-gray-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 钱包 */}
            <SuiWalletButton />
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    item.highlight 
                      ? 'text-amber-400 font-bold' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
