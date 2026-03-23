'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, LogOut, Copy, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

function shortenAddress(addr: string): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function SuiWalletButton() {
  const pathname = usePathname();
  const { tt } = useI18n();
  const { address, connected, disconnect } = useWallet();
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zkUser, setZkUser] = useState<{name?: string; picture?: string; provider?: string; suiAddress?: string} | null>(null);

  // 获取 zkLogin 用户信息
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.user) {
          setZkUser(data.user);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
    
    // 页面可见时才刷新
    const handleVisibility = () => {
      if (!document.hidden) fetchSession();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    
    // 减少轮询频率（10秒）
    const interval = setInterval(fetchSession, 10000);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  // 判断登录状态：zkLogin用户 或 钱包连接
  const hasZkLogin = !!zkUser?.suiAddress;
  const hasWallet = !!address && connected;
  const isLoggedIn = hasZkLogin || hasWallet;
  
  // 显示信息
  const displayAddress = zkUser?.suiAddress || address || '';
  const displayName = zkUser?.name || (address ? shortenAddress(address) : '');

  const copyAddress = async (addr: string) => {
    if (addr) {
      await navigator.clipboard.writeText(addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 退出登录
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    disconnect();
    window.location.reload();
  };

  // Loading
  if (loading) {
    return (
      <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
      </button>
    );
  }

  // 已登录 - 显示用户信息
  if (isLoggedIn) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {zkUser?.picture ? (
            <img src={zkUser.picture} alt={displayName} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs text-white font-bold">
              {(displayName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <span className="hidden sm:inline text-white font-medium">{displayName || shortenAddress(displayAddress)}</span>
          <span className="sm:hidden text-white font-medium">{shortenAddress(displayAddress)}</span>
        </button>
        
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 overflow-hidden z-[100]"
          >
            {/* 用户信息 */}
            {hasZkLogin && zkUser && (
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-xs text-gray-500 mb-1">{zkUser.provider || 'zkLogin'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{zkUser.name}</span>
                </div>
              </div>
            )}

            {/* 地址 */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-gray-500 mb-1">{tt('profile.address', 'Address')}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white">{shortenAddress(displayAddress)}</span>
                <button onClick={() => copyAddress(displayAddress)} className="p-1 hover:bg-white/5 rounded">
                  {copied ? <Copy className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* 菜单 */}
            <div className="py-2">
              <Link href="/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                <Wallet className="w-4 h-4" />
                {tt('nav.profile', 'Profile')}
              </Link>
              <Link href="/wallet" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                <Wallet className="w-4 h-4" />
                {tt('home.connectWallet', 'Wallet')}
              </Link>
            </div>

            {/* 退出 */}
            <div className="border-t border-white/10 py-2">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                {tt('nav.logout', 'Logout')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // 未登录 - 显示 Login 按钮
  const loginUrl = pathname === '/login' ? '/login' : `/login?redirect=${encodeURIComponent(pathname)}`;
  
  return (
    <Link 
      href={loginUrl}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity text-white"
    >
      <Wallet className="w-4 h-4" />
      <span>Login</span>
    </Link>
  );
}
