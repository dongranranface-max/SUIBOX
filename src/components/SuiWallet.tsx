'use client';

import { useWallet, shortenAddress } from '@/hooks/useWallet';
import { Wallet, LogOut, Loader2, AlertTriangle } from 'lucide-react';

export function SuiWalletButton() {
  const { address, connected, loading, connect, disconnect, isInstalled, debug } = useWallet();

  if (loading) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>检测中...</span>
      </button>
    );
  }

  if (connected && address) {
    return (
      <button 
        onClick={disconnect}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-500 hover:to-pink-500 transition-all text-sm"
      >
        <Wallet className="w-4 h-4" />
        <span>{shortenAddress(address)}</span>
        <LogOut className="w-3 h-3" />
      </button>
    );
  }

  return (
    <button 
      onClick={connect}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg hover:from-violet-500 hover:to-pink-500 transition-all text-sm"
    >
      <Wallet className="w-4 h-4" />
      <span>连接钱包</span>
    </button>
  );
}

// 调试组件 - 显示检测信息
export function WalletDebug() {
  const { debug, isInstalled } = useWallet();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-xs text-gray-400 p-2 rounded max-w-xs">
      <div>已安装: {isInstalled ? '✓' : '✗'}</div>
      <div>检测信息: {debug || '无'}</div>
    </div>
  );
}
