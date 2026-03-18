'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Heart, ShoppingCart, X, ChevronDown, Star, Flame, Clock, Zap } from 'lucide-react';

interface NFT {
  id: number;
  name: string;
  image: string;
  price: number;
  priceUnit: string;
  supply: number;
  remaining: number;
  rarity: string;
  artist: string;
  description: string;
  likes: number;
  comments: number;
  sales: number;
  createdAt: string;
}

export default function MarketPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { key: 'all', label: '全部' },
    { key: 'common', label: '普通' },
    { key: 'rare', label: '稀有' },
    { key: 'epic', label: '史诗' },
  ];

  const priceRanges = [
    { key: 'all', label: '全部价格' },
    { key: 'low', label: '0-100' },
    { key: 'mid', label: '100-500' },
    { key: 'high', label: '500+' },
  ];

  const sortOptions = [
    { key: 'hot', label: '热度', icon: Flame },
    { key: 'new', label: '最新', icon: Clock },
    { key: 'price-asc', label: '价格低', icon: Zap },
    { key: 'price-desc', label: '价格高', icon: Zap },
  ];

  const nfts: NFT[] = [
    { id: 1, name: '星辰大海 #88', image: '🌟', price: 500, priceUnit: 'SUI', supply: 100, remaining: 45, rarity: 'Epic', artist: 'CryptoArtist', description: '稀有的星空主题NFT，蕴含宇宙的神秘力量。全球限量100枚，每一枚都是独特的艺术品。', likes: 234, comments: 56, sales: 89, createdAt: '2026-03-01' },
    { id: 2, name: '烈焰麒麟 #66', image: '🔥', price: 150, priceUnit: 'SUI', supply: 500, remaining: 230, rarity: 'Rare', artist: 'FireMaster', description: '燃烧的麒麟兽，代表着热情与力量。拥有独特的火焰特效。', likes: 189, comments: 42, sales: 156, createdAt: '2026-03-05' },
    { id: 3, name: '冰晶之心 #55', image: '❄️', price: 120, priceUnit: 'SUI', supply: 500, remaining: 312, rarity: 'Rare', artist: 'IceQueen', description: '冰冷的钻石之心，极寒之美。蕴含冰雪女王的神秘力量。', likes: 156, comments: 38, sales: 98, createdAt: '2026-03-08' },
    { id: 4, name: '大地之怒 #33', image: '🌍', price: 30, priceUnit: 'SUI', supply: 1000, remaining: 567, rarity: 'Common', artist: 'EarthKing', description: '大地的力量，象征着稳固与坚韧。入门级NFT首选。', likes: 89, comments: 15, sales: 234, createdAt: '2026-03-10' },
    { id: 5, name: '机械之心 #77', image: '⚙️', price: 800, priceUnit: 'SUI', supply: 50, remaining: 12, rarity: 'Epic', artist: 'RoboArtist', description: '未来科技结晶，机械美学的巅峰之作。拥有独特的动态效果。', likes: 312, comments: 78, sales: 45, createdAt: '2026-03-12' },
    { id: 6, name: '暗黑天使 #99', image: '😈', price: 666, priceUnit: 'SUI', supply: 80, remaining: 34, rarity: 'Epic', artist: 'DarkSoul', description: '暗黑系顶级艺术品，极致奢华。代表着黑暗与优雅的完美结合。', likes: 267, comments: 63, sales: 67, createdAt: '2026-03-14' },
    { id: 7, name: '金色凤凰 #11', image: '🐦', price: 999, priceUnit: 'SUI', supply: 30, remaining: 8, rarity: 'Epic', artist: 'Phoenix', description: '浴火重生的凤凰，极致稀有。拥有炫目的金色光芒。', likes: 456, comments: 89, sales: 28, createdAt: '2026-03-15' },
    { id: 8, name: '绿茵王者 #22', image: '⚽', price: 50, priceUnit: 'SUI', supply: 800, remaining: 445, rarity: 'Common', artist: 'SoccerKing', description: '足球主题NFT，体育爱好者的首选。', likes: 123, comments: 28, sales: 312, createdAt: '2026-03-16' },
  ];

  const filteredNFTs = useMemo(() => {
    let result = [...nfts];
    
    // 搜索过滤
    if (searchQuery) {
      result = result.filter(nft => 
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 分类过滤
    if (activeCategory !== 'all') {
      result = result.filter(nft => 
        nft.rarity.toLowerCase() === activeCategory
      );
    }
    
    // 价格过滤
    if (priceRange !== 'all') {
      result = result.filter(nft => {
        if (priceRange === 'low') return nft.price < 100;
        if (priceRange === 'mid') return nft.price >= 100 && nft.price <= 500;
        if (priceRange === 'high') return nft.price > 500;
        return true;
      });
    }
    
    // 排序
    switch (sortBy) {
      case 'hot':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'new':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }
    
    return result;
  }, [nfts, searchQuery, activeCategory, priceRange, sortBy]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-violet-900/20 to-transparent pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🛒 NFT市场</h1>
          <p className="text-gray-400">浏览和购买稀有NFT</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-14 md:top-16 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-white/5 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text"
                placeholder="搜索NFT名称或艺术家..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            
            {/* Sort */}
            <div className="flex gap-2">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none"
              >
                {sortOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
              
              {/* View Mode */}
              <div className="flex bg-gray-800 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Categories & Price Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                    activeCategory === cat.key 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <select 
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none"
            >
              {priceRanges.map(pr => (
                <option key={pr.key} value={pr.key}>{pr.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-gray-400 text-sm mb-4">找到 {filteredNFTs.length} 个NFT</p>
        
        {filteredNFTs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">没有找到匹配的NFT</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredNFTs.map((nft) => (
              <motion.div
                key={nft.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setSelectedNFT(nft)}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-800 flex items-center justify-center text-6xl relative">
                  {nft.image}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(nft.id); }}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(nft.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                  <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${getRarityColor(nft.rarity)}`}>
                    {nft.rarity}
                  </span>
                </div>
                
                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-sm truncate">{nft.name}</h3>
                  <p className="text-gray-500 text-xs mb-2">by {nft.artist}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-xs">价格</p>
                      <p className="text-violet-400 font-bold">{nft.price} {nft.priceUnit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs">剩余</p>
                      <p className="text-gray-300">{nft.remaining}/{nft.supply}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNFTs.map((nft) => (
              <motion.div
                key={nft.id}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-900 rounded-xl p-4 flex gap-4 cursor-pointer"
                onClick={() => setSelectedNFT(nft)}
              >
                <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  {nft.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{nft.name}</h3>
                      <p className="text-gray-500 text-sm">by {nft.artist}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(nft.id); }}
                      className="p-1"
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(nft.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getRarityColor(nft.rarity)}`}>
                      {nft.rarity}
                    </span>
                    <span className="text-violet-400 font-bold">{nft.price} {nft.priceUnit}</span>
                    <span className="text-gray-500 text-sm">剩余 {nft.remaining}/{nft.supply}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
            onClick={() => setSelectedNFT(null)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-gray-900 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button 
                onClick={() => setSelectedNFT(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Image */}
              <div className="aspect-square bg-gray-800 flex items-center justify-center text-8xl relative">
                {selectedNFT.image}
                <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-bold ${getRarityColor(selectedNFT.rarity)}`}>
                  {selectedNFT.rarity}
                </span>
              </div>
              
              <div className="p-4 md:p-6">
                <h2 className="text-2xl font-bold mb-1">{selectedNFT.name}</h2>
                <p className="text-gray-400 mb-4">by {selectedNFT.artist}</p>
                
                <p className="text-gray-300 text-sm mb-6">{selectedNFT.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">价格</p>
                    <p className="text-violet-400 font-bold">{selectedNFT.price}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">剩余</p>
                    <p className="text-white font-bold">{selectedNFT.remaining}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">销量</p>
                    <p className="text-white font-bold">{selectedNFT.sales}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">热度</p>
                    <p className="text-red-400 font-bold">❤️ {selectedNFT.likes}</p>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => toggleFavorite(selectedNFT.id)}
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
                      favorites.includes(selectedNFT.id) 
                        ? 'bg-red-500/20 text-red-400 border border-red-500' 
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(selectedNFT.id) ? 'fill-current' : ''}`} />
                    {favorites.includes(selectedNFT.id) ? '已收藏' : '收藏'}
                  </button>
                  <button className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    立即购买
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
