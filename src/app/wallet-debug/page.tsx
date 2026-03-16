'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const check = () => {
      let info = '检查中...\n';
      
      // 检查 window.sui
      const suiWin = (window as unknown as { sui?: unknown }).sui;
      if (suiWin) {
        info += '✅ window.sui 存在\n';
        const wallets = (suiWin as { wallets?: unknown[] }).wallets;
        if (wallets?.length) {
          info += `✅ 找到 ${wallets.length} 个钱包\n`;
          const firstWallet = wallets[0] as { name?: string; accounts?: { address: string }[] };
          info += `钱包名称: ${firstWallet.name}\n`;
          if (firstWallet.accounts?.[0]?.address) {
            info += `✅ 已连接地址: ${firstWallet.accounts[0].address}\n`;
            setAddress(firstWallet.accounts[0].address);
          }
        }
      } else {
        info += '❌ window.sui 不存在\n';
      }

      // 检查 window.suiWallet
      const suiWallet = (window as unknown as { suiWallet?: unknown }).suiWallet;
      if (suiWallet) {
        info += '✅ window.suiWallet 存在\n';
      } else {
        info += '❌ window.suiWallet 不存在\n';
      }

      // 检查其他可能的全局变量
      const possibleKeys = Object.keys(window).filter(k => 
        k.toLowerCase().includes('sui') || k.toLowerCase().includes('wallet')
      );
      if (possibleKeys.length > 0) {
        info += `找到相关全局变量: ${possibleKeys.join(', ')}\n`;
      }

      setDebugInfo(info);
    };

    check();
    const timer = setInterval(check, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">钱包调试</h1>
      
      <div className="bg-gray-900 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
        {debugInfo}
      </div>

      {address && (
        <div className="mt-4 p-4 bg-green-900 rounded-lg">
          <p className="text-green-400 font-bold">已连接地址:</p>
          <p className="font-mono">{address}</p>
        </div>
      )}
    </div>
  );
}
