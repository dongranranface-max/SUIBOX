'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface StatsData {
  sui: {
    price: number;
    change: number;
    chart: number[];
  };
  box: {
    price: number;
    change: number;
    chart: number[];
  };
  gasFee: number;
  platform: {
    tradingVolume: number;
    nftTotal: number;
    nftStaked: number;
    boxStaked: number;
    suiStaked: number;
    nftHolders: number;
    royaltyPaid: number;
  };
}

export function useStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStats = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchRef.current < 60000) {
      return;
    }
    lastFetchRef.current = now;

    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Stats fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 定时刷新 - 每60秒，不依赖 fetchStats 引用避免重复创建 interval
  useEffect(() => {
    const id = setInterval(() => fetchStats(), 60000);
    return () => clearInterval(id);
  }, [fetchStats]);

  // 手动刷新
  const refresh = useCallback(() => {
    return fetchStats(true);
  }, [fetchStats]);

  return { stats, loading, error, refresh };
}
