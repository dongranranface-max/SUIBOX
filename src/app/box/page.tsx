'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Users, Zap, Shield, Layers, Star, CheckCircle } from 'lucide-react';

// 碎片数据
const fragmentData = {
  common: { name: '普通', count: 6, color: 'from-gray-500 to-gray-600' },
  rare: { name: '稀有', count: 2, color: 'from-blue-500 to-cyan-500' },
  epic: { name: '史诗', count: 0, color: 'from-yellow-500 to-amber-500' },
};

// NFT数据
const nftData = [
  { name: '普通碎片', rarity: 'R', image: '/fragment-common.png' },
  { name: '稀有碎片', rarity: 'SR', image: '/fragment-rare.png' },
  { name: '史诗碎片', rarity: 'SSR', image: '/fragment-epic.png' },
];

// 概率配置
const probabilities = {
  none: 40,
  common: 40,
  rare: 15,
  epic: 1,
};

// 保底配置
const guaranteeConfig = {
  common: { count: 3 },
  rare: { count: 5 },
  epic: { count: 53 },
};

export default function BoxPage() {
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{ name: string; rarity: string; image: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [myFragments, setMyFragments] = useState(fragmentData);
  const [consecutiveNone, setConsecutiveNone] = useState(0);

  // 开盒
  const handleOpenBox = () => {
    if (isOpening) return;
    setIsOpening(true);
    setResult(null);
    setShowResult(false);

    setTimeout(() => {
      const rand = Math.random() * 100;
      let nft: typeof nftData[0] | null = null;
      let resultRarity = 'none';

      // 保底逻辑
      if (consecutiveNone >= guaranteeConfig.epic.count) {
        nft = nftData[2];
        resultRarity = 'SSR';
        setConsecutiveNone(0);
      } else if (consecutiveNone >= guaranteeConfig.rare.count) {
        nft = nftData[1];
        resultRarity = 'SR';
        setConsecutiveNone(0);
      } else if (consecutiveNone >= guaranteeConfig.common.count) {
        nft = nftData[0];
        resultRarity = 'R';
        setConsecutiveNone(0);
      } else {
        if (rand < probabilities.epic) {
          nft = nftData[2];
          resultRarity = 'SSR';
        } else if (rand < probabilities.epic + probabilities.rare) {
          nft = nftData[1];
          resultRarity = 'SR';
        } else if (rand < probabilities.epic + probabilities.rare + probabilities.common) {
          nft = nftData[0];
          resultRarity = 'R';
        } else {
          resultRarity = 'none';
          setConsecutiveNone(prev => prev + 1);
        }
      }

      if (nft) {
        setResult({ name: nft.name, rarity: resultRarity, image: nft.image });
        const type = resultRarity === 'SSR' ? 'epic' : resultRarity === 'SR' ? 'rare' : 'common';
        setMyFragments(prev => ({
          ...prev,
          [type]: { ...prev[type], count: prev[type].count + 1 }
        }));
      } else {
        setResult({ name: '感谢参与', rarity: 'none', image: '' });
      }
      
      setShowResult(true);
      setTimeout(() => setIsOpening(false), 500);
    }, 2500);
  };

  // 粒子效果
  const ParticleBurst = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          initial={{ x: '50%', y: '50%', opacity: 1, scale: 1 }}
          animate={showResult && result?.rarity !== 'none' ? {
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
            scale: 0,
          } : { opacity: 0 }}
          transition={{ duration: 1, delay: i * 0.02 }}
          style={{
            background: result?.rarity === 'SSR' ? '#fbbf24' : result?.rarity === 'SR' ? '#a855f7' : '#3b82f6'
          }}
        />
      ))}
    </div>
  );

  // 抽奖光效
  const LotteryGlow = () => (
    <motion.div
      className="absolute inset-0 rounded-2xl"
      animate={isOpening ? {
        boxShadow: [
          '0 0 20px rgba(139, 92, 246, 0.3)',
          '0 0 60px rgba(236, 72, 153, 0.5)',
          '0 0 20px rgba(139, 92, 246, 0.3)',
        ],
      } : {}}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* 主标题 */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-3 mb-2"
          >
            <span className="text-5xl">🎁</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              NFT 盲盒
            </h1>
            <span className="text-5xl">💎</span>
          </motion.div>
          <p className="text-gray-400">Sui Randomness 随机数 · 公平公正</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* 左侧：大转盘区域 */}
          <div className="lg:col-span-3">
            {/* 保底进度 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-2xl p-5 border border-amber-500/30 mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-amber-400" />
                  <span className="font-bold text-amber-400">保底进度</span>
                </div>
                <div className="text-amber-400 font-bold text-xl">
                  {consecutiveNone} / {guaranteeConfig.epic.count}
                </div>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b)'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((consecutiveNone / guaranteeConfig.epic.count) * 100, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span className="text-blue-400">3次=普通</span>
                <span className="text-purple-400">5次=稀有</span>
                <span className="text-amber-400">53次=史诗</span>
              </div>
            </motion.div>

            {/* 抽奖转盘 */}
            <motion.div 
              className="relative bg-gray-900/80 rounded-3xl p-8 min-h-[450px] flex flex-col items-center justify-center overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)' }}
            >
              <LotteryGlow />
              <ParticleBurst />

              {/* 中央结果 */}
              <AnimatePresence mode="wait">
                {showResult && result ? (
                  <motion.div
                    key="result"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="text-center z-10"
                  >
                    {/* 特效 */}
                    {result.rarity !== 'none' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-3 h-3 rounded-full"
                            style={{
                              background: result.rarity === 'SSR' ? '#fbbf24' : result.rarity === 'SR' ? '#a855f7' : '#3b82f6',
                            }}
                            animate={{
                              x: [0, Math.cos(i * 30 * Math.PI / 180) * 150],
                              y: [0, Math.sin(i * 30 * Math.PI / 180) * 150],
                              opacity: [1, 0],
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        ))}
                      </motion.div>
                    )}

                    {/* 表情 */}
                    <div className="text-8xl mb-4">
                      {result.rarity === 'SSR' ? '🌟' : result.rarity === 'SR' ? '✨' : result.rarity === 'R' ? '💫' : '💨'}
                    </div>
                    
                    {/* 稀有度标签 */}
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`inline-block px-8 py-3 rounded-2xl font-bold text-2xl mb-4 ${
                        result.rarity === 'SSR' 
                          ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white' 
                          : result.rarity === 'SR'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : result.rarity === 'R'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                      }`}
                    >
                      {result.rarity === 'none' ? '感谢参与' : result.rarity}
                    </motion.div>

                    {/* 图片 */}
                    {result.image && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="w-48 h-48 mx-auto mb-4 relative"
                      >
                        <img src={result.image} alt={result.name} className="w-full h-full object-contain" />
                        {/* 光环 */}
                        <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 ${
                          result.rarity === 'SSR' ? 'bg-yellow-500' : result.rarity === 'SR' ? 'bg-purple-500' : 'bg-blue-500'
                        }`} />
                      </motion.div>
                    )}

                    {/* 名称 */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-3xl font-bold"
                    >
                      {result.name}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="waiting"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-center z-10"
                  >
                    <motion.div
                      animate={isOpening ? { 
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 0.5, repeat: isOpening ? Infinity : 0 }}
                      className="text-[150px] leading-none mb-4"
                    >
                      {isOpening ? '🎁' : '❓'}
                    </motion.div>
                    <div className="text-xl text-gray-400">
                      {isOpening ? '正在抽奖中...' : '点击下方按钮开始'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 抽奖按钮 */}
              <motion.button
                onClick={handleOpenBox}
                disabled={isOpening}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-8 px-12 py-4 rounded-2xl font-bold text-xl flex items-center gap-3 z-20 ${
                  isOpening 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:from-green-300 hover:via-emerald-400 hover:to-teal-400 shadow-lg shadow-green-500/30'
                }`}
              >
                {isOpening ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Zap className="w-6 h-6" />
                    </motion.span>
                    抽奖中...
                  </>
                ) : (
                  <>
                    <Gift className="w-6 h-6" />
                    开始抽奖
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* 概率卡片 */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              {[
                { rate: '40%', name: '感谢参与', color: 'gray' },
                { rate: '40%', name: '普通碎片', color: 'blue' },
                { rate: '15%', name: '稀有碎片', color: 'purple' },
                { rate: '1%', name: '史诗碎片', color: 'amber' },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-gray-900/60 rounded-xl p-3 text-center border border-${item.color}-500/20`}
                >
                  <div className={`text-2xl font-bold text-${item.color}-400`}>{item.rate}</div>
                  <div className="text-xs text-gray-500">{item.name}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 右侧：状态面板 */}
          <div className="space-y-4">
            {/* 邀请进度 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-violet-900/40 to-pink-900/40 rounded-2xl p-4 border border-violet-500/30"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-violet-400" />
                <span className="font-bold">邀请进度</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: '1位好友', reward: '+2', done: true },
                  { label: '3位好友', reward: '+3', done: false },
                  { label: '15位好友', reward: '+5', done: false },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${item.done ? 'bg-green-500/20' : 'bg-black/30'}`}>
                    <div className="flex items-center gap-2">
                      {item.done && <CheckCircle className="w-4 h-4 text-green-400" />}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-green-400 font-bold text-sm">{item.reward}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 text-center text-sm text-gray-400">
                今日已获：<span className="text-green-400 font-bold">+2</span>
              </div>
            </motion.div>

            {/* 碎片库存 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 rounded-2xl p-4 border border-amber-500/30"
            >
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-amber-400" />
                <span className="font-bold">我的碎片</span>
              </div>
              <div className="space-y-2">
                {Object.entries(myFragments).map(([key, data]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <img 
                        src={key === 'common' ? '/fragment-common.png' : key === 'rare' ? '/fragment-rare.png' : '/fragment-epic.png'}
                        alt={data.name}
                        className="w-8 h-8 object-contain"
                      />
                      <span className="text-sm">{data.name}</span>
                    </div>
                    <span className={`font-bold ${
                      key === 'common' ? 'text-gray-400' : key === 'rare' ? 'text-blue-400' : 'text-amber-400'
                    }`}>
                      ×{data.count}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
