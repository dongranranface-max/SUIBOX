'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Clock, Zap, Hexagon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

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
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [activeTab, setActiveTab] = useState<'hot' | 'ending' | 'new'>('hot');
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [countdown, setCountdown] = useState<Record<number, {days: number; hours: number; minutes: number; seconds: number}>>({});
  // 支付方式固定为BOX
                const payToken = 'BOX' as const;
  const [bidPrice, setBidPrice] = useState('');
  const [bidError, setBidError] = useState('');

  const validateBid = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) return '请输入有效金额';
    if (selectedAuction && num < selectedAuction.currentPrice + 10) return `最低出价 ${selectedAuction.currentPrice + 10} BOX`;
    return '';
  };

  const handleSubmitBid = () => {
    const error = validateBid(bidPrice);
    if (error) { setBidError(error); return; }
    alert(`出价成功！\n金额: ${bidPrice} ${payToken}`);
    setSelectedAuction(null);
  };

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
      <div className="max-w-7xl mx-auto px-4 mb-4 md:mb-6">
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { key: 'hot', label: '热门拍卖', icon: '🔥' },
            { key: 'ending', label: '即将结束', icon: '⏰' },
            { key: 'new', label: '最新上架', icon: '🆕' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 md:px-4 py-2.5 rounded-xl flex items-center gap-1.5 md:gap-2 whitespace-nowrap transition-all min-h-[44px] min-w-[44px] ${
                activeTab === tab.key
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span className="text-sm md:text-base">{tab.icon}</span>
              <span className="text-sm md:text-base">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 拍卖列表 - 2x4网格 */}
      <div className="max-w-7xl mx-auto px-4 pb-8 md:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {filteredAuctions.slice(0, 8).map((auction) => (
            <motion.div 
              key={auction.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleBid(auction)}
            >
              <div className="aspect-square relative bg-gray-800">
                <Image src={auction.image} alt={auction.name} fill className="object-cover" />
                <div className={`absolute top-1.5 left-1.5 md:top-2 md:left-2 px-1.5 md:px-2 py-1 rounded text-[10px] md:text-xs font-bold flex items-center gap-0.5 ${
                  countdown[auction.id]?.days !== undefined && countdown[auction.id].days < 1 
                    ? 'bg-red-600 animate-pulse' 
                    : 'bg-orange-600/80 backdrop-blur-sm'
                }`}>
                  <Clock className="w-2.5 md:w-3 h-2.5 md:h-3" />
                  <span className="hidden sm:inline">{formatCountdown(auction.id)}</span>
                  <span className="sm:hidden">{countdown[auction.id]?.days > 0 ? `${countdown[auction.id].days}天` : countdown[auction.id]?.hours > 0 ? `${countdown[auction.id].hours}时` : `${countdown[auction.id]?.minutes}分`}</span>
                </div>
                <div className={`absolute top-1.5 right-1.5 md:top-2 md:right-2 px-1 md:px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold ${
                  auction.rarity === 'Epic' ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  {auction.rarity === 'Epic' ? 'SSR' : 'SR'}
                </div>
              </div>
              
              <div className="p-2 md:p-3">
                <h3 className="font-bold text-xs md:text-base truncate">{auction.name}</h3>
                <div className="flex items-center justify-between mt-1 md:mt-2">
                  <div>
                    <p className="text-[9px] md:text-xs text-gray-500">当前价</p>
                    <p className="text-orange-400 font-bold text-xs md:text-lg">{auction.currentPrice}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleBid(auction); }}
                    className="px-2 md:px-3 py-1.5 md:py-1.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-[10px] md:text-xs font-bold min-h-[36px]"
                  >
                    参与
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 出价弹窗 - 响应式 */}
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
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-3xl md:rounded-2xl w-full md:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border-t border-gray-700"
            onClick={e => e.stopPropagation()}
          >
              {/* 顶部装饰条 */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-12 h-1 bg-gray-600 rounded-full" />
              </div>
              
              {/* 关闭按钮 */}
              <button 
                onClick={() => setSelectedAuction(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
              
              {/* 图片 */}
              <div className="aspect-square relative bg-gray-800">
                <Image src={selectedAuction.image} alt={selectedAuction.name} fill className="object-cover" />
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                
                {/* 稀有度标签 */}
                <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${
                  selectedAuction.rarity === 'Epic' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                }`}>
                  {selectedAuction.rarity === 'Epic' ? '⭐ SSR' : '💎 SR'}
                </div>
              </div>
              
              <div className="p-4 md:p-6 -mt-6 relative">
                {/* NFT名称卡片 */}
                <div className="bg-gray-800/90 backdrop-blur rounded-2xl p-4 mb-4 border border-gray-700 shadow-lg">
                  <h2 className="text-xl md:text-2xl font-bold mb-1">{selectedAuction.name}</h2>
                  <p className="text-gray-400 text-sm">by {selectedAuction.artist}</p>
                </div>
                
                {/* 价格信息 */}
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-4 mb-4 border border-orange-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">当前价</p>
                      <p className="text-3xl md:text-4xl font-black text-orange-400">{selectedAuction.currentPrice}</p>
                      <p className="text-orange-400/60 text-sm">BOX</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">{selectedAuction.bids}次出价</p>
                      <p className="text-red-400 text-sm font-medium">⏱️ {formatCountdown(selectedAuction.id)}</p>
                    </div>
                  </div>
                </div>

                {/* 一口价 */}
                <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-medium">一口价</span>
                    <span className="text-yellow-400 font-bold">{selectedAuction.buyNowPrice} BOX</span>
                  </div>
                </div>

                {/* 出价输入 */}
                <div className="mb-4">
                  <label className="text-gray-400 text-sm block mb-2">出价金额</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={bidPrice}
                      onChange={(e) => { setBidPrice(e.target.value); setBidError(''); }}
                      className={`w-full bg-gray-800/80 border rounded-xl py-4 px-4 pr-20 text-white text-xl font-bold text-center ${bidError ? 'border-red-500' : 'border-gray-600'}`}
                      placeholder={`最低 ${selectedAuction.currentPrice + 10}`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 font-bold">
                      BOX
                    </span>
                  </div>
                  {bidError ? (
                    <p className="text-red-400 text-xs text-center mt-2">{bidError}</p>
                  ) : (
                    <p className="text-gray-500 text-xs text-center mt-2">
                      最低出价: {selectedAuction.currentPrice + 10} BOX
                    </p>
                  )}
                </div>

                {/* 按钮 */}
                <div className="space-y-3">
                  <button 
                    onClick={handleSubmitBid}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-[1.02]"
                  >
                    ⚡ 确认出价
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-[1.02]"
                  >
                    💰 一口价购买
                  </button>
                </div>

                {/* 说明 */}
                <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
                  <span>📊 卖家到手 95%</span>
                  <span>🔥 平台销毁 5%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
    </div>
  );
}
