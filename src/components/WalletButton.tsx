'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';

export function WalletButton() {
  const wallet = useWallet();
  const [showMenu, setShowMenu] = useState(false);

  if (wallet.loading) {
    return (
      <button className="px-4 py-2 bg-gray-700 rounded-lg" disabled>
        <span className="text-sm text-gray-400">连接中...</span>
      </button>
    );
  }

  if (wallet.connected && wallet.address) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/60 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-lg text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-white">{wallet.formatAddress(wallet.address)}</span>
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="text-xs text-gray-500">余额</div>
              <div className="font-medium">{(Number(wallet.balance) / 1000000000).toFixed(4)} SUI</div>
            </div>
            <button
              onClick={() => {
                wallet.disconnect();
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-700 text-red-400 transition-colors"
            >
              断开连接
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button 
      onClick={wallet.connect}
      className="px-4 py-2 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-pink-600/80 hover:from-blue-500/90 hover:via-purple-500/90 hover:to-pink-500/90 backdrop-blur-md rounded-lg text-sm text-white font-medium transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-105 border border-white/10 hover:border-white/30"
    >
      连接钱包
    </button>
  );
}
