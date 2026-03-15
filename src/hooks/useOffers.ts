import { useState, useEffect, useCallback } from 'react';

export interface Offer {
  id: string;
  nftId: number;
  nftName: string;
  nftImage: string;
  offerPrice: number;
  marketPrice: number;
  buyer: string;
  seller: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: number;
  updatedAt: number;
  counterOffer?: number;
}

export function useOffers(address?: string, type: 'received' | 'sent' | 'all' = 'all') {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    if (!address) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`/api/offers?address=${address}&type=${type}`);
      const json = await res.json();
      if (json.success) {
        setOffers(json.data);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError('获取报价失败');
    } finally {
      setLoading(false);
    }
  }, [address, type]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const createOffer = async (offerData: Omit<Offer, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData),
    });
    const json = await res.json();
    if (json.success) {
      await fetchOffers();
    }
    return json;
  };

  const updateOfferStatus = async (offerId: string, action: 'accept' | 'reject' | 'counter', counterOffer?: number) => {
    const res = await fetch('/api/offers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, action, counterOffer }),
    });
    const json = await res.json();
    if (json.success) {
      await fetchOffers();
    }
    return json;
  };

  return { offers, loading, error, refetch: fetchOffers, createOffer, updateOfferStatus };
}
