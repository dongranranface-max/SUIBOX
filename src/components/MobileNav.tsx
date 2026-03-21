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
    { label: '开盲盒', href: '/box', highlight: true },
    { label: '合成', href: '/craft' },
    { label: '市场', href: '/market' },
    { label: 'Staking', href: '/mine' },
    { label: 'DAO', href: '/governance' },
    { label: '邀请', href: '/invite' },
    { label: '个人主页', href: '/profile' },
  ];

  return (
    <>
      {/* 移动端导航栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-black border-b border-white/10">
        <div className="flex items-center justify-between px-2 h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 flex-shrink-0">
            <span className="text-lg">🎁</span>
            <span className="font-bold text-sm">SUIBOX</span>
          </Link>
          
          {/* Nav Items */}
          <nav className="flex items-center gap-0.5 flex-1 justify-center">
            <Link href="/box" className="px-2 py-1 text-xs text-amber-400 font-medium">盲盒</Link>
            <Link href="/craft" className="px-2 py-1 text-xs text-amber-400 font-medium">合成</Link>
            <Link href="/market" className="px-2 py-1 text-xs text-gray-300 flex items-center gap-0.5">市场</Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Link href="/announcements" className="p-1.5 relative">
              <span className="text-base">🔔</span>
              <span className="absolute top-0.5 right-0 w-2.5 h-2.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">3</span>
            </Link>
            <Link href="/profile" className="p-1.5">
              <span className="text-base">👤</span>
            </Link>
            <Link href="/wallet" className="p-1.5">
              <span className="text-base">👛</span>
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="p-1.5">
            <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
          </button>
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

          {/* Bottom Menu */}
          <div className="border-t border-white/10">
            <Link href="/support" className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white">
              <span>🎫</span>
              <span>客服支持</span>
            </Link>
            <Link href="/security" className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white">
              <span>🛡️</span>
              <span>安全中心</span>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-auto p-4 border-t border-white/10 text-xs text-gray-500">
            <p>SUIBOX v1.0</p>
            <p>SUI区块链NFT平台</p>
          </div>
        </div>
      </div>

      {/* 底部占位 */}
      <div className="md:hidden h-12" />
    </>
  );
}
