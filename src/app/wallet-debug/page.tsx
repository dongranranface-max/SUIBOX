'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('检测中...');
  const [logs, setLogs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  useEffect(() => {
    setMounted(true);
    detectWallet();
  }, []);

  const detectWallet = async () => {
    addLog('=== 检测钱包 ===');
    
    // @ts-ignore
    const eth = window.ethereum;
    
    if (!eth) {
      setStatus('❌ 未找到钱包');
      return;
    }

    addLog('找到 ethereum');

    // 检查钱包支持的方法
    addLog('检查钱包能力...');
    
    // 检查是否是 Suiet
    // @ts-ignore
    if (eth.isSuiet) {
      addLog('✓ 检测到 Suiet Wallet');
    }
    
    // 检查是否是 SUI 链
    try {
      // @ts-ignore
      const chainId = await eth.request({ method: 'eth_chainId' });
      addLog('当前链ID: ' + chainId);
    } catch (e) {
      addLog('无法获取链ID');
    }

    // 尝试 SUI 方法
    try {
      // @ts-ignore
      const result = await eth.request({ 
        method: 'suix_getAllAddresses' 
      });
      addLog('✓ SUI方法成功: ' + JSON.stringify(result));
      if (result && result.length > 0) {
        setStatus('✅ SUI钱包: ' + result[0]);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        addLog('✗ SUI方法: ' + e.message);
      }
    }

    // 尝试标准账户
    try {
      // @ts-ignore
      const accounts = await eth.request({ 
        method: 'eth_requestAccounts' 
      });
      if (accounts && accounts.length > 0) {
        addLog('✓ 以太坊账户: ' + accounts[0]);
        setStatus('已连接: ' + accounts[0].slice(0, 16) + '...\n\n提示: 请确保钱包网络是SUI Devnet');
      }
    } catch (e) {
      addLog('✗ 获取账户失败');
    }
  };

  if (!mounted) return <div className="p-8">加载中...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔍 钱包检测</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <p className="whitespace-pre-wrap">{status}</p>
      </div>

      <button onClick={detectWallet} className="px-6 py-3 bg-purple-600 rounded-lg font-bold mb-4">
        重新检测
      </button>

      <div className="bg-gray-800 p-4 rounded-lg">
        <pre className="text-xs">{logs.join('\n')}</pre>
      </div>
    </div>
  );
}
