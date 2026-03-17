'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [address, setAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('点击按钮连接钱包');
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);
    setStatus('正在请求连接...');
    
    try {
      // @ts-ignore
      const ethereum = window.ethereum;
      
      if (!ethereum) {
        setStatus('❌ 未找到钱包');
        setLoading(false);
        return;
      }

      // 尝试 SUI 链
      try {
        // @ts-ignore
        const suiAddresses = await ethereum.request({ 
          method: 'suix_getAllAddresses' 
        });
        
        if (suiAddresses && suiAddresses.length > 0) {
          setAddress(suiAddresses[0]);
          setStatus('✅ 已连接到 SUI 链！');
          setLoading(false);
          return;
        }
      } catch (e) {
        // 忽略
      }

      // 尝试连接
      try {
        // @ts-ignore
        const accounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setStatus('⚠️ 连接成功，但可能不是 SUI 链');
        }
      } catch (e: unknown) {
        setStatus('❌ ' + (e instanceof Error ? e.message : '连接失败'));
      }
    } catch (e: unknown) {
      setStatus('❌ 错误: ' + (e instanceof Error ? e.message : '未知错误'));
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="text-xl mb-4">{status}</p>
        
        {address && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">钱包地址:</p>
            <p className="font-mono text-lg break-all">{address}</p>
          </div>
        )}

        <button 
          onClick={connect}
          disabled={loading}
          className="mt-6 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-lg font-bold hover:from-violet-500 hover:to-pink-500 disabled:opacity-50"
        >
          {loading ? '连接中...' : '连接钱包'}
        </button>
      </div>
    </div>
  );
}
