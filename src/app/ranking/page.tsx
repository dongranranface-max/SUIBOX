'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, TrendingUp, Flame, ArrowUp, ArrowDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// 综合排行榜数据（模拟真实数据）
const allNFTs = [
  { id: 1, name: '星辰大海 #88', collection: '星辰大海', volume: 1250000, change: 91.1, image: '/nft-common.png', rarity: 'SSR', type: 'market' },
  { id: 2, name: '烈焰麒麟 #66', collection: '烈焰麒麟', volume: 890000, change: 45.2, image: '/fragment-epic.png', rarity: 'SR', type: 'market' },
  { id: 3, name: '宇宙之心 #01', collection: '宇宙之心', volume: 850000, change: 156.3, image: '/nft-common.png', rarity: '传说', type: 'auction' },
  { id: 4, name: '冰晶之心 #33', collection: '冰晶之心', volume: 670000, change: 23.5, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 5, name: '暗黑天使 #25', collection: '暗黑天使', volume: 450000, change: 15.8, image: '/fragment-epic.png', rarity: 'R', type: 'market' },
  { id: 6, name: '机械之心 #77', collection: '机械之心', volume: 420000, change: 88.2, image: '/nft-common.png', rarity: '史诗', type: 'auction' },
  { id: 7, name: '机械之心 #11', collection: '机械之心', volume: 320000, change: -8.2, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 8, name: '星空漫步 #99', collection: '星空漫步', volume: 280000, change: 55.5, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 9, name: '深海巨兽 #45', collection: '深海巨兽', volume: 210000, change: 33.3, image: '/fragment-epic.png', rarity: 'SR', type: 'auction' },
  { id: 10, name: '火焰使者 #77', collection: '火焰使者', volume: 180000, change: -12.5, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 11, name: '星辰大海 #99', collection: '星辰大海', volume: 165000, change: 55.2, image: '/nft-common.png', rarity: 'SSR', type: 'market' },
  { id: 12, name: '烈焰麒麟 #88', collection: '烈焰麒麟', volume: 152000, change: 33.3, image: '/fragment-epic.png', rarity: 'SR', type: 'market' },
  { id: 13, name: '冰晶之心 #55', collection: '冰晶之心', volume: 138000, change: 18.8, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 14, name: '暗黑天使 #77', collection: '暗黑天使', volume: 125000, change: 22.1, image: '/fragment-epic.png', rarity: 'R', type: 'market' },
  { id: 15, name: '机械之心 #55', collection: '机械之心', volume: 112000, change: 12.5, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 16, name: '星际远征 #12', collection: '星际远征', volume: 98000, change: 45.8, image: '/nft-common.png', rarity: 'SR', type: 'auction' },
  { id: 17, name: '深海巨兽 #88', collection: '深海巨兽', volume: 85000, change: 28.3, image: '/fragment-epic.png', rarity: 'SR', type: 'market' },
  { id: 18, name: '火焰使者 #33', collection: '火焰使者', volume: 72000, change: -5.2, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 19, name: '星辰大海 #55', collection: '星辰大海', volume: 68000, change: 35.5, image: '/nft-common.png', rarity: 'SSR', type: 'market' },
  { id: 20, name: '烈焰麒麟 #99', collection: '烈焰麒麟', volume: 65000, change: 66.6, image: '/fragment-epic.png', rarity: 'SR', type: 'auction' },
  { id: 21, name: '冰晶之心 #77', collection: '冰晶之心', volume: 58000, change: 15.2, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 22, name: '暗黑天使 #55', collection: '暗黑天使', volume: 52000, change: 8.8, image: '/fragment-epic.png', rarity: 'R', type: 'market' },
  { id: 23, name: '机械之心 #99', collection: '机械之心', volume: 48000, change: -3.2, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 24, name: '星空漫步 #66', collection: '星空漫步', volume: 45000, change: 22.5, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 25, name: '宇宙之心 #05', collection: '宇宙之心', volume: 42000, change: 89.3, image: '/nft-common.png', rarity: '传说', type: 'auction' },
  { id: 26, name: '深海巨兽 #22', collection: '深海巨兽', volume: 38000, change: 12.8, image: '/fragment-epic.png', rarity: 'SR', type: 'market' },
  { id: 27, name: '火焰使者 #11', collection: '火焰使者', volume: 35000, change: -8.5, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 28, name: '星辰大海 #33', collection: '星辰大海', volume: 32000, change: 25.8, image: '/nft-common.png', rarity: 'SSR', type: 'market' },
  { id: 29, name: '烈焰麒麟 #77', collection: '烈焰麒麟', volume: 29000, change: 18.2, image: '/fragment-epic.png', rarity: 'SR', type: 'market' },
  { id: 30, name: '冰晶之心 #88', collection: '冰晶之心', volume: 26000, change: 8.5, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 31, name: '暗黑天使 #99', collection: '暗黑天使', volume: 23000, change: 5.2, image: '/fragment-epic.png', rarity: 'R', type: 'market' },
  { id: 32, name: '机械之心 #22', collection: '机械之心', volume: 21000, change: -2.8, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 33, name: '星空漫步 #44', collection: '星空漫步', volume: 18500, change: 15.8, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 34, name: '星际远征 #08', collection: '星际远征', volume: 16000, change: 32.5, image: '/nft-common.png', rarity: 'SR', type: 'auction' },
  { id: 35, name: '深海巨兽 #66', collection: '深海巨兽', volume: 14000, change: 8.2, image: '/fragment-epic.png', rarity: 'SR', type: 'market' },
  { id: 36, name: '火焰使者 #55', collection: '火焰使者', volume: 12000, change: -5.8, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 37, name: '星辰大海 #11', collection: '星辰大海', volume: 10500, change: 18.5, image: '/nft-common.png', rarity: 'SSR', type: 'market' },
  { id: 38, name: '烈焰麒麟 #22', collection: '烈焰麒麟', volume: 9200, change: 12.2, image: '/fragment-epic.png', rarity: 'SR', type: 'market' },
  { id: 39, name: '冰晶之心 #11', collection: '冰晶之心', volume: 8000, change: 5.5, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 40, name: '暗黑天使 #33', collection: '暗黑天使', volume: 7200, change: 3.2, image: '/fragment-epic.png', rarity: 'R', type: 'market' },
  { id: 41, name: '机械之心 #88', collection: '机械之心', volume: 6500, change: -1.2, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 42, name: '星空漫步 #22', collection: '星空漫步', volume: 5800, change: 10.5, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 43, name: '宇宙之心 #03', collection: '宇宙之心', volume: 5200, change: 45.2, image: '/nft-common.png', rarity: '传说', type: 'auction' },
  { id: 44, name: '深海巨兽 #33', collection: '深海巨兽', volume: 4500, change: 5.8, image: '/fragment-epic.png', rarity: 'SR', type: 'market' },
  { id: 45, name: '火焰使者 #88', collection: '火焰使者', volume: 3800, change: -3.5, image: '/nft-common.png', rarity: 'R', type: 'market' },
  { id: 46, name: '星辰大海 #77', collection: '星辰大海', volume: 3200, change: 12.8, image: '/nft-common.png', rarity: 'SSR', type: 'market' },
  { id: 47, name: '烈焰麒麟 #11', collection: '烈焰麒麟', volume: 2800, change: 8.5, image: '/fragment-epic.png', rarity: 'SR', type: 'market' },
  { id: 48, name: '冰晶之心 #22', collection: '冰晶之心', volume: 2400, change: 3.2, image: '/fragment-rare.png', rarity: 'SR', type: 'market' },
  { id: 49, name: '暗黑天使 #44', collection: '暗黑天使', volume: 2000, change: 1.5, image: '/fragment-epic.png', rarity: 'R', type: 'market' },
  { id: 50, name: '机械之心 #33', collection: '机械之心', volume: 1500, change: -0.8, image: '/nft-common.png', rarity: 'R', type: 'market' },
];

const rarityColors: Record<string, string> = {
  'SSR': 'bg-gradient-to-r from-yellow-500 to-orange-500',
  'SR': 'bg-gradient-to-r from-purple-500 to-pink-500',
  'R': 'bg-gradient-to-r from-blue-500 to-cyan-500',
  '传说': 'bg-gradient-to-r from-orange-600 to-red-600',
  '史诗': 'bg-gradient-to-r from-purple-600 to-pink-600',
};

const typeLabels: Record<string, { label: string, color: string }> = {
  market: { label: '市场', color: 'bg-blue-500/20 text-blue-400' },
  auction: { label: '拍卖', color: 'bg-orange-500/20 text-orange-400' },
};

export default function RankingPage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [sortBy, setSortBy] = useState<'volume' | 'change'>('volume');
  const [filterType, setFilterType] = useState<'all' | 'market' | 'auction'>('all');

  const filteredNFTs = allNFTs
    .filter(nft => filterType === 'all' || nft.type === filterType)
    .sort((a, b) => sortBy === 'volume' ? b.volume - a.volume : b.change - a.change);

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(0)}K`;
    return vol.toString();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            NFT交易排行榜
          </h1>
          <p className="text-gray-400">综合市场与拍卖数据，展示全站交易热度最高的NFT</p>
        </div>

        {/* 筛选和排序 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-all ${filterType === 'all' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType('market')}
              className={`px-4 py-2 rounded-lg transition-all ${filterType === 'market' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              市场
            </button>
            <button
              onClick={() => setFilterType('auction')}
              className={`px-4 py-2 rounded-lg transition-all ${filterType === 'auction' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              拍卖
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('volume')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${sortBy === 'volume' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              <TrendingUp className="w-4 h-4" />
              交易量
            </button>
            <button
              onClick={() => setSortBy('change')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${sortBy === 'change' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              <Flame className="w-4 h-4" />
              涨幅
            </button>
          </div>
        </div>

        {/* 排行榜列表 */}
        <div className="space-y-3">
          {filteredNFTs.map((nft, i) => (
            <Link 
              key={nft.id} 
              href={`/nft/${nft.id}`}
              className="flex items-center gap-4 p-4 bg-gray-900/60 rounded-xl hover:bg-gray-800/80 transition-all hover:scale-[1.01]"
            >
              {/* 排名 */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold ${
                i === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                i === 1 ? 'bg-gray-300/20 text-gray-300' : 
                i === 2 ? 'bg-orange-500/20 text-orange-400' : 
                'bg-gray-700/50 text-gray-500'
              }`}>
                {i + 1}
              </div>

              {/* 图片 */}
              <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                <Image src={nft.image} alt={nft.name} fill className="object-cover" />
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${rarityColors[nft.rarity] || 'bg-gray-600'}`}>
                    {nft.rarity}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${typeLabels[nft.type].color}`}>
                    {typeLabels[nft.type].label}
                  </span>
                </div>
                <p className="font-medium truncate">{nft.name}</p>
                <p className="text-sm text-gray-400">{nft.collection}</p>
              </div>

              {/* 交易量和涨幅 */}
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-violet-400">{formatVolume(nft.volume)} SUI</p>
                <p className={`text-sm flex items-center justify-end gap-1 ${nft.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {nft.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(nft.change)}%
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 分页提示 */}
        <div className="text-center mt-8 text-gray-500">
          <p>共展示 {filteredNFTs.length} 个NFT</p>
        </div>
      </main>
    </div>
  );
}
