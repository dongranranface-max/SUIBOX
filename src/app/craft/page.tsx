'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Zap, Gem, Crown, Wallet, ArrowRight, RefreshCw, Layers, Box, Star, Award, Trophy, Flame, Target, Rocket, Cpu, Atom, ChevronRight } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

type FragmentType = 'common' | 'rare' | 'epic';

// 碎片配置
const FRAGMENT_CONFIG = {
  common: { name: '普通碎片', image: '/fragment-common.png', color: 'from-gray-500 to-gray-600', border: 'border-gray-500', glow: 'shadow-gray-500/30', bg: 'bg-gray-500' },
  rare: { name: '稀有碎片', image: '/fragment-rare.png', color: 'from-blue-500 to-cyan-600', border: 'border-blue-500', glow: 'shadow-blue-500/30', bg: 'bg-blue-500' },
  epic: { name: '史诗碎片', image: '/fragment-epic.png', color: 'from-yellow-500 to-orange-600', border: 'border-yellow-500', glow: 'shadow-yellow-500/30', bg: 'bg-yellow-500' },
};

// 碎片合成配方
const FRAGMENT_RECIPES = [
  { id: 1, result: 'common', cost: { common: 3 }, reward: 1, name: '普通NFT', tier: 1 },
  { id: 2, result: 'rare', cost: { rare: 3 }, reward: 3, name: '稀有NFT', tier: 2 },
  { id: 3, result: 'epic', cost: { epic: 3 }, reward: 10, name: '史诗NFT', tier: 3 },
];

// NFT合成配方
const NFT_RECIPES = [
  { id: 1, result: 'rare', cost: { common: 3 }, boxCost: 10, reward: 20, name: '稀有NFT', tier: 2 },
  { id: 2, result: 'epic', cost: { rare: 3 }, boxCost: 30, reward: 50, name: '史诗NFT', tier: 3 },
];

function FragImg({ src, alt, size = 40, glow = false }: { src: string; alt: string; size?: number; glow?: boolean }) {
  return (
    <div className={`relative ${glow ? 'animate-pulse' : ''}`}>
      <img src={src} alt={alt} className="object-contain" style={{ width: size, height: size, borderRadius: '8px' }} />
      {glow && (
        <div className={`absolute inset-0 ${FRAGMENT_CONFIG[alt as FragmentType]?.bg} opacity-30 blur-xl rounded-full`} />
      )}
    </div>
  );
}

// 等级徽章
function TierBadge({ tier }: { tier: number }) {
  const configs = [
    { name: '普通', color: 'text-gray-400', bg: 'bg-gray-600' },
    { name: '稀有', color: 'text-blue-400', bg: 'bg-blue-600' },
    { name: '史诗', color: 'text-yellow-400', bg: 'bg-yellow-600' },
  ];
  const config = configs[tier - 1] || configs[0];
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>
      {config.name}
    </span>
  );
}

export default function CraftPage() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<'fragment' | 'nft'>('fragment');
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{ type: string; reward: number } | null>(null);

  // 用户数据
  const [myFragments, setMyFragments] = useState({ common: 10, rare: 5, epic: 2 });
  const [myNFTs, setMyNFTs] = useState({ common: 3, rare: 1, epic: 0 });
  const [myBOX, setMyBOX] = useState(100);

  // 计算可合成
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
        
        setMyFragments(prev => ({
          common: prev.common - (c.common || 0),
          rare: prev.rare - (c.rare || 0),
          epic: prev.epic - (c.epic || 0)
        }));
        
        setMyNFTs(prev => ({
          ...prev,
          [recipe.result]: prev[recipe.result as keyof typeof prev] + 1
        }));
        
        setMyBOX(prev => prev + recipe.reward);
        setResultData({ type: recipe.result, reward: recipe.reward });
      } else {
        const recipe = NFT_RECIPES[selectedRecipe];
        const c = recipe.cost;
        
        setMyBOX(prev => prev - recipe.boxCost + recipe.reward);
        
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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4ODgiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgNHYyaC0ydi0yaDJ6bTQtOGgydjJoLTJ2LTJ6bS04IDhoMnYyaC0ydi0yek0zMiAyNnYyaC0ydi0yaDJ6bTAgNGgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-violet-950/50 via-black to-purple-950/50" />
        <motion.div animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px]" />
        <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[150px]" />
        
        {/* 网格线 */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_#8b5cf6_1px)] bg-[size:50px_50px] [mask-image:linear-gradient(to_bottom,transparent,black)] opacity-5" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 py-6">
        {/* 标题 */}
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
          <motion.h1 
            animate={{ textShadow: ['0 0 20px rgba(139,92,246,0.5)', '0 0 40px rgba(139,92,246,0.8)', '0 0 20px rgba(139,92,246,0.5)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl md:text-5xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
          >
            🔬 合成实验室
          </motion.h1>
          <p className="text-gray-400 mt-1 text-sm">将碎片转化为NFT，获得丰厚奖励</p>
        </motion.div>

        {/* 科技感顶部状态栏 */}
        {wallet.connected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            {/* 能量条 */}
            <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-4 border border-violet-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Atom className="w-5 h-5 text-violet-400" />
                  <span className="font-bold text-gray-300">合成能量</span>
                </div>
                <span className="text-xs text-gray-500">{canSynth} 种配方可用</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: 'common', config: FRAGMENT_CONFIG.common, count: myFragments.common, label: '普通碎片' },
                  { key: 'rare', config: FRAGMENT_CONFIG.rare, count: myFragments.rare, label: '稀有碎片' },
                  { key: 'epic', config: FRAGMENT_CONFIG.epic, count: myFragments.epic, label: '史诗碎片' },
                  { key: 'box', color: 'from-green-500 to-emerald-600', count: myBOX, label: 'BOX', icon: '💰' },
                ].map(item => (
                  <motion.div 
                    key={item.key}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800/50 rounded-xl p-3 text-center"
                  >
                    {item.key === 'box' ? (
                      <>
                        <p className="text-2xl font-black text-green-400">{item.count}</p>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center mb-1">
                          <FragImg src={item.config.image} alt={item.key} size={28} />
                        </div>
                        <p className={`text-xl font-bold ${item.key === 'common' ? 'text-gray-300' : item.key === 'rare' ? 'text-blue-400' : 'text-yellow-400'}`}>
                          {item.count}
                        </p>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab切换 - 游戏风格 */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'fragment', label: '⚡ 碎片合成', icon: Layers, desc: '碎片→NFT' },
            { key: 'nft', label: '🚀 NFT升级', icon: Rocket, desc: 'NFT+BOX→更高阶' },
          ].map(tab => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveTab(tab.key as 'fragment' | 'nft'); setSelectedRecipe(null); }}
              className={`flex-1 py-3 px-3 md:px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 shadow-lg shadow-violet-500/25' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm md:text-base">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* 配方列表 - 游戏卡片风格 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {activeTab === 'fragment' ? (
            FRAGMENT_RECIPES.map((recipe, index) => {
              const c = recipe.cost;
              const canDo = (!c.common || myFragments.common >= c.common) &&
                           (!c.rare || myFragments.rare >= c.rare) &&
                           (!c.epic || myFragments.epic >= c.epic);
              const resultConfig = FRAGMENT_CONFIG[recipe.result as FragmentType];
              
              return (
                <motion.div
                  key={recipe.id}
                  whileHover={canDo ? { scale: 1.01, x: 4 } : {}}
                  onClick={() => canDo && setSelectedRecipe(index)}
                  className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all ${
                    selectedRecipe === index 
                      ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20' 
                      : canDo 
                        ? 'border-gray-700 bg-gray-900/60 hover:border-gray-600' 
                        : 'border-gray-800 bg-gray-900/30 opacity-60'
                  }`}
                >
                  {/* 进度背景 */}
                  {canDo && (
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-pink-500/5"
                    />
                  )}
                  
                  <div className="relative p-3 md:p-4 flex items-center justify-between gap-3">
                    {/* 左侧：消耗 */}
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        {c.common && (
                          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-lg">
                            <FragImg src={FRAGMENT_CONFIG.common.image} alt="c" size={18} />
                            <span className="text-xs text-gray-300">×{c.common}</span>
                          </div>
                        )}
                        {c.rare && (
                          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-lg">
                            <FragImg src={FRAGMENT_CONFIG.rare.image} alt="r" size={18} />
                            <span className="text-xs text-gray-300">×{c.rare}</span>
                          </div>
                        )}
                        {c.epic && (
                          <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-lg">
                            <FragImg src={FRAGMENT_CONFIG.epic.image} alt="e" size={18} />
                            <span className="text-xs text-gray-300">×{c.epic}</span>
                          </div>
                        )}
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      
                      {/* 产出 */}
                      <div className="flex items-center gap-2">
                        <FragImg src={resultConfig.image} alt={recipe.result} size={32} glow />
                        <div>
                          <p className="font-bold text-sm md:text-base">{recipe.name}</p>
                          <TierBadge tier={recipe.tier} />
                        </div>
                      </div>
                    </div>
                    
                    {/* 右侧：奖励 */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <motion.p 
                          animate={canDo ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-green-400 font-bold text-sm md:text-base"
                        >
                          +{recipe.reward} BOX
                        </motion.p>
                        {canDo ? (
                          <Zap className="w-4 h-4 text-green-400 ml-auto" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-600 ml-auto" />
                        )}
                      </div>
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
                  whileHover={canDo ? { scale: 1.01, x: 4 } : {}}
                  onClick={() => canDo && setSelectedRecipe(index)}
                  className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all ${
                    selectedRecipe === index 
                      ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20' 
                      : canDo 
                        ? 'border-gray-700 bg-gray-900/60 hover:border-gray-600' 
                        : 'border-gray-800 bg-gray-900/30 opacity-60'
                  }`}
                >
                  <div className="relative p-3 md:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <div className="bg-gray-800 px-2 py-1 rounded-lg">
                          <span className="text-xs text-gray-300">
                            {c.common ? '普通' : '稀有'}NFT ×{c.common || c.rare}
                          </span>
                        </div>
                        <div className="bg-red-500/20 px-2 py-1 rounded-lg">
                          <span className="text-xs text-red-400">-{recipe.boxCost} BOX</span>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      
                      <div className="flex items-center gap-2">
                        <Crown className="w-6 h-6 text-yellow-400" />
                        <div>
                          <p className="font-bold text-sm md:text-base">{recipe.name}</p>
                          <TierBadge tier={recipe.tier} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <motion.p 
                          animate={canDo ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-green-400 font-bold text-sm md:text-base"
                        >
                          +{recipe.reward} BOX
                        </motion.p>
                        {canDo ? (
                          <Zap className="w-4 h-4 text-green-400 ml-auto" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-600 ml-auto" />
                        )}
                      </div>
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
              className="w-full py-4 bg-gradient-to-r from-violet-600 via-pink-600 to-purple-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-violet-500/30"
            >
              {synthesizing ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>合成进行中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>开始合成</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* 未连接 */}
        {!wallet.connected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-gray-900/80 backdrop-blur rounded-2xl p-8 text-center border border-gray-700">
            <Wallet className="w-14 h-14 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-4">连接钱包进入合成实验室</p>
            <ConnectButton />
          </motion.div>
        )}
      </div>

      {/* 合成中特效 */}
      {synthesizing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="text-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 mx-auto mb-6 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full blur-xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-violet-600 to-pink-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"
            >
              合成进行中
            </motion.h2>
            <p className="text-gray-400 mt-2">正在融合能量...</p>
          </div>
        </motion.div>
      )}

      {/* 结果弹窗 */}
      {showResult && resultData && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowResult(false)}
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className={`bg-gradient-to-br ${FRAGMENT_CONFIG[resultData.type as FragmentType]?.color || 'from-gray-600 to-gray-800'} rounded-3xl p-8 text-center max-w-sm w-full`}
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              {resultData.type === 'epic' ? '💎' : resultData.type === 'rare' ? '⭐' : '🎯'}
            </motion.div>
            <h2 className="text-2xl font-black mb-2">
              {resultData.type === 'epic' ? '史诗NFT' : resultData.type === 'rare' ? '稀有NFT' : '普通NFT'}
            </h2>
            <p className="text-green-400 font-bold text-xl mb-6">+{resultData.reward} BOX</p>
            <button 
              onClick={() => setShowResult(false)}
              className="px-10 py-3 bg-white text-black rounded-full font-bold"
            >
              收下奖励
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
