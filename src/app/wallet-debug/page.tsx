'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useWallets, ConnectButton } from '@mysten/dapp-kit';

function WalletContent() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-center p-8">加载中...</div>;
  }

  if (account?.address) {
    return (
      <div className="p-6 bg-green-900 rounded-xl">
        <p className="text-green-400 font-bold mb-2">✅ 已连接 SUI 钱包！</p>
        <p className="text-gray-400 text-sm mb-2">钱包地址:</p>
        <p className="font-mono text-lg break-all">{account.address}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 p-4 rounded-lg">
        <p className="text-lg mb-2">检测到钱包: {wallets.map(w => w.name).join(', ') || '无'}</p>
        <p className="text-sm text-gray-400">
          共 {wallets.length} 个钱包
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="mb-4">点击下方按钮连接钱包:</p>
        <ConnectButton />
      </div>

      {wallets.length === 0 && (
        <div className="p-4 bg-yellow-900 rounded-lg">
          <p className="text-yellow-400 font-bold mb-2">未检测到钱包</p>
          <p className="text-sm">请确保已安装 Suiet Wallet 或其他 SUI 钱包扩展</p>
        </div>
      )}
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
