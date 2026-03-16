'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [debugInfo, setDebugInfo] = useState<string>('检查中...\n');

  useEffect(() => {
    const check = async () => {
      let info = '=== 钱包检测 ===\n\n';
      
      // @ts-ignore
      const eth = window.ethereum;
      
      if (eth) {
        info += `✅ window.ethereum 存在\n`;
        
        // 检查是否是 Suiet
        // @ts-ignore
        info += `isSuiet: ${eth.isSuiet || false}\n`;
        // @ts-ignore
        info += `isPhantom: ${eth.isPhantom || false}\n`;
        // @ts-ignore
        info += `isRabby: ${eth.isRabby || false}\n`;
        // @ts-ignore
        info += `isCoinbaseWallet: ${eth.isCoinbaseWallet || false}\n`;
        
        // 尝试获取账户
        try {
          // @ts-ignore
          const accounts = await eth.request({ method: 'eth_requestAccounts' });
          info += `\n请求账户...\n`;
          info += `eth_requestAccounts 返回: ${JSON.stringify(accounts)}\n`;
          
          if (accounts && accounts.length > 0) {
            info += `\n✅ 已连接！地址: ${accounts[0]}\n`;
          }
        } catch (e: unknown) {
          info += `请求账户失败: ${e instanceof Error ? e.message : e}\n`;
        }
        
        // 尝试 Sui 链方法
        try {
          // @ts-ignore
          const suiAccounts = await eth.request({ method: 'suix_getAllAddresses' });
          info += `\nsuix_getAllAddresses: ${JSON.stringify(suiAccounts)}\n`;
        } catch (e: unknown) {
          // 忽略
        }
      } else {
        info += '❌ window.ethereum 不存在\n';
      }

      // 检查 localStorage
      try {
        const keys = Object.keys(localStorage);
        const suiKeys = keys.filter(k => k.includes('sui') || k.includes('wallet'));
        if (suiKeys.length > 0) {
          info += `\n=== localStorage ===\n`;
          for (const key of suiKeys) {
            const val = localStorage.getItem(key);
            info += `${key}: ${val?.slice(0, 100)}\n`;
          }
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
      <h1 className="text-2xl font-bold mb-4">🔍 钱包检测 - 尝试连接</h1>
      
      <div className="bg-gray-900 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
        {debugInfo}
      </div>

      <div className="mt-4 p-4 bg-blue-900 rounded-lg">
        <p className="text-blue-400">刷新页面，看看是否请求连接授权</p>
      </div>
    </div>
  );
}
