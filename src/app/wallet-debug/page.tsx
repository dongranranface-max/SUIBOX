'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('加载中...');
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
    addLog('检查钱包...');
    
    // @ts-ignore
    const ethereum = window.ethereum;
    
    if (!ethereum) {
      setStatus('❌ 未找到钱包扩展\n请安装 Suiet Wallet');
      addLog('window.ethereum 不存在');
      return;
    }

    addLog('找到 window.ethereum');
    setStatus('✅ 找到钱包\n请点击按钮连接');

    // 自动尝试
    try {
      addLog('尝试 suix_getAllAddresses...');
      // @ts-ignore
      const suiAddresses = await ethereum.request({ 
        method: 'suix_getAllAddresses' 
      });
      addLog('结果: ' + JSON.stringify(suiAddresses));
      
      if (suiAddresses && suiAddresses.length > 0) {
        setAddress(suiAddresses[0]);
        setStatus('✅ 已连接 SUI 钱包！');
      }
    } catch (e: unknown) {
      addLog('错误: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleConnect = async () => {
    setLogs([]);
    addLog('开始连接...');
    
    // @ts-ignore
    const ethereum = window.ethereum;
    if (!ethereum) {
      setStatus('❌ 未找到钱包');
      addLog('错误: window.ethereum 不存在');
      return;
    }

    setStatus('🔄 请在钱包中确认授权...');
    addLog('请求连接...');

    // 方法1: suix_getAllAddresses
    try {
      addLog('方法1: suix_getAllAddresses');
      // @ts-ignore
      const suiAddresses = await ethereum.request({ 
        method: 'suix_getAllAddresses' 
      });
      addLog('结果: ' + JSON.stringify(suiAddresses));
      
      if (suiAddresses && suiAddresses.length > 0) {
        setAddress(suiAddresses[0]);
        setStatus('✅ 连接成功！');
        return;
      }
    } catch (e: unknown) {
      addLog('方法1失败: ' + (e instanceof Error ? e.message : String(e)));
    }

    // 方法2: eth_requestAccounts
    try {
      addLog('方法2: eth_requestAccounts');
      // @ts-ignore
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      addLog('结果: ' + JSON.stringify(accounts));
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setStatus('⚠️ 连接成功（可能非SUI地址）');
        return;
      }
    } catch (e: unknown) {
      addLog('方法2失败: ' + (e instanceof Error ? e.message : String(e)));
    }

    setStatus('❌ 连接失败\n请查看下方日志');
  };

  if (!mounted) {
    return <div className="min-h-screen bg-black text-white p-8">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl mb-4">
        <pre className="whitespace-pre-wrap text-sm mb-4">{status}</pre>
        
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

      {/* 日志 */}
      {logs.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-xl">
          <p className="font-bold mb-2">连接日志:</p>
          <div className="font-mono text-xs space-y-1">
            {logs.map((log, i) => (
              <p key={i} className="text-gray-400">{log}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
