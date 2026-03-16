'use client';

import { useState, useEffect } from 'react';

export function useWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    connected: false,
    loading: true,
    debug: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 监听消息（钱包通过postMessage通信）
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'suiet-connected') {
        setWallet({
          address: event.data.address,
          connected: true,
          loading: false,
          debug: 'Connected via postMessage',
        });
      }
    };

    window.addEventListener('message', handleMessage);

    // 定时检查localStorage（部分钱包会存这里）
    const check = () => {
      try {
        const suiAddress = localStorage.getItem('sui_address');
        if (suiAddress) {
          setWallet({
            address: suiAddress,
            connected: true,
            loading: false,
            debug: 'Found in localStorage',
          });
          return;
        }
      } catch (e) {}

      setWallet(prev => ({ ...prev, loading: false, debug: 'No wallet detected' }));
    };

    check();
    const timer = setInterval(check, 2000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(timer);
    };
  }, []);

  const connect = async () => {
    // 尝试打开Suiet
    // Suiet没有标准API，我们用一种workaround方式
    
    // 方法1: 尝试Suiet Deep Link
    const suietUrl = 'suiet://connect';
    
    // 方法2: 提示用户手动授权
    alert('请在打开的钱包窗口中点击"连接/Connect"按钮授权网站！\n\n如果找不到钱包窗口，请点击浏览器右上角的钱包图标。');
  };

  const disconnect = () => {
    try {
      localStorage.removeItem('sui_address');
    } catch (e) {}
    setWallet({ address: null, connected: false, loading: false, debug: '' });
  };

  return {
    ...wallet,
    connect,
    disconnect,
    isInstalled: true, // 假设已安装，让用户可以尝试连接
  };
}

export function shortenAddress(addr: string | null): string {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
