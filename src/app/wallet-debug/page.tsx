'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('加载中...');
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkWallet();
  }, []);

  const checkWallet = async () => {
    setStatus('🔍 检查SUI钱包...');
    
    // @ts-ignore
    const ethereum = window.ethereum;
    
    if (!ethereum) {
      setStatus('❌ 未找到钱包扩展\n请确保已安装 Suiet Wallet');
      return;
    }

    setStatus('✅ 找到钱包扩展\n请点击按钮连接');

    // 自动尝试获取地址
    try {
      // @ts-ignore
      const suiAddresses = await ethereum.request({ 
        method: 'suix_getAllAddresses' 
      });
      
      if (suiAddresses && suiAddresses.length > 0) {
        setAddress(suiAddresses[0]);
        setStatus('✅ 已自动连接 SUI 钱包！');
      }
    } catch (e) {
      // 忽略
    }
  };

  const handleConnect = async () => {
    setError('');
    // @ts-ignore
    const ethereum = window.ethereum;
    if (!ethereum) {
      setError('未找到钱包');
      return;
    }

    setStatus('🔄 请求连接...\n请在钱包中确认');

    try {
      // 尝试 SUI 方法
      // @ts-ignore
      const suiAddresses = await ethereum.request({ 
        method: 'suix_getAllAddresses' 
      });
      
      if (suiAddresses && suiAddresses.length > 0) {
        setAddress(suiAddresses[0]);
        setStatus('✅ 连接成功！');
        return;
      }
    } catch (e: unknown) {
      setError('SUI方法失败: ' + (e instanceof Error ? e.message : String(e)));
    }

    // 尝试以太坊方法
    try {
      // @ts-ignore
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setStatus('⚠️ 连接成功，但可能是以太坊地址');
      }
    } catch (e: unknown) {
      setError('连接失败: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-black text-white p-8">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <pre className="whitespace-pre-wrap text-sm mb-4">{status}</pre>
        
        {error && (
          <div className="p-3 bg-red-900 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        {address && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <p className="text-gray-400 text-sm">钱包地址:</p>
            <p className="font-mono text-lg break-all">{address}</p>
          </div>
        )}

        <button 
          onClick={handleConnect}
          className="mt-6 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-lg font-bold"
        >
          连接钱包
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-900 rounded-lg">
        <p className="font-bold mb-2">请确保：</p>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Suiet Wallet 已解锁</li>
          <li>网络切换到 Devnet 或 Testnet</li>
          <li>点击按钮后，在钱包中确认授权</li>
        </ol>
      </div>
    </div>
  );
}
