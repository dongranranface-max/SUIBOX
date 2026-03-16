'use client';

import { useState, useEffect, useCallback } from 'react';

interface SuiWallet {
  name: string;
  icon?: string;
  accounts: { address: string }[];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    suiet?: { address: string; connected: boolean };
    sui?: { wallets: SuiWallet[] };
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

    // 检查Suiet
    if (window.suiet) {
      debugInfo = 'Suiet: ';
      if (window.suiet.connected && window.suiet.address) {
        addr = window.suiet.address;
        conn = true;
        debugInfo += 'connected ' + addr.slice(0, 8);
      } else {
        debugInfo += 'not connected';
      }
    }
    // 检查官方
    else if (window.sui?.wallets) {
      debugInfo = 'Sui: ';
      const suiWallet = window.sui.wallets[0];
      if (suiWallet?.accounts?.[0]?.address) {
        addr = suiWallet.accounts[0].address;
        conn = true;
        debugInfo += 'connected ' + addr.slice(0, 8);
      } else {
        debugInfo += 'wallets exist but not connected';
      }
    } else {
      debugInfo = 'No wallet found';
    }

    setWallet({
      address: addr,
      connected: conn,
      loading: false,
      debug: debugInfo,
    });
  }, []);

  useEffect(() => {
    // 立即检查
    checkWallet();

    // 使用 MutationObserver 监听 DOM 变化（钱包可能延迟注入）
    const observer = new MutationObserver(() => {
      checkWallet();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 定时检查
    const timer = setInterval(checkWallet, 1000);

    // 监听钱包事件
    const handleWalletChange = () => checkWallet();
    window.addEventListener('wallet:change', handleWalletChange);

    return () => {
      observer.disconnect();
      clearInterval(timer);
      window.removeEventListener('wallet:change', handleWalletChange);
    };
  }, [checkWallet]);

  const connect = async () => {
    // 如果有Suiet
    if (window.suiet) {
      // Suiet需要用户手动在钱包里授权
      // 我们只需要刷新状态
      setTimeout(checkWallet, 2000);
      return;
    }

    // 如果有官方钱包
    if (window.sui?.wallets?.length) {
      try {
        await window.sui.wallets[0].connect();
        setTimeout(checkWallet, 2000);
        return;
      } catch (e) {
        console.error(e);
      }
    }

    alert('请在浏览器右上角打开钱包，点击"连接"授权网站！');
  };

  const disconnect = () => {
    setWallet({ address: null, connected: false, loading: false, debug: '' });
  };

  const isInstalled = typeof window !== 'undefined' && (!!window.suiet || !!window.sui?.wallets?.length);

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled,
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
