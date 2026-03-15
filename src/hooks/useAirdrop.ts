'use client';

import { useState, useCallback } from 'react';

interface AirdropConfig {
  totalBudget: number;
  perUserCap: number;
  minInvites: number;
}

interface AirdropStats {
  totalDistributed: number;
  totalRecipients: number;
  remaining: number;
  dailyLimit: number;
  dailyDistributed: number;
}

interface ClaimResult {
  address: string;
  amount: number;
  txHash: string;
  status: string;
  explorerUrl: string;
}

export function useAirdrop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取空投信息
  const getAirdropInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/airdrop');
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch airdrop info:', err);
      return null;
    }
  }, []);

  // 领取空投
  const claimAirdrop = useCallback(async (address: string, invites: number): Promise<ClaimResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/airdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, invites }),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        setError(data.error);
        return null;
      }
      
      return data.data;
    } catch (err) {
      setError('领取失败，请重试');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAirdropInfo,
    claimAirdrop,
  };
}
