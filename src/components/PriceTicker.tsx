'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  prices: number[]; // Historical prices for sparkline
  icon: string;
  color: string;
}

// Mock historical data for sparkline (in real app, fetch from API)
const generateSparkline = (basePrice: number): number[] => {
  const points = 24;
  const data: number[] = [];
  let price = basePrice * 0.95;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * basePrice * 0.04;
    price = Math.max(price + change, basePrice * 0.9);
    data.push(price);
  }
  data[data.length - 1] = basePrice;
  return data;
};

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export default function PriceTicker() {
  const [prices, setPrices] = useState<PriceData[]>([
    { symbol: 'SUI', name: 'SUI Token', price: 0.9726, change24h: -2.57, prices: [], icon: '/sui-logo.png', color: '#6DB3F2' },
    { symbol: 'BOX', name: 'BOX Token', price: 0.01, change24h: 0, prices: [], icon: '/box-logo.png', color: '#FFD700' },
  ]);
  const [priceFlash, setPriceFlash] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch SUI price from CoinGecko
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await response.json();
        
        if (data.sui) {
          const suiPrice = data.sui.usd;
          const suiChange = data.sui.usd_24h_change;
          
          // 价格更新时闪烁
          setPrices(prev => {
            const newPrices = prev.map(p => {
              if (p.symbol === 'SUI') {
                if (p.price !== suiPrice) {
                  setPriceFlash(f => ({ ...f, [p.symbol]: true }));
                  setTimeout(() => setPriceFlash(f => ({ ...f, [p.symbol]: false })), 500);
                }
                return {
                  ...p,
                  price: suiPrice,
                  change24h: suiChange,
                  prices: generateSparkline(suiPrice),
                };
              }
              // For BOX (not listed yet), use mock data
              if (p.symbol === 'BOX') {
                return {
                  ...p,
                  prices: generateSparkline(p.price),
                };
              }
              return p;
            });
            return newPrices;
          });
        }
      } catch (error) {
        console.error('Failed to fetch prices:', error);
        // Use mock data on error
        setPrices(prev => prev.map(p => ({
          ...p,
          prices: generateSparkline(p.price),
        })));
      } finally {
        // 数据更新完成
      }
    };

    fetchPrices();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderSparkline = (data: number[], color: string) => {
    if (!data || data.length === 0) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 32;
    const stepX = width / (data.length - 1);

    const points = data.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const gradientId = `sparkline-gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Glow effect */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
        />
        {/* Current price dot */}
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="4"
          fill={color}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-gray-500">Price Reference</div>
      {prices.map((token) => (
        <div
          key={token.symbol}
          className="bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all border border-white/5"
        >
          {/* Token Icon */}
          <div className="w-8 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
            <Image src={token.icon} alt={token.symbol} width={32} height={32} className="object-contain" />
          </div>

          {/* Token Info */}
          <div className="space-y-1 min-w-[80px]">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-white text-sm">{token.symbol}</span>
              <span className="text-gray-500 text-xs">{token.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-white font-bold text-sm transition-all duration-300 ${priceFlash[token.symbol] ? 'scale-125 brightness-150' : ''}`}>
                ${token.price < 1 ? token.price.toFixed(4) : token.price.toFixed(2)}
              </span>
              <span className={`text-xs font-medium transition-all duration-300 ${priceFlash[token.symbol] ? 'scale-125' : ''} ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Sparkline Chart */}
          <div className="ml-auto">
            {renderSparkline(token.prices, token.color)}
          </div>
        </div>
      ))}
    </div>
  );
}
