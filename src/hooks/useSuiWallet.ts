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

      // 1. 先切换到 SUI Devnet (0x3)
      try {
        // @ts-ignore
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x3' }],
        });
      } catch (e) {
        // 忽略
      }

      // 等待网络切换
      await new Promise(r => setTimeout(r, 1000));

      // 2. 尝试获取 SUI 地址
      try {
        // @ts-ignore
        const suiAddrs = await eth.request({ 
          method: 'suix_getAllAddresses' 
        });
        
        if (suiAddrs && suiAddrs.length > 0) {
          // SUI 地址是66个字符
          if (suiAddrs[0].length === 66) {
            setAddress(suiAddrs[0]);
            setConnected(true);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // 忽略
      }

      // 3. 如果没有SUI地址，获取普通账户
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
