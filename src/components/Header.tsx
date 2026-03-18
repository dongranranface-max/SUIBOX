'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Menu, X, ChevronDown, Home, Coins, FlaskConical, ShoppingCart, Landmark, UserPlus, User } from 'lucide-react';
import { SuiWalletButton } from './SuiWallet';

const navItems = [
  { name: '首页', href: '/', icon: Home },
  { name: 'BOX', href: '/box', icon: Coins, highlight: true },
  { name: '合成', href: '/craft', icon: FlaskConical },
  { name: '交易', hasDropdown: true, menu: 'trade', icon: ShoppingCart },
  { name: 'DAO', hasDropdown: true, menu: 'dao', icon: Landmark, highlight: true },
  { name: '邀请', href: '/invite', icon: User },
  { name: '入驻', hasDropdown: true, menu: 'join', icon: UserPlus },
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

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* Logo - 放大1.3倍 + 旋转发光特效 */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img 
                src="/suibox-logo.png" 
                alt="SUIBOX" 
                className="h-10 w-auto md:h-12 transition-transform duration-500 group-hover:rotate-12" 
              />
              {/* 旋转光晕 */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500 group-hover:animate-spin" />
              {/* 底层发光 */}
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/50 to-pink-500/50 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-full" />
            </div>
            <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              SUIBOX
            </span>
          </Link>

          {/* Desktop Nav - 隐藏移动端 */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={() => setDropdownOpen(item.menu || null)}
                    onMouseLeave={() => setDropdownOpen(null)}
                    className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                      item.highlight 
                        ? 'text-amber-400 font-bold' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ) : (
                  <Link 
                    href={item.href || '/'}
                    className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                      item.highlight 
                        ? 'text-amber-400 font-bold' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {item.hasDropdown && dropdownOpen === item.menu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-1 w-40 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 overflow-hidden"
                      onMouseEnter={() => setDropdownOpen(item.menu || null)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {dropdowns[item.menu || '']?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
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
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search - PC端 */}
            <button className="hidden md:flex p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <Link href="/announcements" className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Language - PC端 */}
            <div className="hidden md:block relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2 py-1.5 hover:bg-white/5 rounded-lg text-sm text-gray-400 transition-colors"
              >
                <span>{currentLang.flag}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {langMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-1 w-32 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/10 text-gray-300 transition-colors"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Wallet */}
            <div className="hidden md:block">
              <SuiWalletButton />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10"
            >
              <nav className="py-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <>
                        <button 
                          onClick={() => setDropdownOpen(dropdownOpen === item.menu ? null : item.menu)}
                          className={`w-full px-4 py-3 text-sm flex items-center justify-between ${
                            item.highlight 
                              ? 'text-amber-400 font-bold' 
                              : 'text-gray-400'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {item.icon && <item.icon className="w-5 h-5" />}
                            {item.name}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === item.menu ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Mobile Dropdown */}
                        <AnimatePresence>
                          {dropdownOpen === item.menu && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 pl-4 border-l border-gray-700 space-y-1"
                            >
                              {dropdowns[item.menu || '']?.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                  onClick={() => { setMobileMenuOpen(false); setDropdownOpen(null); }}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link 
                        href={item.href || '/'}
                        className={`flex items-center gap-2 px-4 py-3 text-sm ${
                          item.highlight 
                            ? 'text-amber-400 font-bold' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Wallet Button */}
                <div className="pt-4 px-4 pb-20">
                  <SuiWalletButton />
                </div>
                
                {/* Mobile Language Switcher */}
                <div className="px-4 pb-4 border-t border-white/10 pt-4">
                  <p className="text-xs text-gray-500 mb-2">语言 / Language</p>
                  <div className="flex gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="flex-1 py-2 px-3 bg-gray-800 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        {lang.flag} {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
