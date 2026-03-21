'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, Heart, ShoppingCart, X, Flame, Zap, DollarSign, MessageCircle, Send, TrendingUp, Users, Layers, Sparkles, Loader2, Filter } from 'lucide-react';
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
  { id: '6', name: '暗黑天使 #99', image: '😈', price: 666, priceUnit: 'SUI', supply: 80, remaining: 34, rarity: 'Epic', category: 'art', artist: 'DarkSoul', description: '暗黑系顶级艺术品，极致奢华', likes: 267, comments: 63, sales: 67, createdAt: '2026-03-14', verified: false },
  { id: '7', name: '金色凤凰 #11', image: '🐦', price: 500, priceUnit: 'BOX', supply: 30, remaining: 8, rarity: 'Legendary', category: 'art', artist: 'Phoenix', description: '浴火重生的凤凰，极致稀有', likes: 456, comments: 89, sales: 28, createdAt: '2026-03-15', verified: true },
  { id: '8', name: '绿茵王者 #22', image: '⚽', price: 50, priceUnit: 'SUI', supply: 800, remaining: 445, rarity: 'Common', category: 'sports', artist: 'SoccerKing', description: '足球主题NFT，体育爱好者首选', likes: 123, comments: 28, sales: 312, createdAt: '2026-03-16', verified: true },
  { id: '9', name: '星空漫游 #44', image: '🚀', price: 280, priceUnit: 'SUI', supply: 200, remaining: 89, rarity: 'Rare', category: 'art', artist: 'SpaceArtist', description: '探索宇宙的奥秘，星空漫游者', likes: 178, comments: 34, sales: 123, createdAt: '2026-03-17', verified: true },
  { id: '10', name: '深海巨兽 #77', image: '🦑', price: 120, priceUnit: 'BOX', supply: 150, remaining: 67, rarity: 'Epic', category: 'nature', artist: 'OceanMaster', description: '深海的霸主，神秘而强大', likes: 234, comments: 56, sales: 98, createdAt: '2026-03-18', verified: true },
];

const rarityColors: Record<string, string> = {
  Legendary: 'from-amber-500 via-orange-500 to-yellow-500',
  Epic: 'from-purple-500 via-pink-500 to-violet-500',
  Rare: 'from-blue-500 via-cyan-500 to-sky-500',
  Common: 'from-gray-500 to-gray-600',
};

const rarityBorders: Record<string, string> = {
  Legendary: 'border-amber-500/50 shadow-amber-500/20',
  Epic: 'border-purple-500/50 shadow-purple-500/20',
  Rare: 'border-blue-500/30 shadow-blue-500/10',
  Common: 'border-white/10',
};

export default function MarketPage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  // 统一认证
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
  const [chainData, setChainData] = useState<Record<string, { owners: number }>>({});
  const [loadingChain, setLoadingChain] = useState(true);

  const categories = [
    { key: 'all', label: '全部', icon: Layers },
    { key: 'art', label: '艺术品', icon: Sparkles },
    { key: 'nature', label: '自然', icon: TrendingUp },
    { key: 'tech', label: '科技', icon: Zap },
    { key: 'sports', label: '体育', icon: Flame },
  ];

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

  // 统计数据
  const stats = useMemo(() => ({
    total: mockNFTs.length,
    suiCount: mockNFTs.filter(n => n.priceUnit === 'SUI').length,
    boxCount: mockNFTs.filter(n => n.priceUnit === 'BOX').length,
    filtered: filteredNFTs.length,
  }), [filteredNFTs]);

  useEffect(() => {
    setLoadingChain(true);
    const timer = setTimeout(() => {
      const data: Record<string, { owners: number }> = {};
      mockNFTs.forEach(n => { data[n.id] = { owners: Math.floor(Math.random() * 500) + 10 }; });
      setChainData(data);
      setLoadingChain(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 顶部装饰 */}
      <div className="relative h-32 md:h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-purple-900/20 to-gray-950" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/15 rounded-full blur-[60px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg shadow-violet-500/30">
              🛒
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                NFT 大厅
              </h1>
              <p className="text-gray-400 text-sm">发现 · 收藏 · 交易</p>
            </div>
          </div>
        </div>
      </div>

      {/* 统计栏 */}
      <div className="bg-gray-900/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">交易方式:</span>
              <div className="flex gap-1">
                {[
                  { key: 'all', label: '全部', count: stats.total },
                  { key: 'SUI', label: 'SUI', count: stats.suiCount },
                  { key: 'BOX', label: 'BOX', count: stats.boxCount },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setCoinFilter(item.key as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      coinFilter === item.key 
                        ? item.key === 'SUI' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                        : item.key === 'BOX' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50'
                        : 'bg-white/10 text-white border border-white/20'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {item.key === 'SUI' ? '🔵' : item.key === 'BOX' ? '🟣' : '✨'} {item.label}
                    <span className="opacity-60">({item.count})</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {loadingChain ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
              <span>{loadingChain ? '同步中' : '链上已同步'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="sticky top-14 z-30 bg-gray-950/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* 搜索 */}
            <div className="relative flex-1 min-w-[150px] max-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="搜索NFT..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:border-violet-500/50"
              />
            </div>

            {/* 分隔 */}
            <div className="hidden sm:block w-px h-4 bg-white/10" />

            {/* 分类 */}
            <div className="flex gap-1 overflow-x-auto">
              {categories.map(cat => (
                <button 
                  key={cat.key} 
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.key ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 价格筛选 */}
            <select 
              value={priceRange} 
              onChange={e => setPriceRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs cursor-pointer"
            >
              <option value="all">💰 全部价格</option>
              <option value="low">💰 0-100</option>
              <option value="mid">💰 100-500</option>
              <option value="high">💰 500+</option>
            </select>

            {/* 排序 */}
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs cursor-pointer"
            >
              <option value="hot">🔥 热度</option>
              <option value="new">🕐 最新</option>
              <option value="price-asc">⬆️ 价格低</option>
              <option value="price-desc">⬇️ 价格高</option>
            </select>

            {/* 视图切换 */}
            <div className="flex bg-white/5 rounded-full p-0.5">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1.5 rounded-full ${viewMode === 'grid' ? 'bg-violet-600' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1.5 rounded-full ${viewMode === 'list' ? 'bg-violet-600' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* 结果数 */}
            <span className="text-xs text-gray-500 ml-auto">{stats.filtered}个NFT</span>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredNFTs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center text-4xl">🔍</div>
            <p className="text-gray-400 mb-4">暂无NFT</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); setPriceRange('all'); setCoinFilter('all'); }}
              className="px-4 py-2 bg-violet-600 rounded-full text-sm"
            >
              清空筛选
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredNFTs.map((nft, i) => (
              <motion.div 
                key={nft.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`bg-gray-900/80 rounded-2xl overflow-hidden cursor-pointer border ${rarityBorders[nft.rarity]} hover:shadow-lg transition-all`}
                onClick={() => setSelectedNFT(nft)}
              >
                {/* 图片 */}
                <div className="aspect-square bg-gradient-to-br from-gray-800 via-gray-900 to-black relative flex items-center justify-center text-5xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[nft.rarity]} opacity-0 group-hover:opacity-20 transition-opacity`} />
                  <span className="drop-shadow-2xl">{nft.image}</span>
                  
                  {/* 稀有度 */}
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${rarityColors[nft.rarity]} text-white`}>
                    {nft.rarity}
                  </span>
                  
                  {/* 币种标签 */}
                  <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    nft.priceUnit === 'SUI' ? 'bg-cyan-500/80 text-white' : 'bg-violet-500/80 text-white'
                  }`}>
                    {nft.priceUnit}
                  </span>

                  {/* 收藏 */}
                  <button 
                    onClick={e => { e.stopPropagation(); toggleFavorite(nft.id); }}
                    className="absolute bottom-2 right-2 p-1.5 bg-black/50 rounded-full"
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(nft.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                </div>

                {/* 信息 */}
                <div className="p-2.5">
                  <h3 className="font-bold text-sm truncate flex items-center gap-1">
                    {nft.name}
                    {nft.verified && <span className="text-blue-400 text-xs">✓</span>}
                  </h3>
                  <p className="text-gray-500 text-xs truncate mb-2">by {nft.artist}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-500">价格</p>
                      <p className={`font-black text-sm ${nft.priceUnit === 'SUI' ? 'text-cyan-400' : 'text-violet-400'}`}>
                        {nft.price} <span className="text-xs">{nft.priceUnit}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500">剩余</p>
                      <p className="text-xs font-bold">{nft.remaining}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* 列表视图 */
          <div className="space-y-2">
            {filteredNFTs.map((nft, i) => (
              <motion.div 
                key={nft.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ x: 4 }}
                className="bg-gray-900/80 rounded-xl p-3 flex gap-3 cursor-pointer border border-white/5 hover:border-white/20"
                onClick={() => setSelectedNFT(nft)}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center text-3xl flex-shrink-0 relative">
                  <span>{nft.image}</span>
                  <span className={`absolute -bottom-1 -right-1 px-1 py-0.5 rounded text-[8px] font-bold ${
                    nft.priceUnit === 'SUI' ? 'bg-cyan-500' : 'bg-violet-500'
                  }`}>{nft.priceUnit}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold truncate flex items-center gap-1">
                      {nft.name}
                      {nft.verified && <span className="text-blue-400 text-xs">✓</span>}
                    </h3>
                    <button onClick={e => { e.stopPropagation(); toggleFavorite(nft.id); }}>
                      <Heart className={`w-4 h-4 ${favorites.includes(nft.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs truncate">by {nft.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r ${rarityColors[nft.rarity]} text-white`}>
                      {nft.rarity}
                    </span>
                    <span className={`font-black text-sm ${nft.priceUnit === 'SUI' ? 'text-cyan-400' : 'text-violet-400'}`}>
                      {nft.price} {nft.priceUnit}
                    </span>
                    <span className="text-gray-500 text-xs">剩{nft.remaining}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50"
            onClick={() => setSelectedNFT(null)}
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              className="bg-gray-900 w-full md:max-w-md rounded-t-2xl md:rounded-2xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* 关闭 */}
              <button 
                onClick={() => setSelectedNFT(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 图片 */}
              <div className="aspect-square md:aspect-video bg-gradient-to-br from-gray-800 to-black relative flex items-center justify-center text-[100px]">
                <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[selectedNFT.rarity]} opacity-20`} />
                <span className="relative z-10">{selectedNFT.image}</span>
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${rarityColors[selectedNFT.rarity]} text-white`}>
                  {selectedNFT.rarity}
                </span>
                <span className={`absolute top-4 right-4 px-2 py-1 rounded-full text-sm font-bold ${
                  selectedNFT.priceUnit === 'SUI' ? 'bg-cyan-500 text-white' : 'bg-violet-500 text-white'
                }`}>
                  {selectedNFT.priceUnit}
                </span>
              </div>

              {/* 内容 */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-black">{selectedNFT.name}</h2>
                    <p className="text-gray-400 text-sm">by {selectedNFT.artist}</p>
                  </div>
                  <button 
                    onClick={() => toggleFavorite(selectedNFT.id)}
                    className={`p-2 rounded-full ${favorites.includes(selectedNFT.id) ? 'bg-red-500/20' : 'bg-white/10'}`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(selectedNFT.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <p className="text-gray-300 text-sm mb-4">{selectedNFT.description}</p>

                {/* 统计 */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { l: '价格', v: `${selectedNFT.price} ${selectedNFT.priceUnit}`, c: selectedNFT.priceUnit === 'SUI' ? 'cyan' : 'violet' },
                    { l: '剩余', v: selectedNFT.remaining },
                    { l: '销量', v: selectedNFT.sales },
                    { l: '热度', v: `❤️${selectedNFT.likes}` },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-gray-500 text-[10px]">{s.l}</p>
                      <p className={`font-bold text-sm ${s.c === 'cyan' ? 'text-cyan-400' : s.c === 'violet' ? 'text-violet-400' : ''}`}>{s.v}</p>
                    </div>
                  ))}
                </div>

                {/* 链上数据 */}
                {chainData[selectedNFT.id] && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 mb-4 text-center">
                    <span className="text-green-400 text-xs">🔗 {chainData[selectedNFT.id].owners} 人持有</span>
                  </div>
                )}

                {/* Tab */}
                <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-1">
                  {[
                    { key: 'buy', label: '购买', icon: ShoppingCart },
                    { key: 'offer', label: '报价', icon: DollarSign },
                    { key: 'comments', label: '评论', icon: MessageCircle },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                        activeTab === tab.key ? 'bg-violet-600 text-white' : 'text-gray-400'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab内容 */}
                {activeTab === 'buy' && (
                  <button
                    onClick={() => isLoggedIn ? alert('购买功能开发中') : alert('请先登录')}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    立即购买 {selectedNFT.price} {selectedNFT.priceUnit}
                  </button>
                )}

                {activeTab === 'offer' && (
                  <div className="space-y-2">
                    <input type="number" placeholder="输入报价金额" className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                    <button className="w-full py-3 bg-green-600 rounded-xl font-bold text-sm">发起报价</button>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-2">
                    <div className="max-h-24 overflow-y-auto space-y-2">
                      <div className="flex gap-2 text-sm">
                        <span>🎮</span>
                        <div>
                          <p className="font-bold text-xs">CryptoFan</p>
                          <p className="text-gray-400 text-xs">太漂亮了！</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="说点什么..." className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                      <button className="px-4 bg-violet-600 rounded-lg"><Send className="w-4 h-4" /></button>
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
