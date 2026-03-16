'use client';

import { useState, useCallback } from 'react';

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    connected: false,
    loading: false,
    debug: '点击连接按钮输入地址',
  });

  const connect = useCallback(async () => {
    const address = prompt('请输入你的SUI钱包地址（66位字符）：\n\n如果没有，可以先输入测试地址：\n0xbfb88d37c8df43f0e826967cd635fa7b909da3d6fce691ca70e325a5fd95ed0e');
    
    if (address && address.length === 66 && address.startsWith('0x')) {
      setWallet({
        address,
        connected: true,
        loading: false,
        debug: '已连接: ' + address.slice(0, 10) + '...',
      });
    } else if (address) {
      alert('地址格式错误！必须是66位，以0x开头');
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({ address: null, connected: false, loading: false, debug: '' });
  }, []);

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled: true,
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
