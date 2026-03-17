'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useWallets } from '@mysten/dapp-kit';

function WalletContent() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const [status, setStatus] = useState<string>('检测中...');

  useEffect(() => {
    if (wallets.length > 0) {
      setStatus(`✅ 检测到 ${wallets.length} 个钱包`);
    } else {
      setStatus('❌ 未检测到钱包');
    }
  }, [wallets]);

  if (account?.address) {
    return (
      <div className="p-6 bg-green-900 rounded-xl">
        <p className="text-green-400 font-bold mb-2">✅ 已连接 SUI 钱包！</p>
        <p className="text-gray-400 text-sm mb-2">钱包地址:</p>
        <p className="font-mono text-lg">{account.address}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 p-4 rounded-lg">
        <p className="text-lg">{status}</p>
        <p className="text-sm text-gray-400 mt-2">检测到的钱包: {wallets.map(w => w.name).join(', ') || '无'}</p>
      </div>

      <div className="p-4 bg-blue-900 rounded-lg">
        <p className="text-blue-400 font-bold mb-2">请确保：</p>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>已安装 Suiet Wallet 扩展</li>
          <li>扩展已启用并解锁</li>
          <li>网络已切换到 Devnet 或 Testnet</li>
        </ol>
      </div>
    </div>
  );
}

export default function WalletDebugPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      <WalletContent />
    </div>
  );
}
