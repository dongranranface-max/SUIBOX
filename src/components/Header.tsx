'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, type ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X, ChevronDown, Home, Coins, FlaskConical, ShoppingCart, Landmark, UserPlus, User, Ticket, Megaphone, Globe } from 'lucide-react';
import { SuiWalletButton } from './SuiWallet';
import { useI18n } from '@/lib/i18n';

const navItems = [
  { key: 'nav.home', href: '/', icon: Home },
  { key: 'nav.box', href: '/box', icon: Coins, highlight: true, badge: 'HOT' },
  { key: 'nav.craft', href: '/craft', icon: FlaskConical, badge: 'NEW' },
  { key: 'nav.market', hasDropdown: true, menu: 'market', icon: ShoppingCart },
  { key: 'nav.stake', hasDropdown: true, menu: 'earn', icon: Landmark, highlight: true },
  { key: 'nav.invite', href: '/invite', icon: User, badge: 'FREE' },
];

const dropdowns: Record<string, { name: string; href: string; icon?: ComponentType<{ className?: string }> }[]> = {
  market: [
    { name: 'nav.market', href: '/market', icon: ShoppingCart },
    { name: 'nav.auction', href: '/auction', icon: Ticket },
  ],
  earn: [
    { name: 'nav.staking', href: '/mine', icon: Landmark },
    { name: 'nav.dao', href: '/governance', icon: Megaphone },
  ],
};

// 获取未读通知数量的函数
async function fetchNotificationCount(): Promise<number> {
  try {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    const notifications = data.data || data.notifications || [];
    
    // 获取已读列表
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    
    // 返回未读数量
    const unreadCount = notifications.filter((n: { id: string }) => !readIds.includes(n.id)).length;
    return unreadCount;
  } catch {
    return 0;
  }
}

// 标记通知为已读
function markNotificationsAsRead(notificationIds: string[]) {
  if (typeof window === 'undefined') return;
  
  const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
  const newReadIds = [...new Set([...readIds, ...notificationIds])];
  localStorage.setItem('readNotifications', JSON.stringify(newReadIds));
}

export default function Header() {
  const { languages, language, setLanguage, tt } = useI18n();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 获取通知数量
  useEffect(() => {
    async function loadNotificationCount() {
      const count = await fetchNotificationCount();
      setNotificationCount(count);
    }
    loadNotificationCount();
    
    // 监听通知已读事件
    const handleNotificationsRead = () => {
      loadNotificationCount();
    };
    window.addEventListener('notificationsRead', handleNotificationsRead);
    
    return () => window.removeEventListener('notificationsRead', handleNotificationsRead);
  }, []);

  // 关闭移动菜单
  const closeMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(null);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-purple-500/5' : 'bg-black/90 backdrop-blur-xl'
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
              <div key={item.key} className="relative">
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={() => setDropdownOpen(item.menu || null)}
                    onMouseLeave={() => setDropdownOpen(null)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                      item.highlight ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tt(item.key)}
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                ) : (
                  <Link 
                    href={item.href || '/'}
                    className={`relative px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${
                      item.highlight ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {tt(item.key)}
                    {item.badge && (
                      <span className={`ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        item.badge === 'HOT' ? 'bg-red-500 text-white' :
                        item.badge === 'NEW' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                      }`}>{item.badge}</span>
                    )}
                    {item.showCount && notificationCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                )}

                <AnimatePresence>
                  {item.hasDropdown && dropdownOpen === item.menu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-2 min-w-[180px] bg-gray-900/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                      onMouseEnter={() => setDropdownOpen(item.menu || null)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      <div className="px-3 py-2 border-b border-white/5">
                        <span className="text-xs text-gray-500">{tt(item.key)}</span>
                      </div>
                      {dropdowns[item.menu || '']?.map((sub) => (
                        <Link key={sub.href} href={sub.href} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                          {sub.icon && <sub.icon className="w-4 h-4 text-violet-400" />}
                          {tt(sub.name)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notifications Bell */}
            <Link href="/announcements" className="relative p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Link>

            {/* Language - Desktop */}
            <div 
              className="relative"
              onMouseEnter={() => setLangMenuOpen(true)}
              onMouseLeave={() => setLangMenuOpen(false)}
            >
              <button 
                className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-xl text-sm text-gray-300 hover:text-white transition-all duration-200"
              >
                <Globe className="w-5 h-5 text-violet-400" />
                <span className="hidden lg:inline">{tt('nav.language', 'Language')}</span>
                <span className="lg:hidden text-lg">{languages.find(l => l.code === language)?.flag}</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-60 ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50"
                >
                  <div className="px-3 py-2 border-b border-white/10">
                    <span className="text-xs text-gray-500">{tt('nav.language', 'Language')}</span>
                  </div>
                  {languages.map((lang) => (
                    <button 
                      key={lang.code} 
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 transition-all ${
                        language === lang.code ? 'text-violet-400 bg-violet-500/10' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>



            {/* Login Button */}
            {!isLoginPage && (
              <SuiWalletButton key={pathname} />
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
                  <div key={item.key}>
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
                            {tt(item.key)}
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
                                {tt(sub.name)}
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
                          {tt(item.key)}
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
                        onClick={() => setLanguage(lang.code)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all ${
                          language === lang.code
                            ? 'bg-violet-500/20 text-violet-300'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.code.toUpperCase()}</span>
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
