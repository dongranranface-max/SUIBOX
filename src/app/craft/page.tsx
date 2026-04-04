'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Rocket, Layers, ChevronRight, Check } from 'lucide-react';

const FRAGMENT_CONFIG = {
  common: { name: 'Common Fragment', emoji: '🔹', color: 'gray', desc: 'Common quality fragment' },
  rare: { name: 'Rare Fragment', emoji: '💎', color: 'purple', desc: 'Rare quality fragment' },
  epic: { name: 'Epic Fragment', emoji: '⚡', color: 'orange', desc: 'Epic quality fragment' },
};

const NFT_CONFIG = {
  common: { name: 'Common NFT', emoji: '✨', color: 'gray', stars: 1 },
  rare: { name: 'Rare NFT', emoji: '💎', color: 'purple', stars: 2 },
  epic: { name: 'Epic NFT', emoji: '🔥', color: 'orange', stars: 3 },
  legendary: { name: 'Legendary NFT', emoji: '👑', color: 'yellow', stars: 5 },
};

const fragmentRecipes = [
  { result: 'common', cost: { common: 6 }, reward: 5, name: 'Common NFT', tier: 1 },
  { result: 'rare', cost: { rare: 8 }, reward: 8, name: 'Rare NFT', tier: 2 },
  { result: 'epic', cost: { epic: 10 }, reward: 15, name: 'Epic NFT', tier: 3 },
];

const nftRecipes = [
  { result: 'rare', cost: { commonNFT: 5, box: 30 }, reward: 10, name: 'Rare NFT', boxCost: 30 },
  { result: 'epic', cost: { rareNFT: 4, box: 50 }, reward: 20, name: 'Epic NFT', boxCost: 50 },
  { result: 'legendary', cost: { commonNFT: 100, rareNFT: 50, epicNFT: 20, box: 200 }, reward: 100, name: 'Legendary NFT', boxCost: 200 },
];

const userFragments = { common: 12, rare: 6, epic: 3 };
const userNFTs = { common: 3, rare: 1, epic: 0, legendary: 0 };
const userBox = 500;

export default function CraftPage() {
  const [activeTab, setActiveTab] = useState<'fragment' | 'nft'>('fragment');
  const [craftingNFT, setCraftingNFT] = useState<string | null>(null);
  const [craftSuccess, setCraftSuccess] = useState<{ type: string; name: string } | null>(null);

  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    gray: { bg: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/30', text: 'text-gray-400', glow: 'shadow-gray-500/20' },
    purple: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
    orange: { bg: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
    yellow: { bg: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    cyan: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  };

  const canCraftFragment = (recipe: typeof fragmentRecipes[0]) => {
    return Object.entries(recipe.cost).every(([type, needed]) => {
      const fragType = type.replace('Fragment', '') as 'common' | 'rare' | 'epic';
      return userFragments[fragType] >= needed;
    });
  };

  const canCraftNFT = (recipe: typeof nftRecipes[0]) => {
    if (recipe.cost.commonNFT && userNFTs.common < recipe.cost.commonNFT) return false;
    if (recipe.cost.rareNFT && userNFTs.rare < recipe.cost.rareNFT) return false;
    if (recipe.cost.epicNFT && userNFTs.epic < recipe.cost.epicNFT) return false;
    if (recipe.cost.box && userBox < recipe.cost.box) return false;
    return true;
  };

  const doFragmentCraft = (recipe: typeof fragmentRecipes[0]) => {
    if (!canCraftFragment(recipe)) return;
    setCraftingNFT(recipe.name);
    setTimeout(() => {
      setCraftingNFT(null);
      setCraftSuccess({ type: 'fragment', name: NFT_CONFIG[recipe.result as keyof typeof NFT_CONFIG].name });
      setTimeout(() => setCraftSuccess(null), 3000);
    }, 2000);
  };

  const doNFTCraft = (recipe: typeof nftRecipes[0]) => {
    if (!canCraftNFT(recipe)) return;
    setCraftingNFT(recipe.name);
    setTimeout(() => {
      setCraftingNFT(null);
      setCraftSuccess({ type: 'nft', name: NFT_CONFIG[recipe.result as keyof typeof NFT_CONFIG].name });
      setTimeout(() => setCraftSuccess(null), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">NFT Craft</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Craft Center
            </span>
          </h1>
          <p className="text-gray-400">Craft Fragments into NFTs · Upgrade to Higher Tiers</p>
        </motion.div>

        {/* User Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Common Fragments', value: userFragments.common, emoji: '🔹', color: 'gray' },
            { label: 'Rare Fragments', value: userFragments.rare, emoji: '💎', color: 'purple' },
            { label: 'Epic Fragments', value: userFragments.epic, emoji: '⚡', color: 'orange' },
            { label: 'BOX Balance', value: userBox, emoji: '💰', color: 'cyan' },
          ].map((item, i) => (
            <div key={i} className={`bg-gray-900 border border-gray-800 rounded-2xl p-4 bg-gradient-to-br ${colorMap[item.color].bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-gray-500 text-sm">{item.label}</span>
              </div>
              <p className={`text-2xl font-black ${colorMap[item.color].text}`}>{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Tab Switch */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('fragment')}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'fragment'
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="inline-block w-5 h-5 mr-2" />
            Fragment Craft
          </button>
          <button
            onClick={() => setActiveTab('nft')}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'nft'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Rocket className="inline-block w-5 h-5 mr-2" />
            NFT Upgrade
          </button>
        </div>

        {/* Fragment Craft */}
        <AnimatePresence>
          {activeTab === 'fragment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Fragment → NFT</h2>
                <p className="text-gray-400">Consume fragments, receive NFT + BOX reward</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fragmentRecipes.map((recipe, i) => {
                  const nft = NFT_CONFIG[recipe.result as keyof typeof NFT_CONFIG];
                  const canCraft = canCraftFragment(recipe);
                  const isCrafting = craftingNFT === recipe.name;

                  return (
                    <motion.div
                      key={recipe.result}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-gray-900 border border-gray-800 rounded-3xl p-6 bg-gradient-to-br ${colorMap[nft.color].bg}`}
                    >
                      <div className="text-center mb-6">
                        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${colorMap[nft.color].bg} border-2 ${colorMap[nft.color].border} flex items-center justify-center text-4xl mb-3`}>
                          {nft.emoji}
                        </div>
                        <h3 className={`text-xl font-black ${colorMap[nft.color].text}`}>{nft.name}</h3>
                      </div>

                      <div className="space-y-2 mb-6">
                        <p className="text-sm text-gray-400 mb-2">Required Materials:</p>
                        {Object.entries(recipe.cost).map(([type, needed]) => {
                          const fragType = type.replace('Fragment', '') as 'common' | 'rare' | 'epic';
                          const frag = FRAGMENT_CONFIG[fragType];
                          const hasEnough = userFragments[fragType] >= needed;
                          return (
                            <div key={type} className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{frag.emoji}</span>
                                <span className="text-white">{frag.name}</span>
                              </div>
                              <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                                {hasEnough ? '' : 'Need '}{userFragments[fragType]}/{needed}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400">Reward</span>
                          <span className="text-green-400 font-bold">+{recipe.reward} BOX</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: canCraft ? 1.02 : 1 }}
                        whileTap={{ scale: canCraft ? 0.98 : 1 }}
                        onClick={() => doFragmentCraft(recipe)}
                        disabled={!canCraft || isCrafting}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                          isCrafting
                            ? 'bg-gray-700 cursor-wait'
                            : canCraft
                            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isCrafting ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                            Crafting...
                          </span>
                        ) : canCraft ? (
                          'Start Craft'
                        ) : (
                          'Insufficient Materials'
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NFT Upgrade */}
        <AnimatePresence>
          {activeTab === 'nft' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">NFT → Higher Tier NFT</h2>
                <p className="text-gray-400">Consume NFT + BOX, receive higher tier NFT</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nftRecipes.map((recipe, i) => {
                  const nft = NFT_CONFIG[recipe.result as keyof typeof NFT_CONFIG];
                  const canCraft = canCraftNFT(recipe);
                  const isCrafting = craftingNFT === recipe.name;

                  return (
                    <motion.div
                      key={recipe.result}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-gray-900 border border-gray-800 rounded-3xl p-6 bg-gradient-to-br ${colorMap[nft.color].bg}`}
                    >
                      <div className="flex items-center justify-center my-4">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                          <ChevronRight className={`w-8 h-8 ${colorMap[nft.color].text}`} />
                        </motion.div>
                      </div>

                      <div className="text-center mb-6">
                        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${colorMap[nft.color].bg} border-2 ${colorMap[nft.color].border} flex items-center justify-center text-4xl mb-3 relative`}>
                          {nft.emoji}
                          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-yellow-500 rounded-full text-xs font-bold text-black">
                            {'★'.repeat(nft.stars)}
                          </div>
                        </div>
                        <h3 className={`text-xl font-black ${colorMap[nft.color].text}`}>{nft.name}</h3>
                      </div>

                      <div className="space-y-2 mb-6">
                        <p className="text-sm text-gray-400 mb-2">Required Materials:</p>
                        {Object.entries(recipe.cost).map(([type, needed]) => {
                          if (type === 'box') {
                            const hasEnough = userBox >= needed;
                            return (
                              <div key={type} className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">💰</span>
                                  <span className="text-white">BOX</span>
                                </div>
                                <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                                  {hasEnough ? '' : 'Need '}{userBox}/{needed}
                                </span>
                              </div>
                            );
                          }
                          
                          const nftType = type.replace('NFT', '') as 'common' | 'rare' | 'epic';
                          const requiredNFT = NFT_CONFIG[nftType];
                          const userCount = userNFTs[nftType] || 0;
                          const hasEnough = userCount >= needed;
                          
                          return (
                            <div key={type} className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{requiredNFT.emoji}</span>
                                <span className="text-white">{requiredNFT.name}</span>
                              </div>
                              <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                                {hasEnough ? '' : 'Need '}{userCount}/{needed}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400">Reward</span>
                          <span className="text-green-400 font-bold">+{recipe.reward} BOX</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: canCraft ? 1.02 : 1 }}
                        whileTap={{ scale: canCraft ? 0.98 : 1 }}
                        onClick={() => doNFTCraft(recipe)}
                        disabled={!canCraft || isCrafting}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                          isCrafting
                            ? 'bg-gray-700 cursor-wait'
                            : canCraft
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg shadow-orange-500/25'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isCrafting ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                            Crafting...
                          </span>
                        ) : canCraft ? (
                          'Start Upgrade'
                        ) : (
                          'Insufficient Materials'
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Legendary Tip */}
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-3xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl">
                    👑
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">Legendary NFT Ultimate Craft</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      100 Common NFT + 50 Rare NFT + 20 Epic NFT + 200 BOX = 1 Legendary NFT
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                        Global Limited 353
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                        +100 BOX Reward
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {craftSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="bg-gray-900 border border-green-500/30 rounded-3xl p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center text-5xl mb-4"
              >
                ✅
              </motion.div>
              <h2 className="text-2xl font-black text-green-400 mb-2">Craft Success!</h2>
              <p className="text-white text-lg">You received {craftSuccess.name}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
