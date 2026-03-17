'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Menu, X, ChevronDown, Wallet } from 'lucide-react';

const navItems = [
  { name: '首页', href: '/' },
  { name: 'BOX', href: '/box', icon: '🪙', highlight: true },
  { name: '合成', href: '/craft' },
  { name: '交易', hasDropdown: true, menu: 'trade' },
  { name: 'DAO', hasDropdown: true, menu: 'dao', icon: '🏛️', highlight: true },
  { name: '邀请', href: '/invite' },
  { name: '入驻', hasDropdown: true, menu: 'join' },
];

const dropdowns: Record<string, { name: string; href: string }[]> = {
  trade: [
    { name: 'NFT交易', href: '/market' },
    { name: '拍卖', href: '/auction' },
  ],
  dao: [
    { name: '社区提案', href: '/governance' },
    { name: 'Staking', href: '/mine' },
  ],
  join: [
    { name: '申请入驻', href: '/join' },
    { name: '创作', href: '/create' },
    { name: '个人主页', href: '/profile' },
    { name: '机构管理', href: '/institution' },
  ],
};

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [currentLang] = useState(languages[0]);
  const [searchOpen, setSearchOpen] = useState(false);

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
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={() => setDropdownOpen(item.menu || null)}
                    onMouseLeave={() => setDropdownOpen(null)}
                    className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                      item.highlight 
                        ? 'text-amber-400 font-bold' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.name}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ) : (
                  <Link 
                    href={item.href || '/'}
                    className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                      item.highlight 
                        ? 'text-amber-400 font-bold' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.hasDropdown && dropdownOpen === item.menu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-1 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden"
                      onMouseEnter={() => setDropdownOpen(item.menu || null)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {dropdowns[item.menu || '']?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <Link href="/announcements" className="relative p-2 text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Language */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-800 rounded-lg text-sm text-gray-400"
              >
                <span>{currentLang.flag}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 text-gray-300"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet - Simple Button */}
            <Link 
              href="/wallet-debug"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-500 hover:to-pink-500 transition-all text-sm"
            >
              <Wallet className="w-4 h-4" />
              <span>连接钱包</span>
            </Link>
            
            {/* Mobile Menu */}
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
                  key={item.name}
                  href={item.href || '#'}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    item.highlight 
                      ? 'text-amber-400 font-bold' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <span>{item.icon}</span>} {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
