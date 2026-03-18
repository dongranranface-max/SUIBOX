'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Menu, X, ChevronDown, Home, Coins, FlaskConical, ShoppingCart, Landmark, UserPlus, User, Ticket, TrendingUp, Megaphone } from 'lucide-react';
import { SuiWalletButton } from './SuiWallet';

// 导航配置
const navItems = [
  { name: '首页', href: '/', icon: Home },
  { name: 'BOX', href: '/box', icon: Coins, highlight: true, badge: 'HOT' },
  { name: '合成', href: '/craft', icon: FlaskConical, badge: 'NEW' },
  { name: '交易', hasDropdown: true, menu: 'trade', icon: ShoppingCart },
  { name: 'DAO', hasDropdown: true, menu: 'dao', icon: Landmark, highlight: true },
  { name: '邀请', href: '/invite', icon: User, badge: 'FREE' },
  { name: '入驻', hasDropdown: true, menu: 'join', icon: UserPlus },
  { name: 'Ranking', href: '/ranking', icon: TrendingUp },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // 简化的导航（平板显示）
  const simpleNavItems = navItems.filter(item => !item.hasDropdown && !item.badge);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* Logo - 3D旋转特效 */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative">
              <img 
                src="/suibox-logo.png" 
                alt="SUIBOX" 
                className="h-9 w-auto md:h-11 transition-all duration-500 group-hover:rotate-y-180"
                style={{ transformStyle: 'preserve-3d' }}
              />
              {/* 3D光晕效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500 animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/50 to-pink-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 rounded-full" />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              SUIBOX
            </span>
          </Link>

          {/* Desktop Nav - 大屏幕 */}
          <nav className="hidden xl:flex items-center gap-0.5 mx-4">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={() => setDropdownOpen(item.menu || null)}
                    onMouseLeave={() => setDropdownOpen(null)}
                    className={`px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center gap-1.5 ${
                      item.highlight 
                        ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link 
                    href={item.href || '/'}
                    className={`relative px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center gap-1.5 ${
                      item.highlight 
                        ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                    {item.badge && (
                      <span className={`absolute -top-1.5 -right-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                        item.badge === 'HOT' ? 'bg-red-500 text-white' :
                        item.badge === 'NEW' ? 'bg-green-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {item.hasDropdown && dropdownOpen === item.menu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 min-w-[180px] bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                      onMouseEnter={() => setDropdownOpen(item.menu || null)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {dropdowns[item.menu || '']?.map((sub, i) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="flex items-center gap-3 px-4 py-3.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all first:rounded-t-2xl last:rounded-b-2xl"
                        >
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
            {/* Search - PC */}
            <button className="hidden md:flex p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <Link href="/announcements" className="relative p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </Link>

            {/* Language - PC */}
            <div className="hidden md:block relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 hover:bg-white/5 rounded-xl text-sm text-gray-400 transition-all"
              >
                <span>🇨🇳</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {langMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-36 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Wallet - PC */}
            <div className="hidden md:block">
              <SuiWalletButton />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
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
              className="md:hidden overflow-hidden border-t border-white/5"
            >
              <nav className="py-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <>
                        <button 
                          onClick={() => setDropdownOpen(dropdownOpen === item.menu ? null : item.menu)}
                          className={`w-full px-4 py-3.5 text-sm flex items-center justify-between rounded-xl ${
                            item.highlight ? 'text-amber-400 font-medium' : 'text-gray-400'
                          }`}
                        >
                          <span className="flex items-center gap-3">
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
                              className="ml-4 pl-4 border-l border-gray-800 space-y-1"
                            >
                              {dropdowns[item.menu || '']?.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                  onClick={() => { setMobileMenuOpen(false); setDropdownOpen(null); }}
                                >
                                  {sub.icon && <sub.icon className="w-4 h-4" />}
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
                        className={`flex items-center gap-3 px-4 py-3.5 text-sm rounded-xl ${
                          item.highlight ? 'text-amber-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        {item.name}
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            item.badge === 'HOT' ? 'bg-red-500 text-white' :
                            item.badge === 'NEW' ? 'bg-green-500 text-white' :
                            'bg-amber-500 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Wallet */}
                <div className="pt-4 pb-24">
                  <div className="px-4">
                    <SuiWalletButton />
                  </div>
                </div>
                
                {/* Mobile Language */}
                <div className="px-4 pb-4 border-t border-white/5 pt-4">
                  <p className="text-xs text-gray-600 mb-2">语言 / Language</p>
                  <div className="flex gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="flex-1 py-2.5 bg-white/5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
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
