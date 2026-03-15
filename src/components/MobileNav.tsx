'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 关闭菜单当页面切换
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // 防止滚动穿透
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { label: '🏠 首页', href: '/' },
    { label: '🎁 盲盒', href: '/box', highlight: true },
    { label: '⚗️ 合成', href: '/craft' },
    { label: '💎 交易', href: '/market' },
    { label: '🏛️ DAO', href: '/governance', highlight: true },
    { label: '🤝 邀请', href: '/invite' },
    { label: '🏢 入驻', href: '/join' },
    { label: '👤 我的主页', href: '/profile' },
    { label: '🎫 客服工单', href: '/support' },
  ];

  const quickLinks = [
    { label: '🏆 排行榜', href: '/ranking' },
    { label: '⛏️ 挖矿', href: '/mine' },
    { label: '📦 质押', href: '/stake' },
    { label: '🛡️ 安全中心', href: '/security' },
  ];

  return (
    <>
      {/* 移动端导航栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-black border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <span className="font-bold">SUIBOX</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link href="/wallet" className="p-2">
              <span className="text-lg">👛</span>
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 遮罩层 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[90] bg-black/70 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div className={`fixed top-12 right-0 bottom-0 w-64 bg-gray-900 z-[95] md:hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-y-auto pb-20">
          {/* 主导航 */}
          <nav className="flex-1 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 border-b border-white/5 ${
                  pathname === item.href 
                    ? 'bg-violet-600 text-white'
                    : item.highlight
                    ? 'text-amber-400 font-semibold'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 快捷链接 */}
          <div className="border-t border-white/10 p-4">
            <div className="text-xs text-gray-500 mb-2">快捷入口</div>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-400 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 底部 */}
          <div className="p-4 border-t border-white/10 text-xs text-gray-500">
            <p>SUIBOX v1.0.0</p>
            <p>SUI区块链NFT盲盒</p>
          </div>
        </div>
      </div>

      {/* 底部占位 */}
      <div className="md:hidden h-12" />
    </>
  );
}
