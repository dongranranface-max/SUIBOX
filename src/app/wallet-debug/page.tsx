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
    addLog('开始检测钱包...');
    
    // 检测各种可能的钱包注入
    // @ts-ignore
    let wallet = window.ethereum;
    let walletName = 'window.ethereum';
    
    if (!wallet) {
      // @ts-ignore
      wallet = window.sui;
      walletName = 'window.sui';
    }
    
    if (!wallet) {
      // @ts-ignore
      wallet = window.suiWallet;
      walletName = 'window.suiWallet';
    }
    
    if (!wallet) {
      // @ts-ignore
      wallet = window.phantom?.solana;
      walletName = 'window.phantom';
    }
    
    if (wallet) {
      addLog(`找到钱包: ${walletName}`);
      setStatus('✅ 找到钱包\n请点击按钮连接');
    } else {
      setStatus('❌ 未找到钱包\n请确保已安装 Suiet Wallet');
      addLog('未找到任何钱包注入');
    }
  };

  const handleConnect = async () => {
    setLogs([]);
    addLog('开始连接...');
    
    // 尝试方法1: suix_getAllAddresses
    try {
      addLog('方法1: suix_getAllAddresses');
      // @ts-ignore
      const suiAddresses = await window.ethereum?.request({ 
        method: 'suix_getAllAddresses' 
      });
      addLog('结果: ' + JSON.stringify(suiAddresses));
      
      if (suiAddresses && suiAddresses.length > 0) {
        setAddress(suiAddresses[0]);
        setStatus('✅ 连接成功！');
        return;
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      addLog('失败: ' + errMsg);
    }

    // 尝试方法2: requestAccounts
    try {
      addLog('方法2: eth_requestAccounts');
      // @ts-ignore
      const accounts = await window.ethereum?.request({ 
        method: 'eth_requestAccounts' 
      });
      addLog('结果: ' + JSON.stringify(accounts));
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setStatus('✅ 连接成功！');
        return;
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      addLog('失败: ' + errMsg);
    }

    // 尝试方法3: Suiet Wallet Standard
    try {
      addLog('方法3: Wallet Standard');
      // @ts-ignore
      const suiWin = window.sui;
      if (suiWin?.wallets?.length > 0) {
        addLog('找到 ' + suiWin.wallets.length + ' 个钱包');
        const firstWallet = suiWin.wallets[0];
        if (firstWallet.accounts?.[0]?.address) {
          setAddress(firstWallet.accounts[0].address);
          setStatus('✅ 连接成功！');
          return;
        }
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      addLog('失败: ' + errMsg);
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

      {logs.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-xl">
          <p className="font-bold mb-2">日志:</p>
          <div className="font-mono text-xs space-y-1 max-h-60 overflow-y-auto">
            {logs.map((log, i) => (
              <p key={i} className="text-gray-400">{log}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
