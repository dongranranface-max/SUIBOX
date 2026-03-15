'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';

// 模拟拍卖数据 - 使用时间戳
const now = Date.now();
const auctionList = [
  { id: 1, name: '星辰大海 #01', artist: 'CryptoArtist', rarity: 'Epic', currentPrice: 888, startPrice: 500, bids: 23, endTime: now + 2*60*60*1000 + 30*60*1000, image: '/fragment-epic.png', desc: '稀有的星空主题NFT，全球唯一编号！' },
  { id: 2, name: '烈焰麒麟 #99', artist: 'FireMaster', rarity: 'Epic', currentPrice: 1500, startPrice: 800, bids: 56, endTime: now + 5*60*60*1000 + 45*60*1000, image: '/fragment-epic.png', desc: '燃烧的麒麟兽，传说级艺术品！' },
  { id: 3, name: '冰晶之心 #88', artist: 'IceQueen', rarity: 'Epic', currentPrice: 2000, startPrice: 1000, bids: 89, endTime: now + 8*60*60*1000, image: '/fragment-rare.png', desc: '冰封的宝石之心！' },
  { id: 4, name: '机械之心 #77', artist: 'RoboMaster', rarity: 'Rare', currentPrice: 666, startPrice: 300, bids: 34, endTime: now + 1*24*60*60*1000, image: '/nft-common.png', desc: '未来科技感NFT！' },
  { id: 5, name: '暗黑天使 #33', artist: 'DarkArtist', rarity: 'Rare', currentPrice: 520, startPrice: 200, bids: 12, endTime: now + 2*24*60*60*1000, image: '/fragment-epic.png', desc: '黑暗系艺术品！' },
  { id: 6, name: '深海巨兽 #12', artist: 'SeaMaster', rarity: 'Rare', currentPrice: 999, startPrice: 400, bids: 45, endTime: now + 3*24*60*60*1000, image: '/fragment-epic.png', desc: '神秘海洋生物！' },
];

export default function AuctionPage() {
  const [activeTab, setActiveTab] = useState<'hot' | 'ending' | 'new'>('hot');
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [countdown, setCountdown] = useState<Record<number, {days: number; hours: number; minutes: number; seconds: number}>>({});

  // 倒计时计算
  useEffect(() => {
    const updateCountdown = () => {
      const newCountdown: Record<number, {days: number; hours: number; minutes: number; seconds: number}> = {};
      auctionList.forEach(auction => {
        const diff = auction.endTime - Date.now();
        if (diff <= 0) {
          newCountdown[auction.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        } else {
          newCountdown[auction.id] = {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          };
        }
      });
      setCountdown(newCountdown);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // 格式化倒计时 - 精确到秒
  const formatCountdown = (auctionId: number) => {
    const c = countdown[auctionId];
    if (!c) return '已结束';
    if (c.days > 0) return `${c.days}天${c.hours}时${c.minutes}分${c.seconds}秒`;
    if (c.hours > 0) return `${c.hours}时${c.minutes}分${c.seconds}秒`;
    if (c.minutes > 0) return `${c.minutes}分${c.seconds}秒`;
    return `${c.seconds}秒`;
  };

  // 过滤拍卖
  const filteredAuctions = activeTab === 'ending' 
    ? [...auctionList].sort((a, b) => a.endTime - b.endTime)
    : activeTab === 'new'
    ? [...auctionList].sort((a, b) => b.id - a.id)
    : [...auctionList].sort((a, b) => b.bids - a.bids);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 头部 */}
      <div className="bg-gradient-to-b from-violet-900/20 to-transparent pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🔥 NFT拍卖</h1>
          <p className="text-gray-400">参与拍卖，竞得稀有NFT！</p>
        </div>
      </div>

      {/* 标签页 */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'hot', label: '热门拍卖', icon: '🔥' },
            { key: 'ending', label: '即将结束', icon: '⏰' },
            { key: 'new', label: '最新上架', icon: '🆕' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 拍卖列表 */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <div 
              key={auction.id} 
              className="bg-gray-900 rounded-2xl overflow-hidden hover:ring-2 hover:ring-violet-500 transition-all cursor-pointer"
              onClick={() => setSelectedAuction(auction)}
            >
              <div className="aspect-square relative bg-gray-800">
                <Image src={auction.image} alt={auction.name} fill className="object-cover" />
                {/* 倒计时 */}
                <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 ${
                  countdown[auction.id]?.days !== undefined && countdown[auction.id].days < 1 
                    ? 'bg-red-600 animate-pulse' 
                    : 'bg-orange-600/80 backdrop-blur-sm'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatCountdown(auction.id)}</span>
                </div>
                {/* 稀有度 */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${
                  auction.rarity === 'Epic' ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  {auction.rarity}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{auction.name}</h3>
                <p className="text-gray-400 text-sm mb-3">by {auction.artist}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-xs">当前价</p>
                    <p className="text-xl font-bold text-violet-400">{auction.currentPrice} SUI</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">竞价次数</p>
                    <p className="font-bold">{auction.bids}次</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedAuction && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAuction(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-square relative bg-gray-800">
                <Image src={selectedAuction.image} alt={selectedAuction.name} fill className="object-cover" />
                <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 ${
                  countdown[selectedAuction.id]?.days !== undefined && countdown[selectedAuction.id].days < 1 
                    ? 'bg-red-600 animate-pulse' 
                    : 'bg-orange-600/80 backdrop-blur-sm'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatCountdown(selectedAuction.id)}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAuction.name}</h2>
                    <p className="text-gray-400">by {selectedAuction.artist}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    selectedAuction.rarity === 'Epic' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    {selectedAuction.rarity}
                  </span>
                </div>

                <p className="text-gray-300 mb-6">{selectedAuction.desc}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">当前价</p>
                    <p className="text-2xl font-bold text-violet-400">{selectedAuction.currentPrice} SUI</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">起拍价</p>
                    <p className="text-xl font-bold">{selectedAuction.startPrice} SUI</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">竞价次数</p>
                    <p className="text-xl font-bold">{selectedAuction.bids}次</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold text-lg hover:from-violet-700 hover:to-pink-700 transition-all">
                  参与竞拍
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
