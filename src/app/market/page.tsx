'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, Heart, ShoppingCart, X, Zap, MessageCircle, Send, DollarSign, TrendingUp, Flame, Clock, Filter, RefreshCw, Eye, CheckCircle } from 'lucide-react';

interface NFT {
  id: number;
  name: string;
  image: string;
  price: number;
  priceUnit: string;
  supply: number;
  remaining: number;
  rarity: string;
  category: string;
  artist: string;
  description: string;
  likes: number;
  comments: number;
  sales: number;
  views: number;
  createdAt: string;
  verified: boolean;
}

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  liked: boolean;
}

interface Offer {
  id: number;
  buyer: string;
  price: number;
  unit: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function MarketPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCoin, setActiveCoin] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [activeTab, setActiveTab] = useState<'buy' | 'offer' | 'comments'>('buy');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerType, setOfferType] = useState<'溢价' | '折价'>('溢价');
  const [offerPercent, setOfferPercent] = useState('10');
  const [showOffers, setShowOffers] = useState(false);
  const [comments, setComments] = useState<Record<number, Comment[]>>({
    1: [
      { id: 1, user: 'CryptoFan', avatar: '🎮', text: '太漂亮了！必须入手', time: '2小时前', liked: false },
      { id: 2, user: 'NFTCollector', avatar: '💎', text: '稀有度拉满', time: '5小时前', liked: true },
    ],
    2: [{ id: 1, user: 'SuiLover', avatar: '⚡', text: '火焰特效太帅了', time: '1天前', liked: false }],
  });
  const [newComment, setNewComment] = useState('');
  const [myOffers, setMyOffers] = useState<Offer[]>([
    { id: 1, buyer: '你', price: 450, unit: 'SUI', status: 'pending' },
  ]);

  const categories = [
    { key: 'all', label: '全部', count: 156 },
    { key: 'common', label: '普通', count: 89 },
    { key: 'rare', label: '稀有', count: 45 },
    { key: 'epic', label: '史诗', count: 18 },
    { key: 'collector', label: '藏家', count: 12 },
    { key: 'digital', label: '数字IP', count: 8 },
  ];

  const nfts: NFT[] = [
    { id: 1, name: '星辰大海 #88', image: '🌟', price: 500, priceUnit: 'SUI', supply: 100, remaining: 45, rarity: 'Epic', category: 'collector', artist: 'CryptoArtist', description: '稀有的星空主题NFT，蕴含宇宙的神秘力量。全球限量100枚，每一枚都是独特的艺术品。', likes: 234, comments: 2, sales: 89, views: 1256, createdAt: '2026-03-01', verified: true },
    { id: 2, name: '烈焰麒麟 #66', image: '🔥', price: 150, priceUnit: 'SUI', supply: 500, remaining: 230, rarity: 'Rare', category: 'digital', artist: 'FireMaster', description: '燃烧的麒麟兽，代表着热情与力量。拥有独特的火焰特效。', likes: 189, comments: 1, sales: 156, views: 890, createdAt: '2026-03-05', verified: true },
    { id: 3, name: '冰晶之心 #55', image: '❄️', price: 120, priceUnit: 'BOX', supply: 500, remaining: 312, rarity: 'Rare', category: 'common', artist: 'IceQueen', description: '冰冷的钻石之心，极寒之美。', likes: 156, comments: 0, sales: 98, views: 567, createdAt: '2026-03-08', verified: false },
    { id: 4, name: '大地之怒 #33', image: '🌍', price: 30, priceUnit: 'BOX', supply: 1000, remaining: 567, rarity: 'Common', category: 'common', artist: 'EarthKing', description: '大地的力量，入门级NFT首选。', likes: 89, comments: 0, sales: 234, views: 432, createdAt: '2026-03-10', verified: false },
    { id: 5, name: '机械之心 #77', image: '⚙️', price: 800, priceUnit: 'SUI', supply: 50, remaining: 12, rarity: 'Epic', category: 'digital', artist: 'RoboArtist', description: '未来科技结晶，机械美学的巅峰之作。', likes: 312, comments: 0, sales: 45, views: 2100, createdAt: '2026-03-12', verified: true },
    { id: 6, name: '暗黑天使 #99', image: '😈', price: 666, priceUnit: 'BOX', supply: 80, remaining: 34, rarity: 'Epic', category: 'collector', artist: 'DarkSoul', description: '暗黑系顶级艺术品，极致奢华。', likes: 267, comments: 0, sales: 67, views: 1567, createdAt: '2026-03-14', verified: true },
    { id: 7, name: '金色凤凰 #11', image: '🐦', price: 999, priceUnit: 'SUI', supply: 30, remaining: 8, rarity: 'Epic', category: 'collector', artist: 'Phoenix', description: '浴火重生的凤凰，极致稀有。', likes: 456, comments: 0, sales: 28, views: 3200, createdAt: '2026-03-15', verified: true },
    { id: 8, name: '绿茵王者 #22', image: '⚽', price: 50, priceUnit: 'BOX', supply: 800, remaining: 445, rarity: 'Common', category: 'digital', artist: 'SoccerKing', description: '足球主题NFT，体育爱好者的首选。', likes: 123, comments: 0, sales: 312, views: 678, createdAt: '2026-03-16', verified: false },
  ];

  const filteredNFTs = useMemo(() => {
    let result = [...nfts];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(nft => 
        nft.name.toLowerCase().includes(query) ||
        nft.artist.toLowerCase().includes(query) ||
        nft.description.toLowerCase().includes(query) ||
        nft.rarity.toLowerCase().includes(query) ||
        nft.category.toLowerCase().includes(query)
      );
    }
    if (activeCategory !== 'all') result = result.filter(nft => nft.rarity.toLowerCase() === activeCategory || nft.category === activeCategory);
    if (activeCoin !== 'all') result = result.filter(nft => nft.priceUnit === activeCoin);
    if (priceRange !== 'all') result = result.filter(nft => { if (priceRange === 'low') return nft.price < 100; if (priceRange === 'mid') return nft.price >= 100 && nft.price <= 500; if (priceRange === 'high') return nft.price > 500; return true; });
    switch (sortBy) { case 'hot': result.sort((a, b) => b.likes - a.likes); break; case 'new': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break; case 'price-asc': result.sort((a, b) => a.price - b.price); break; case 'price-desc': result.sort((a, b) => b.price - a.price); break; case 'views': result.sort((a, b) => b.views - a.views); break; }
    return result;
  }, [nfts, searchQuery, activeCategory, activeCoin, priceRange, sortBy]);

  const toggleFavorite = (id: number) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  const toggleCommentLike = (nftId: number, commentId: number) => setComments(prev => ({ ...prev, [nftId]: prev[nftId]?.map(c => c.id === commentId ? { ...c, liked: !c.liked } : c) || [] }));

  const handleSendComment = () => {
    if (!newComment.trim() || !selectedNFT) return;
    setComments(prev => ({ ...prev, [selectedNFT.id]: [...(prev[selectedNFT.id] || []), { id: Date.now(), user: '你', avatar: '👤', text: newComment, time: '刚刚', liked: false }] }));
    setNewComment('');
  };

  const handleSubmitOffer = () => {
    if (!offerPrice || !selectedNFT) return;
    const finalPrice = offerType === '溢价' ? Number(offerPrice) * (1 + Number(offerPercent) / 100) : Number(offerPrice) * (1 - Number(offerPercent) / 100);
    alert(`报价提交成功！\n报价: ${Math.round(finalPrice)} ${selectedNFT.priceUnit}\n等待卖家确认...`);
    setOfferPrice('');
    setSelectedNFT(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) { case 'epic': return 'from-purple-500 to-pink-500'; case 'rare': return 'from-blue-500 to-cyan-500'; default: return 'from-gray-500 to-gray-600'; }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity.toLowerCase()) { case 'epic': return '👑 史诗'; case 'rare': return '💎 稀有'; default: return '⭐ 普通'; }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-violet-900/30 to-transparent pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">🛒 NFT大厅 鉴赏与交易</h1>
              <p className="text-gray-400 mt-1">浏览和购买稀有NFT · 已有 2,456 笔交易</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-4 py-2 bg-gray-800/50 rounded-xl"><p className="text-2xl font-bold text-green-400">156</p><p className="text-xs text-gray-500">在线NFT</p></div>
              <div className="text-center px-4 py-2 bg-gray-800/50 rounded-xl"><p className="text-2xl font-bold text-pink-400">89</p><p className="text-xs text-gray-500">今日交易</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-14 md:top-16 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="text" placeholder="搜索NFT名称、艺术家..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500" /></div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${activeCategory === cat.key ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {cat.label} <span className="opacity-60">({cat.count})</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <select value={activeCoin} onChange={(e) => setActiveCoin(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
                  <option value="all">全部代币</option>
                  <option value="BOX">BOX交易</option>
                  <option value="SUI">SUI交易</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
                  <option value="hot">🔥 热度</option>
                  <option value="new">🕐 最新</option>
                  <option value="price-asc">💰 价格低</option>
                  <option value="price-desc">💎 价格高</option>
                  <option value="views">👀 浏览量</option>
                </select>
                <div className="flex bg-gray-800 rounded-lg overflow-hidden"><button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}><Grid className="w-4 h-4" /></button><button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-violet-600' : 'hover:bg-gray-700'}`}><List className="w-4 h-4" /></button></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4"><p className="text-gray-400">找到 <span className="text-white font-bold">{filteredNFTs.length}</span> 个NFT</p><button className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 刷新</button></div>
        {filteredNFTs.length === 0 ? <div className="text-center py-20"><p className="text-gray-500 text-lg">没有找到匹配的NFT</p></div> : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredNFTs.map((nft) => (
              <motion.div key={nft.id} whileHover={{ scale: 1.02 }} className="bg-gray-900 rounded-2xl overflow-hidden cursor-pointer group" onClick={() => setSelectedNFT(nft)}>
                <div className="aspect-square bg-gray-800 flex items-center justify-center text-7xl relative overflow-hidden">
                  <span className="transform group-hover:scale-110 transition-transform duration-500">{nft.image}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(nft.id); }} className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur rounded-full hover:bg-black/60 transition-colors"><Heart className={`w-5 h-5 ${favorites.includes(nft.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} /></button>
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(nft.rarity)}`}>{getRarityBadge(nft.rarity)}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${nft.priceUnit === 'BOX' ? 'bg-orange-500' : 'bg-cyan-500'}`}>{nft.priceUnit}</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1"><h3 className="font-bold text-sm truncate flex-1">{nft.name}</h3>{nft.verified && <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />}</div>
                  <p className="text-gray-500 text-xs mb-2">by {nft.artist}</p>
                  <div className="flex justify-between items-end">
                    <div><p className="text-gray-500 text-[10px]">价格</p><p className="text-lg font-black text-gradient-to-r from-violet-400 to-pink-400">{nft.price}</p></div>
                    <div className="text-right"><p className="text-gray-500 text-[10px]">剩余</p><p className="text-gray-300 text-sm">{nft.remaining}/{nft.supply}</p></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNFTs.map((nft) => (
              <motion.div key={nft.id} whileHover={{ scale: 1.01 }} className="bg-gray-900 rounded-2xl p-4 flex gap-4 cursor-pointer" onClick={() => setSelectedNFT(nft)}>
                <div className="w-24 h-24 bg-gray-800 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">{nft.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-lg">{nft.name}</h3>{nft.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}<span className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${getRarityColor(nft.rarity)}`}>{nft.rarity}</span></div>
                  <p className="text-gray-500 text-sm mb-2">by {nft.artist}</p>
                  <div className="flex items-center gap-4">
                    <div><span className="text-gray-500 text-xs">价格</span><span className="ml-2 font-bold text-violet-400">{nft.price} {nft.priceUnit}</span></div>
                    <div><span className="text-gray-500 text-xs">剩余</span><span className="ml-2 text-gray-300">{nft.remaining}</span></div>
                    <div><span className="text-gray-500 text-xs">热度</span><span className="ml-2 text-red-400">❤️ {nft.likes}</span></div>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(nft.id); }}><Heart className={`w-5 h-5 ${favorites.includes(nft.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={() => setSelectedNFT(null)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-gray-900 rounded-t-3xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedNFT(null)} className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white md:hidden"><X className="w-5 h-5" /></button>
              <div className="aspect-square md:aspect-video bg-gray-800 relative flex items-center justify-center text-[120px]">{selectedNFT.image}</div>
              <div className="p-4 md:p-6 -mt-8 relative">
                <div className="bg-gray-800/90 backdrop-blur rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2"><h2 className="text-2xl font-black">{selectedNFT.name}</h2>{selectedNFT.verified && <CheckCircle className="w-5 h-5 text-blue-400" />}<span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getRarityColor(selectedNFT.rarity)}`}>{selectedNFT.rarity}</span></div>
                  <p className="text-gray-400">by <span className="text-violet-400">{selectedNFT.artist}</span></p>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center bg-gray-800/50 rounded-xl p-3"><p className="text-gray-500 text-xs">价格</p><p className="text-xl font-black text-violet-400">{selectedNFT.price}</p><p className="text-gray-500 text-xs">{selectedNFT.priceUnit}</p></div>
                  <div className="text-center bg-gray-800/50 rounded-xl p-3"><p className="text-gray-500 text-xs">剩余</p><p className="text-xl font-black">{selectedNFT.remaining}</p><p className="text-gray-500 text-xs">/ {selectedNFT.supply}</p></div>
                  <div className="text-center bg-gray-800/50 rounded-xl p-3"><p className="text-gray-500 text-xs">销量</p><p className="text-xl font-black text-green-400">{selectedNFT.sales}</p></div>
                  <div className="text-center bg-gray-800/50 rounded-xl p-3"><p className="text-gray-500 text-xs">热度</p><p className="text-xl font-black text-red-400">❤️ {selectedNFT.likes}</p></div>
                </div>
                <div className="flex gap-2 mb-4 border-b border-gray-700">
                  {[{ key: 'buy', label: '购买', icon: ShoppingCart }, { key: 'offer', label: '报价', icon: DollarSign }, { key: 'comments', label: '评论', icon: MessageCircle }].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === tab.key ? 'border-violet-500 text-violet-400' : 'border-transparent text-gray-500 hover:text-white'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>
                  ))}
                </div>
                {activeTab === 'buy' && (
                  <div className="space-y-3">
                    <button className="w-full py-4 bg-gradient-to-r from-violet-600 via-pink-600 to-purple-600 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"><ShoppingCart className="w-5 h-5" />立即购买 {selectedNFT.price} {selectedNFT.priceUnit}</button>
                  </div>
                )}
                {activeTab === 'offer' && (
                  <div className="space-y-3">
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3"><DollarSign className="w-5 h-5 text-green-400" /><span className="font-bold">发起报价</span></div>
                      <div className="flex gap-2 mb-2">
                        <select value={offerType} onChange={(e) => setOfferType(e.target.value as any)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"><option>溢价</option><option>折价</option></select>
                        <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="输入价格" className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        <select value={selectedNFT.priceUnit} disabled className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-400"><option>{selectedNFT.priceUnit}</option></select>
                      </div>
                      <div className="flex gap-2 mb-3">
                        {['5', '10', '15', '20'].map(p => (
                          <button key={p} onClick={() => setOfferPercent(p)} className={`flex-1 py-1.5 rounded-lg text-sm ${offerPercent === p ? 'bg-violet-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{offerType === '溢价' ? '+' : '-'}{p}%</button>
                        ))}
                      </div>
                      <button onClick={handleSubmitOffer} className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold flex items-center justify-center gap-2"><Zap className="w-5 h-5" />确认报价</button>
                    </div>
                  </div>
                )}
                {activeTab === 'comments' && (
                  <div className="space-y-3">
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {comments[selectedNFT.id]?.map(c => (
                        <div key={c.id} className="flex gap-2"><span className="text-2xl">{c.avatar}</span><div className="flex-1"><div className="flex items-center gap-2"><span className="font-bold text-sm">{c.user}</span><span className="text-gray-500 text-xs">{c.time}</span><button onClick={() => toggleCommentLike(selectedNFT.id, c.id)} className={`text-xs ${c.liked ? 'text-red-400' : 'text-gray-500'}`}>❤️</button></div><p className="text-gray-300 text-sm">{c.text}</p></div></div></div>
                      ))}
                      {(!comments[selectedNFT.id] || comments[selectedNFT.id].length === 0) && <p className="text-center text-gray-500 py-4">暂无评论</p>}
                    </div>
                    <div className="flex gap-2"><input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="发表评论..." className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white" /><button onClick={handleSendComment} className="px-4 bg-violet-600 rounded-lg"><Send className="w-5 h-5" /></button></div>
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
