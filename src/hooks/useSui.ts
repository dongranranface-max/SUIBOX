'use client';

import { useState, useEffect, useCallback } from 'react';

// SUI RPC 端点
const SUI_RPC = {
  testnet: 'https://fullnode.testnet.sui.io',
  mainnet: 'https://fullnode.mainnet.sui.io',
};

type Network = 'testnet' | 'mainnet';

// 链上数据Hook
export function useSuiChain(network: Network = 'testnet') {
  const [gasPrice, setGasPrice] = useState<string>('0.00001');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取Gas价格
  const fetchGasPrice = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/sui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'suix_getReferenceGasPrice',
          params: [],
        }),
      });
      
      const data = await res.json();
      
      if (data.result) {
        // 转换为 SUI (Gwei to SUI)
        const price = (data.result / 1000000000).toFixed(6);
        setGasPrice(price);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取Gas失败');
      // 使用默认值
      setGasPrice('0.00001');
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取钱包余额
  const getBalance = useCallback(async (address: string): Promise<string> => {
    try {
      const res = await fetch('/api/sui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'suix_getBalance',
          params: [address, '0x2::sui::SUI'],
        }),
      });
      
      const data = await res.json();
      
      if (data.result?.totalBalance) {
        // 转换为 SUI
        return (Number(data.result.totalBalance) / 1000000000).toFixed(4);
      }
      return '0';
    } catch {
      return '0';
    }
  }, []);

  // 获取NFT列表
  const getNFTs = useCallback(async (address: string) => {
    try {
      const res = await fetch('/api/sui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'suix_getOwnedObjects',
          params: [
            address,
            {
              filter: { StructType: '0x2::nft::NFT' },
              options: { showContent: true },
            },
          ],
        }),
      });
      
      const data = await res.json();
      return data.result || [];
    } catch {
      return [];
    }
  }, []);

  // 初始化获取Gas价格
  useEffect(() => {
    fetchGasPrice();
    
    // 每30秒更新一次
    const interval = setInterval(fetchGasPrice, 30000);
    return () => clearInterval(interval);
  }, [fetchGasPrice]);

  return {
    gasPrice,
    loading,
    error,
    fetchGasPrice,
    getBalance,
    getNFTs,
  };
}

// 检查网络连接
export function useNetworkStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { online };
}
