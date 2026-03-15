'use client';

import { useSuiWallet } from '@/hooks/useSuiWallet';
import { SUI_CONFIG } from '@/config/sui';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

export function SuiWalletButton() {
  const { address, connected, connecting, connect, disconnect } = useSuiWallet();

  const shortAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  if (connecting) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>连接中...</span>
      </button>
    );
  }

  if (connected && address) {
    return (
      <button 
        onClick={disconnect}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-500 hover:to-pink-500 transition-all"
      >
        <Wallet className="w-4 h-4" />
        <span>{shortAddress}</span>
        <LogOut className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button 
      onClick={connect}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-500 hover:to-pink-500 transition-all"
    >
      <Wallet className="w-4 h-4" />
      <span>连接钱包</span>
    </button>
  );
}

export { useSuiWallet } from '@/hooks/useSuiWallet';
