'use client';

import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    suiet?: { address: string; connected: boolean };
    sui?: unknown;
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    connected: false,
    loading: true,
    debug: '',
  });

  const checkWallet = useCallback(async () => {
    if (typeof window === 'undefined') return;

    let debugInfo = '';
    let addr: string | null = null;
    let conn = false;

    // 1. 检查Suiet
    if (window.suiet) {
      debugInfo += 'Suiet detected. ';
      if (window.suiet.connected && window.suiet.address) {
        addr = window.suiet.address;
        conn = true;
        debugInfo += 'Connected!';
      } else {
        debugInfo += 'Not connected.';
      }
    } else {
      debugInfo += 'No Suiet. ';
    }

    // 2. 检查Sui官方钱包 (通过全局对象)
    // 官方钱包会注入到window.SUI_WALLET或类似位置
    const suiKeys = Object.keys(window).filter(k => 
      k.toLowerCase().includes('sui') || k.toLowerCase().includes('wallet')
    );
    if (suiKeys.length > 0) {
      debugInfo += ` Found keys: ${suiKeys.join(', ')}`;
    }

    setWallet({
      address: addr,
      connected: conn,
      loading: false,
      debug: debugInfo,
    });
  }, []);

  useEffect(() => {
    checkWallet();
    const timer = setInterval(checkWallet, 2000);
    return () => clearInterval(timer);
  }, [checkWallet]);

  const connect = async () => {
    // 尝试触发Suiet连接
    if (window.suiet) {
      // Suiet会自动弹窗
      // 刷新状态
      setTimeout(checkWallet, 2000);
      return;
    }

    // 尝试Sui官方钱包
    alert('请在浏览器右上角点击Sui Wallet图标进行连接！\n\n如果看不到图标，请：\n1. 点击浏览器右上角拼图🧩\n2. 找到Sui Wallet并固定\n3. 解锁钱包');
  };

  const disconnect = () => {
    setWallet({ address: null, connected: false, loading: false, debug: '' });
  };

  return {
    ...wallet,
    connect,
    disconnect,
  const isInstalled = typeof window !== 'undefined' && (!!window.suiet || !!window.sui);
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
