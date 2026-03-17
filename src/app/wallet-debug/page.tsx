'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('加载中...');
  const [address, setAddress] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const connect = async () => {
    setLogs([]);
    addLog('开始...');
    
    // @ts-ignore
    const eth = window.ethereum;
    if (!eth) {
      setStatus('❌ 未找到钱包');
      return;
    }

    // 先检查链
    try {
      // @ts-ignore
      const chainId = await eth.request({ method: 'eth_chainId' });
      addLog('链: ' + chainId);
    } catch (e) {
      addLog('无法获取链');
    }

    // 方法1: 直接获取SUI地址
    try {
      addLog('1. suix_getAllAddresses...');
      // @ts-ignore
      const suiAddrs = await eth.request({ 
        method: 'suix_getAllAddresses' 
      });
      
      if (suiAddrs && suiAddrs.length > 0) {
        setAddress(suiAddrs[0]);
        setStatus('✅ 成功！\n' + suiAddrs[0]);
        addLog('SUI地址: ' + suiAddrs[0]);
        return;
      }
    } catch (e: unknown) {
      addLog('方法1失败');
    }

    // 方法2: 获取账户
    try {
      addLog('2. eth_requestAccounts...');
      // @ts-ignore
      const accounts = await eth.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        // @ts-ignore
        const chainId = await eth.request({ method: 'eth_chainId' });
        
        setStatus('✅ 连接成功\n' + accounts[0] + '\n\n链ID: ' + chainId);
        addLog('地址: ' + accounts[0]);
        addLog('链: ' + chainId);
        return;
      }
    } catch (e: unknown) {
      addLog('方法2失败');
    }

    setStatus('❌ 连接失败');
  };

  if (!mounted) return <div className="p-8">加载中...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔗 SUI钱包</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <p className="whitespace-pre-wrap">{status}</p>
      </div>

      <button 
        onClick={connect}
        className="px-6 py-3 bg-purple-600 rounded-lg font-bold"
      >
        连接
      </button>

      {logs.length > 0 && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <pre className="text-xs">{logs.join('\n')}</pre>
        </div>
      )}
    </div>
  );
}
