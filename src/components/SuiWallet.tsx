'use client';

import { useState } from 'react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import { Wallet, LogOut } from 'lucide-react';
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
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm"
        >
          <Wallet className="w-4 h-4" />
          <span>{shortenAddress(wallet.account.address)}</span>
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
            <button
              onClick={() => {
                wallet.disconnect();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4" />
              断开连接
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <ConnectButton />
  );
}
