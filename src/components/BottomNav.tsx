'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Coins, ShoppingCart, Landmark, User } from 'lucide-react';

const navItems = [
  { name: '首页', href: '/', icon: Home },
  { name: '开盲盒', href: '/box', icon: Coins },
  { name: '市场', href: '/market', icon: ShoppingCart },
  { name: '收益', href: '/mine', icon: Landmark },
  { name: '我的', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-violet-500' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-violet-500/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
