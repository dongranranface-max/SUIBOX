'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Zap, Crown, Wallet, ArrowRight, RefreshCw, Layers, Rocket, Atom, ChevronRight } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

// NFT视频配置
const NFT_VIDEOS = { common: '/nft-common.mp4', rare: '/nft-rare.mp4', epic: '/nft-epic.mp4' };

// 碎片配置
const FRAGMENT_CONFIG = {
  common: { name: '普通碎片', image: '/fragment-common.png' },
  rare: { name: '稀有碎片', image: '/fragment-rare.png' },
  epic: { name: '史诗碎片', image: '/fragment-epic.png' },
};

// NFT配置
const NFT_CONFIG = {
  common: { name: '普通NFT', video: '/nft-common.mp4' },
  rare: { name: '稀有NFT', video: '/nft-rare.mp4' },
  epic: { name: '史诗NFT', video: '/nft-epic.mp4' },
};

// 碎片合成配方
const FRAGMENT_RECIPES = [
  { id: 1, result: 'common', cost: { common: 6 }, reward: 5, name: '普通NFT', tier: 1 },
  { id: 2, result: 'rare', cost: { rare: 8 }, reward: 8, name: '稀有NFT', tier: 2 },
  { id: 3, result: 'epic', cost: { epic: 10 }, reward: 15, name: '史诗NFT', tier: 3 },
];

// NFT合成配方
const NFT_RECIPES = [
  { id: 1, result: 'rare', cost: { common: 5 }, boxCost: 30, reward: 10, name: '稀有NFT', tier: 2 },
  { id: 2, result: 'epic', cost: { rare: 4 }, boxCost: 50, reward: 20, name: '史诗NFT', tier: 3 },
];

function NFTVideo({ src, alt, size = 40 }: { src: string; alt: string; size?: number }) {
  return <div className="relative rounded-lg overflow-hidden" style={{ width: size, height: size }}><video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover" /></div>;
}

function FragImg({ src, alt, size = 40 }: { src: string; alt: string; size?: number }) {
  return <img src={src} alt={alt} className="object-contain" style={{ width: size, height: size, borderRadius: '8px' }} />;
}

function TierBadge({ tier }: { tier: number }) {
  const configs = [{ name: '普通', color: 'text-gray-400', bg: 'bg-gray-600' }, { name: '稀有', color: 'text-blue-400', bg: 'bg-blue-600' }, { name: '史诗', color: 'text-yellow-400', bg: 'bg-yellow-600' }];
  const config = configs[tier - 1] || configs[0];
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>{config.name}</span>;
}

export default function CraftPage() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<'fragment' | 'nft'>('fragment');
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{ type: string; reward: number } | null>(null);

  const [myFragments, setMyFragments] = useState({ common: 10, rare: 5, epic: 2 });
  const [myNFTs, setMyNFTs] = useState({ common: 3, rare: 1, epic: 0 });
  const [myBOX, setMyBOX] = useState(100);

  const canSynth = useMemo(() => {
    if (activeTab === 'fragment') {
      return FRAGMENT_RECIPES.filter(r => {
        const c = r.cost;
        return (!c.common || myFragments.common >= c.common) && (!c.rare || myFragments.rare >= c.rare) && (!c.epic || myFragments.epic >= c.epic);
      }).length;
    } else {
      return NFT_RECIPES.filter(r => {
        const c = r.cost;
        const nftCount = c.common ? myNFTs.common : myNFTs.rare;
        return nftCount >= (c.common || c.rare || 0) && myBOX >= r.boxCost;
      }).length;
    }
  }, [activeTab, myFragments, myNFTs, myBOX]);

  const handleSynth = () => {
    if (selectedRecipe === null) return;
    setSynthesizing(true);
    setTimeout(() => {
      if (activeTab === 'fragment') {
        const recipe = FRAGMENT_RECIPES[selectedRecipe];
        const c = recipe.cost;
        setMyFragments(prev => ({ common: prev.common - (c.common || 0), rare: prev.rare - (c.rare || 0), epic: prev.epic - (c.epic || 0) }));
        setMyNFTs(prev => ({ ...prev, [recipe.result]: prev[recipe.result as keyof typeof prev] + 1 }));
        setMyBOX(prev => prev + recipe.reward);
        setResultData({ type: recipe.result, reward: recipe.reward });
      } else {
        const recipe = NFT_RECIPES[selectedRecipe];
        const c = recipe.cost;
        setMyBOX(prev => prev - recipe.boxCost + recipe.reward);
        setMyNFTs(prev => ({ common: prev.common - (c.common || 0), rare: prev.rare - (c.rare || 0), epic: prev.epic + 1 }));
        setResultData({ type: recipe.result, reward: recipe.reward });
      }
      setSynthesizing(false);
      setShowResult(true);
      setSelectedRecipe(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-black to-purple-950/50" />
        <motion.div animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px]" />
        <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 py-6">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
          <motion.h1 animate={{ textShadow: ['0 0 20px rgba(139,92,246,0.5)', '0 0 40px rgba(139,92,246,0.8)', '0 0 20px rgba(139,92,246,0.5)'] }} transition={{ duration: 2, repeat: Infinity }} className="text-3xl md:text-5xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            🔬 Laboratory
          </motion.h1>
          <p className="text-gray-400 mt-1 text-sm">Transform fragments into NFTs and earn rewards</p>
        </motion.div>

        {wallet.connected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-4 border border-violet-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><Atom className="w-5 h-5 text-violet-400" /><span className="font-bold text-gray-300">My Assets</span></div>
                <span className="text-xs text-gray-500">{canSynth} recipes available</span>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">🎯 Fragments</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ key: 'common', count: myFragments.common }, { key: 'rare', count: myFragments.rare }, { key: 'epic', count: myFragments.epic }].map(item => (
                    <div key={item.key} className="bg-gray-800/50 rounded-xl p-2 text-center">
                      <div className="flex justify-center mb-1"><FragImg src={FRAGMENT_CONFIG[item.key as keyof typeof FRAGMENT_CONFIG].image} alt={item.key} size={32} /></div>
                      <p className={`text-lg font-bold ${item.key === 'common' ? 'text-gray-300' : item.key === 'rare' ? 'text-blue-400' : 'text-yellow-400'}`}>{item.count}</p>
                      <p className="text-xs text-gray-600">{item.key === 'common' ? 'Common' : item.key === 'rare' ? 'Rare' : 'Epic'}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">🖼️ NFTs</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ key: 'common', count: myNFTs.common }, { key: 'rare', count: myNFTs.rare }, { key: 'epic', count: myNFTs.epic }].map(item => (
                    <div key={item.key} className="bg-gray-800/50 rounded-xl p-2 text-center">
                      <div className="flex justify-center mb-1"><NFTVideo src={NFT_CONFIG[item.key as keyof typeof NFT_CONFIG].video} alt={item.key} size={32} /></div>
                      <p className={`text-lg font-bold ${item.key === 'common' ? 'text-gray-300' : item.key === 'rare' ? 'text-blue-400' : 'text-yellow-400'}`}>{item.count}</p>
                      <p className="text-xs text-gray-600">{item.key === 'common' ? 'Common' : item.key === 'rare' ? 'Rare' : 'Epic'}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">💰 BOX Balance</span>
                  <motion.span key={myBOX} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-2xl font-black text-green-400">{myBOX}</motion.span>
                </div>
              </div>
              
              {/* NFT发行量 */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-xs text-gray-500">Common NFT</p><p className="text-sm font-bold text-green-400">1M</p></div>
                  <div><p className="text-xs text-gray-500">Rare NFT</p><p className="text-sm font-bold text-blue-400">100K</p></div>
                  <div><p className="text-xs text-gray-500">Epic NFT</p><p className="text-sm font-bold text-yellow-400">20K</p></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-2 mb-6">
          {[{ key: 'fragment', label: '⚡ Fragment Synthesis', icon: Layers }, { key: 'nft', label: '🚀 Ultimate Synthesis', icon: Rocket }].map(tab => (
            <motion.button key={tab.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setActiveTab(tab.key as 'fragment' | 'nft'); setSelectedRecipe(null); }} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${activeTab === tab.key ? 'bg-gradient-to-r from-violet-600 to-pink-600 shadow-lg' : 'bg-gray-800 text-gray-400'}`}>
              <tab.icon className="w-5 h-5" /><span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {activeTab === 'fragment' ? FRAGMENT_RECIPES.map((recipe, index) => {
            const c = recipe.cost;
            const canDo = (!c.common || myFragments.common >= c.common) && (!c.rare || myFragments.rare >= c.rare) && (!c.epic || myFragments.epic >= c.epic);
            return (
              <motion.div key={recipe.id} whileHover={canDo ? { scale: 1.01 } : {}} onClick={() => canDo && setSelectedRecipe(index)} className={`rounded-xl border-2 cursor-pointer transition-all ${selectedRecipe === index ? 'border-violet-500 bg-violet-500/10' : canDo ? 'border-gray-700 bg-gray-900/60' : 'border-gray-800 bg-gray-900/30 opacity-60'}`}>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex gap-1">
                      {c.common && <div className="bg-gray-800 px-2 py-1 rounded-lg flex items-center gap-1"><FragImg src={FRAGMENT_CONFIG.common.image} alt="" size={18} /><span className="text-xs text-gray-300">×{c.common}</span></div>}
                      {c.rare && <div className="bg-gray-800 px-2 py-1 rounded-lg flex items-center gap-1"><FragImg src={FRAGMENT_CONFIG.rare.image} alt="" size={18} /><span className="text-xs text-gray-300">×{c.rare}</span></div>}
                      {c.epic && <div className="bg-gray-800 px-2 py-1 rounded-lg flex items-center gap-1"><FragImg src={FRAGMENT_CONFIG.epic.image} alt="" size={18} /><span className="text-xs text-gray-300">×{c.epic}</span></div>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      <NFTVideo src={NFT_CONFIG[recipe.result as keyof typeof NFT_CONFIG].video} alt={recipe.result} size={36} />
                      <div><p className="font-bold text-sm">{NFT_CONFIG[recipe.result as keyof typeof NFT_CONFIG].name}</p><TierBadge tier={recipe.tier} /></div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-green-400 font-bold">+{recipe.reward} BOX</p>
                    {canDo ? <Zap className="w-4 h-4 text-green-400 ml-auto" /> : <Lock className="w-4 h-4 text-gray-600 ml-auto" />}
                  </div>
                </div>
              </motion.div>
            );
          }) : NFT_RECIPES.map((recipe, index) => {
            const c = recipe.cost;
            const nftCount = c.common ? myNFTs.common : myNFTs.rare;
            const canDo = nftCount >= (c.common || c.rare || 0) && myBOX >= recipe.boxCost;
            return (
              <motion.div key={recipe.id} whileHover={canDo ? { scale: 1.01 } : {}} onClick={() => canDo && setSelectedRecipe(index)} className={`rounded-xl border-2 cursor-pointer transition-all ${selectedRecipe === index ? 'border-violet-500 bg-violet-500/10' : canDo ? 'border-gray-700 bg-gray-900/60' : 'border-gray-800 bg-gray-900/30 opacity-60'}`}>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex gap-1">
                      <div className="bg-gray-800 px-2 py-1 rounded-lg"><span className="text-xs text-gray-300">{c.common ? 'Common' : 'Rare'} NFT ×{c.common || c.rare}</span></div>
                      <div className="bg-red-500/20 px-2 py-1 rounded-lg"><span className="text-xs text-red-400">-{recipe.boxCost} BOX</span></div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      <Crown className="w-6 h-6 text-yellow-400" />
                      <div><p className="font-bold text-sm">{NFT_CONFIG[recipe.result as keyof typeof NFT_CONFIG].name}</p><TierBadge tier={recipe.tier} /></div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-green-400 font-bold">+{recipe.reward} BOX</p>
                    {canDo ? <Zap className="w-4 h-4 text-green-400 ml-auto" /> : <Lock className="w-4 h-4 text-gray-600 ml-auto" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {wallet.connected && selectedRecipe !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSynth} disabled={synthesizing} className="w-full py-4 bg-gradient-to-r from-violet-600 via-pink-600 to-purple-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-violet-500/30">
              {synthesizing ? <><RefreshCw className="w-6 h-6 animate-spin" /><span>Synthesizing...</span></> : <><Sparkles className="w-6 h-6" /><span>Start Synthesis</span></>}
            </motion.button>
          </motion.div>
        )}

        {!wallet.connected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-gray-900/80 rounded-2xl p-8 text-center border border-gray-700">
            <Wallet className="w-14 h-14 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-4">Connect wallet to enter Laboratory</p>
            <ConnectButton />
          </motion.div>
        )}
      </div>

      {synthesizing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 mx-auto mb-6"><div className="w-full h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center"><Sparkles className="w-12 h-12 text-white" /></div></motion.div>
            <p className="text-2xl font-bold">Synthesizing...</p>
          </div>
        </motion.div>
      )}

      {showResult && resultData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowResult(false)}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`bg-gradient-to-br ${resultData.type === 'epic' ? 'from-yellow-600 to-orange-700' : resultData.type === 'rare' ? 'from-blue-600 to-cyan-700' : 'from-gray-600 to-gray-700'} rounded-3xl p-8 text-center max-w-sm`} onClick={e => e.stopPropagation()}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden"><video src={NFT_VIDEOS[resultData.type as keyof typeof NFT_VIDEOS]} autoPlay loop muted playsInline className="w-full h-full object-cover" /></motion.div>
            <h2 className="text-2xl font-black mb-2">{resultData.type === 'epic' ? 'Epic NFT' : resultData.type === 'rare' ? 'Rare NFT' : 'Common NFT'}</h2>
            <p className="text-green-400 font-bold text-xl mb-6">+{resultData.reward} BOX</p>
            <button onClick={() => setShowResult(false)} className="px-10 py-3 bg-white text-black rounded-full font-bold">Collect</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
