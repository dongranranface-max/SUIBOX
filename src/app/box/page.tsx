'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Users, Zap, Shield, Layers, Star, CheckCircle, Wallet, ExternalLink, AlertCircle } from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { SUI_CONFIG } from '@/config/sui';

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

// 保底配置
const guaranteeConfig = {
  common: { count: 3, name: '普通碎片' },
  rare: { count: 5, name: '稀有碎片' },
  epic: { count: 53, name: '史诗碎片' },
};

const rarityColors: Record<string, string> = {
  SSR: 'from-yellow-500 via-orange-500 to-red-500',
  SR: 'from-purple-500 to-pink-500',
  R: 'from-blue-500 to-cyan-500',
};

export default function BoxPage() {
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{ name: string; rarity: string; image: string; txDigest?: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [myFragments, setMyFragments] = useState(fragmentData);
  const [consecutiveNone, setConsecutiveNone] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { address, connected, connect } = useWallet();

  // 模拟开盒（实际对接会调用合约）
  const handleOpenBox = useCallback(async (boxType: 'common' | 'rare' | 'epic') => {
    setError(null);
    
    if (!connected) {
      setError('请先连接SUI钱包！');
      return;
    }
    
    setIsOpening(true);
    setResult(null);
    setShowResult(false);

    // 模拟开盒结果
    setTimeout(() => {
      const rand = Math.random() * 100;
      let rarity: string;
      
      // 保底逻辑
      if (consecutiveNone >= guaranteeConfig.epic.count) {
        rarity = boxType === 'epic' ? 'SSR' : boxType === 'rare' ? 'SR' : 'R';
        setConsecutiveNone(0);
      } else if (consecutiveNone >= guaranteeConfig.rare.count) {
        rarity = 'SR';
        setConsecutiveNone(0);
      } else if (consecutiveNone >= guaranteeConfig.common.count) {
        rarity = 'R';
        setConsecutiveNone(0);
      } else {
        // 正常概率
        if (boxType === 'epic') {
          if (rand < 1) rarity = 'SSR';
          else if (rand < 16) rarity = 'SR';
          else rarity = 'R';
        } else if (boxType === 'rare') {
          if (rand < 3) rarity = 'SR';
          else rarity = 'R';
        } else {
          rarity = rand < 10 ? 'SR' : 'R';
        }
        
        if (rarity === 'R') {
          setConsecutiveNone(prev => prev + 1);
        } else {
          setConsecutiveNone(0);
        }
      }

      const nft = nftData.find(n => n.rarity === rarity) || nftData[0];
      
      setResult({ 
        name: nft.name, 
        rarity, 
        image: nft.image,
        txDigest: `0x${Math.random().toString(16).slice(2, 66)}`
      });
      setShowResult(true);
      
      // 更新碎片数量
      if (rarity === 'SSR' || rarity === 'SR') {
        setMyFragments(prev => ({
          ...prev,
          [rarity === 'SSR' ? 'epic' : 'rare']: { 
            ...prev[rarity === 'SSR' ? 'epic' : 'rare'], 
            count: prev[rarity === 'SSR' ? 'epic' : 'rare'].count + 1 
          }
        }));
      } else {
        setMyFragments(prev => ({
          ...prev,
          common: { ...prev.common, count: prev.common.count + 1 }
        }));
      }
      
      setIsOpening(false);
    }, 2500);
  }, [connected, consecutiveNone]);

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
          <p className="text-gray-400">SUI Devnet 链上盲盒 · {SUI_CONFIG.devnet.packageId.slice(0, 10)}...</p>
        </div>

        {/* 钱包连接提示 */}
        {!connected && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-center justify-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400">请先连接SUI钱包体验链上开盲盒！</span>
            <SuiWalletButton />
          </div>
        )}

        <div className="flex justify-end mb-4">
          <SuiWalletButton />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* 左侧：大转盘区域 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 保底进度 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-2xl p-5 border border-amber-500/30"
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
                  style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b)' }}
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

            {/* 抽奖按钮 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'common' as const, name: '普通盲盒', price: '免费', emoji: '📦' },
                { type: 'rare' as const, name: '稀有盲盒', price: '100 SUI', emoji: '🎁' },
                { type: 'epic' as const, name: '史诗盲盒', price: '500 SUI', emoji: '💎' },
              ].map((box) => (
                <motion.button
                  key={box.type}
                  onClick={() => handleOpenBox(box.type)}
                  disabled={isOpening || !connected}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isOpening || !connected
                      ? 'border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed'
                      : 'border-violet-500 bg-violet-500/10 hover:border-violet-400'
                  }`}
                >
                  <div className="text-4xl mb-2">{box.emoji}</div>
                  <div className="font-bold text-sm">{box.name}</div>
                  <div className="text-violet-400 text-sm">{box.price}</div>
                </motion.button>
              ))}
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center text-red-400">
                {error}
              </div>
            )}

            {/* 开盒结果区 */}
            <motion.div 
              className="relative bg-gray-900/80 rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center"
              style={{ background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)' }}
            >
              <AnimatePresence mode="wait">
                {showResult && result ? (
                  <motion.div
                    key="result"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="text-center z-10"
                  >
                    <div className="text-6xl mb-4">
                      {result.rarity === 'SSR' ? '🌟' : result.rarity === 'SR' ? '✨' : '💫'}
                    </div>
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`inline-block px-8 py-3 rounded-2xl font-bold text-2xl mb-4 bg-gradient-to-r ${rarityColors[result.rarity]} text-white`}
                    >
                      {result.rarity}
                    </motion.div>
                    {result.image && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="w-40 h-40 mx-auto mb-4 relative"
                      >
                        <img src={result.image} alt={result.name} className="w-full h-full object-contain" />
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-bold"
                    >
                      {result.name}
                    </motion.div>
                    {result.txDigest && (
                      <a 
                        href={`https://suivision.xyz/tx/${result.txDigest}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gray-400 mt-2 hover:text-white"
                      >
                        查看交易 <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
                      className="text-[120px] leading-none mb-4"
                    >
                      {isOpening ? '🎁' : '❓'}
                    </motion.div>
                    <div className="text-xl text-gray-400">
                      {isOpening ? '抽奖中...' : '选择一个盲盒开始'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 抽奖按钮 */}
              {connected && !showResult && (
                <motion.button
                  onClick={() => handleOpenBox('common')}
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
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
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
              )}
            </motion.div>

            {/* 概率卡片 */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { rate: '44%', name: '感谢参与', color: 'gray' },
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
