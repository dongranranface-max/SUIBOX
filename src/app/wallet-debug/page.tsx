'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('检测中...');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const connectWallet = async () => {
      // @ts-ignore
      const ethereum = window.ethereum;
      
      if (!ethereum) {
        setStatus('❌ 未找到 window.ethereum');
        return;
      }

      setStatus('✅ 找到 ethereum，尝试连接...');

      try {
        // 尝试请求连接账户
        // @ts-ignore
        const accounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setStatus('✅ 连接成功！');
        } else {
          setStatus('⚠️ 用户未授权');
        }
      } catch (e: unknown) {
        setStatus(`❌ 连接失败: ${e instanceof Error ? e.message : '未知错误'}`);
      }
    };

    // 延迟一下确保钱包加载
    setTimeout(connectWallet, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 自动获取钱包地址</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="text-xl mb-4">{status}</p>
        
        {address && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <p className="text-green-400 font-bold mb-2">钱包地址:</p>
            <p className="font-mono text-lg">{address}</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500"
      >
        刷新重试
      </button>
    </div>
  );
}
