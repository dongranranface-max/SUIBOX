'use client';

import { useState, useEffect } from 'react';

interface WalletAccount {
  address: string;
  chain?: string;
}

interface Wallet {
  name: string;
  icon?: string;
  accounts: WalletAccount[];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    sui?: {
      hasWallets?: boolean;
      wallets?: Wallet[];
    };
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    connected: false,
    loading: true,
    debug: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const check = () => {
      // 使用Sui Wallet Standard
      if (window.sui?.wallets && window.sui.wallets.length > 0) {
        const suiWallet = window.sui.wallets[0];
        if (suiWallet.accounts && suiWallet.accounts.length > 0) {
          setWallet({
            address: suiWallet.accounts[0].address,
            connected: true,
            loading: false,
            debug: `${suiWallet.name}: ${suiWallet.accounts[0].address.slice(0, 10)}...`,
          });
          return;
        }
        setWallet(prev => ({
          ...prev,
          loading: false,
          debug: `${suiWallet.name} found but not connected`,
        }));
        return;
      }

      setWallet(prev => ({
        ...prev,
        loading: false,
        debug: 'No wallet connected. Click "Connect Wallet" to authorize.',
      }));
    };

    check();
    const timer = setInterval(check, 1500);
    return () => clearInterval(timer);
  }, []);

  const connect = async () => {
    // 使用Wallet Standard连接
    if (window.sui?.wallets && window.sui.wallets.length > 0) {
      try {
        const suiWallet = window.sui.wallets[0];
        await suiWallet.connect();
        
        // 等待连接
        setTimeout(() => {
          if (suiWallet.accounts && suiWallet.accounts.length > 0) {
            setWallet({
              address: suiWallet.accounts[0].address,
              connected: true,
              loading: false,
              debug: 'Connected!',
            });
          }
        }, 1000);
        return;
      } catch (e) {
        console.error('Connect error:', e);
        alert('连接失败，请重试！');
        return;
      }
    }

    alert('请先安装Sui Wallet钱包插件！\n\n推荐：\n1. Suiet Wallet\n2. 官方Sui Wallet\n\n安装后在钱包中点击"连接"授权。');
  };

  const disconnect = async () => {
    if (window.sui?.wallets && window.sui.wallets.length > 0) {
      try {
        await window.sui.wallets[0].disconnect();
      } catch (e) {
        console.error(e);
      }
    }
    setWallet({ address: null, connected: false, loading: false, debug: '' });
  };

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled: typeof window !== 'undefined' && !!window.sui?.wallets?.length,
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
