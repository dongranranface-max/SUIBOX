'use client';

import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import { Wallet } from 'lucide-react';
import '@suiet/wallet-kit/style.css';

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function SuiWalletButton() {
  const wallet = useWallet();

  if (wallet.connecting) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm">
        <span>连接中...</span>
      </button>
    );
  }

  if (wallet.connected && wallet.account) {
    return (
      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm">
        <Wallet className="w-4 h-4" />
        <span>{shortenAddress(wallet.account.address)}</span>
      </button>
    );
  }

  return (
    <ConnectButton />
  );
}
