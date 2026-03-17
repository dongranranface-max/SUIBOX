'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  useEffect(() => {
    setMounted(true);
    
    addLog('=== 检查所有全局变量 ===');
    
    // 检查所有可能的钱包
    const checks = [
      { name: 'window.ethereum', val: window.ethereum },
      { name: 'window.sui', val: (window as unknown as Record<string, unknown>).sui },
      { name: 'window.suiWallet', val: (window as unknown as Record<string, unknown>).suiWallet },
      { name: 'window.phantom', val: (window as unknown as Record<string, unknown>).phantom },
    ];
    
    checks.forEach(({ name, val }) => {
      if (val) {
        addLog('✓ ' + name + ' 存在');
        // @ts-ignore
        if (val.isSuiet) addLog('  -> isSuiet: true');
        // @ts-ignore
        if (val.isPhantom) addLog('  -> isPhantom: true');
      } else {
        addLog('✗ ' + name + ' 不存在');
      }
    });

    // 检查以太坊相关的
    // @ts-ignore
    const eth = window.ethereum;
    if (eth) {
      addLog('');
      addLog('ethereum 属性:');
      // @ts-ignore
      const props = Object.keys(eth).filter(k => !k.startsWith('_'));
      props.slice(0, 20).forEach(p => addLog('  ' + p));
    }
  }, []);

  if (!mounted) return <div className="p-8">加载中...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔍 检查</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <pre className="text-xs">{logs.join('\n')}</pre>
      </div>
    </div>
  );
}
