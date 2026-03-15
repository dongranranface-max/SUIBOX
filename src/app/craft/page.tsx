'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Lock, CheckCircle, Zap, Gem, Crown, AlertTriangle, Flame, Wallet } from 'lucide-react';

type FragmentType = 'common' | 'rare' | 'epic';
type NFTRarity = 'common' | 'rare' | 'epic';
type SynthesizeState = 'select' | 'confirm' | 'synthesizing' | 'success';

interface FragmentRecipe {
  id: number;
  result: { name: string; image: string; rarity: FragmentType };
  cost: { common?: number; rare?: number; epic?: number };
  reward: number;
}

interface NFTRecipe {
  id: number;
  result: { name: string; image: string; rarity: NFTRarity };
  cost: { common?: number; rare?: number };
  costBOX: number;
  reward: number;
}

interface SynthesizedNFT {
  id: string;
  name: string;
  image: string;
  rarity: NFTRarity;
  timestamp: number;
}

// NFT图片 - 合成后的成品
const NFT_IMAGES: Record<FragmentType, { image: string; isVideo?: boolean }> = {
  common: { image: '/nft-common.mp4', isVideo: true },
  rare: { image: '/nft-rare.mp4', isVideo: true },
  epic: { image: '/nft-epic.mp4', isVideo: true },
};

// 碎片合成配方 - 使用NFT图片作为结果展示
const FRAGMENT_RECIPES: FragmentRecipe[] = [
  { id: 1, result: { name: '普通NFT', image: '/nft-common.mp4', rarity: 'common' }, cost: { common: 4 }, reward: 3 },
  { id: 2, result: { name: '稀有NFT', image: '/nft-rare.mp4', rarity: 'rare' }, cost: { rare: 5 }, reward: 7 },
  { id: 3, result: { name: '史诗NFT', image: '/nft-epic.mp4', rarity: 'epic' }, cost: { epic: 6 }, reward: 9 },
];

// 终极合成配方 - 使用NFT图片作为结果展示
const NFT_RECIPES: NFTRecipe[] = [
  { id: 1, result: { name: '稀有NFT', image: '/nft-rare.mp4', rarity: 'rare' }, cost: { common: 4 }, costBOX: 20, reward: 30 },
  { id: 2, result: { name: '史诗NFT', image: '/nft-epic.mp4', rarity: 'epic' }, cost: { rare: 4 }, costBOX: 50, reward: 100 },
];

// 碎片图片 - 使用静态图片替代视频以提高加载速度
const FRAGMENT_IMAGES: Record<FragmentType, string> = {
  common: '/fragment-common.png',
  rare: '/fragment-rare.png',
  epic: '/fragment-epic.png',  // 改为使用图片
};

function FragImg({ src, alt, size = 40, isVideo }: { src: string; alt: string; size?: number; isVideo?: boolean }) {
  if (src && src.startsWith('/')) {
    if (isVideo) {
      return <video src={src} autoPlay loop muted playsInline className="object-contain" style={{ width: size, height: size, borderRadius: '8px' }} />;
    }
    return <img src={src} alt={alt} className="object-contain" style={{ width: size, height: size, borderRadius: '8px' }} />;
  }
  return <span className="text-2xl">{alt}</span>;
}

// 合成动画
function SynthesizingAnim() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-32 h-32 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-violet-600 to-pink-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold mb-2">合成中...</motion.h2>
        <p className="text-gray-400">正在融合能量</p>
        <div className="mt-8 w-64 mx-auto">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-violet-500 to-pink-500" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3, ease: 'linear' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 确认弹窗
function ConfirmModal({ recipe, type, onConfirm, onCancel }: { 
  recipe: FragmentRecipe | NFTRecipe; 
  type: 'fragment' | 'ultimate';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const isFragment = type === 'fragment';
  const fragRecipe = recipe as FragmentRecipe;
  const nftRecipe = recipe as NFTRecipe;
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">确认合成</h2>
          <p className="text-gray-400">请确认以下信息</p>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FragImg src={isFragment ? fragRecipe.result.image : nftRecipe.result.image} alt="结果" size={48} />
            <span className="text-xl font-bold">→</span>
            <FragImg src={isFragment ? fragRecipe.result.image : nftRecipe.result.image} alt="结果" size={64} />
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">产出</span>
              <span className="font-bold">{isFragment ? fragRecipe.result.name : nftRecipe.result.name}</span>
            </div>
            
            {!isFragment && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">消耗NFT</span>
                  <span className="text-amber-400">{nftRecipe.cost.common ? '4个普通NFT' : '4个稀有NFT'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">消耗BOX</span>
                  <span className="text-red-400">-{nftRecipe.costBOX} BOX</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-400">获得奖励</span>
              <span className="text-green-400">+{isFragment ? fragRecipe.reward : nftRecipe.reward} BOX</span>
            </div>
            
            {!isFragment && (
              <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-white/10">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-xs">消耗的NFT将进行链上销毁</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold">
            取消
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 rounded-xl font-bold">
            确认合成
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 结果弹窗
function ResultModal({ success, result, reward, onClose }: { success: boolean; result?: string; reward?: number; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 12 }} className={`bg-gradient-to-br ${success ? 'from-violet-600 to-pink-600' : 'from-gray-700 to-gray-900'} rounded-3xl p-10 shadow-2xl border-2 ${success ? 'border-violet-400' : 'border-gray-600'} text-center`}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-32 h-32 mx-auto mb-4">
          {success && result ? <FragImg src={result} alt="NFT" size={128} /> : <span className="text-8xl">💨</span>}
        </motion.div>
        
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-3xl font-bold mb-2">
          {success ? '合成成功!' : '合成失败'}
        </motion.h2>
        
        {success && reward && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-green-400 mb-6 text-lg">
            +{reward} BOX 奖励已发放
          </motion.p>
        )}
        
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={onClose} className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold">
          继续
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function CraftPage() {
  // 用户状态
  const [myFragments, setMyFragments] = useState({ common: 20, rare: 10, epic: 8 });
  const [myNFTs, setMyNFTs] = useState<SynthesizedNFT[]>([]);
  const [myBOX, setMyBOX] = useState(500);
  const [activeTab, setActiveTab] = useState<'fragment' | 'ultimate'>('fragment');
  const [selectedFragRecipe, setSelectedFragRecipe] = useState<number | null>(null);
  const [selectedNFTRecipe, setSelectedNFTRecipe] = useState<number | null>(null);
  const [synthState, setSynthState] = useState<SynthesizeState>('select');
  const [synthResult, setSynthResult] = useState<{ name: string; reward: number } | null>(null);

  // 可合成数量
  const canFragSynth = useMemo(() => FRAGMENT_RECIPES.filter(r => {
    const c = r.cost;
    return (!c.common || myFragments.common >= c.common) && (!c.rare || myFragments.rare >= c.rare) && (!c.epic || myFragments.epic >= c.epic);
  }).length, [myFragments]);

  const canNFTSynth = NFT_RECIPES.filter(r => {
    const c = r.cost;
    const nftCount = myNFTs.filter(n => n.rarity === (c.common ? 'common' : 'rare')).length;
    return nftCount >= (c.common || c.rare || 0) && myBOX >= r.costBOX;
  }).length;

  // 碎片合成
  const handleFragSynth = () => {
    if (selectedFragRecipe === null) return;
    setSynthState('confirm');
  };

  const confirmFragSynth = () => {
    if (selectedFragRecipe === null) return;
    const recipe = FRAGMENT_RECIPES[selectedFragRecipe];
    const c = recipe.cost;
    
    setSynthState('synthesizing');
    
    setTimeout(() => {
      // 扣除碎片
      setMyFragments(prev => ({
        common: prev.common - (c.common || 0),
        rare: prev.rare - (c.rare || 0),
        epic: prev.epic - (c.epic || 0)
      }));
      
      // 增加BOX奖励
      setMyBOX(prev => prev + recipe.reward);
      
      // 添加NFT
      const newNFT: SynthesizedNFT = {
        id: `${Date.now()}`,
        name: `${recipe.result.name} #${String(myNFTs.length + 1).padStart(3, '0')}`,
        image: recipe.result.image,
        rarity: recipe.result.rarity,
        timestamp: Date.now()
      };
      setMyNFTs(prev => [...prev, newNFT]);
      
      setSynthResult({ name: recipe.result.image, reward: recipe.reward });
      setSynthState('success');
    }, 3000);
  };

  // 终极合成
  const handleNFTSynth = () => {
    if (selectedNFTRecipe === null) return;
    setSynthState('confirm');
  };

  const confirmNFTSynth = () => {
    if (selectedNFTRecipe === null) return;
    const recipe = NFT_RECIPES[selectedNFTRecipe];
    const c = recipe.cost;
    
    setSynthState('synthesizing');
    
    setTimeout(() => {
      // 扣除BOX
      setMyBOX(prev => prev - recipe.costBOX + recipe.reward);
      
      // 销毁NFT并添加新NFT
      const nftsToRemove = c.common || c.rare || 0;
      const rarityToRemove = c.common ? 'common' : 'rare';
      
      // 过滤掉要销毁的NFT
      const remainingNFTs = myNFTs.filter(n => n.rarity !== rarityToRemove).slice(0, -nftsToRemove);
      
      const newNFT: SynthesizedNFT = {
        id: `${Date.now()}`,
        name: `${recipe.result.name} #${String(remainingNFTs.length + 1).padStart(3, '0')}`,
        image: recipe.result.image,
        rarity: recipe.result.rarity,
        timestamp: Date.now()
      };
      
      setMyNFTs([...remainingNFTs, newNFT]);
      
      setSynthResult({ name: recipe.result.image, reward: recipe.reward });
      setSynthState('success');
    }, 3000);
  };

  const handleClose = () => {
    setSynthState('select');
    setSelectedFragRecipe(null);
    setSelectedNFTRecipe(null);
    setSynthResult(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">⚗️ 碎片合成</h1>
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold">{myBOX}</span> BOX
            </div>
            <div className="text-sm text-gray-400">已合成 {myNFTs.length} 个NFT</div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button onClick={() => setActiveTab('fragment')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition ${activeTab === 'fragment' ? 'bg-violet-600' : 'bg-white/5 hover:bg-white/10'}`}>
            <Sparkles className="w-5 h-5" />碎片合成
          </button>
          <button onClick={() => setActiveTab('ultimate')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition ${activeTab === 'ultimate' ? 'bg-amber-600' : 'bg-white/5 hover:bg-white/10'}`}>
            <Crown className="w-5 h-5" />终极合成
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* 碎片合成 */}
        {activeTab === 'fragment' && (
          <>
            {/* 我的碎片 */}
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-4">🎒 我的碎片</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-xl p-4 border border-gray-500/30">
                  <div className="flex items-center gap-3">
                    <FragImg src={FRAGMENT_IMAGES.common} alt="普通" size={32} />
                    <div>
                      <div className="font-bold text-xl">{myFragments.common}</div>
                      <div className="text-xs text-gray-400">普通碎片</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <FragImg src={FRAGMENT_IMAGES.rare} alt="稀有" size={32} isVideo={FRAGMENT_IMAGES.rare.endsWith('.mp4')} />
                    <div>
                      <div className="font-bold text-xl text-blue-400">{myFragments.rare}</div>
                      <div className="text-xs text-gray-400">稀有碎片</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <FragImg src={FRAGMENT_IMAGES.epic} alt="史诗" size={32} isVideo={FRAGMENT_IMAGES.epic.endsWith('.mp4')} />
                    <div>
                      <div className="font-bold text-xl text-purple-400">{myFragments.epic}</div>
                      <div className="text-xs text-gray-400">史诗碎片</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 合成配方 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">🧪 碎片合成配方</h2>
                <span className="text-sm text-gray-400">可合成: {canFragSynth} 种</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FRAGMENT_RECIPES.map((recipe, i) => {
                  const c = recipe.cost;
                  const can = (!c.common || myFragments.common >= c.common) && (!c.rare || myFragments.rare >= c.rare) && (!c.epic || myFragments.epic >= c.epic);
                  
                  return (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }} 
                      onClick={() => setSelectedFragRecipe(i)}
                      className={`
                        relative p-5 rounded-2xl border-2 cursor-pointer transition-all
                        ${selectedFragRecipe === i ? 'border-violet-500 bg-violet-600/20' : 'border-white/10 bg-white/5'}
                        ${!can && 'opacity-60'}
                      `}
                    >
                      {selectedFragRecipe === i && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        {/* 碎片输入 */}
                        <div className="flex items-center gap-2">
                          <FragImg src={FRAGMENT_IMAGES[recipe.result.rarity]} alt="碎片" size={36} />
                          <div>
                            <div className="font-bold text-sm">{recipe.result.rarity === 'common' ? '4普通碎片' : recipe.result.rarity === 'rare' ? '5稀有碎片' : '6史诗碎片'}</div>
                          </div>
                        </div>
                        <div className="text-gray-400">→</div>
                        {/* NFT输出 */}
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-bold">{recipe.result.name}</div>
                          </div>
                          <FragImg src={recipe.result.image} alt={recipe.result.name} size={36} isVideo={recipe.result.image.endsWith('.mp4')} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 py-2 bg-black/30 rounded-xl text-sm">
                        <span className="text-green-400">+{recipe.reward} BOX 奖励</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-1 text-green-400 text-sm">
                        <Zap className="w-4 h-4" />+{recipe.reward} BOX
                      </div>
                      
                      {!can && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-red-400 text-sm">
                          <Lock className="w-4 h-4" />材料不足
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 合成按钮 */}
            <div className="flex justify-center mb-12">
              <motion.button 
                whileHover={{ scale: selectedFragRecipe !== null ? 1.05 : 1 }} 
                onClick={handleFragSynth} 
                disabled={selectedFragRecipe === null} 
                className={`
                  px-12 py-4 rounded-2xl font-bold text-xl flex items-center gap-2
                  ${selectedFragRecipe !== null ? 'bg-gradient-to-r from-violet-600 to-pink-600 hover:shadow-lg' : 'bg-gray-600 cursor-not-allowed'}
                `}
              >
                <Sparkles className="w-5 h-5" />
                {selectedFragRecipe !== null ? '开始合成' : '选择配方'}
              </motion.button>
            </div>
          </>
        )}

        {/* 终极合成 */}
        {activeTab === 'ultimate' && (
          <>
            {/* 我的NFT */}
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-4">🏆 我的NFT</h2>
              <div className="grid grid-cols-6 gap-4">
                {myNFTs.length > 0 ? (
                  myNFTs.map((nft) => (
                    <motion.div 
                      key={nft.id}
                      initial={{ scale: 0, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      className={`
                        p-3 rounded-xl
                        ${nft.rarity === 'epic' ? 'bg-purple-900/30 border border-purple-500/30' : ''}
                        ${nft.rarity === 'rare' ? 'bg-blue-900/30 border border-blue-500/30' : ''}
                        ${nft.rarity === 'common' ? 'bg-gray-800/30 border border-gray-500/30' : ''}
                      `}
                    >
                      <FragImg src={nft.image} alt={nft.name} size={48} />
                      <div className="mt-1 text-xs truncate">{nft.name}</div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-6 text-center py-8 text-gray-500">暂无NFT</div>
                )}
              </div>
            </div>

            {/* 终极合成配方 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">👑 终极合成配方</h2>
                <span className="text-sm text-gray-400">可合成: {canNFTSynth} 种</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {NFT_RECIPES.map((recipe, i) => {
                  const c = recipe.cost;
                  const rarity = c.common ? 'common' : 'rare';
                  const nftCount = myNFTs.filter(n => n.rarity === rarity).length;
                  const can = nftCount >= (c.common || c.rare || 0) && myBOX >= recipe.costBOX;
                  
                  return (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }} 
                      onClick={() => setSelectedNFTRecipe(i)}
                      className={`
                        relative p-5 rounded-2xl border-2 cursor-pointer transition-all
                        ${selectedNFTRecipe === i ? 'border-amber-500 bg-amber-600/20' : 'border-white/10 bg-white/5'}
                        ${!can && 'opacity-60'}
                      `}
                    >
                      {selectedNFTRecipe === i && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        {/* NFT输入 */}
                        <div className="flex items-center gap-2">
                          <FragImg src={c.common ? NFT_IMAGES.common.image : NFT_IMAGES.rare.image} alt="NFT" size={36} isVideo={(c.common ? NFT_IMAGES.common.isVideo : NFT_IMAGES.rare.isVideo)} />
                          <div>
                            <div className="font-bold text-sm">{c.common ? '4个普通NFT' : '4个稀有NFT'}</div>
                          </div>
                        </div>
                        <div className="text-gray-400">→</div>
                        {/* NFT输出 */}
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-bold">{recipe.result.name}</div>
                          </div>
                          <FragImg src={recipe.result.image} alt={recipe.result.name} size={36} isVideo={recipe.result.image.endsWith('.mp4')} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 py-2 bg-black/30 rounded-xl text-sm mb-2">
                        <span className="text-gray-400">消耗BOX:</span>
                        <span className={myBOX >= recipe.costBOX ? 'text-green-400' : 'text-red-400'}>-{recipe.costBOX} BOX</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-1 text-green-400 text-sm">
                        <Zap className="w-4 h-4" />+{recipe.reward} BOX
                        <Flame className="w-3 h-3 text-orange-400 ml-1" />
                      </div>
                      
                      {!can && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-red-400 text-sm">
                          <Lock className="w-4 h-4" />
                          {myBOX < recipe.costBOX ? 'BOX不足' : 'NFT不足'}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 合成按钮 */}
            <div className="flex justify-center">
              <motion.button 
                whileHover={{ scale: selectedNFTRecipe !== null ? 1.05 : 1 }} 
                onClick={handleNFTSynth} 
                disabled={selectedNFTRecipe === null} 
                className={`
                  px-12 py-4 rounded-2xl font-bold text-xl flex items-center gap-2
                  ${selectedNFTRecipe !== null ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-lg' : 'bg-gray-600 cursor-not-allowed'}
                `}
              >
                <Crown className="w-5 h-5" />
                {selectedNFTRecipe !== null ? '开始终极合成' : '选择配方'}
              </motion.button>
            </div>
          </>
        )}

        {/* 已合成NFT展示 */}
        <div className="mt-12">
          <h2 className="font-bold text-lg mb-4">🏆 已合成的NFT</h2>
          {myNFTs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {myNFTs.map((nft) => (
                <motion.div 
                  key={nft.id}
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  className={`
                    p-4 rounded-xl
                    ${nft.rarity === 'epic' ? 'bg-purple-900/30 border border-purple-500/30' : ''}
                    ${nft.rarity === 'rare' ? 'bg-blue-900/30 border border-blue-500/30' : ''}
                    ${nft.rarity === 'common' ? 'bg-gray-800/30 border border-gray-500/30' : ''}
                  `}
                >
                  <FragImg src={nft.image} alt={nft.name} size={64} />
                  <div className="mt-2 text-sm font-medium truncate">{nft.name}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Gem className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无合成的NFT</p>
            </div>
          )}
        </div>
      </main>

      {/* 动画层 */}
      <AnimatePresence>
        {synthState === 'synthesizing' && <SynthesizingAnim />}
        {synthState === 'confirm' && selectedFragRecipe !== null && (
          <ConfirmModal 
            recipe={FRAGMENT_RECIPES[selectedFragRecipe]} 
            type="fragment" 
            onConfirm={confirmFragSynth} 
            onCancel={() => setSynthState('select')} 
          />
        )}
        {synthState === 'confirm' && selectedNFTRecipe !== null && (
          <ConfirmModal 
            recipe={NFT_RECIPES[selectedNFTRecipe]} 
            type="ultimate" 
            onConfirm={confirmNFTSynth} 
            onCancel={() => setSynthState('select')} 
          />
        )}
        {synthState === 'success' && (
          <ResultModal 
            success={!!synthResult} 
            result={synthResult?.name} 
            reward={synthResult?.reward} 
            onClose={handleClose} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
