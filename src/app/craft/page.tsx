'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Check, Zap, Gem, Crown, Wallet, ArrowRight, RefreshCw, Layers, Box } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

type FragmentType = 'common' | 'rare' | 'epic';

// 碎片配置
const FRAGMENT_CONFIG = {
  common: { name: '普通碎片', image: '/fragment-common.png', color: 'from-gray-500 to-gray-600', border: 'border-gray-500' },
  rare: { name: '稀有碎片', image: '/fragment-rare.png', color: 'from-blue-500 to-cyan-600', border: 'border-blue-500' },
  epic: { name: '史诗碎片', image: '/fragment-epic.png', color: 'from-yellow-500 to-orange-600', border: 'border-yellow-500' },
};

// 碎片合成配方
const FRAGMENT_RECIPES = [
  { id: 1, result: 'common', cost: { common: 3 }, reward: 1, name: '普通NFT' },
  { id: 2, result: 'rare', cost: { rare: 3 }, reward: 3, name: '稀有NFT' },
  { id: 3, result: 'epic', cost: { epic: 3 }, reward: 10, name: '史诗NFT' },
];

// NFT合成配方
const NFT_RECIPES = [
  { id: 1, result: 'rare', cost: { common: 3 }, boxCost: 10, reward: 20, name: '稀有NFT' },
  { id: 2, result: 'epic', cost: { rare: 3 }, boxCost: 30, reward: 50, name: '史诗NFT' },
];

function FragImg({ src, alt, size = 40 }: { src: string; alt: string; size?: number }) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className="object-contain" 
      style={{ width: size, height: size, borderRadius: '8px' }} 
    />
  );
}

export default function CraftPage() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<'fragment' | 'nft'>('fragment');
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{ type: string; reward: number } | null>(null);

  // 用户数据（模拟）
  const [myFragments, setMyFragments] = useState({ common: 10, rare: 5, epic: 2 });
  const [myNFTs, setMyNFTs] = useState({ common: 3, rare: 1, epic: 0 });
  const [myBOX, setMyBOX] = useState(100);

  // 计算可合成数量
  const canSynth = useMemo(() => {
    if (activeTab === 'fragment') {
      return FRAGMENT_RECIPES.filter(r => {
        const c = r.cost;
        return (!c.common || myFragments.common >= c.common) &&
               (!c.rare || myFragments.rare >= c.rare) &&
               (!c.epic || myFragments.epic >= c.epic);
      }).length;
    } else {
      return NFT_RECIPES.filter(r => {
        const c = r.cost;
        const nftCount = c.common ? myNFTs.common : myNFTs.rare;
        return nftCount >= (c.common || c.rare || 0) && myBOX >= r.boxCost;
      }).length;
    }
  }, [activeTab, myFragments, myNFTs, myBOX]);

  // 执行合成
  const handleSynth = () => {
    if (selectedRecipe === null) return;
    setSynthesizing(true);

    setTimeout(() => {
      if (activeTab === 'fragment') {
        const recipe = FRAGMENT_RECIPES[selectedRecipe];
        const c = recipe.cost;
        
        // 扣除碎片
        setMyFragments(prev => ({
          common: prev.common - (c.common || 0),
          rare: prev.rare - (c.rare || 0),
          epic: prev.epic - (c.epic || 0)
        }));
        
        // 增加NFT
        setMyNFTs(prev => ({
          ...prev,
          [recipe.result]: prev[recipe.result as keyof typeof prev] + 1
        }));
        
        // 增加BOX奖励
        setMyBOX(prev => prev + recipe.reward);
        
        setResultData({ type: recipe.result, reward: recipe.reward });
      } else {
        const recipe = NFT_RECIPES[selectedRecipe];
        const c = recipe.cost;
        
        // 扣除BOX
        setMyBOX(prev => prev - recipe.boxCost + recipe.reward);
        
        // 消耗NFT并升级
        setMyNFTs(prev => ({
          common: prev.common - (c.common || 0),
          rare: prev.rare - (c.rare || 0),
          epic: prev.epic + 1
        }));
        
        setResultData({ type: recipe.result, reward: recipe.reward });
      }
      
      setSynthesizing(false);
      setShowResult(true);
      setSelectedRecipe(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景 */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-violet-950 via-black to-purple-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            合成
          </h1>
          <p className="text-gray-400">碎片合成NFT，获得BOX奖励！</p>
        </motion.div>

        {/* 用户资产 */}
        {wallet.connected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/80 rounded-xl p-4 text-center">
              <FragImg src={FRAGMENT_CONFIG.common.image} alt="普通" size={32} />
              <p className="text-2xl font-black text-white mt-1">{myFragments.common}</p>
              <p className="text-xs text-gray-500">普通碎片</p>
            </div>
            <div className="bg-gray-900/80 rounded-xl p-4 text-center">
              <FragImg src={FRAGMENT_CONFIG.rare.image} alt="稀有" size={32} />
              <p className="text-2xl font-black text-blue-400 mt-1">{myFragments.rare}</p>
              <p className="text-xs text-gray-500">稀有碎片</p>
            </div>
            <div className="bg-gray-900/80 rounded-xl p-4 text-center">
              <FragImg src={FRAGMENT_CONFIG.epic.image} alt="史诗" size={32} />
              <p className="text-2xl font-black text-yellow-400 mt-1">{myFragments.epic}</p>
              <p className="text-xs text-gray-500">史诗碎片</p>
            </div>
            <div className="bg-gray-900/80 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-green-400 mt-1">{myBOX}</p>
              <p className="text-xs text-gray-500">BOX余额</p>
            </div>
          </motion.div>
        )}

        {/* Tab切换 */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'fragment', label: '碎片合成', icon: Layers },
            { key: 'nft', label: 'NFT升级', icon: Crown },
          ].map(tab => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveTab(tab.key as 'fragment' | 'nft'); setSelectedRecipe(null); }}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600' 
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* 合成配方 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {activeTab === 'fragment' ? (
            FRAGMENT_RECIPES.map((recipe, index) => {
              const c = recipe.cost;
              const canDo = (!c.common || myFragments.common >= c.common) &&
                           (!c.rare || myFragments.rare >= c.rare) &&
                           (!c.epic || myFragments.epic >= c.epic);
              const resultConfig = FRAGMENT_CONFIG[recipe.result as keyof FragmentType];
              
              return (
                <motion.div
                  key={recipe.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => canDo && setSelectedRecipe(index)}
                  className={`bg-gray-900/80 rounded-xl p-4 border-2 cursor-pointer transition-all ${
                    selectedRecipe === index 
                      ? 'border-violet-500 bg-violet-500/10' 
                      : canDo 
                        ? 'border-gray-700 hover:border-gray-600' 
                        : 'border-gray-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* 消耗 */}
                      <div className="flex items-center gap-2">
                        {c.common && (
                          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-lg">
                            <FragImg src={FRAGMENT_CONFIG.common.image} alt="" size={20} />
                            <span className="text-sm">×{c.common}</span>
                          </div>
                        )}
                        {c.rare && (
                          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-lg">
                            <FragImg src={FRAGMENT_CONFIG.rare.image} alt="" size={20} />
                            <span className="text-sm">×{c.rare}</span>
                          </div>
                        )}
                        {c.epic && (
                          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-lg">
                            <FragImg src={FRAGMENT_CONFIG.epic.image} alt="" size={20} />
                            <span className="text-sm">×{c.epic}</span>
                          </div>
                        )}
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                      
                      {/* 产出 */}
                      <div className="flex items-center gap-2">
                        <FragImg src={resultConfig.image} alt={resultConfig.name} size={32} />
                        <span className="font-bold">{recipe.name}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-green-400 font-bold">+{recipe.reward} BOX</p>
                      {canDo ? (
                        <Check className="w-5 h-5 text-green-400 ml-auto" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-600 ml-auto" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            NFT_RECIPES.map((recipe, index) => {
              const c = recipe.cost;
              const nftCount = c.common ? myNFTs.common : myNFTs.rare;
              const canDo = nftCount >= (c.common || c.rare || 0) && myBOX >= recipe.boxCost;
              
              return (
                <motion.div
                  key={recipe.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => canDo && setSelectedRecipe(index)}
                  className={`bg-gray-900/80 rounded-xl p-4 border-2 cursor-pointer transition-all ${
                    selectedRecipe === index 
                      ? 'border-violet-500 bg-violet-500/10' 
                      : canDo 
                        ? 'border-gray-700 hover:border-gray-600' 
                        : 'border-gray-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {c.common && (
                          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-lg">
                            <span className="text-sm">普通NFT ×{c.common}</span>
                          </div>
                        )}
                        {c.rare && (
                          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-lg">
                            <span className="text-sm">稀有NFT ×{c.rare}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-lg">
                          <span className="text-sm text-red-400">-{recipe.boxCost} BOX</span>
                        </div>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                      
                      <div className="flex items-center gap-2">
                        <Crown className="w-6 h-6 text-yellow-400" />
                        <span className="font-bold">{recipe.name}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-green-400 font-bold">+{recipe.reward} BOX</p>
                      {canDo ? (
                        <Check className="w-5 h-5 text-green-400 ml-auto" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-600 ml-auto" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* 合成按钮 */}
        {wallet.connected && selectedRecipe !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSynth}
              disabled={synthesizing}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              {synthesizing ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  合成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  开始合成
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* 未连接钱包 */}
        {!wallet.connected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-gray-900/80 rounded-2xl p-8 text-center border border-gray-700">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-4">连接钱包进行合成</p>
            <ConnectButton />
          </motion.div>
        )}
      </div>

      {/* 合成中动画 */}
      {synthesizing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 mx-auto mb-6">
              <div className="w-full h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <p className="text-2xl font-bold">合成中...</p>
          </div>
        </motion.div>
      )}

      {/* 结果弹窗 */}
      {showResult && resultData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setShowResult(false)}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`bg-gradient-to-br ${FRAGMENT_CONFIG[resultData.type as keyof FragmentType]?.color || 'from-gray-600 to-gray-800'} rounded-2xl p-8 text-center max-w-sm`} onClick={e => e.stopPropagation()}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-6xl mb-4">
              {resultData.type === 'epic' ? '💎' : resultData.type === 'rare' ? '⭐' : '🎯'}
            </motion.div>
            <h2 className="text-2xl font-black mb-2">
              {resultData.type === 'epic' ? '史诗NFT' : resultData.type === 'rare' ? '稀有NFT' : '普通NFT'}
            </h2>
            <p className="text-green-400 font-bold mb-4">+{resultData.reward} BOX</p>
            <button onClick={() => setShowResult(false)} className="px-8 py-3 bg-white text-black rounded-full font-bold">
              收下
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
