'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('加载中...');
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
    setStatus('正在连接SUI...');
    addLog('=== 开始连接SUI ===');
    
    // @ts-ignore
    const eth = window.ethereum;
    if (!eth) {
      setStatus('❌ 未找到钱包');
      return;
    }

    // 先尝试添加SUI网络
    try {
      addLog('尝试添加SUI Devnet...');
      // @ts-ignore
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x3',
          chainName: 'Sui Devnet',
          nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: 9 },
          rpcUrls: ['https://fullnode.devnet.sui.io'],
          blockExplorerUrls: ['https://explorer.sui.io'],
        }],
      });
      addLog('添加网络成功');
    } catch (e: unknown) {
      addLog('添加网络: ' + (e instanceof Error ? e.message : String(e)));
    }

    // 切换到SUI网络
    try {
      addLog('尝试切换到SUI Devnet...');
      // @ts-ignore
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3' }],
      });
      addLog('切换成功');
    } catch (e: unknown) {
      addLog('切换: ' + (e instanceof Error ? e.message : String(e)));
    }

    // 等待一下
    await new Promise(r => setTimeout(r, 1000));

    // 检查当前链
    try {
      // @ts-ignore
      const chainId = await eth.request({ method: 'eth_chainId' });
      addLog('当前链: ' + chainId);
    } catch (e) {}

    // 获取SUI地址
    try {
      addLog('获取SUI地址...');
      // @ts-ignore
      const suiAddrs = await eth.request({ 
        method: 'suix_getAllAddresses' 
      });
      
      if (suiAddrs && suiAddrs.length > 0) {
        setStatus('✅ SUI连接成功！\n\n' + suiAddrs[0]);
        addLog('SUI地址: ' + suiAddrs[0]);
        return;
      }
    } catch (e: unknown) {
      addLog('SUI方法: ' + (e instanceof Error ? e.message : String(e)));
    }

    // 获取普通账户
    try {
      addLog('获取账户...');
      // @ts-ignore
      const accounts = await eth.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        // @ts-ignore
        const chainId = await eth.request({ method: 'eth_chainId' });
        setStatus('⚠️ 连接成功\n' + accounts[0] + '\n\n当前链: ' + chainId);
        addLog('地址: ' + accounts[0]);
        addLog('链: ' + chainId);
      }
    } catch (e: unknown) {
      addLog('失败: ' + (e instanceof Error ? e.message : String(e)));
      setStatus('❌ 连接失败');
    }
  };

  if (!mounted) return <div className="p-8">加载中...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔗 SUI钱包</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <p className="whitespace-pre-wrap">{status}</p>
      </div>

      <button onClick={connectSUI} className="px-6 py-3 bg-purple-600 rounded-lg font-bold mb-4">
        获取SUI地址
      </button>

      {logs.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <pre className="text-xs">{logs.join('\n')}</pre>
        </div>
      )}
    </div>
  );
}
