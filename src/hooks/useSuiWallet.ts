'use client';

import { useState, useEffect, useCallback } from 'react';

export function useSuiWallet() {
  const [address, setAddress] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const connect = useCallback(async () => {
    setLoading(true);
    
    try {
      // @ts-ignore
      const eth = window.ethereum;
      if (!eth) {
        setLoading(false);
        return;
      }

      // 直接尝试获取账户
      try {
        // @ts-ignore
        const accounts = await eth.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setConnected(true);
        }
      } catch (e) {
        // 忽略
      }
    } catch (e) {
      // 忽略
    }
    
    setLoading(false);
  }, []);

  const disconnect = useCallback(() => {
    setAddress('');
    setConnected(false);
  }, []);

  return { address, connected, loading, connect, disconnect };
}
