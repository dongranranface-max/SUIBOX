'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('加载中...');
  const [wallets, setWallets] = useState<string[]>([]);
  const [address, setAddress] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStatus('检查钱包...');
    
    // @ts-ignore
    const ethereum = window.ethereum;
    
    if (!ethereum) {
      setStatus('❌ 未找到钱包扩展');
      return;
    }

    setStatus('✅ 找到ethereum');

    // 尝试获取账户
    // @ts-ignore
    ethereum.request({ method: 'eth_requestAccounts' })
      .then((accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setStatus('⚠️ 连接以太坊钱包: ' + accounts[0].slice(0, 10) + '...');
        } else {
          setStatus('点击按钮连接钱包');
        }
      })
      .catch(() => {
        setStatus('请点击按钮连接');
      });
  }, []);

  const handleConnect = async () => {
    // @ts-ignore
    const ethereum = window.ethereum;
    if (ethereum) {
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setStatus('✅ 连接成功: ' + accounts[0].slice(0, 10) + '...');
        }
      } catch (e) {
        setStatus('连接失败');
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 钱包连接测试</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="text-xl mb-4">{status}</p>
        
        {address && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <p className="text-gray-400 text-sm">钱包地址:</p>
            <p className="font-mono text-lg">{address}</p>
          </div>
        )}

        <button 
          onClick={handleConnect}
          className="mt-6 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-lg font-bold"
        >
          连接钱包
        </button>
      </div>
    </div>
  );
}
