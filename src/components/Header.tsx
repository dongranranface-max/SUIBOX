'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X, ChevronDown, Home, Coins, FlaskConical, ShoppingCart, Landmark, UserPlus, User, Ticket, Megaphone, Globe } from 'lucide-react';
import { SuiWalletButton } from './SuiWallet';
import { useWallet } from '@suiet/wallet-kit';

// 导航配置
const navItems = [
  { name: '首页', href: '/', icon: Home },
  { name: 'BOX', href: '/box', icon: Coins, highlight: true, badge: 'HOT' },
  { name: '合成', href: '/craft', icon: FlaskConical, badge: 'NEW' },
  { name: '交易', hasDropdown: true, menu: 'trade', icon: ShoppingCart },
  { name: 'DAO', hasDropdown: true, menu: 'dao', icon: Landmark, highlight: true },
  { name: '邀请', href: '/invite', icon: User, badge: 'FREE' },
  { name: '入驻', hasDropdown: true, menu: 'join', icon: UserPlus },
];

// 二级菜单
const dropdowns: Record<string, { name: string; href: string; icon?: any }[]> = {
  trade: [
    { name: 'NFT市场', href: '/market', icon: ShoppingCart },
    { name: '拍卖行', href: '/auction', icon: Ticket },
  ],
  dao: [
    { name: '社区治理', href: '/governance', icon: Megaphone },
    { name: '质押Staking', href: '/mine', icon: Landmark },
  ],
  join: [
    { name: '申请入驻', href: '/join' },
    { name: '创作', href: '/create' },
    { name: '个人主页', href: '/profile' },
    { name: '机构管理', href: '/institution' },
  ],
};

// 语言配置
const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export default function Header() {
  const wallet = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // 滚动检测
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/5' : 'bg-black/80 backdrop-blur-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative">
              <img 
                src="/suibox-logo.png" 
                alt="SUIBOX" 
                className="h-9 w-auto md:h-10 transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10 rounded-full" />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              SUIBOX
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={() => setDropdownOpen(item.menu || null)}
                    onMouseLeave={() => setDropdownOpen(null)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
                      item.highlight ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ) : (
                  <Link 
                    href={item.href || '/'}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
                      item.highlight ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                    {item.badge && (
                      <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-[8px] font-bold rounded-full ${
                        item.badge === 'HOT' ? 'bg-red-500 text-white' :
                        item.badge === 'NEW' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                      }`}>{item.badge}</span>
                    )}
                  </Link>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {item.hasDropdown && dropdownOpen === item.menu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-2 min-w-[160px] bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 overflow-hidden"
                      onMouseEnter={() => setDropdownOpen(item.menu || null)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {dropdowns[item.menu || '']?.map((sub) => (
                        <Link key={sub.href} href={sub.href} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                          {sub.icon && <sub.icon className="w-4 h-4" />}
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
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {/* Notifications with badge */}
            <div className="relative">
              <Link href="/announcements" className="flex items-center p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
              </Link>
            </div>

            {/* Language */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/5 rounded-lg text-sm text-gray-400 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">语言</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 overflow-hidden z-50"
                >
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="text-xs text-gray-500">选择语言</p>
                  </div>
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button key={lang.code} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Wallet */}
            <SuiWalletButton />

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
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
              className="lg:hidden overflow-hidden border-t border-white/5"
            >
              <nav className="py-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <>
                        <button 
                          onClick={() => setDropdownOpen(dropdownOpen === item.menu ? null : item.menu)}
                          className={`w-full px-4 py-3 text-sm flex items-center justify-between rounded-lg ${
                            item.highlight ? 'text-amber-400 font-medium' : 'text-gray-400'
                          }`}
                        >
                          <span className="flex items-center gap-2">{item.icon && <item.icon className="w-5 h-5" />}{item.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === item.menu ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen === item.menu && (
                          <div className="ml-4 pl-4 border-l border-gray-800 space-y-1">
                            {dropdowns[item.menu || '']?.map((sub) => (
                              <Link key={sub.href} href={sub.href} className="block px-4 py-2.5 text-sm text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(null); }}>
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href={item.href || '/'} className={`flex items-center gap-2 px-4 py-3 text-sm rounded-lg ${item.highlight ? 'text-amber-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`} onClick={() => setMobileMenuOpen(false)}>
                        {item.icon && <item.icon className="w-5 h-5" />}
                        {item.name}
                        {item.badge && <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badge === 'HOT' ? 'bg-red-500 text-white' : item.badge === 'NEW' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>{item.badge}</span>}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Language */}
                <div className="pt-4 pb-20 border-t border-white/5">
                  <p className="px-4 text-xs text-gray-500 mb-2">选择语言</p>
                  <div className="grid grid-cols-2 gap-2 px-4">
                    {languages.map((lang) => (
                      <button key={lang.code} className="flex items-center gap-2 py-2.5 px-3 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
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
