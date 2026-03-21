'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronRight, ArrowUp, ArrowDown, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStats } from '@/hooks/useStats';
import { useI18n } from '@/lib/i18n';

// 轮播图
const banners = [
  { id: 1, title: 'NFT盲盒', desc: '打开盲盒，赢取稀有NFT！', link: '/box', bg: 'from-violet-600 via-purple-600 to-pink-600', emoji: '🎁' },
  { id: 2, title: '碎片合成', desc: '碎片合成NFT，赢取BOX奖励！', link: '/craft', bg: 'from-blue-600 via-cyan-600 to-teal-600', emoji: '⚗️' },
  { id: 3, title: 'NFT拍卖', desc: '稀有NFT正在拍卖中！', link: '/auction', bg: 'from-orange-600 via-red-600 to-pink-600', emoji: '🔨' },
  { id: 4, title: 'DAO治理', desc: '参与治理，质押BOX获取收益！', link: '/mine', bg: 'from-green-600 via-emerald-600 to-teal-600', emoji: '🏛️' },
];

const hotNFTs = [
  { id: 1, name: '星辰大海 #88', collection: '星辰大海', price: 162.2, change: 91.1, image: '/nft-common.png', rarity: 'SSR' },
  { id: 2, name: '烈焰麒麟 #66', collection: '烈焰麒麟', price: 56.12, change: -12.3, image: '/fragment-epic.png', rarity: 'SR' },
  { id: 3, name: '冰晶之心 #33', collection: '冰晶之心', price: 45.8, change: 23.5, image: '/fragment-rare.png', rarity: 'SR' },
  { id: 4, name: '机械之心 #77', collection: '机械之心', price: 38.5, change: -5.2, image: '/nft-common.png', rarity: 'R' },
  { id: 5, name: '暗黑天使 #25', collection: '暗黑天使', price: 28.9, change: 15.8, image: '/fragment-epic.png', rarity: 'R' },
  { id: 6, name: '星辰大海 #99', collection: '星辰大海', price: 188.8, change: 55.2, image: '/nft-common.png', rarity: 'SSR' },
  { id: 7, name: '烈焰麒麟 #88', collection: '烈焰麒麟', price: 66.6, change: 33.3, image: '/fragment-epic.png', rarity: 'SR' },
  { id: 8, name: '冰晶之心 #55', collection: '冰晶之心', price: 52.1, change: 18.8, image: '/fragment-rare.png', rarity: 'SR' },
  { id: 9, name: '机械之心 #11', collection: '机械之心', price: 41.2, change: 8.5, image: '/nft-common.png', rarity: 'R' },
  { id: 10, name: '暗黑天使 #77', collection: '暗黑天使', price: 31.5, change: 22.1, image: '/fragment-epic.png', rarity: 'R' },
];

// 拍卖品 - 使用时间戳（当前时间 + 秒数）
const now = Date.now();
const hotAuctions = [
  // 即将结束 (结束时间短的排前面)
  { id: 4, name: '烈焰麒麟 #55', artist: 'FireMaster', price: 888, bids: 23, endTime: now + 2*60*60*1000 + 30*60*1000, rarity: '史诗', image: '/fragment-epic.png', buyNowPrice: 1500 },
  { id: 5, name: '冰晶之心 #88', artist: 'IceArtist', price: 666, bids: 18, endTime: now + 5*60*60*1000 + 45*60*1000, rarity: '史诗', image: '/fragment-rare.png', buyNowPrice: 1000 },
  { id: 6, name: '暗黑天使 #33', artist: 'DarkArtist', price: 520, bids: 12, endTime: now + 8*60*60*1000, rarity: '稀有', image: '/fragment-epic.png', buyNowPrice: 800 },
  // 最新上架 (ID大的排前面)
  { id: 9, name: '星辰大海 #99', artist: 'StarMaster', price: 3888, bids: 89, endTime: now + 10*24*60*60*1000, rarity: '传说', image: '/nft-common.png', buyNowPrice: 5000 },
  { id: 8, name: '机械之心 #88', artist: 'RoboMaster', price: 1888, bids: 45, endTime: now + 8*24*60*60*1000, rarity: '史诗', image: '/nft-common.png', buyNowPrice: 2500 },
  { id: 7, name: '深海巨兽 #12', artist: 'SeaMaster', price: 999, bids: 34, endTime: now + 5*24*60*60*1000, rarity: '稀有', image: '/fragment-epic.png', buyNowPrice: 1500 },
  // 即将结束
  { id: 1, name: '宇宙之心 #01', artist: 'StarArtist', price: 5000, bids: 156, endTime: now + 6*24*60*60*1000 + 19*60*60*1000, rarity: '传说', image: '/nft-common.png', buyNowPrice: 8000 },
  { id: 2, name: '机械之心 #77', artist: 'RoboArtist', price: 2000, bids: 89, endTime: now + 2*24*60*60*1000 + 11*60*60*1000, rarity: '史诗', image: '/nft-common.png', buyNowPrice: 3000 },
  { id: 3, name: '烈焰麒麟 #99', artist: 'FireMaster', price: 1500, bids: 56, endTime: now + 1*24*60*60*1000 + 19*60*60*1000, rarity: '史诗', image: '/fragment-epic.png', buyNowPrice: 2500 },
];

const nftRankings = [
  { id: 1, name: '星辰大海', volume: 1250000, change: 91.1, image: '/nft-common.png' },
  { id: 2, name: '烈焰麒麟', volume: 890000, change: 45.2, image: '/fragment-epic.png' },
  { id: 3, name: '冰晶之心', volume: 670000, change: 23.5, image: '/fragment-rare.png' },
  { id: 4, name: '暗黑天使', volume: 450000, change: 15.8, image: '/fragment-epic.png' },
  { id: 5, name: '机械之心', volume: 320000, change: -8.2, image: '/nft-common.png' },
  { id: 6, name: '星空漫步', volume: 280000, change: 55.5, image: '/fragment-rare.png' },
  { id: 7, name: '深海巨兽', volume: 210000, change: 33.3, image: '/fragment-epic.png' },
  { id: 8, name: '火焰使者', volume: 180000, change: -12.5, image: '/nft-common.png' },
];

const suiEcosystem = [
  { name: 'SUIet', url: 'https://suiet.com', logo: '/suiet-logo.png', emoji: '👛', desc: '钱包' },
  { name: 'Cetus', url: 'https://cetus.zone', logo: '/cetus-logo.png', emoji: '🐬', desc: 'DEX' },
  { name: 'Scallop', url: 'https://scallop.io', logo: '/scallop-logo.png', emoji: '🐚', desc: '借贷' },
  { name: 'Turbos', url: 'https://turbos.finance', logo: '/turbos-logo.png', emoji: '🚀', desc: 'DEX' },
  { name: 'Walrus', url: 'https://walrus.xyz', logo: '/walrus-logo.png', emoji: '🗄️', desc: '去中心化储存' },
];

const rarityColors: Record<string, string> = {
  SSR: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  SR: 'bg-gradient-to-r from-purple-500 to-pink-500',
  R: 'bg-gradient-to-r from-blue-500 to-cyan-500',
};

export default function Home() {
  const { t } = useI18n?.() || { t: {} };
  const [currentBanner, setCurrentBanner] = useState(0);
  const [countdown, setCountdown] = useState<Record<number, {days: number, hours: number, minutes: number, seconds: number}>>({});
  const [bidModal, setBidModal] = useState<{show: boolean, auction?: any}>({show: false});
  const [bidPrice, setBidPrice] = useState('');
  const [bidError, setBidError] = useState('');
  const [auctionFilter, setAuctionFilter] = useState<'ending' | 'new'>('ending');
  const { stats, loading: statsLoading } = useStats();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // 过滤拍卖数据 - 显示8个
  const filteredAuctions = auctionFilter === 'ending' 
    ? [...hotAuctions].sort((a, b) => a.endTime - b.endTime).slice(0, 8)
    : [...hotAuctions].sort((a, b) => b.id - a.id).slice(0, 8);

  // 价格显示用变量
  const suiChangeVal = stats?.sui?.change ?? 0.56;
  const suiPriceVal = stats?.sui?.price ?? 0.9999;
  const boxPriceVal = stats?.box?.price ?? 0.0042;

  // 只在首次加载时显示loading，后续静默更新价格
  useEffect(() => {
    if (!statsLoading && stats) {
      if (!hasLoadedOnce) {
        setHasLoadedOnce(true);
      }
    }
  }, [stats, statsLoading, hasLoadedOnce]);

  // 轮播图自动滑动
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 拍卖倒计时
  useEffect(() => {
    const calculateCountdown = () => {
      const newCountdown: Record<number, {days: number, hours: number, minutes: number, seconds: number}> = {};
      hotAuctions.forEach(auction => {
        const diff = auction.endTime - Date.now();
        if (diff > 0) {
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
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // 格式化倒计时 - 显示到秒
  const formatCountdown = (auctionId: number) => {
    const c = countdown[auctionId];
    if (!c) return '已结束';
    if (c.days > 0) return `${c.days}天${c.hours}时${c.minutes}分${c.seconds}秒`;
    if (c.hours > 0) return `${c.hours}时${c.minutes}分${c.seconds}秒`;
    if (c.minutes > 0) return `${c.minutes}分${c.seconds}秒`;
    return `${c.seconds}秒`;
  };

  // 出价
  const handleBid = (auction: any) => {
    // 设置弹窗显示
    setBidModal({show: true, auction: auction});
  };

  const validateBid = (price: string) => {
    const num = parseFloat(price);
    const minPrice = Math.floor(bidModal.auction.price * 1.1);
    if (isNaN(num) || num <= 0) return '请输入有效金额';
    if (num < minPrice) return `最低出价 ${minPrice} BOX`;
    return '';
  };

  const submitBid = () => {
    const error = validateBid(bidPrice);
    if (error) { setBidError(error); return; }
    alert(`出价成功！出价: ${bidPrice} BOX`);
    setBidModal({show: false});
  };

  const handleBuyNow = () => {
    if (!bidModal.auction) return;
    alert(`一口价购买成功！金额: ${bidModal.auction.buyNowPrice} BOX`);
    setBidModal({show: false});
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 轮播图 - 移动端适配 */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        {banners.map((banner, i) => (
          <Link 
            key={banner.id} 
            href={banner.link}
            className={`absolute inset-0 bg-gradient-to-r ${banner.bg} transition-all duration-500 ${i === currentBanner ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
          >
            <div className="max-w-7xl mx-auto h-full flex items-center px-4 md:px-8">
              <div className="flex-1">
                <span className="text-5xl md:text-7xl mb-4 md:mb-6 block">{banner.emoji}</span>
                <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">{banner.title}</h1>
                <p className="text-lg md:text-xl opacity-90 mb-4 md:mb-6">{banner.desc}</p>
                <span className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/20 hover:bg-white/30 rounded-xl md:rounded-2xl transition-all text-base md:text-lg font-medium">
                  立即体验 <ChevronRight className="w-5 h-5" />
                </span>
              </div>
              <div className="w-40 md:w-72 h-40 md:h-72 relative hidden sm:block">
                <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />
                <Image src="/suibox-logo.png" alt="SUIBOX" width={288} height={288} className="relative object-contain drop-shadow-2xl" />
              </div>
            </div>
          </Link>
        ))}
        {/* 轮播指示器 */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentBanner(i)} 
              className={`h-2 md:h-3 rounded-full transition-all ${i === currentBanner ? 'w-6 md:w-10 bg-white' : 'w-2 md:w-3 bg-white/50'}`} 
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8 md:space-y-12">

        {/* 热门拍卖 - 2x4布局 */}
        <section className="bg-gray-900/30 -mx-4 px-4 py-6 md:py-8 rounded-2xl md:rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
              热门拍卖
            </h2>
            <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-hide">
              <button 
                onClick={() => setAuctionFilter('ending')}
                className={`flex-shrink-0 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap ${auctionFilter === 'ending' ? 'bg-orange-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
              >
                ⏰ 即将结束
              </button>
              <button 
                onClick={() => setAuctionFilter('new')}
                className={`flex-shrink-0 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-all whitespace-nowrap ${auctionFilter === 'new' ? 'bg-violet-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
              >
                🆕 最新上架
              </button>
              <Link href="/auction" className="flex-shrink-0 px-2.5 md:px-4 py-1.5 md:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs md:text-sm transition-colors whitespace-nowrap">
                查看全部
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {filteredAuctions.map((auction) => (
              <div key={auction.id} className="group bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-700/50 transition-all cursor-pointer" onClick={() => handleBid(auction)}>
                <div className="aspect-square relative bg-gray-700">
                  <img src={auction.image} alt={auction.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute top-2 left-2 right-2 flex justify-between">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-0.5 ${
                      countdown[auction.id]?.days !== undefined && countdown[auction.id].days < 1 
                        ? 'bg-red-600 animate-pulse' 
                        : 'bg-orange-600/80 backdrop-blur-sm'
                    }`}>
                      <Clock className="w-3 h-3" /> 
                      <span>{formatCountdown(auction.id)}</span>
                    </span>
                    <span className={`px-1.5 py-0.5 backdrop-blur-sm rounded-lg text-[10px] ${auction.rarity === '传说' ? 'bg-orange-500/60' : 'bg-purple-500/60'}`}>{auction.rarity === '传说' ? 'SSR' : 'SR'}</span>
                  </div>
                </div>
                <div className="p-2 md:p-3">
                  <h3 className="font-bold text-sm truncate">{auction.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <p className="text-[10px] text-gray-500">当前价</p>
                      <p className="text-orange-400 font-bold text-sm">{auction.price} BOX</p>
                    </div>
                    <p className="text-[10px] text-gray-500">{auction.bids}次</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleBid(auction); }}
                    className="w-full mt-2 py-1.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-xs font-bold"
                  >
                    参与竞拍
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 热门NFT */}
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full" />
              热门NFT
            </h2>
            <Link href="/market" className="text-violet-400 hover:text-violet-300 flex items-center gap-1">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {hotNFTs.map((nft) => (
              <Link key={nft.id} href={`/nft/${nft.id}`} className="group bg-gray-900/60 rounded-xl md:rounded-2xl overflow-hidden hover:bg-gray-800/80 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
                <div className="aspect-square relative bg-gray-800">
                  <img src={nft.image} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <span className={`absolute top-2 md:top-3 right-2 md:right-3 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-bold ${rarityColors[nft.rarity] || 'bg-gray-600'}`}>{nft.rarity}</span>
                </div>
                <div className="p-2 md:p-4">
                  <p className="text-[10px] md:text-xs text-gray-400">{nft.collection}</p>
                  <p className="text-sm font-medium truncate mb-1 md:mb-2">{nft.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-violet-400 font-bold text-sm">{nft.price} SUI</span>
                    <span className={`text-[10px] md:text-xs flex items-center gap-0.5 md:gap-1 ${nft.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {nft.change >= 0 ? <ArrowUp className="w-2 md:w-3 h-2 md:h-3" /> : <ArrowDown className="w-2 md:w-3 h-2 md:h-3" />}
                      {Math.abs(nft.change)}%
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 排行榜 - 只显示前8名 */}
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full" />
              排行榜
            </h2>
            <Link href="/ranking" className="text-violet-400 hover:text-violet-300 flex items-center gap-1">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {nftRankings.slice(0, 8).map((item, i) => (
              <Link key={item.id} href={`/ranking`} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-900/60 rounded-lg md:rounded-xl hover:bg-gray-800/80 transition-all hover:-translate-y-0.5">
                <span className={`w-6 md:w-8 h-6 md:h-8 flex items-center justify-center rounded-md md:rounded-lg font-bold text-sm ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-300/20 text-gray-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700/50 text-gray-500'}`}>{i + 1}</span>
                <div className="w-8 md:w-10 h-8 md:h-10 rounded-md md:rounded-lg overflow-hidden relative flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-[10px] md:text-xs text-gray-400">{(item.volume / 1000).toFixed(0)}K</p>
                </div>
                <span className={`text-xs md:text-sm ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{item.change >= 0 ? '+' : ''}{item.change}%</span>
              </Link>
            ))}
          </div>
        </section>

        {/* SUI生态 + 价格 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-4 md:mb-6">
              <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
              SUI生态
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
              {suiEcosystem.map((item) => (
                <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-3 md:p-4 bg-gray-900/60 rounded-xl hover:bg-gray-800/80 transition-all hover:-translate-y-0.5 group">
                  {item.logo ? (
                    <div className="w-8 md:w-10 h-8 md:h-10">
                      <img src={item.logo} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                  ) : (
                    <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                  )}
                  <span className="font-medium text-sm md:text-base">{item.name}</span>
                  <span className="text-[10px] md:text-xs text-gray-500">{item.desc}</span>
                </a>
              ))}
            </div>

            {/* SUI/USDC + BOX/SUI 价格走势 */}
            <div className="mt-6 md:mt-8">
              {/* 价格数据 - 首次加载显示骨架，后续静默更新 */}
              {statsLoading && !hasLoadedOnce ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1,2].map(i => (
                    <div key={i} className="bg-gray-900/60 rounded-xl p-4 animate-pulse">
                      <div className="h-24 bg-gray-800 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {/* SUI/USDC */}
                  <div className="bg-gray-900/60 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">SUI</span>
                        <span className="text-xs text-gray-500">USDC</span>
                      </div>
                      <span className="text-sm text-green-400">+0.56%</span>
                    </div>
                    <p className="text-3xl font-bold mb-2">${suiPriceVal.toFixed(4)}</p>
                    {/* 折线图 */}
                    <div className="h-20 relative">
                      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="suiChartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0,40 L8,35 L16,38 L24,30 L32,32 L40,25 L48,28 L56,22 L64,20 L72,18 L80,22 L88,15 L96,12 L100,10" 
                          fill="none" 
                          stroke="#06b6d4" 
                          strokeWidth="2" 
                          vectorEffect="non-scaling-stroke"
                        />
                        <path 
                          d="M0,40 L8,35 L16,38 L24,30 L32,32 L40,25 L48,28 L56,22 L64,20 L72,18 L80,22 L88,15 L96,12 L100,10 L100,50 L0,50 Z" 
                          fill="url(#suiChartGrad)" 
                        />
                      </svg>
                    </div>
                    <div className="flex justify-between mt-2">
                      <a href="https://app.cetus.zone/swap?from=SUI&to=USDC" target="_blank" className="text-xs text-violet-400 hover:text-violet-300">在Cetus交易 ↗</a>
                    </div>
                  </div>

                  {/* BOX/SUI */}
                  <div className="bg-gray-900/60 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">BOX</span>
                        <span className="text-xs text-gray-500">SUI</span>
                      </div>
                      <span className="text-sm text-green-400">
                        +0.56%
                      </span>
                    </div>
                    <p className="text-3xl font-bold mb-2">${(boxPriceVal * suiPriceVal).toFixed(4)}</p>
                    {/* 折线图 */}
                    <div className="h-20 relative">
                      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="boxChartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#eab308" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0,35 L8,38 L16,32 L24,35 L32,30 L40,28 L48,32 L56,25 L64,28 L72,22 L80,25 L88,20 L96,18 L100,15" 
                          fill="none" 
                          stroke="#eab308" 
                          strokeWidth="2" 
                          vectorEffect="non-scaling-stroke"
                        />
                        <path 
                          d="M0,35 L8,38 L16,32 L24,35 L32,30 L40,28 L48,32 L56,25 L64,28 L72,22 L80,25 L88,20 L96,18 L100,15 L100,50 L0,50 Z" 
                          fill="url(#boxChartGrad)" 
                        />
                      </svg>
                    </div>
                    <div className="flex justify-between mt-2">
                      <a href="https://app.cetus.zone/swap?from=BOX&to=SUI" target="_blank" className="text-xs text-violet-400 hover:text-violet-300">在Cetus交易 ↗</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* 平台统计 */}
        <section className="bg-gray-900/30 -mx-4 px-4 py-6 md:py-8 mt-8 rounded-xl md:rounded-2xl">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-4 md:mb-6">
            <span className="w-1 h-6 md:h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
            平台统计
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 交易量 */}
            <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm mb-2">交易量</p>
              <p className="text-3xl font-bold text-white">456M</p>
              <p className="text-gray-500 text-xs mt-1">SUI</p>
              <p className="text-green-500 text-xs mt-1">↑ 12.5%</p>
            </div>
            {/* NFT总量 */}
            <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm mb-2">NFT总量</p>
              <p className="text-3xl font-bold text-white">125K</p>
              <p className="text-gray-500 text-xs mt-1">个</p>
              <p className="text-green-500 text-xs mt-1">↑ 8.3%</p>
            </div>
            {/* 版税支付 */}
            <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm mb-2">版税支付</p>
              <p className="text-3xl font-bold text-white">3.6M</p>
              <p className="text-gray-500 text-xs mt-1">SUI</p>
              <p className="text-green-500 text-xs mt-1">↑ 15.2%</p>
            </div>
            {/* NFT持有者 */}
            <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm mb-2">NFT持有者</p>
              <p className="text-3xl font-bold text-white">89K</p>
              <p className="text-gray-500 text-xs mt-1">用户</p>
              <p className="text-green-500 text-xs mt-1">↑ 5.2%</p>
            </div>
            {/* 质押率 */}
            <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm mb-2">质押率</p>
              <p className="text-3xl font-bold text-white">68%</p>
              <p className="text-gray-500 text-xs mt-1">总质押</p>
              <p className="text-orange-500 text-xs mt-1">热</p>
            </div>
            {/* BOX质押 */}
            <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm mb-2">BOX质押</p>
              <p className="text-3xl font-bold text-white">28M</p>
              <p className="text-gray-500 text-xs mt-1">占总流通 28%</p>
            </div>
            {/* SUI质押 */}
            <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm mb-2">SUI质押</p>
              <p className="text-3xl font-bold text-white">85M</p>
              <p className="text-gray-500 text-xs mt-1">占总流通 15%</p>
            </div>
            {/* NFT质押 */}
            <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/50 text-center">
              <p className="text-gray-400 text-sm mb-2">NFT质押</p>
              <p className="text-3xl font-bold text-white">45K</p>
              <p className="text-gray-500 text-xs mt-1">占总NFT 36%</p>
            </div>
          </div>
        </section>

      </div>

      {/* 底部 */}
      <footer className="border-t border-gray-800 bg-gradient-to-b from-gray-900/80 to-black mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-start justify-between gap-12 flex-wrap">
            {/* 左边 - 宣传信息 + 统计 */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {/* 动态Logo */}
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-pink-500 to-violet-500 rounded-2xl blur-md opacity-75 animate-pulse" style={{ animationDuration: '2s' }} />
                  <Image src="/suibox-logo.png" alt="SUIBOX" width={64} height={64} className="relative object-contain animate-pulse" style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <p className="font-bold text-2xl bg-gradient-to-r from-violet-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">发现SUIBOX</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                即可发现并购买NFT。无需托管，无需延迟，只需连接您的钱包，并通过我们的智能合约购买即可。
              </p>
              {/* 统计 - 4列 */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50 text-center">
                  <p className="text-gray-400 text-xs">用户人数</p>
                  <p className="text-xl font-bold text-white">8,522</p>
                  <p className="text-green-500 text-xs">↑ 5.2%</p>
                </div>
                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50 text-center">
                  <p className="text-gray-400 text-xs">今日交易量</p>
                  <p className="text-xl font-bold text-white">567</p>
                  <p className="text-green-500 text-xs">↑ 12.5%</p>
                </div>
                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50 text-center">
                  <p className="text-gray-400 text-xs">Gas费率</p>
                  <p className="text-xl font-bold text-white">0.000001</p>
                  <p className="text-gray-500 text-xs">SUI</p>
                </div>
                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50 text-center">
                  <p className="text-gray-400 text-xs">网络状态</p>
                  <p className="text-xl font-bold text-green-500">正常</p>
                  <p className="text-gray-500 text-xs">45ms</p>
                </div>
              </div>
            </div>

            {/* 右边 - 快捷链接 */}
            <div className="flex gap-16">
              {/* 探索 */}
              <div>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full" />
                  探索
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="/craft" className="hover:text-white transition-colors">• 合成</Link></li>
                  <li><Link href="/market" className="hover:text-white transition-colors">• 交易</Link></li>
                  <li><Link href="/governance" className="hover:text-white transition-colors">• 质押</Link></li>
                  <li><Link href="/auction" className="hover:text-white transition-colors">• 拍卖</Link></li>
                </ul>
              </div>
              {/* 创造 */}
              <div>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
                  创造
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="/join" className="hover:text-white transition-colors">• 入驻</Link></li>
                  <li><Link href="/create" className="hover:text-white transition-colors">• 铸造</Link></li>
                </ul>
              </div>
              {/* 支持 */}
              <div>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                  支持
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="/support" className="hover:text-white transition-colors">• 客服中心</Link></li>
                  <li><Link href="/help" className="hover:text-white transition-colors">• 帮助中心</Link></li>
                  <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">• X</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 底部版权 */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-6 text-sm text-gray-500">
                <Link href="/terms" className="hover:text-white transition-colors">服务条款</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
                <Link href="/security" className="hover:text-white transition-colors">安全中心</Link>
                <Link href="/join" className="hover:text-white transition-colors">申请入驻</Link>
              </div>
              <div className="text-gray-500 text-sm">
                © 2026 SUIBOX. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 出价弹窗 - 响应式 */}
      {bidModal.show && bidModal.auction && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setBidModal({show: false})}
        >
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-gray-900 rounded-t-3xl md:rounded-2xl w-full md:max-w-md max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* 关闭按钮 - 移动端 */}
            <button 
              onClick={() => setBidModal({show: false})}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* 图片 */}
            <div className="aspect-square bg-gray-800 relative flex items-center justify-center text-8xl">
              <img src={bidModal.auction.image} alt={bidModal.auction.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold ${
                bidModal.auction.rarity === '传说' ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}>
                {bidModal.auction.rarity === '传说' ? '⭐ SSR' : '💎 SR'}
              </span>
            </div>
            
            <div className="p-4 md:p-6 -mt-8 relative">
              {/* NFT信息卡片 */}
              <div className="bg-gray-800/90 backdrop-blur rounded-2xl p-4 mb-4 border border-gray-700">
                <h3 className="text-xl md:text-2xl font-bold mb-1">{bidModal.auction.name}</h3>
                <p className="text-gray-400 text-sm">by {bidModal.auction.artist}</p>
              </div>
              
              {/* 价格信息 */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-4 mb-4 border border-orange-500/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">当前价</p>
                    <p className="text-3xl md:text-4xl font-black text-orange-400">{bidModal.auction.price}</p>
                    <p className="text-orange-400/60 text-sm">BOX</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">{bidModal.auction.bids}次出价</p>
                    <p className="text-red-400 text-sm font-medium">🔥 {formatCountdown(bidModal.auction.id)}</p>
                  </div>
                </div>
              </div>
              
              {/* 出价输入 */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm block mb-2">出价金额 (BOX)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={bidPrice}
                    onChange={(e) => { setBidPrice(e.target.value); setBidError(''); }}
                    className={`w-full bg-gray-800/80 border rounded-xl py-4 px-4 pr-16 text-white text-xl font-bold text-center ${bidError ? 'border-red-500' : 'border-gray-600'}`}
                    placeholder="请输入出价金额"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 font-bold">
                    BOX
                  </span>
                </div>
                {bidError ? (
                  <p className="text-red-400 text-xs text-center mt-2">{bidError}</p>
                ) : (
                  <p className="text-gray-500 text-xs text-center mt-2">
                    最低出价: {Math.floor(bidModal.auction.price * 1.1)} BOX
                  </p>
                )}
              </div>

              {/* 一口价 */}
              {bidModal.auction.buyNowPrice && (
                <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-medium">一口价</span>
                    <span className="text-yellow-400 font-bold">{bidModal.auction.buyNowPrice} BOX</span>
                  </div>
                </div>
              )}
              
              {/* 按钮 */}
              <div className="space-y-3">
                <button 
                  onClick={submitBid} 
                  className="w-full py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all"
                >
                  ⚡ 确认出价
                </button>
                {bidModal.auction.buyNowPrice && (
                  <button 
                    onClick={handleBuyNow}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all"
                  >
                    💰 一口价购买
                  </button>
                )}
              </div>
              
              {/* 说明 */}
              <p className="text-gray-500 text-xs text-center mt-4">
                📊 卖家到手 95% | 🔥 平台销毁 5%
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
