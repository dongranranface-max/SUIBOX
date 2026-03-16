'use client';

import { useState, useEffect, useCallback } from 'react';

// Sui Wallet Standard 类型
interface Wallet {
  name: string;
  icon?: string;
  accounts: { address: string }[];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    sui?: {
      wallets: Wallet[];
    };
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    connected: false,
    loading: true,
  });

  // 使用Wallet Standard检测钱包
  const detectWallet = useCallback(() => {
    if (typeof window === 'undefined') {
      setWallet({ address: null, connected: false, loading: false });
      return;
    }

    // 检查window.sui (Sui Wallet Standard)
    const suiWindow = window.sui;
    if (suiWindow?.wallets?.length > 0) {
      const suiWallet = suiWindow.wallets.find((w: Wallet) => 
        w.name?.toLowerCase().includes('sui')
      );
      
      if (suiWallet?.accounts?.[0]?.address) {
        setWallet({
          address: suiWallet.accounts[0].address,
          connected: true,
          loading: false,
        });
        return;
      }
    }

    setWallet({ address: null, connected: false, loading: false });
  }, []);

  useEffect(() => {
    detectWallet();
    
    // 监听钱包变化
    const handleChange = () => detectWallet();
    window.addEventListener('wallet:change', handleChange);
    window.addEventListener('storage', handleChange);
    
    const interval = setInterval(detectWallet, 3000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('wallet:change', handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, [detectWallet]);

  const connect = async () => {
    const suiWindow = window.sui;
    if (!suiWindow?.wallets?.length) {
      alert('请安装Sui Wallet钱包！\nhttps://sui.io/wallet');
      return;
    }

    setWallet(prev => ({ ...prev, loading: true }));
    try {
      const suiWallet = suiWindow.wallets.find((w: Wallet) => 
        w.name?.toLowerCase().includes('sui')
      );
      
      if (suiWallet) {
        await suiWallet.connect();
        if (suiWallet.accounts?.[0]?.address) {
          setWallet({ 
            address: suiWallet.accounts[0].address, 
            connected: true, 
            loading: false 
          });
        }
      }
    } catch (e) {
      console.error(e);
      setWallet(prev => ({ ...prev, loading: false }));
    }
  };

  const disconnect = async () => {
    const suiWindow = window.sui;
    if (suiWindow?.wallets?.length) {
      const suiWallet = suiWindow.wallets.find((w: Wallet) => 
        w.name?.toLowerCase().includes('sui')
      );
      if (suiWallet) {
        await suiWallet.disconnect();
      }
    }
    setWallet({ address: null, connected: false, loading: false });
  };

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled: typeof window !== 'undefined' && !!window.sui?.wallets?.length,
  };
}

export function shortenAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
