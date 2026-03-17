'use client';

import { useSuiWallet } from '@/hooks/useSuiWallet';
import { Wallet } from 'lucide-react';
import { useState } from 'react';

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function SuiWalletButton() {
  const { address, connected, loading, connect } = useSuiWallet();
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    setStatus('连接中...');
    await connect();
    setStatus('');
  };

  if (loading) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm">
        <span>连接中...</span>
      </button>
    );
  }

  if (connected && address) {
    return (
      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm">
        <Wallet className="w-4 h-4" />
        <span>{shortenAddress(address)}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-500 hover:to-pink-500 transition-all text-sm"
      >
        <Wallet className="w-4 h-4" />
        <span>连接钱包</span>
      </button>
      {status && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-gray-800 rounded text-xs whitespace-nowrap">
          {status}
        </div>
      )}
    </div>
  );
}
