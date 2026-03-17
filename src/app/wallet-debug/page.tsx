'use client';

import { use wallet } from '@suiet/wallet-kit';

export default function WalletDebugPage() {
  const { address, connected, chain, connecting, connect, disconnect } = useWallet();

  if (connected && address) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-8">✅ 已连接！</h1>
        
        <div className="bg-green-900 p-6 rounded-xl">
          <p className="text-gray-400 mb-2">钱包地址:</p>
          <p className="font-mono text-lg break-all">{address}</p>
          <p className="text-gray-400 mt-4">网络: {chain}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="text-xl mb-4">
          {connecting ? '连接中...' : '点击下方按钮连接钱包'}
        </p>
        
        <button 
          onClick={connect}
          disabled={connecting}
          className="mt-6 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-lg font-bold hover:from-violet-500 hover:to-pink-500 disabled:opacity-50"
        >
          {connecting ? '连接中...' : '连接钱包'}
        </button>
      </div>
    </div>
  );
}
