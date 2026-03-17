'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('加载中...');
  const [address, setAddress] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  useEffect(() => {
    setMounted(true);
    checkWallet();
  }, []);

  const checkWallet = async () => {
    addLog('检测钱包...');
    
    // @ts-ignore
    const eth = window.ethereum;
    if (!eth) {
      setStatus('❌ 未找到钱包');
      return;
    }

    addLog('找到钱包');

    // 获取链ID
    try {
      // @ts-ignore
      const chain = await eth.request({ method: 'eth_chainId' });
      setChainId(chain);
      addLog('当前链: ' + chain);
    } catch (e) {
      addLog('获取链失败');
    }

    // 获取账户
    try {
      // @ts-ignore
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setStatus('✅ 已连接\n' + accounts[0].slice(0, 20) + '...');
        addLog('地址: ' + accounts[0]);
      } else {
        setStatus('👆 点击按钮连接');
      }
    } catch (e) {
      setStatus('👆 点击按钮连接');
    }
  };

  const switchToSUI = async () => {
    setLogs([]);
    addLog('开始连接...');
    
    // @ts-ignore
    const eth = window.ethereum;
    if (!eth) {
      setStatus('❌ 未找到钱包');
      return;
    }

    // 先尝试直接获取SUI地址
    try {
      addLog('尝试获取SUI地址...');
      // @ts-ignore
      const suiAddrs = await eth.request({ 
        method: 'suix_getAllAddresses' 
      });
      
      if (suiAddrs && suiAddrs.length > 0) {
        setAddress(suiAddrs[0]);
        setStatus('✅ 连接SUI成功！\n' + suiAddrs[0]);
        return;
      }
    } catch (e) {
      addLog('SUI方法失败');
    }

    // 尝试切换到SUI Devnet
    try {
      addLog('尝试切换到SUI Devnet...');
      // @ts-ignore
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3' }], // SUI Devnet chainId
      });
      addLog('切换成功');
      
      // 重试获取地址
      // @ts-ignore
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        // @ts-ignore
        const chain = await eth.request({ method: 'eth_chainId' });
        setChainId(chain);
        setStatus('✅ 连接成功！\n' + accounts[0]);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      addLog('切换失败: ' + msg);
      
      // 如果切换失败，直接获取账户
      try {
        // @ts-ignore
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setStatus('⚠️ 连接成功\n' + accounts[0]);
        }
      } catch (e2) {
        setStatus('❌ 连接失败');
      }
    }
  };

  if (!mounted) return <div className="p-8">加载中...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔗 SUI 钱包</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <p className="whitespace-pre-wrap">{status}</p>
        {chainId && <p className="text-sm text-gray-400 mt-2">链ID: {chainId}</p>}
      </div>

      {address && (
        <div className="bg-green-900 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-400">地址:</p>
          <p className="font-mono text-sm break-all">{address}</p>
        </div>
      )}

      <button 
        onClick={switchToSUI}
        className="px-6 py-3 bg-purple-600 rounded-lg font-bold"
      >
        切换到SUI网络
      </button>

      {logs.length > 0 && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <p className="text-xs">{logs.join('\n')}</p>
        </div>
      )}
    </div>
  );
}
