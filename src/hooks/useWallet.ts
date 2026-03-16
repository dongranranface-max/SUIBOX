'use client';

import { useState } from 'react';
import { useCurrentAccount, useWallets } from '@mysten/dapp-kit';

export function useWallet() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  
  const [savedAddress, setSavedAddress] = useState<string | null>(null);

  // 优先使用链上账户
  const address = account?.address || savedAddress;
  const connected = !!account || !!savedAddress;

  // 临时：允许手动设置地址（用于测试）
  const connect = () => {
    // 使用 dapp-kit 的连接功能
    // 实际连接由 ConnectButton 组件处理
    if (wallets?.length) {
      // 触发钱包选择
    }
  };

  // 临时存储地址用于测试
  const saveAddress = (addr: string) => {
    setSavedAddress(addr);
    localStorage.setItem('sui_address', addr);
  };

  const disconnect = () => {
    setSavedAddress(null);
    localStorage.removeItem('sui_address');
  };

  // 检查 localStorage
  if (typeof window !== 'undefined' && !account && !savedAddress) {
    const saved = localStorage.getItem('sui_address');
    if (saved) {
      setSavedAddress(saved);
    }
  }

  return {
    address,
    connected,
    loading: false,
    debug: connected ? `已连接: ${address?.slice(0, 10)}...` : '点击连接按钮',
    connect,
    disconnect,
    isInstalled: (wallets?.length || 0) > 0,
  };
}

export function shortenAddress(addr: string | null | undefined): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
