'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { Wallet } from 'lucide-react';
import { ConnectButton } from '@mysten/dapp-kit';

function shortenAddress(addr: string | null | undefined): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function SuiWalletButton() {
  const account = useCurrentAccount();
  const address = account?.address;
  const connected = !!address;

  if (connected && address) {
    return (
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-500 hover:to-pink-500 transition-all text-sm"
      >
        <Wallet className="w-4 h-4" />
        <span>{shortenAddress(address)}</span>
      </button>
    );
  }

  return (
    <ConnectButton />
  );
}
