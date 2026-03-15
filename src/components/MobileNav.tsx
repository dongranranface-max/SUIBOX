'use client';

import { useState } from 'react';
import { Menu, X, ChevronDown, Sparkles, Hexagon, Landmark, Users, Gift, Bell, Wallet, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 导航项配置
const navItems = [
  { key: 'home', label: '首页', href: '/', icon: '🏠' },
  { key: 'box', label: '🪙BOX', href: '/box', highlight: true },
  { key: 'craft', label: '合成', href: '/craft', icon: '⚗️' },
  { key: 'market', label: '交易', href: '/market', icon: '💎' },
  { key: 'dao', label: '🏛️DAO', href: '/governance', highlight: true, dropdown: [
    { label: '社区提案', href: '/governance' },
    { label: 'Staking', href: '/stake' },
  ]},
  { key: 'invite', label: '邀请', href: '/invite', icon: '🤝' },
  { key: 'join', label: '入驻', href: '/join', icon: '🏢' },
];

// 右侧工具栏
const toolItems = [
  { key: 'notification', label: '通知', href: '/notifications', icon: Bell },
  { key: 'wallet', label: '钱包', href: '/wallet', icon: Wallet },
  { key: 'language', label: '语言', href: '#', icon: Globe, action: 'language' },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // 切换下拉菜单
  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <>
      {/* 移动端导航栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-white/10 safe-area-top">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎁</span>
            </div>
            <span className="font-bold text-lg">SUIBOX</span>
          </Link>

          {/* 右侧工具 */}
          <div className="flex items-center gap-2">
            <Link href="/wallet" className="p-2 rounded-lg hover:bg-white/10">
              <Wallet className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition-transform"
              aria-label="菜单"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单抽屉 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* 菜单内容 */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-14 right-0 bottom-0 w-[280px] bg-gray-900 z-50 md:hidden overflow-y-auto safe-area-bottom"
            >
              <div className="p-4 space-y-2">
                {/* 导航项 */}
                {navItems.map((item) => (
                  <div key={item.key}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(item.key)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                            pathname === item.href ? 'bg-violet-600 text-white' : 'hover:bg-white/10'
                          } ${item.highlight ? 'text-amber-400 font-bold' : ''}`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.key ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* 下拉菜单 */}
                        <AnimatePresence>
                          {activeDropdown === item.key && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden ml-4 mt-1"
                            >
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={() => setIsOpen(false)}
                                  className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 rounded-xl transition-colors ${
                          pathname === item.href ? 'bg-violet-600 text-white' : 'hover:bg-white/10'
                        } ${item.highlight ? 'text-amber-400 font-bold' : ''}`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* 分割线 */}
                <div className="border-t border-white/10 my-4" />

                {/* 快捷链接 */}
                <div className="space-y-1">
                  <Link href="/ranking" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10">
                    <span>🏆</span> 排行榜
                  </Link>
                  <Link href="/mine" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10">
                    <span>⛏️</span> 挖矿
                  </Link>
                  <Link href="/box-stake" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10">
                    <span>📦</span> 质押
                  </Link>
                </div>

                {/* 底部信息 */}
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <div className="text-sm text-gray-400">
                    <p>SUIBOX v1.0.0</p>
                    <p className="mt-1">基于 SUI 区块链</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 底部安全区域 */}
      <div className="md:hidden h-14" />
    </>
  );
}
