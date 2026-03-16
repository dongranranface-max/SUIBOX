'use client';

import { useState, useEffect } from 'react';

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    connected: false,
    loading: false,
    debug: '点击连接钱包按钮测试',
  });

  const connect = async () => {
    // 尝试标准方式
    if (typeof window !== 'undefined' && (window as unknown as { sui?: { wallets?: unknown[] } }).sui?.wallets?.length) {
      try {
        const suiWallet = (window as unknown as { sui: { wallets: { connect: () => Promise<void>; accounts: { address: string }[] }[] } }).sui.wallets[0];
        await suiWallet.connect();
        if (suiWallet.accounts?.[0]?.address) {
          setWallet({
            address: suiWallet.accounts[0].address,
            connected: true,
            loading: false,
            debug: '已连接',
          });
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 如果标准方式失败，让用户手动输入
    const address = prompt('无法自动检测到钱包，请手动输入你的SUI钱包地址：\n\n如果你没有钱包，请先安装Suiet Wallet或Sui Wallet');
    
    if (address && address.length === 66) {
      setWallet({
        address: address,
        connected: true,
        loading: false,
        debug: '手动连接成功',
      });
    } else if (address) {
      alert('地址格式不正确，应该是66个字符');
    }
  };

  const disconnect = () => {
    setWallet({ address: null, connected: false, loading: false, debug: '' });
  };

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled: false, // 简化检测
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
