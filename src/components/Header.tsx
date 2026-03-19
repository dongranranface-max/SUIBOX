'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X, ChevronDown, Home, Coins, FlaskConical, ShoppingCart, Landmark, UserPlus, User, Ticket, Megaphone, Globe } from 'lucide-react';
import { SuiWalletButton } from './SuiWallet';

const navItems = [
  { name: '首页', href: '/', icon: Home },
  { name: 'BOX', href: '/box', icon: Coins, highlight: true, badge: 'HOT' },
  { name: '合成', href: '/craft', icon: FlaskConical, badge: 'NEW' },
  { name: '交易', hasDropdown: true, menu: 'trade', icon: ShoppingCart },
  { name: 'DAO', hasDropdown: true, menu: 'dao', icon: Landmark, highlight: true },
  { name: '邀请', href: '/invite', icon: User, badge: 'FREE' },
  { name: '入驻', hasDropdown: true, menu: 'join', icon: UserPlus },
];

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

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭移动菜单
  const closeMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(null);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'bg-black/90 backdrop-blur-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative">
              <img 
                src="/suibox-logo.png" 
                alt="SUIBOX" 
                className="h-8 w-auto sm:h-9 md:h-10 transition-transform duration-200 group-hover:scale-105" 
              />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              SUIBOX
            </span>
          </Link>

          {/* Desktop Nav - 桌面端 */}
          <nav className="hidden md:flex items-center gap-0.5">
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
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Notifications */}
            <Link href="/announcements" className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Language - Desktop */}
            <div className="hidden sm:block relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-2 hover:bg-white/5 rounded-lg text-sm text-gray-400 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden lg:inline">语言</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-36 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 overflow-hidden z-50"
                >
                  {languages.map((lang) => (
                    <button key={lang.code} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>



            {/* Login Button - Desktop only */}
            {!isLoginPage && (
              <a 
                href="/login" 
                className="hidden sm:block px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                登录
              </a>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="菜单"
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
              className="md:hidden overflow-hidden border-t border-white/5 bg-black"
            >
              <nav className="py-2 space-y-0.5 max-h-[70vh] overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <>
                        <button 
                          onClick={() => setDropdownOpen(dropdownOpen === item.menu ? null : item.menu)}
                          className={`w-full px-3 py-2.5 text-sm flex items-center justify-between rounded-lg ${
                            item.highlight ? 'text-amber-400 font-medium' : 'text-gray-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {item.icon && <item.icon className="w-4 h-4" />}
                            {item.name}
                            {item.badge && <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                              item.badge === 'HOT' ? 'bg-red-500 text-white' :
                              item.badge === 'NEW' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                            }`}>{item.badge}</span>}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === item.menu ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen === item.menu && (
                          <div className="ml-3 pl-3 border-l-2 border-gray-800 space-y-0.5">
                            {dropdowns[item.menu || '']?.map((sub) => (
                              <Link 
                                key={sub.href} 
                                href={sub.href} 
                                className="block px-3 py-2 text-xs text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                onClick={closeMenu}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link 
                        href={item.href || '/'} 
                        className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 transition-all"
                        onClick={closeMenu}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span className={item.highlight ? 'text-amber-400 font-medium' : 'text-gray-300'}>
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className={`ml-auto px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                            item.badge === 'HOT' ? 'bg-red-500 text-white' :
                            item.badge === 'NEW' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                          }`}>{item.badge}</span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Language - Compact */}
                <div className="pt-2 pb-1 border-t border-white/5">
                  <div className="flex gap-1 px-3">
                    {languages.map((lang) => (
                      <button 
                        key={lang.code} 
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/5 rounded-lg text-xs text-gray-400 hover:text-white"
                      >
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
