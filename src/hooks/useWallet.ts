'use client';

import { useState, useEffect, useCallback } from 'react';

// 官方Sui Wallet类型
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

    // 1. 检查Suiet Wallet
    if (window.suiet) {
      debugInfo += 'Suiet found. ';
      if (window.suiet.connected && window.suiet.address) {
        addr = window.suiet.address;
        conn = true;
        debugInfo += 'Connected! ';
      } else {
        debugInfo += 'Not connected. ';
      }
    }

    // 2. 检查官方Sui Wallet (Wallet Standard)
    if (window.sui?.wallets) {
      debugInfo += 'Sui wallets found: ' + window.sui.wallets.length;
      const suiWallet = window.sui.wallets.find((w: SuiWallet) => 
        w.name?.toLowerCase().includes('sui')
      );
      if (suiWallet?.accounts?.[0]?.address) {
        addr = suiWallet.accounts[0].address;
        conn = true;
        debugInfo += ' - Connected!';
      }
    } else if (!window.suiet) {
      debugInfo += 'No wallets detected.';
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
    // 尝试Suiet
    if (window.suiet) {
      setTimeout(checkWallet, 2000);
      return;
    }

    // 尝试官方Sui Wallet
    if (window.sui?.wallets?.length) {
      const suiWallet = window.sui.wallets.find((w: SuiWallet) => 
        w.name?.toLowerCase().includes('sui')
      );
      if (suiWallet) {
        try {
          await suiWallet.connect();
          setTimeout(checkWallet, 2000);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 都没找到
    alert('请在浏览器右上角点击Sui Wallet图标连接！\n\n如果看不到钱包图标：\n1. 点击浏览器右上角拼图🧩\n2. 找到Sui Wallet并固定');
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
