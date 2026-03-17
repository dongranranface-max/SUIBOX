'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    setMounted(true);
    checkWallet();
  }, []);

  const checkWallet = async () => {
    addLog('检测钱包...');
    
    // @ts-ignore
    if (window.ethereum) {
      addLog('找到 window.ethereum');
      
      try {
        // 尝试获取账户
        // @ts-ignore
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setStatus('✅ 已连接！\n地址: ' + accounts[0].slice(0, 20) + '...');
          addLog('获取到地址: ' + accounts[0]);
          
          // 检查链ID
          // @ts-ignore
          const chainId = await window.ethereum.request({ 
            method: 'eth_chainId' 
          });
          addLog('链ID: ' + chainId);
          
          if (chainId !== '0x1' && chainId !== '0x5') {
            setStatus(prev => prev + '\n\n⚠️ 当前可能不是SUI网络\n请切换到SUI Devnet');
          }
        }
      } catch (e) {
        addLog('获取账户失败');
      }
    } else {
      addLog('未找到钱包');
      setStatus('❌ 未找到钱包');
    }
  };

  const handleConnect = async () => {
    setLogs([]);
    addLog('开始连接...');
    
    try {
      // @ts-ignore
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setStatus('✅ 连接成功！\n地址: ' + accounts[0]);
        addLog('成功: ' + accounts[0]);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus('❌ 连接失败: ' + msg);
      addLog('失败: ' + msg);
    }
  };

  if (!mounted) return <div className="p-8">加载中...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔗 钱包连接</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <pre className="whitespace-pre-wrap text-sm">{status || '检测中...'}</pre>
      </div>

      {address && (
        <div className="bg-green-900 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-400">地址:</p>
          <p className="font-mono text-sm break-all">{address}</p>
        </div>
      )}

      <button 
        onClick={handleConnect}
        className="px-6 py-3 bg-purple-600 rounded-lg font-bold"
      >
        连接钱包
      </button>

      {logs.length > 0 && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <p className="font-bold mb-2">日志:</p>
          <pre className="text-xs whitespace-pre-wrap">{logs.join('\n')}</pre>
        </div>
      )}
    </div>
  );
}
