'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Coins, ShoppingCart, Landmark, User } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const navItems = [
  { key: 'nav.home', href: '/', icon: Home, fallback: 'Home' },
  { key: 'nav.box', href: '/box', icon: Coins, fallback: 'Box' },
  { key: 'nav.market', href: '/market', icon: ShoppingCart, fallback: 'Market' },
  { key: 'nav.staking', href: '/mine', icon: Landmark, fallback: 'Staking' },
  { key: 'nav.profile', href: '/profile', icon: User, fallback: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { tt } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-violet-500' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-violet-500/20' : ''}`} />
              <span className="text-[10px] font-medium">{tt(item.key, item.fallback)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
