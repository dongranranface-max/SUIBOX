'use client';

import { useState, useEffect, useCallback } from 'react';

export function useSuiWallet() {
  const [address, setAddress] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const connect = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // @ts-ignore
      const eth = window.ethereum;
      if (!eth) {
        setError('未找到钱包');
        setLoading(false);
        return false;
      }

      // 尝试切换到 SUI Devnet
      try {
        // @ts-ignore
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x3' }],
        });
      } catch (e) {
        // 忽略
      }

      // 等待一下
      await new Promise(r => setTimeout(r, 500));

      // 尝试获取 SUI 地址
      try {
        // @ts-ignore
        const suiAddrs = await eth.request({ 
          method: 'suix_getAllAddresses' 
        });
        
        if (suiAddrs && suiAddrs.length > 0) {
          setAddress(suiAddrs[0]);
          setConnected(true);
          setLoading(false);
          return true;
        }
      } catch (e) {
        // 忽略
      }

      // 获取普通账户
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
        setError('连接失败');
      }
    } catch (e) {
      setError('错误');
    }
    
    setLoading(false);
    return false;
  }, []);

  const disconnect = useCallback(() => {
    setAddress('');
    setConnected(false);
  }, []);

  return { address, connected, loading, error, connect, disconnect };
}
