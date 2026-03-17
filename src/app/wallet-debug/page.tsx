'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  useEffect(() => {
    // 检测所有可能的全局变量
    const keys = Object.keys(window).filter(k => 
      k.toLowerCase().includes('sui') || 
      k.toLowerCase().includes('eth') ||
      k.toLowerCase().includes('wallet')
    );
    
    addLog('=== 检测结果 ===');
    addLog('window.ethereum: ' + (typeof window.ethereum !== 'undefined' ? 'YES' : 'NO'));
    addLog('window.sui: ' + (typeof window.sui !== 'undefined' ? 'YES' : 'NO'));
    addLog('window.suiWallet: ' + (typeof window.suiWallet !== 'undefined' ? 'YES' : 'NO'));
    addLog('');
    addLog('相关全局变量:');
    keys.forEach(k => addLog('  ' + k));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔍 钱包检测</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <pre className="whitespace-pre-wrap text-sm font-mono">
{logs.join('\n')}
        </pre>
      </div>

      <div className="mt-6 p-4 bg-yellow-900 rounded-lg">
        <p className="text-yellow-400">请确保：</p>
        <ol className="list-decimal list-inside text-sm mt-2">
          <li>安装了 Suiet Wallet 扩展</li>
          <li>扩展已解锁</li>
          <li>网络切换到 Devnet</li>
        </ol>
      </div>
    </div>
  );
}
