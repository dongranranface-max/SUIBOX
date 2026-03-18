'use client';

import { useState } from 'react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import { Wallet, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import '@suiet/wallet-kit/style.css';

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function SuiWalletButton() {
  const wallet = useWallet();
  const [showMenu, setShowMenu] = useState(false);

  if (wallet.connecting) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm">
        <span>连接中...</span>
      </button>
    );
  }

  if (wallet.connected && wallet.account) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Wallet className="w-4 h-4" />
          <span>{shortenAddress(wallet.account.address)}</span>
        </button>
        
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-40 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 overflow-hidden z-[100]"
          >
            <button
              onClick={() => {
                wallet.disconnect();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              断开连接
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <ConnectButton />
  );
}
