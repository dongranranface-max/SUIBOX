'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [debugInfo, setDebugInfo] = useState<string>('检查中...\n');

  useEffect(() => {
    const check = () => {
      let info = '=== 钱包检测 ===\n\n';
      
      // 检查 window.sui (Wallet Standard)
      try {
        const suiWin = (window as unknown as Record<string, unknown>).sui;
        if (suiWin) {
          info += '✅ window.sui 存在\n';
          if (typeof suiWin === 'object' && suiWin !== null) {
            info += `内容: ${JSON.stringify(Object.keys(suiWin)).slice(0, 100)}\n`;
          }
        } else {
          info += '❌ window.sui 不存在\n';
        }
      } catch (e) {
        info += `❌ window.sui 检查失败: ${e}\n`;
      }

      // 检查 Suiet 特有变量
      const suietKeys = Object.keys(window).filter(k => 
        k.toLowerCase().includes('suiet') || 
        k.toLowerCase().includes('sui') ||
        k.toLowerCase().includes('wallet')
      );
      
      info += '\n=== 相关全局变量 ===\n';
      if (suietKeys.length > 0) {
        info += suietKeys.slice(0, 20).join(', ') + '\n';
      } else {
        info += '无\n';
      }

      // 检查所有以 sui 开头的
      info += '\n=== window 对象中 sui 相关 ===\n';
      const allKeys = Object.keys(window);
      const suiRelated = allKeys.filter(k => k.toLowerCase().startsWith('sui'));
      info += suiRelated.length > 0 ? suiRelated.join(', ') : '无\n';

      setDebugInfo(info);
    };

    check();
    const timer = setInterval(check, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">🔍 钱包深度检测</h1>
      
      <div className="bg-gray-900 p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
        {debugInfo}
      </div>

      <div className="mt-4 p-4 bg-blue-900 rounded-lg">
        <p className="text-blue-400 font-bold">提示：</p>
        <ul className="list-disc list-inside text-sm mt-2">
          <li>确保 Suiet Wallet 扩展已解锁（需要输入密码）</li>
          <li>确保在扩展设置中允许 localhost</li>
          <li>尝试刷新页面后再检查</li>
        </ul>
      </div>
    </div>
  );
}
