'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('检测中...');
  const [address, setAddress] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const connectSuiWallet = async () => {
      // @ts-ignore
      const ethereum = window.ethereum;
      
      if (!ethereum) {
        setStatus('❌ 未找到钱包');
        return;
      }

      setStatus('✅ 找到钱包，尝试连接...');

      // 先尝试 suix_getAllAddresses
      try {
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
      } catch (e: unknown) {
        setError(`suix_getAllAddresses: ${e instanceof Error ? e.message : String(e)}`);
      }

      // 再尝试 eth_requestAccounts
      try {
        // @ts-ignore
        const ethAccounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (ethAccounts && ethAccounts.length > 0) {
          setAddress(ethAccounts[0]);
          setChain('Ethereum');
          setStatus('⚠️ 连接到以太坊链');
          return;
        }
      } catch (e: unknown) {
        setError(prev => prev + `\neth_requestAccounts: ${e instanceof Error ? e.message : String(e)}`);
      }

      // 尝试切换到 SUI 链
      try {
        // @ts-ignore
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }], // SUI chain ID
        });
        setStatus('🔄 已切换链，再试一次...');
        
        // 重试获取地址
        // @ts-ignore
        const suiAddresses = await ethereum.request({ 
          method: 'suix_getAllAddresses' 
        });
        
        if (suiAddresses && suiAddresses.length > 0) {
          setAddress(suiAddresses[0]);
          setChain('SUI');
          setStatus('✅ 切换到 SUI 链成功！');
        }
      } catch (e: unknown) {
        setError(prev => prev + `\nwallet_switchEthereumChain: ${e instanceof Error ? e.message : String(e)}`);
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

        {error && (
          <div className="mt-4 p-4 bg-red-900 rounded-lg whitespace-pre-wrap">
            <p className="text-red-400 font-bold mb-2">错误详情:</p>
            <p className="font-mono text-sm">{error}</p>
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
