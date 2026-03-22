'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Clock, Zap, Hexagon, Gavel, Timer, Flame, Star, TrendingUp, Plus, Minus, X, Check, DollarSign, Users, Fire } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const SUI_TO_BOX_RATE = 100;

const auctionList = [
  { id: 1, name: '星辰大海 #01', artist: 'CryptoArtist', rarity: 'Epic', currentPrice: 888, bids: 23, endTime: Date.now() + 2*60*60*1000 + 30*60*1000, image: '/fragment-epic.png', buyNowPrice: 1500, views: 1523 },
  { id: 2, name: '烈焰麒麟 #99', artist: 'FireMaster', rarity: 'Epic', currentPrice: 1500, bids: 56, endTime: Date.now() + 5*60*60*1000 + 45*60*1000, image: '/fragment-epic.png', buyNowPrice: 2500, views: 2341 },
  { id: 3, name: '冰晶之心 #88', artist: 'IceQueen', rarity: 'Epic', currentPrice: 2000, bids: 89, endTime: Date.now() + 8*60*60*1000, image: '/fragment-rare.png', buyNowPrice: 3000, views: 1892 },
  { id: 4, name: '机械之心 #77', artist: 'RoboMaster', rarity: 'Rare', currentPrice: 666, bids: 34, endTime: Date.now() + 1*24*60*60*1000, image: '/nft-common.png', buyNowPrice: 1000, views: 987 },
  { id: 5, name: '暗黑天使 #33', artist: 'DarkArtist', rarity: 'Rare', currentPrice: 520, bids: 12, endTime: Date.now() + 2*24*60*60*1000, image: '/fragment-epic.png', buyNowPrice: 800, views: 756 },
  { id: 6, name: '深海巨兽 #12', artist: 'SeaMaster', rarity: 'Rare', currentPrice: 999, bids: 45, endTime: Date.now() + 3*24*60*60*1000, image: '/fragment-epic.png', buyNowPrice: 1500, views: 1234 },
  { id: 7, name: '金色凤凰 #55', artist: 'Phoenix', rarity: 'Legendary', currentPrice: 2888, bids: 78, endTime: Date.now() + 4*60*60*1000, image: '/fragment-epic.png', buyNowPrice: 4000, views: 3456 },
  { id: 8, name: '绿茵王者 #10', artist: 'SoccerKing', rarity: 'Rare', currentPrice: 388, bids: 19, endTime: Date.now() + 12*60*60*1000, image: '/nft-common.png', buyNowPrice: 600, views: 567 },
];

const rarityConfig: Record<string, { gradient: string; border: string; badge: string; glow: string; color: string }> = {
  Legendary: { gradient: 'from-amber-500 via-orange-500 to-yellow-500', border: 'border-amber-500/50', badge: 'bg-gradient-to-r from-amber-500 to-orange-500', glow: 'shadow-amber-500/30', color: 'text-amber-400' },
  Epic: { gradient: 'from-violet-500 via-purple-500 to-pink-500', border: 'border-violet-500/50', badge: 'bg-gradient-to-r from-violet-500 to-purple-500', glow: 'shadow-violet-500/30', color: 'text-violet-400' },
  Rare: { gradient: 'from-blue-500 via-cyan-500 to-sky-500', border: 'border-blue-500/40', badge: 'bg-gradient-to-r from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20', color: 'text-blue-400' },
  Common: { gradient: 'from-gray-500 to-slate-600', border: 'border-white/10', badge: 'bg-gray-600', glow: 'shadow-gray-500/10', color: 'text-gray-400' },
};

type TabType = 'hot' | 'ending' | 'new';

export default function AuctionPage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [activeTab, setActiveTab] = useState<TabType>('hot');
  const [selectedAuction, setSelectedAuction] = useState<typeof auctionList[0] | null>(null);
  const [modalTab, setModalTab] = useState<'bid' | 'offer' | 'history'>('bid');
  const [countdown, setCountdown] = useState<Record<number, {days: number; hours: number; minutes: number; seconds: number}>>({});
  const [bidPrice, setBidPrice] = useState('');
  const [bidError, setBidError] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerType, setOfferType] = useState<'fixed' | 'premium'>('fixed');
  const [premiumPercent, setPremiumPercent] = useState(10);

  const filteredAuctions = useMemo(() => {
    let result = [...auctionList];
    switch (activeTab) {
      case 'ending': return result.sort((a, b) => a.endTime - b.endTime);
      case 'new': return result.sort((a, b) => b.id - a.id);
      default: return result.sort((a, b) => b.bids - a.bids);
    }
  }, [activeTab]);

  const stats = useMemo(() => ({
    totalAuctions: auctionList.length,
    totalBids: auctionList.reduce((sum, a) => sum + a.bids, 0),
    totalValue: auctionList.reduce((sum, a) => sum + a.currentPrice, 0),
    endingSoon: auctionList.filter(a => a.endTime - Date.now() < 24*60*60*1000).length,
  }), []);

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
    if (!c) return 'Ended';
    if (c.days > 0) return `${c.days}d ${c.hours}h ${c.minutes}m`;
    if (c.hours > 0) return `${c.hours}h ${c.minutes}m ${c.seconds}s`;
    if (c.minutes > 0) return `${c.minutes}m ${c.seconds}s`;
    return `${c.seconds}s`;
  };

  const getUrgencyLevel = (auctionId: number) => {
    const c = countdown[auctionId];
    if (!c) return 'ended';
    if (c.days > 0) return 'normal';
    if (c.hours > 0) return 'warning';
    return 'urgent';
  };

  const handleBid = (auction: typeof auctionList[0]) => {
    setSelectedAuction(auction);
    setBidPrice((auction.currentPrice + 10).toString());
    setBidError('');
  };

  const validateBid = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) return 'Enter a valid amount';
    if (selectedAuction && num < selectedAuction.currentPrice + 10) return `Min bid: ${selectedAuction.currentPrice + 10} BOX`;
    return '';
  };

  const handleSubmitBid = () => {
    const error = validateBid(bidPrice);
    if (error) { setBidError(error); return; }
    alert(`Bid submitted!\nAmount: ${bidPrice} BOX`);
    setSelectedAuction(null);
  };

  const handleBuyNow = () => {
    if (!selectedAuction) return;
    alert(`Purchase successful!\nAmount: ${selectedAuction.buyNowPrice} BOX`);
    setSelectedAuction(null);
  };

  // 溢价处理
  const handlePremiumChange = (percent: number) => {
    setPremiumPercent(percent);
    if (selectedAuction) {
      const premium = selectedAuction.currentPrice * (1 + percent / 100);
      setOfferPrice(premium.toFixed(2));
    }
  };

  // 提交报价
  const submitOffer = () => {
    if (!offerPrice || parseFloat(offerPrice) <= 0) return;
    alert(`Offer submitted!\nPrice: ${offerPrice} BOX\nPremium: +${premiumPercent}%\nWaiting for seller confirmation...`);
    setSelectedAuction(null);
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 h-[280px] md:h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-red-900/10 to-[#08080c]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-orange-500/15 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-red-500/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Floating orbs */}
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-20 left-[15%] w-2 h-2 bg-orange-500/40 rounded-full blur-sm" />
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-32 right-[20%] w-3 h-3 bg-red-500/30 rounded-full blur-sm" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Gavel className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                    Live Auctions
                  </h1>
                  <p className="text-gray-500 text-sm">Bid & Win Exclusive NFTs</p>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-3">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="px-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                <p className="text-2xl font-bold text-white">{stats.totalAuctions}</p>
                <p className="text-xs text-gray-500">Auctions</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="px-4 py-2.5 bg-orange-500/10 backdrop-blur-xl border border-orange-500/20 rounded-xl">
                <p className="text-2xl font-bold text-orange-400">{stats.totalBids}</p>
                <p className="text-xs text-gray-500">Total Bids</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="px-4 py-2.5 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl">
                <p className="text-2xl font-bold text-red-400">{stats.endingSoon}</p>
                <p className="text-xs text-gray-500">Ending Soon</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-[#08080c]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
              {[
                { key: 'hot', label: '🔥 Hot', icon: Flame },
                { key: 'ending', label: '⏰ Ending', icon: Timer },
                { key: 'new', label: '✨ New', icon: Star },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key 
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live bidding
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white font-medium">{filteredAuctions.length}</span> auctions
        </p>
      </div>

      {/* Auction Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAuctions.map((auction, index) => {
            const rarity = rarityConfig[auction.rarity] || rarityConfig.Common;
            const urgency = getUrgencyLevel(auction.id);
            
            return (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleBid(auction)}
                className={`group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:shadow-xl ${rarity.glow}`}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${rarity.gradient} opacity-15`} />
                  <div className="absolute inset-0 flex items-center justify-center text-7xl">
                    {auction.rarity === 'Legendary' ? '🐦' : auction.rarity === 'Epic' ? '🔥' : '💎'}
                  </div>
                  
                  {/* Rarity Badge */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 ${rarity.badge} rounded-lg text-[10px] font-bold text-white uppercase tracking-wider`}>
                    {auction.rarity}
                  </div>

                  {/* Countdown Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-2 rounded-xl text-xs font-bold flex flex-col items-center min-w-[60px] ${
                    getUrgencyLevel(auction.id) === 'urgent' 
                      ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/50' 
                      : getUrgencyLevel(auction.id) === 'warning'
                      ? 'bg-orange-500/90 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-black/60 backdrop-blur-sm text-white border border-white/10'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatCountdown(auction.id)}</span>
                    </div>
                    {getUrgencyLevel(auction.id) === 'urgent' && (
                      <span className="text-[9px] opacity-80 mt-0.5">HURRY!</span>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="block w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl text-center transition-colors">
                        Place Bid
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-white truncate">{auction.name}</h3>
                  </div>
                  <p className="text-gray-500 text-xs mb-4">by {auction.artist}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-500 text-[10px] mb-0.5">Current Bid</p>
                      <p className="text-lg font-bold text-orange-400">{auction.currentPrice} BOX</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-[10px] mb-0.5">{auction.bids} bids</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {auction.views}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-500">Buy Now</span>
                      <span className="text-white font-semibold">{auction.buyNowPrice} BOX</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (auction.currentPrice / auction.buyNowPrice) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bid Modal */}
      <AnimatePresence>
        {selectedAuction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedAuction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0f0f14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative h-56 bg-gradient-to-br from-orange-900/30 via-red-900/20 to-pink-900/30">
                <div className="absolute inset-0 flex items-center justify-center text-8xl">
                  {selectedAuction.rarity === 'Legendary' ? '🐦' : selectedAuction.rarity === 'Epic' ? '🔥' : '💎'}
                </div>
                <div className={`absolute top-4 left-4 px-3 py-1.5 ${rarityConfig[selectedAuction.rarity]?.badge || 'bg-gray-600'} rounded-lg text-xs font-bold text-white uppercase`}>
                  {selectedAuction.rarity}
                </div>
                <button
                  onClick={() => setSelectedAuction(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedAuction.name}</h2>
                    <p className="text-gray-500 flex items-center gap-2">
                      by <span className="text-orange-400">{selectedAuction.artist}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs mb-1">Time Left</p>
                    <p className={`text-lg font-bold ${isEnding(selectedAuction.id) ? 'text-red-400' : 'text-white'}`}>
                      {formatCountdown(selectedAuction.id)}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setModalTab('bid')}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${modalTab === 'bid' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                  >
                    Place Bid
                  </button>
                  <button
                    onClick={() => setModalTab('offer')}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${modalTab === 'offer' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                  >
                    Make Offer
                  </button>
                  <button
                    onClick={() => setModalTab('history')}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${modalTab === 'history' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                  >
                    History
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-gray-500 text-xs mb-1">Current Bid</p>
                    <p className="text-lg font-bold text-orange-400">{selectedAuction.currentPrice}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-gray-500 text-xs mb-1">Total Bids</p>
                    <p className="text-lg font-bold text-white">{selectedAuction.bids}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-gray-500 text-xs mb-1">Buy Now</p>
                    <p className="text-lg font-bold text-white">{selectedAuction.buyNowPrice}</p>
                  </div>
                </div>

                {/* Tab Content */}
                {modalTab === 'bid' && (
                  <>
                    {/* Bid Input */}
                    <div className="mb-4">
                      <label className="block text-gray-500 text-xs mb-2">Your Bid (min {selectedAuction.currentPrice + 10} BOX)</label>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setBidPrice(String(Math.max(selectedAuction.currentPrice + 10, parseInt(bidPrice) - 10)))}
                          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={bidPrice}
                          onChange={(e) => { setBidPrice(e.target.value); setBidError(''); }}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-center font-semibold focus:outline-none focus:border-orange-500/50"
                        />
                        <button 
                          onClick={() => setBidPrice(String(parseInt(bidPrice) + 10))}
                          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {bidError && <p className="text-red-400 text-xs mt-2">{bidError}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitBid}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20"
                      >
                        Place Bid
                      </button>
                      <button
                        onClick={handleBuyNow}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all"
                      >
                        Buy Now
                      </button>
                    </div>
                  </>
                )}

                {modalTab === 'offer' && (
                  <div className="space-y-4">
                    {/* Offer Type */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setOfferType('fixed'); setOfferPrice(String(selectedAuction.currentPrice)); }}
                        className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${offerType === 'fixed' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                      >
                        Fixed Price
                      </button>
                      <button
                        onClick={() => setOfferType('premium')}
                        className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${offerType === 'premium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                      >
                        Premium Offer
                      </button>
                    </div>

                    {/* Price Input */}
                    <div>
                      <label className="text-gray-500 text-xs mb-2 block">Your Offer Price</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                          placeholder="Enter price"
                        />
                        <span className="text-white font-medium">BOX</span>
                      </div>
                    </div>

                    {/* Premium Slider */}
                    {offerType === 'premium' && (
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-500">Premium</span>
                          <span className="text-amber-400 font-medium">+{premiumPercent}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={premiumPercent}
                          onChange={(e) => handlePremiumChange(parseInt(e.target.value))}
                          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Submit Offer */}
                    <button
                      onClick={submitOffer}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all"
                    >
                      Submit Offer (Seller Confirm)
                    </button>
                  </div>
                )}

                {modalTab === 'history' && (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">0x1234...abcd</span>
                          <span className="text-orange-400 font-bold">+50 BOX</span>
                        </div>
                        <p className="text-gray-500 text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">0x5678...efgh</span>
                          <span className="text-orange-400 font-bold">+30 BOX</span>
                        </div>
                        <p className="text-gray-500 text-xs">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
