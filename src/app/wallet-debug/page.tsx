'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [debugInfo, setDebugInfo] = useState<string>('检查中...\n');
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    const check = async () => {
      let info = '=== 钱包检测 ===\n\n';
      
      // 方法1: window.sui (Wallet Standard)
      const suiWin = (window as unknown as Record<string, unknown>).sui;
      info += `window.sui: ${suiWin ? '✅ 存在' : '❌ 不存在'}\n`;

      // 方法2: suiWallet (Suiet/鲸鱼钱包)
      const suiWallet = (window as unknown as Record<string, unknown>).suiWallet;
      info += `window.suiWallet: ${suiWallet ? '✅ 存在' : '❌ 不存在'}\n`;

      if (suiWallet) {
        info += `\n尝试连接 suiWallet...\n`;
        try {
          // @ts-ignore
          if (typeof suiWallet.connect === 'function') {
            // @ts-ignore
            await suiWallet.connect();
            // @ts-ignore
            if (suiWallet.address) {
              // @ts-ignore
              setWalletAddress(suiWallet.address);
              info += `✅ 连接成功！地址: ${suiWallet.address}\n`;
            }
          }
        } catch (e) {
          info += `连接出错: ${e}\n`;
        }
      }

      // 方法3: 尝试直接获取
      try {
        // @ts-ignore
        if (window.ethereum?.providers) {
          // 多钱包检测
          const providers = window.ethereum.providers;
          info += `\n找到 ${providers.length} 个 Ethereum 提供商\n`;
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
      <h1 className="text-2xl font-bold mb-4">🔍 钱包深度检测</h1>
      
      <div className="bg-gray-900 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
        {debugInfo}
      </div>

      {walletAddress && (
        <div className="mt-4 p-4 bg-green-900 rounded-lg">
          <p className="text-green-400 font-bold">✅ 找到钱包！</p>
          <p className="font-mono">{walletAddress}</p>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-900 rounded-lg">
        <p className="text-blue-400 font-bold">请告诉我上面显示什么？</p>
      </div>
    </div>
  );
}
