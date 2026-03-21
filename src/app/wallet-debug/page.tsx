'use client';

import { useState, useEffect } from 'react';
import { WalletProvider, useWallet, ConnectButton } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { useI18n } from '@/lib/i18n';

function WalletContent() {
  const wallet = useWallet();
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="mb-4">状态: {wallet.connecting ? '连接中...' : wallet.connected ? '已连接' : '未连接'}</p>
        
        {wallet.connected && wallet.account && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <p className="text-gray-400 text-sm">钱包:</p>
            <p className="font-bold">{wallet.adapter?.name}</p>
            
            <p className="text-gray-400 text-sm mt-4">网络:</p>
            <p className="font-bold">{wallet.chain?.name || 'Unknown'}</p>
            
            <p className="text-gray-400 text-sm mt-4">地址:</p>
            <p className="font-mono text-lg break-all">{wallet.account.address}</p>
          </div>
        )}

        <div className="mt-6">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}

export default function WalletDebugPage() {
  return (
    <WalletProvider>
      <WalletContent />
    </WalletProvider>
  );
}
