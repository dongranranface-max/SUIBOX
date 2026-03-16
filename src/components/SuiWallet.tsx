'use client';

import { useWallet } from '@/providers/WalletProvider';
import { Wallet, LogOut, Loader2, AlertCircle } from 'lucide-react';

export function SuiWalletButton() {
  const { address, connected, connect, disconnect } = useWallet();

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (!connected) {
    return (
      <button 
        onClick={() => connect()}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-500 hover:to-pink-500 transition-all text-sm"
      >
        <Wallet className="w-4 h-4" />
        <span>连接钱包</span>
      </button>
    );
  }

  return (
    <button 
      onClick={() => disconnect()}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-500 hover:to-pink-500 transition-all text-sm"
    >
      <Wallet className="w-4 h-4" />
      <span>{shortenAddress(address || '')}</span>
      <LogOut className="w-3 h-3" />
    </button>
  );
}
