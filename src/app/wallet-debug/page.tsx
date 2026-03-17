'use client';

import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

function WalletInfo() {
  const { 
    address, 
    connected, 
    chain, 
    status,
    allAvailableWallets,
    configuredWallets,
    detectedWallets 
  } = useWallet();

  if (status === 'connecting') {
    return (
      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="text-xl">🔄 正在连接钱包...</p>
      </div>
    );
  }

  if (connected && address) {
    return (
      <div className="bg-green-900 p-6 rounded-xl">
        <p className="text-green-400 font-bold mb-4 text-xl">✅ 连接成功！</p>
        <p className="text-gray-400 text-sm">钱包地址:</p>
        <p className="font-mono text-lg break-all">{address}</p>
        {chain && (
          <p className="text-gray-400 mt-4">网络: {chain}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 p-4 rounded-xl">
        <p className="text-lg mb-2">可用的钱包:</p>
        <div className="flex flex-wrap gap-2">
          {allAvailableWallets.map((wallet) => (
            <span 
              key={wallet.name} 
              className="px-3 py-1 bg-blue-900 rounded-full text-sm"
            >
              {wallet.name}
            </span>
          ))}
        </div>
        {allAvailableWallets.length === 0 && (
          <p className="text-gray-500">未检测到钱包</p>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="text-lg mb-4">点击下方按钮连接钱包:</p>
        <ConnectButton />
      </div>
    </div>
  );
}

export default function WalletDebugPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      <WalletInfo />
    </div>
  );
}
