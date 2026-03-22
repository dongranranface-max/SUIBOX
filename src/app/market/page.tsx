'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, Heart, ShoppingCart, X, Flame, Zap, DollarSign, MessageCircle, Send, TrendingUp, Users, Layers, Sparkles, Loader2, Filter, ChevronDown, Grid3X3, LayoutGrid, SlidersHorizontal, Fire, Star, Clock, ArrowUpDown, Plus, Minus } from 'lucide-react';
import { useWallet } from '@suiet/wallet-kit';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';

interface NFT {
  id: string;
  name: string;
  image: string;
  price: number;
  priceUnit: 'SUI' | 'BOX';
  supply: number;
  remaining: number;
  rarity: string;
  category: string;
  artist: string;
  description: string;
  likes: number;
  comments: number;
  sales: number;
  createdAt: string;
  verified: boolean;
}

const mockNFTs: NFT[] = [
  { id: '1', name: '星辰大海 #88', image: '🌟', price: 500, priceUnit: 'SUI', supply: 100, remaining: 45, rarity: 'Epic', category: 'art', artist: 'CryptoArtist', description: '稀有的星空主题NFT，蕴含宇宙的神秘力量', likes: 234, comments: 56, sales: 89, createdAt: '2026-03-01', verified: true },
  { id: '2', name: '烈焰麒麟 #66', image: '🔥', price: 150, priceUnit: 'SUI', supply: 500, remaining: 230, rarity: 'Rare', category: 'art', artist: 'FireMaster', description: '燃烧的麒麟兽，代表着热情与力量', likes: 189, comments: 42, sales: 156, createdAt: '2026-03-05', verified: true },
  { id: '3', name: '冰晶之心 #55', image: '❄️', price: 80, priceUnit: 'BOX', supply: 500, remaining: 312, rarity: 'Rare', category: 'art', artist: 'IceQueen', description: '冰冷的钻石之心，极寒之美', likes: 156, comments: 38, sales: 98, createdAt: '2026-03-08', verified: false },
  { id: '4', name: '大地之怒 #33', image: '🌍', price: 30, priceUnit: 'SUI', supply: 1000, remaining: 567, rarity: 'Common', category: 'nature', artist: 'EarthKing', description: '大地的力量，象征着稳固与坚韧', likes: 89, comments: 15, sales: 234, createdAt: '2026-03-10', verified: true },
  { id: '5', name: '机械之心 #77', image: '⚙️', price: 200, priceUnit: 'BOX', supply: 50, remaining: 12, rarity: 'Epic', category: 'tech', artist: 'RoboArtist', description: '未来科技结晶，机械美学的巅峰之作', likes: 312, comments: 78, sales: 45, createdAt: '2026-03-12', verified: true },
  { id: '6', name: '暗黑天使 #99', image: '😈', price: 666, priceUnit: 'SUI', supply: 80, remaining: 34, rarity: 'Legendary', category: 'art', artist: 'DarkSoul', description: '暗黑系顶级艺术品，极致奢华', likes: 267, comments: 63, sales: 67, createdAt: '2026-03-14', verified: false },
  { id: '7', name: '金色凤凰 #11', image: '🐦', price: 500, priceUnit: 'BOX', supply: 30, remaining: 8, rarity: 'Legendary', category: 'art', artist: 'Phoenix', description: '浴火重生的凤凰，极致稀有', likes: 456, comments: 89, sales: 28, createdAt: '2026-03-15', verified: true },
  { id: '8', name: '绿茵王者 #22', image: '⚽', price: 50, priceUnit: 'SUI', supply: 800, remaining: 445, rarity: 'Common', category: 'sports', artist: 'SoccerKing', description: '足球主题NFT，体育爱好者首选', likes: 123, comments: 28, sales: 312, createdAt: '2026-03-16', verified: true },
  { id: '9', name: '星空漫游 #44', image: '🚀', price: 280, priceUnit: 'SUI', supply: 200, remaining: 89, rarity: 'Rare', category: 'art', artist: 'SpaceArtist', description: '探索宇宙的奥秘，星空漫游者', likes: 178, comments: 34, sales: 123, createdAt: '2026-03-17', verified: true },
  { id: '10', name: '深海巨兽 #77', image: '🦑', price: 120, priceUnit: 'BOX', supply: 150, remaining: 67, rarity: 'Epic', category: 'nature', artist: 'OceanMaster', description: '深海的霸主，神秘而强大', likes: 234, comments: 56, sales: 98, createdAt: '2026-03-18', verified: true },
];

const rarityConfig: Record<string, { gradient: string; border: string; badge: string; glow: string }> = {
  Legendary: { gradient: 'from-amber-500 via-orange-500 to-yellow-500', border: 'border-amber-500/50', badge: 'bg-gradient-to-r from-amber-500 to-orange-500', glow: 'shadow-amber-500/30' },
  Epic: { gradient: 'from-violet-500 via-purple-500 to-pink-500', border: 'border-violet-500/50', badge: 'bg-gradient-to-r from-violet-500 to-purple-500', glow: 'shadow-violet-500/30' },
  Rare: { gradient: 'from-blue-500 via-cyan-500 to-sky-500', border: 'border-blue-500/40', badge: 'bg-gradient-to-r from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
  Common: { gradient: 'from-gray-500 to-slate-600', border: 'border-white/10', badge: 'bg-gray-600', glow: 'shadow-gray-500/10' },
};

const categories = [
  { key: 'all', label: 'All', icon: Grid3X3 },
  { key: 'art', label: 'Art', icon: Sparkles },
  { key: 'nature', label: 'Nature', icon: TrendingUp },
  { key: 'tech', label: 'Tech', icon: Zap },
  { key: 'sports', label: 'Sports', icon: Flame },
];

const sortOptions = [
  { key: 'hot', label: '🔥 Hot' },
  { key: 'new', label: '✨ New' },
  { key: 'price-asc', label: '💰 Price ↑' },
  { key: 'price-desc', label: '💎 Price ↓' },
];

export default function MarketPage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const { isLoggedIn, login } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [activeTab, setActiveTab] = useState<'buy' | 'offer' | 'comments'>('buy');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [coinFilter, setCoinFilter] = useState<'all' | 'SUI' | 'BOX'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerType, setOfferType] = useState<'fixed' | 'premium'>('fixed');
  const [premiumPercent, setPremiumPercent] = useState(10);
  const [comments, setComments] = useState<{id: string; user: string; avatar: string; text: string; time: string}[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  const filteredNFTs = useMemo(() => {
    let result = [...mockNFTs];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => n.name.toLowerCase().includes(q) || n.artist.toLowerCase().includes(q));
    }
    if (activeCategory !== 'all') result = result.filter(n => n.category === activeCategory);
    if (coinFilter !== 'all') result = result.filter(n => n.priceUnit === coinFilter);
    if (priceRange !== 'all') {
      result = result.filter(n => {
        if (priceRange === 'low') return n.price < 100;
        if (priceRange === 'mid') return n.price >= 100 && n.price <= 500;
        if (priceRange === 'high') return n.price > 500;
        return true;
      });
    }
    switch (sortBy) {
      case 'hot': result.sort((a, b) => b.likes - a.likes); break;
      case 'new': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    }
    return result;
  }, [searchQuery, activeCategory, priceRange, sortBy, coinFilter]);

  const stats = useMemo(() => ({
    total: mockNFTs.length,
    suiCount: mockNFTs.filter(n => n.priceUnit === 'SUI').length,
    boxCount: mockNFTs.filter(n => n.priceUnit === 'BOX').length,
    filtered: filteredNFTs.length,
  }), [filteredNFTs]);

  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  // 加载NFT评论
  const loadComments = (nftId: string) => {
    // 模拟评论数据
    setComments([
      { id: '1', user: 'CryptoFan', avatar: '🎨', text: 'Amazing NFT! The artwork is stunning 👏', time: '2h ago' },
      { id: '2', user: 'SUI_Degen', avatar: '🦊', text: 'Just bought one! Cant wait to see what comes next 🔥', time: '5h ago' },
      { id: '3', user: 'NFTHunter', avatar: '🎯', text: 'Great collection, highly recommend!', time: '1d ago' },
    ]);
  };

  // 处理溢价变化
  const handlePremiumChange = (percent: number) => {
    setPremiumPercent(percent);
    if (selectedNFT) {
      const premium = selectedNFT.price * (1 + percent / 100);
      setOfferPrice(premium.toFixed(2));
    }
  };

  // 提交报价
  const submitOffer = () => {
    if (!offerPrice || parseFloat(offerPrice) <= 0) return;
    setIsSubmittingOffer(true);
    // 模拟提交
    setTimeout(() => {
      setIsSubmittingOffer(false);
      alert(`Offer submitted!\nPrice: ${offerPrice} ${selectedNFT?.priceUnit}\nPremium: +${premiumPercent}%\nWaiting for seller confirmation...`);
    }, 1000);
  };

  // 提交评论
  const submitComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, {
      id: Date.now().toString(),
      user: 'You',
      avatar: '👤',
      text: newComment,
      time: 'Just now'
    }]);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 h-[280px] md:h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-purple-900/10 to-[#08080c]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-violet-500/15 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-pink-500/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-[10%] w-2 h-2 bg-violet-500/40 rounded-full blur-sm"
          />
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-24 right-[15%] w-3 h-3 bg-pink-500/30 rounded-full blur-sm"
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Title */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <LayoutGrid className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                    NFT Marketplace
                  </h1>
                  <p className="text-gray-500 text-sm">Discover • Collect • Trade</p>
                </div>
              </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="px-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
              >
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-gray-500">Total NFTs</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="px-4 py-2.5 bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-xl"
              >
                <p className="text-2xl font-bold text-cyan-400">{stats.suiCount}</p>
                <p className="text-xs text-gray-500">SUI Listings</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-2.5 bg-violet-500/10 backdrop-blur-xl border border-violet-500/20 rounded-xl"
              >
                <p className="text-2xl font-bold text-violet-400">{stats.boxCount}</p>
                <p className="text-xs text-gray-500">BOX Listings</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-[#08080c]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search NFTs, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Categories */}
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat.key 
                        ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Coin Filter */}
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                {[
                  { key: 'all', label: 'All', emoji: '🌟' },
                  { key: 'SUI', label: 'SUI', emoji: '🔵' },
                  { key: 'BOX', label: 'BOX', emoji: '🟣' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setCoinFilter(item.key as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      coinFilter === item.key 
                        ? item.key === 'SUI' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : item.key === 'BOX' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                        : 'bg-white/10 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-medium focus:outline-none focus:border-violet-500/50 cursor-pointer hover:bg-white/10 transition-all"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(priceRange !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-gray-500">Active filters:</span>
              {priceRange !== 'all' && (
                <span className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs rounded-lg flex items-center gap-1">
                  {priceRange === 'low' ? '💰 Under 100' : priceRange === 'mid' ? '💎 100-500' : '👑 Over 500'}
                  <button onClick={() => setPriceRange('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg flex items-center gap-1">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white font-medium">{stats.filtered}</span> NFTs
        </p>
      </div>

      {/* NFT Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        {filteredNFTs.length > 0 ? (
          <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
            {filteredNFTs.map((nft, index) => {
              const rarity = rarityConfig[nft.rarity] || rarityConfig.Common;
              return (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedNFT(nft)}
                  className={`group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:shadow-xl ${rarity.glow} ${viewMode === 'list' ? 'flex' : ''}`}
                >
                  {/* Image */}
                  <div className={`relative aspect-square ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : ''} overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${rarity.gradient} opacity-20`} />
                    <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl">
                      {nft.image}
                    </div>
                    
                    {/* Rarity Badge */}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 ${rarity.badge} rounded-lg text-[10px] font-bold text-white uppercase tracking-wider`}>
                      {nft.rarity}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(nft.id); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-rose-500/80"
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(nft.id) ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                    </button>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="block w-full py-2.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl text-center transition-colors">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-white truncate">{nft.name}</h3>
                      {nft.verified && <span className="text-blue-400 text-xs">✓</span>}
                    </div>
                    <p className="text-gray-500 text-xs mb-3 truncate">by {nft.artist}</p>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-gray-500 text-[10px] mb-0.5">Price</p>
                        <p className={`text-lg font-bold ${nft.priceUnit === 'SUI' ? 'text-cyan-400' : 'text-violet-400'}`}>
                          {nft.price} {nft.priceUnit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-[10px] mb-0.5">{nft.remaining}/{nft.supply}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Heart className="w-3 h-3" /> {nft.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* NFT Detail Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => { setSelectedNFT(null); setActiveTab('buy'); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => { e.stopPropagation(); loadComments(selectedNFT.id); }}
              className="w-full max-w-2xl bg-[#0f0f14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header Image */}
              <div className="relative h-64 bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-pink-900/30">
                <div className="absolute inset-0 flex items-center justify-center text-8xl">
                  {selectedNFT.image}
                </div>
                <div className={`absolute top-4 left-4 px-3 py-1.5 ${rarityConfig[selectedNFT.rarity]?.badge || 'bg-gray-600'} rounded-lg text-xs font-bold text-white uppercase`}>
                  {selectedNFT.rarity}
                </div>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{selectedNFT.name}</h2>
                    <p className="text-gray-500 flex items-center gap-2">
                      by <span className="text-violet-400">{selectedNFT.artist}</span>
                      {selectedNFT.verified && <span className="text-blue-400">✓</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedNFT.id)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      favorites.includes(selectedNFT.id) 
                        ? 'bg-rose-500/20 text-rose-500' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${favorites.includes(selectedNFT.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-gray-400 mb-4">{selectedNFT.description}</p>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab('buy')}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'buy' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setActiveTab('offer')}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'offer' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                  >
                    Make Offer
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'comments' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Comments
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'buy' && (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-gray-500 text-xs mb-1">Likes</p>
                        <p className="text-white font-bold">{selectedNFT.likes}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-gray-500 text-xs mb-1">Sales</p>
                        <p className="text-white font-bold">{selectedNFT.sales}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-gray-500 text-xs mb-1">Supply</p>
                        <p className="text-white font-bold">{selectedNFT.supply}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-gray-500 text-xs mb-1">Remaining</p>
                        <p className="text-white font-bold">{selectedNFT.remaining}</p>
                      </div>
                    </div>

                    {/* Price & Buy with +/- buttons */}
                    <div className="mb-4">
                      <label className="block text-gray-500 text-xs mb-2">Quantity</label>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {}}
                          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value="1"
                          readOnly
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-center font-semibold"
                        />
                        <button 
                          onClick={() => {}}
                          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price & Buy */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Total Price</p>
                        <p className={`text-3xl font-bold ${selectedNFT.priceUnit === 'SUI' ? 'text-cyan-400' : 'text-violet-400'}`}>
                          {selectedNFT.price} <span className="text-lg">{selectedNFT.priceUnit}</span>
                        </p>
                      </div>
                      <button className="px-8 py-3 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25">
                        Buy Now
                      </button>
                    </div>
                  </>
                )}

                {activeTab === 'offer' && (
                  <div className="space-y-4">
                    {/* Offer Type */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setOfferType('fixed'); setOfferPrice(String(selectedNFT.price)); }}
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
                        <span className="text-white font-medium">{selectedNFT.priceUnit}</span>
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
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}

                    {/* Calculated Price */}
                    {offerType === 'premium' && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Price (with {premiumPercent}% premium)</span>
                          <span className="text-2xl font-bold text-amber-400">
                            {(selectedNFT.price * (1 + premiumPercent / 100)).toFixed(2)} {selectedNFT.priceUnit}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Submit Offer */}
                    <button
                      onClick={submitOffer}
                      disabled={isSubmittingOffer || !offerPrice}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                    >
                      {isSubmittingOffer ? 'Submitting...' : 'Submit Offer (Seller Confirm)'}
                    </button>
                    <p className="text-gray-500 text-xs text-center">Seller needs to confirm your offer</p>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    {/* Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && submitComment()}
                        placeholder="Write a comment..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                      <button
                        onClick={submitComment}
                        disabled={!newComment.trim()}
                        className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all disabled:opacity-50"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-white/5 rounded-xl">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                            {comment.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white text-sm">{comment.user}</span>
                              <span className="text-gray-500 text-xs">{comment.time}</span>
                            </div>
                            <p className="text-gray-400 text-sm">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                      {comments.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No comments yet. Be the first!</p>
                      )}
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
