'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
}

export default function MarketPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCoin, setActiveCoin] = useState('all');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  const categories = [
    { key: 'all', label: '所有', icon: '🏠' },
    { key: 'common', label: '普通NFT', icon: '⭐' },
    { key: 'rare', label: '稀有NFT', icon: '💎' },
    { key: 'epic', label: '史诗NFT', icon: '👑' },
    { key: 'premium', label: '精品NFT', icon: '💍' },
    { key: 'artist', label: '作家IP', icon: '🎨' },
    { key: 'nomad', label: '数字游民', icon: '🌍' },
  ];

  const coins = [
    { key: 'all', label: '全部', icon: '📊' },
    { key: 'SUI', label: 'SUI', icon: '⚡' },
    { key: 'USDC', label: 'USDC', icon: '💵' },
    { key: 'BOX', label: 'BOX', icon: '📦' },
  ];

  const nfts: NFT[] = [
    { id: 1, name: '星辰大海 #88', image: '🌟', price: 500, priceUnit: 'SUI', supply: 100, remaining: 45, rarity: 'Epic', artist: 'CryptoArtist', description: '稀有的星空主题NFT，蕴含宇宙的神秘力量。全球限量100枚，每一枚都是独特的艺术品。', likes: 234, comments: 56 },
    { id: 2, name: '烈焰麒麟 #66', image: '🔥', price: 150, priceUnit: 'SUI', supply: 500, remaining: 230, rarity: 'Rare', artist: 'FireMaster', description: '燃烧的麒麟兽，代表着热情与力量。拥有独特的火焰特效。', likes: 189, comments: 42 },
    { id: 3, name: '冰晶之心 #55', image: '❄️', price: 120, priceUnit: 'SUI', supply: 500, remaining: 312, rarity: 'Rare', artist: 'IceQueen', description: '冰冷的钻石之心，极寒之美。蕴含冰雪女王的神秘力量。', likes: 156, comments: 38 },
    { id: 4, name: '大地之怒 #33', image: '🌍', price: 30, priceUnit: 'SUI', supply: 1000, remaining: 567, rarity: 'Common', artist: 'EarthKing', description: '大地的力量，象征着稳固与坚韧。入门级NFT首选。', likes: 89, comments: 15 },
    { id: 5, name: '机械之心 #77', image: '⚙️', price: 800, priceUnit: 'SUI', supply: 50, remaining: 12, rarity: 'Epic', artist: 'RoboArtist', description: '未来科技结晶，机械美学的巅峰之作。拥有独特的动态效果。', likes: 312, comments: 78 },
    { id: 6, name: '暗黑天使 #99', image: '😈', price: 666, priceUnit: 'SUI', supply: 80, remaining: 34, rarity: 'Epic', artist: 'DarkSoul', description: '暗黑系顶级艺术品，极致奢华。代表着黑暗与优雅的完美结合。', likes: 267, comments: 63 },
    { id: 7, name: '精灵之光 #44', image: '🧝', price: 45, priceUnit: 'SUI', supply: 800, remaining: 445, rarity: 'Common', artist: 'ElfArtist', description: '精灵族的守护之光，充满生机与活力。', likes: 78, comments: 12 },
    { id: 8, name: '宇宙之心 #01', image: '🌌', price: 2000, priceUnit: 'SUI', supply: 10, remaining: 3, rarity: 'Legendary', artist: 'StarArtist', description: '宇宙级传奇NFT，仅此一件！蕴含宇宙的终极奥秘。', likes: 567, comments: 123 },
    { id: 9, name: '深海之蓝 #12', image: '🌊', price: 125, priceUnit: 'USDC', supply: 300, remaining: 156, rarity: 'Rare', artist: 'OceanArtist', description: '深海的神秘蓝色，蕴含海洋的力量。', likes: 145, comments: 32 },
    { id: 10, name: '森林之子 #08', image: '🌲', price: 50, priceUnit: 'USDC', supply: 600, remaining: 320, rarity: 'Common', artist: 'NatureArt', description: '森林的守护者，自然的化身。', likes: 67, comments: 18 },
    { id: 11, name: '黄金时代 #05', image: '🏆', price: 588, priceUnit: 'BOX', supply: 50, remaining: 22, rarity: 'Epic', artist: 'GoldMaster', description: '黄金时代的辉煌，财富的象征。', likes: 289, comments: 55 },
    { id: 12, name: '白银骑士 #23', image: '🛡️', price: 235, priceUnit: 'BOX', supply: 200, remaining: 89, rarity: 'Rare', artist: 'SilverKing', description: '白银打造的骑士，守护着荣耀。', likes: 134, comments: 28 },
  ];

  const filteredNFTs = nfts.filter(nft => {
    if (activeCoin !== 'all' && nft.priceUnit !== activeCoin) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'common') return nft.rarity === 'Common';
    if (activeCategory === 'rare') return nft.rarity === 'Rare';
    if (activeCategory === 'epic') return nft.rarity === 'Epic' || nft.rarity === 'Legendary';
    if (activeCategory === 'premium') return nft.price >= 500;
    if (activeCategory === 'artist') return nft.artist === 'CryptoArtist';
    if (activeCategory === 'nomad') return nft.name.includes('宇宙') || nft.name.includes('星辰');
    return true;
  });

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      Legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      Rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Common: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[rarity] || colors.Common;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 主内容 */}

      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-5 gap-6">
          {/* 左侧边栏 */}
          <div className="space-y-4">
            {/* 藏品分类 */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-bold mb-3 text-sm text-gray-400">🏷️ 藏品归纳</h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition ${activeCategory === cat.key ? 'bg-violet-600 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                  >
                    <span>{cat.icon}</span>
                    <span className="text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 硬币归类 */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-bold mb-3 text-sm text-gray-400">💰 硬币归类</h3>
              <div className="grid grid-cols-4 gap-2">
                {coins.map(coin => (
                  <button
                    key={coin.key}
                    onClick={() => setActiveCoin(coin.key)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${activeCoin === coin.key ? 'bg-violet-600' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <span className="text-lg">{coin.icon}</span>
                    <span className="text-xs font-bold">{coin.key}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* NFT网格 */}
          <div className="col-span-4">
            <div className="grid grid-cols-4 gap-4">
              {filteredNFTs.map(nft => (
                <motion.div
                  key={nft.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedNFT(nft)}
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden cursor-pointer"
                >
                  <div className={`h-36 flex items-center justify-center ${nft.rarity === 'Epic' || nft.rarity === 'Legendary' ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30' : nft.rarity === 'Rare' ? 'bg-gradient-to-br from-blue-600/30 to-cyan-600/30' : 'bg-gradient-to-br from-gray-600/30 to-gray-700/30'}`}>
                    <span className="text-6xl">{nft.image}</span>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded border ${getRarityColor(nft.rarity)}`}>{nft.rarity}</span>
                      <span className="text-xs text-gray-500">❤ {nft.likes}</span>
                    </div>
                    <div className="font-medium text-sm mb-2 truncate">{nft.name}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-violet-400">{nft.price} {nft.priceUnit}</span>
                      <span className="text-xs text-gray-500">{nft.remaining}/{nft.supply}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* NFT详情弹窗 */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNFT(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-lg bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className={`h-48 ${selectedNFT.rarity === 'Epic' || selectedNFT.rarity === 'Legendary' ? 'bg-gradient-to-br from-purple-600 to-pink-600' : selectedNFT.rarity === 'Rare' ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-gray-600 to-gray-700'} flex items-center justify-center relative`}>
                <span className="text-8xl">{selectedNFT.image}</span>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRarityColor(selectedNFT.rarity)}`}>{selectedNFT.rarity}</span>
                </div>
                <button onClick={() => setSelectedNFT(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">✕</button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedNFT.name}</h2>
                    <p className="text-gray-500">by {selectedNFT.artist}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">售价</div>
                    <div className="text-2xl font-bold text-violet-400">{selectedNFT.price} {selectedNFT.priceUnit}</div>
                  </div>
                </div>

                <p className="text-gray-400 mb-4">{selectedNFT.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold">{selectedNFT.supply}</div>
                    <div className="text-xs text-gray-500">总量</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold">{selectedNFT.remaining}</div>
                    <div className="text-xs text-gray-500">剩余</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">💬 点评</span>
                    <span className="text-xs text-gray-500">{selectedNFT.comments} 条评论</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 space-y-2 max-h-32 overflow-y-auto">
                    <div className="text-sm">
                      <span className="text-violet-400">@CryptoFan:</span>
                      <span className="text-gray-400"> 非常漂亮的NFT，期待已久！</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-violet-400">@NFTCollector:</span>
                      <span className="text-gray-400"> 稀有度很高，值得收藏</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-violet-600 rounded-xl font-bold flex items-center justify-center gap-2">
                    <span>❤</span> 收藏
                  </button>
                  <button className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold">
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
