'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('检测中...');
  const [address, setAddress] = useState<string>('');
  const [chain, setChain] = useState<string>('');

  useEffect(() => {
    const connectSuiWallet = async () => {
      // @ts-ignore
      const ethereum = window.ethereum;
      
      if (!ethereum) {
        setStatus('❌ 未找到钱包');
        return;
      }

      setStatus('✅ 找到钱包，尝试连接 SUI 链...');

      try {
        // 先尝试 SUI 链的方法 - suix_getAllAddresses
        // @ts-ignore
        const suiAddresses = await ethereum.request({ 
          method: 'suix_getAllAddresses' 
        });
        
        if (suiAddresses && suiAddresses.length > 0) {
          setAddress(suiAddresses[0]);
          setChain('SUI');
          setStatus('✅ 连接到 SUI 链！');
          return;
        }

        // 如果没有 SUI 地址，尝试以太坊
        // @ts-ignore
        const ethAccounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (ethAccounts && ethAccounts.length > 0) {
          setAddress(ethAccounts[0]);
          setChain('Ethereum');
          setStatus('⚠️ 连接到以太坊链，不是 SUI 链');
        } else {
          setStatus('⚠️ 用户未授权');
        }
      } catch (e: unknown) {
        setStatus(`❌ 连接失败: ${e instanceof Error ? e.message : '未知错误'}`);
      }
    };

    setTimeout(connectSuiWallet, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 自动获取 SUI 钱包</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="text-xl mb-4">{status}</p>
        
        {address && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <p className="text-green-400 font-bold mb-2">当前链: {chain}</p>
            <p className="text-gray-400 text-sm mb-2">钱包地址:</p>
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
