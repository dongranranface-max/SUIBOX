'use client';

import { useSuiWallet } from '@/hooks/useSuiWallet';

export default function WalletDebugPage() {
  const { address, connected, loading, error, connect } = useSuiWallet();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="text-xl mb-4">
          {loading ? '连接中...' : connected ? '✅ 已连接' : '点击按钮连接'}
        </p>
        
        {address && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <p className="text-gray-400 text-sm">钱包地址:</p>
            <p className="font-mono text-lg break-all">{address}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <button 
          onClick={connect}
          disabled={loading}
          className="mt-6 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-lg font-bold disabled:opacity-50"
        >
          {loading ? '连接中...' : '连接钱包'}
        </button>
      </div>
    </div>
  );
}
