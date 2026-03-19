'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Wallet, LogOut, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ZkLoginUser {
  provider: string;
  oauthId: string;
  email: string;
  name: string;
  picture: string;
  suiAddress: string;
  createdAt: string;
}

function shortenAddress(addr: string): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function SuiWalletButton() {
  const { address, connected, disconnect } = useWallet();
  const [showMenu, setShowMenu] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zkUser, setZkUser] = useState<ZkLoginUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setZkUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyAddress = async (addr: string) => {
    if (addr) {
      await navigator.clipboard.writeText(addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  // Loading state
  if (loading) {
    return (
      <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
      </button>
    );
  }

  // zkLogin user logged in
  if (zkUser?.suiAddress) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {zkUser.picture ? (
            <img src={zkUser.picture} alt={zkUser.name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs">
              {zkUser.name?.charAt(0) || '👤'}
            </div>
          )}
          <span className="hidden sm:inline">{zkUser.name}</span>
          <span className="sm:hidden">{shortenAddress(zkUser.suiAddress)}</span>
        </button>
        
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 overflow-hidden z-[100]"
          >
            {/* 用户信息 */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-gray-500 mb-1">zkLogin 账户</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{zkUser.name}</span>
                <span className="text-xs px-2 py-0.5 bg-violet-600/30 text-violet-400 rounded-full capitalize">
                  {zkUser.provider}
                </span>
              </div>
            </div>

            {/* 地址显示 */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-gray-500 mb-1">Sui 地址</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white">{shortenAddress(zkUser.suiAddress)}</span>
                <button 
                  onClick={() => copyAddress(zkUser.suiAddress)}
                  className="p-1 hover:bg-white/5 rounded"
                >
                  {copied ? <Copy className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* 菜单选项 */}
            <div className="py-2">
              <a href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                <Wallet className="w-4 h-4" />
                个人主页
              </a>
              <a href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                <ExternalLink className="w-4 h-4" />
                我的资产
              </a>
            </div>

            {/* 退出登录 */}
            <div className="border-t border-white/10 py-2">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Wallet connected (traditional wallet)
  if (connected && address) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Wallet className="w-4 h-4" />
          <span>{shortenAddress(address)}</span>
        </button>
        
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 overflow-hidden z-[100]"
          >
            {/* 地址显示 */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-gray-500 mb-1">钱包地址</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white">{shortenAddress(address)}</span>
                <button 
                  onClick={() => copyAddress(address)}
                  className="p-1 hover:bg-white/5 rounded"
                >
                  {copied ? <Copy className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* 菜单选项 */}
            <div className="py-2">
              <a href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                <Wallet className="w-4 h-4" />
                个人主页
              </a>
              <a href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                <ExternalLink className="w-4 h-4" />
                我的资产
              </a>
            </div>

            {/* 断开连接 */}
            <div className="border-t border-white/10 py-2">
              <button 
                onClick={() => disconnect()}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                断开连接
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Not connected - show connect button
  return (
    <button 
      onClick={() => setShowConnectModal(true)}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
    >
      <Wallet className="w-4 h-4" />
      <span>连接钱包</span>
    </button>
  );
}
