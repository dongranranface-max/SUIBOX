'use client';

import { useState } from 'react';
import { Menu, X, ChevronDown, Bell, Wallet, Globe, Home, Gift, Sparkles, Gem, Landmark, Users, Building2, User, Headphones } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <>
      {/* 移动端导航栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-white/10 safe-area-top">
        <div className="flex items-center justify-between px-3 h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎁</span>
            </div>
            <span className="font-bold text-sm">SUIBOX</span>
          </Link>

          {/* 右侧工具 */}
          <div className="flex items-center gap-1">
            <Link href="/wallet" className="p-2 rounded-lg hover:bg-white/10">
              <Wallet className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition-transform"
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
              className="fixed top-12 right-0 bottom-0 w-[280px] bg-gray-900 z-50 md:hidden overflow-y-auto safe-area-bottom"
            >
              <div className="p-3 space-y-1">
                {/* 导航项 */}
                {[
                  { key: 'home', label: '首页', href: '/', icon: Home },
                  { key: 'box', label: '🪙BOX', href: '/box', highlight: true },
                  { key: 'craft', label: '合成', href: '/craft', icon: Sparkles },
                  { key: 'market', label: '交易', href: '/market', icon: Gem },
                  { key: 'dao', label: '🏛️DAO', href: '/governance', highlight: true },
                  { key: 'invite', label: '邀请', href: '/invite', icon: Users },
                  { key: 'join', label: '入驻', href: '/join', icon: Building2 },
                  { key: 'profile', label: '我的主页', href: '/profile', icon: User },
                  { key: 'support', label: '客服工单', href: '/support', icon: HeadPhones },
                ].map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                      pathname === item.href 
                        ? 'bg-violet-600 text-white' 
                        : item.highlight
                        ? 'text-amber-400 font-bold hover:bg-white/10'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.label}
                  </Link>
                ))}

                {/* 分割线 */}
                <div className="border-t border-white/10 my-3" />

                {/* 快捷链接 */}
                {[
                  { label: '排行榜', href: '/ranking', emoji: '🏆' },
                  { label: '挖矿', href: '/mine', emoji: '⛏️' },
                  { label: '质押', href: '/stake', emoji: '📦' },
                  { label: '安全中心', href: '/security', emoji: '🛡️' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-white/10"
                  >
                    <span>{item.emoji}</span>
                    {item.label}
                  </Link>
                ))}

                {/* 底部信息 */}
                <div className="mt-6 p-3 bg-white/5 rounded-xl">
                  <div className="text-xs text-gray-500">
                    <p>SUIBOX v1.0.0</p>
                    <p className="mt-1">SUI区块链NFT盲盒平台</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 底部安全区域 */}
      <div className="md:hidden h-12" />
    </>
  );
}
