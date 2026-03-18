'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Clock, Zap, Hexagon } from 'lucide-react';

// 汇率: 仅支持BOX
const SUI_TO_BOX_RATE = 100;

// 模拟拍卖数据
const now = Date.now();
const auctionList = [
  { id: 1, name: '星辰大海 #01', artist: 'CryptoArtist', rarity: 'Epic', currentPrice: 888, bids: 23, endTime: now + 2*60*60*1000 + 30*60*1000, image: '/fragment-epic.png', buyNowPrice: 1500 },
  { id: 2, name: '烈焰麒麟 #99', artist: 'FireMaster', rarity: 'Epic', currentPrice: 1500, bids: 56, endTime: now + 5*60*60*1000 + 45*60*1000, image: '/fragment-epic.png', buyNowPrice: 2500 },
  { id: 3, name: '冰晶之心 #88', artist: 'IceQueen', rarity: 'Epic', currentPrice: 2000, bids: 89, endTime: now + 8*60*60*1000, image: '/fragment-rare.png', buyNowPrice: 3000 },
  { id: 4, name: '机械之心 #77', artist: 'RoboMaster', rarity: 'Rare', currentPrice: 666, bids: 34, endTime: now + 1*24*60*60*1000, image: '/nft-common.png', buyNowPrice: 1000 },
  { id: 5, name: '暗黑天使 #33', artist: 'DarkArtist', rarity: 'Rare', currentPrice: 520, bids: 12, endTime: now + 2*24*60*60*1000, image: '/fragment-epic.png', buyNowPrice: 800 },
  { id: 6, name: '深海巨兽 #12', artist: 'SeaMaster', rarity: 'Rare', currentPrice: 999, bids: 45, endTime: now + 3*24*60*60*1000, image: '/fragment-epic.png', buyNowPrice: 1500 },
  { id: 7, name: '金色凤凰 #55', artist: 'Phoenix', rarity: 'Epic', currentPrice: 2888, bids: 78, endTime: now + 4*60*60*1000, image: '/fragment-epic.png', buyNowPrice: 4000 },
  { id: 8, name: '绿茵王者 #10', artist: 'SoccerKing', rarity: 'Rare', currentPrice: 388, bids: 19, endTime: now + 12*60*60*1000, image: '/nft-common.png', buyNowPrice: 600 },
];

// 价格换算函数
const convertPrice = (priceInBOX: number, token: 'BOX' | 'SUI') => {
  if (token === 'BOX') {
    return { amount: priceInBOX, display: `${priceInBOX} BOX` };
  } else {
    const suiAmount = Math.ceil(priceInBOX / SUI_TO_BOX_RATE);
    return { amount: suiAmount, display: `${suiAmount} SUI` };
  }
};

// 获取显示价格
const getDisplayPrice = (priceInBOX: number, token: 'BOX' | 'SUI') => {
  const result = convertPrice(priceInBOX, token);
  if (token === 'SUI') {
    return `${result.amount} SUI (~${priceInBOX} BOX)`;
  }
  return result.display;
};

export default function AuctionPage() {
  const [activeTab, setActiveTab] = useState<'hot' | 'ending' | 'new'>('hot');
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [countdown, setCountdown] = useState<Record<number, {days: number; hours: number; minutes: number; seconds: number}>>({});
  // 支付方式固定为BOX
                const payToken = 'BOX' as const;
  const [bidPrice, setBidPrice] = useState('');

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

  const formatCountdown = (auctionId: number) => {
    const c = countdown[auctionId];
    if (!c) return '已结束';
    if (c.days > 0) return `${c.days}天${c.hours}时${c.minutes}分${c.seconds}秒`;
    if (c.hours > 0) return `${c.hours}时${c.minutes}分${c.seconds}秒`;
    if (c.minutes > 0) return `${c.minutes}分${c.seconds}秒`;
    return `${c.seconds}秒`;
  };

  const filteredAuctions = activeTab === 'ending' 
    ? [...auctionList].sort((a, b) => a.endTime - b.endTime)
    : activeTab === 'new'
    ? [...auctionList].sort((a, b) => b.id - a.id)
    : [...auctionList].sort((a, b) => b.bids - a.bids);

  const handleBid = (auction: any) => {
    setSelectedAuction(auction);
    setBidPrice((auction.currentPrice + 10).toString());
  };

  const handleSubmitBid = () => {
    alert(`出价成功！\n金额: ${bidPrice} ${payToken}`);
    setSelectedAuction(null);
  };

  const handleBuyNow = () => {
    if (!selectedAuction) return;
    alert(`一口价购买成功！\n金额: ${selectedAuction.buyNowPrice} ${payToken}`);
    setSelectedAuction(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 头部 */}
      <div className="bg-gradient-to-b from-violet-900/20 to-transparent pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🔥 NFT拍卖</h1>
          <p className="text-gray-400">参与拍卖，竞得稀有NFT！支持BOX支付</p>
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

      {/* 拍卖列表 - 2x4网格 */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {filteredAuctions.slice(0, 8).map((auction) => (
            <motion.div 
              key={auction.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleBid(auction)}
            >
              <div className="aspect-square relative bg-gray-800">
                <Image src={auction.image} alt={auction.name} fill className="object-cover" />
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold flex items-center gap-0.5 ${
                  countdown[auction.id]?.days !== undefined && countdown[auction.id].days < 1 
                    ? 'bg-red-600 animate-pulse' 
                    : 'bg-orange-600/80 backdrop-blur-sm'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>{formatCountdown(auction.id)}</span>
                </div>
                <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  auction.rarity === 'Epic' ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  {auction.rarity === 'Epic' ? 'SSR' : 'SR'}
                </div>
              </div>
              
              <div className="p-2 md:p-3">
                <h3 className="font-bold text-sm md:text-base truncate">{auction.name}</h3>
                <div className="flex items-center justify-between mt-1 md:mt-2">
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500">当前价</p>
                    <p className="text-orange-400 font-bold text-sm md:text-lg">{auction.currentPrice} BOX</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleBid(auction); }}
                    className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-xs font-bold"
                  >
                    参与竞拍
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 出价弹窗 - 响应式 */}
      <AnimatePresence>
        {selectedAuction && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
            onClick={() => setSelectedAuction(null)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-gray-900 rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* 图片 */}
              <div className="aspect-square relative bg-gray-800">
                <Image src={selectedAuction.image} alt={selectedAuction.name} fill className="object-cover" />
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-sm font-bold ${
                  selectedAuction.rarity === 'Epic' ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  {selectedAuction.rarity === 'Epic' ? 'SSR' : 'SR'}
                </div>
                <button 
                  onClick={() => setSelectedAuction(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-1">{selectedAuction.name}</h2>
                <p className="text-gray-400 text-sm mb-4">by {selectedAuction.artist}</p>
                
                {/* 价格信息 */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-400 text-xs">当前价</p>
                    <p className="text-2xl md:text-3xl font-bold text-orange-400">{selectedAuction.currentPrice} BOX</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">{selectedAuction.bids}次出价</p>
                    <p className="text-xs text-gray-500">剩余 {formatCountdown(selectedAuction.id)}</p>
                  </div>
                </div>

                {/* 支付方式 */}
                <div className="mb-4 p-2 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-orange-400 text-sm font-medium">💰 仅支持 BOX 支付</p>
                </div>

                {/* 出价输入 */}
                <div className="mb-4">
                  <label className="text-gray-400 text-sm block mb-2">出价金额 (BOX)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={bidPrice}
                      onChange={(e) => setBidPrice(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pr-16 text-white text-lg"
                      placeholder={`最低 ${selectedAuction.currentPrice + 10}`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      BOX
                    </span>
                  </div>
                </div>

                {/* 按钮 */}
                <div className="space-y-2">
                  <button 
                    onClick={handleSubmitBid}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold"
                  >
                    确认出价
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <span>一口价购买</span>
                    <span className="text-sm opacity-80">({selectedAuction.buyNowPrice} BOX)</span>
                  </button>
                </div>

                {/* 说明 */}
                <div className="mt-4 space-y-2">
                  <p className="text-gray-500 text-xs text-center">
                    出价后需等待更高出价或拍卖结束
                  </p>
                  <p className="text-gray-600 text-xs text-center">
                    卖家到手 95% | 平台销毁 5%
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
