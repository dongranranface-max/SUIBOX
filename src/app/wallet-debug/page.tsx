'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [debugInfo, setDebugInfo] = useState<string>('检查中...\n');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-10), msg]);
  };

  useEffect(() => {
    const check = async () => {
      let info = '=== 钱包检测 ===\n\n';
      
      // 检查所有可能的全局变量
      const allKeys = Object.keys(window);
      const relatedKeys = allKeys.filter(k => 
        k.toLowerCase().includes('sui') || 
        k.toLowerCase().includes('eth') ||
        k.toLowerCase().includes('wallet') ||
        k.toLowerCase().includes('phantom')
      );
      
      info += `相关全局变量:\n${relatedKeys.slice(0, 30).join(', ')}\n\n`;

      // 尝试检测 Suiet
      try {
        // @ts-ignore
        const sui = window.sui;
        info += `window.sui: ${sui ? '✅' : '❌'}\n`;
        
        // @ts-ignore
        const suiWallet = window.suiWallet;
        info += `window.suiWallet: ${suiWallet ? '✅' : '❌'}\n`;
        
        // @ts-ignore
        const suiEt = window.suiEt;
        info += `window.suiEt: ${suiEt ? '✅' : '❌'}\n`;

        // @ts-ignore - Suiet may use this
        const whale = window.WhaleWallet;
        info += `window.WhaleWallet: ${whale ? '✅' : '❌'}\n`;

        // 检查 ethereum (很多钱包会注入到这个)
        // @ts-ignore
        const eth = window.ethereum;
        info += `window.ethereum: ${eth ? '✅' : '❌'}\n`;
        
        if (eth) {
          // @ts-ignore
          if (eth.isSuiet) {
            addLog('✅ 通过 ethereum.isSuiet 检测到 Suiet Wallet');
            info += `  isSuiet: true\n`;
          }
          // @ts-ignore
          if (eth.isPhantom) {
            addLog('✅ 通过 ethereum.isPhantom 检测到 Phantom');
          }
          // @ts-ignore
          if (eth.isRabby) {
            addLog('✅ 通过 ethereum.isRabby 检测到 Rabby');
          }
        }

      } catch (e) {
        info += `检测出错: ${e}\n`;
      }

      // 检查 localStorage
      try {
        const storageKeys = Object.keys(localStorage);
        const suiKeys = storageKeys.filter(k => k.toLowerCase().includes('sui'));
        if (suiKeys.length > 0) {
          info += `\nlocalStorage 中找到: ${suiKeys.join(', ')}\n`;
        }
      } catch (e) {
        // ignore
      }

      setDebugInfo(info);
    };

    check();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔍 钱包深度检测 V3</h1>
      
      <div className="bg-gray-900 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm mb-4">
        {debugInfo}
      </div>

      {logs.length > 0 && (
        <div className="bg-green-900 p-4 rounded-lg mb-4">
          <p className="font-bold mb-2">检测日志:</p>
          {logs.map((log, i) => (
            <p key={i} className="text-green-400 text-sm">{log}</p>
          ))}
        </div>
      )}

      <div className="mt-4 p-4 bg-yellow-900 rounded-lg">
        <p className="text-yellow-400 font-bold">请把上面显示的内容发给我</p>
      </div>
    </div>
  );
}
