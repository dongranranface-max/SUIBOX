'use client';

import { useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConnectModal } from '@suiet/wallet-kit';

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function SuiWalletButton() {
  const { address, connected, disconnect } = useWallet();
  const [showMenu, setShowMenu] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
                  onClick={copyAddress}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="复制地址"
                >
                  {copied ? (
                    <span className="text-green-400 text-xs">已复制!</span>
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 在Explorer查看 */}
            <a 
              href={`https://suiscan.xyz/devnet/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <ExternalLink className="w-4 h-4" />
              在 Explorer 查看
            </a>

            {/* 断开连接 */}
            <button
              onClick={() => {
                disconnect();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              断开连接
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // 未连接 - 显示连接弹窗
  return (
    <>
      <button
        onClick={() => setShowConnectModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Wallet className="w-4 h-4" />
        <span>连接钱包</span>
      </button>
      <ConnectModal 
        open={showConnectModal} 
        onOpenChange={setShowConnectModal}
      />
    </>
  );
}
