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

  const connectSUI = async () => {
    setLogs([]);
    setStatus('连接中...');
    addLog('开始连接SUI钱包...');
    
    // @ts-ignore
    const eth = window.ethereum;
    if (!eth) {
      setStatus('❌ 未找到钱包');
      return;
    }

    addLog('找到ethereum');

    // 方法1: 直接用 SUI 方法
    try {
      addLog('方法1: suix_getAllAddresses');
      // @ts-ignore
      const suiAddrs = await eth.request({ 
        method: 'suix_getAllAddresses' 
      });
      
      if (suiAddrs && suiAddrs.length > 0) {
        setAddress(suiAddrs[0]);
        setStatus('✅ SUI钱包连接成功！\n' + suiAddrs[0]);
        addLog('成功: ' + suiAddrs[0]);
        return;
      }
      addLog('未获取到SUI地址');
    } catch (e: unknown) {
      addLog('方法1失败: ' + (e instanceof Error ? e.message : String(e)));
    }

    // 方法2: 尝试标准以太坊方法
    try {
      addLog('方法2: eth_requestAccounts');
      // @ts-ignore
      const accounts = await eth.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        
        // 检查链
        // @ts-ignore
        const chainId = await eth.request({ method: 'eth_chainId' });
        addLog('链ID: ' + chainId);
        
        setStatus('⚠️ 已连接，但可能是以太坊地址\n' + accounts[0]);
        addLog('连接成功，但需要切换到SUI网络');
      }
    } catch (e: unknown) {
      addLog('方法2失败: ' + (e instanceof Error ? e.message : String(e)));
      setStatus('❌ 连接失败');
    }
  };

  if (!mounted) return <div className="p-8">加载中...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔗 SUI 钱包</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <p className="whitespace-pre-wrap">{status}</p>
      </div>

      {address && (
        <div className="bg-green-900 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-400">地址:</p>
          <p className="font-mono text-sm break-all">{address}</p>
        </div>
      )}

      <button 
        onClick={connectSUI}
        className="px-6 py-3 bg-purple-600 rounded-lg font-bold"
      >
        连接SUI钱包
      </button>

      {logs.length > 0 && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <p className="text-xs">{logs.join('\n')}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-900 rounded-lg">
        <p className="font-bold">重要提示：</p>
        <p className="text-sm mt-2">
          请在Suiet Wallet扩展中手动切换到 SUI 网络（Devnet），然后再点击连接按钮！
        </p>
      </div>
    </div>
  );
}
