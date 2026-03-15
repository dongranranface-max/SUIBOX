'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UserNFT {
  id: number;
  name: string;
  collection: string;
  rarity: string;
  image: string;
  price: number;
  floorPrice: number;
  change: number;
}

interface UserAuction {
  id: number;
  name: string;
  collection: string;
  rarity: string;
  image: string;
  currentPrice: number;
  myBid: number;
  bids: number;
  status: string;
  endTime: number;
  isWinning: boolean;
}

interface UserBid {
  id: number;
  auctionId: number;
  name: string;
  image: string;
  myBid: number;
  currentPrice: number;
  status: string;
  time: number;
}

interface SentOffer {
  id: number;
  nftId: number;
  nftName: string;
  nftImage: string;
  offerPrice: number;
  marketPrice: number;
  seller: string;
  status: string;
  createdAt: number;
}

interface Activity {
  type: string;
  nft: string;
  price?: number;
  time: number;
}

interface ProfileData {
  nfts: UserNFT[];
  favorites: UserNFT[];
  auctions: UserAuction[];
  bids: UserBid[];
  sentOffers: SentOffer[];
  activities: Activity[];
}

export function useProfile(address: string) {
  const [data, setData] = useState<ProfileData>({
    nfts: [],
    favorites: [],
    auctions: [],
    bids: [],
    sentOffers: [],
    activities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (force = false) => {
    if (!address) return;
    
    const now = Date.now();
    // 30秒内不重复请求（除非force）
    if (!force && now - lastFetchRef.current < 30000) {
      return;
    }
    
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    lastFetchRef.current = now;
    setLoading(true);
    
    try {
      const endpoints = [
        `/api/profile?type=nfts&address=${address}`,
        `/api/profile?type=favorites&address=${address}`,
        `/api/profile?type=auctions&address=${address}`,
        `/api/profile?type=bids&address=${address}`,
        `/api/profile?type=sent-offers&address=${address}`,
        `/api/profile?type=activities&address=${address}`,
      ];

      const results = await Promise.all(
        endpoints.map(async (url) => {
          try {
            const res = await fetch(url);
            const json = await res.json();
            return json.success ? json.data : [];
          } catch {
            return [];
          }
        })
      );

      setData({
        nfts: results[0] || [],
        favorites: results[1] || [],
        auctions: results[2] || [],
        bids: results[3] || [],
        sentOffers: results[4] || [],
        activities: results[5] || [],
      });
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Profile fetch error:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [address]);

  // 初始化加载
  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [address]);

  // 手动刷新
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    ...data,
    loading,
    error,
    refresh,
  };
}
