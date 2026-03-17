'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('加载中...');
  const [address, setAddress] = useState<string>('');
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

    setStatus('✅ 找到钱包扩展');

    try {
      // 尝试获取 SUI 地址 - 使用 SUI 链的方法
      // @ts-ignore
      const suiAddresses = await ethereum.request({ 
        method: 'suix_getAllAddresses' 
      });
      
      if (suiAddresses && suiAddresses.length > 0) {
        setAddress(suiAddresses[0]);
        setStatus('✅ 已连接 SUI 钱包！');
        return;
      }
    } catch (e) {
      // 忽略，继续尝试
    }

    // 如果没有 SUI 地址，显示需要连接
    setStatus('👆 点击下方按钮连接SUI钱包');
  };

  const handleConnect = async () => {
    // @ts-ignore
    const ethereum = window.ethereum;
    if (!ethereum) {
      setStatus('❌ 未找到钱包');
      return;
    }

    setStatus('🔄 请求连接...');

    try {
      // 先尝试 SUI 方法
      // @ts-ignore
      const suiAddresses = await ethereum.request({ 
        method: 'suix_getAllAddresses' 
      });
      
      if (suiAddresses && suiAddresses.length > 0) {
        setAddress(suiAddresses[0]);
        setStatus('✅ 连接成功！');
        return;
      }

      // 如果没有自动弹出，尝试请求账户
      // @ts-ignore
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setStatus('⚠️ 连接成功，但可能是以太坊格式地址');
      }
    } catch (e: unknown) {
      setStatus('❌ 连接失败: ' + (e instanceof Error ? e.message : '未知错误'));
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-black text-white p-8">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <pre className="whitespace-pre-wrap text-sm">{status}</pre>
        
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
          连接 SUI 钱包
        </button>
      </div>
    </div>
  );
}
