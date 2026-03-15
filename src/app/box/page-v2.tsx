'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Users, Wallet, Zap, Shield, Hash, Star, CheckCircle, Clock, Layers, ChevronRight } from 'lucide-react';

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

const rarityColors: Record<string, string> = {
  SSR: 'from-yellow-500 via-orange-500 to-red-500',
  SR: 'from-purple-500 to-pink-500',
  R: 'from-blue-500 to-cyan-500',
};

export default function BoxPage() {
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{ name: string; rarity: string; image: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [myFragments, setMyFragments] = useState(fragmentData);

  // 邀请进度
  const [inviteProgress, setInviteProgress] = useState({
    friend1: true,
    friend3: false,
    friend15: false,
  });

  // 开盒
  const handleOpenBox = () => {
    if (isOpening) return;
    setIsOpening(true);
    setResult(null);
    setShowResult(false);

    setTimeout(() => {
      const rand = Math.random();
      let nft;
      
      if (rand < 0.01) nft = nftData[2]; // 1% 史诗
      else if (rand < 0.16) nft = nftData[1]; // 15% 稀有
      else if (rand < 0.56) nft = nftData[0]; // 40% 普通
      else nft = null; // 44% 感谢参与

      setResult(nft);
      setShowResult(true);
      
      // 添加碎片
      if (nft) {
        const type = nft.rarity === 'SSR' ? 'epic' : nft.rarity === 'SR' ? 'rare' : 'common';
        setMyFragments(prev => ({
          ...prev,
          [type]: { ...prev[type], count: prev[type].count + 1 }
        }));
      }
      
      setTimeout(() => setIsOpening(false), 500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* 左侧：开盒区域 */}
          <div className="md:col-span-2 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NFT盲盒</h1>
                <p className="text-gray-400 text-sm">Sui Randomness 随机数</p>
              </div>
            </div>

            {/* 开盒结果区 */}
            <div className="bg-gray-900/80 rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
              {/* 背景光效 */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10" />
              
              {/* 结果展示 */}
              <AnimatePresence>
                {showResult && result ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 text-center"
                  >
                    <div className="w-48 h-48 mx-auto mb-4 relative">
                      <img src={result.image} alt={result.name} className="w-full h-full object-contain" />
                    </div>
                    <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${rarityColors[result.rarity]} text-white font-bold mb-2`}>
                      {result.rarity} - {result.name}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center relative z-10">
                    <motion.div
                      animate={isOpening ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 0.5, repeat: isOpening ? Infinity : 0 }}
                      className="text-8xl mb-4"
                    >
                      {isOpening ? '🎁' : '❓'}
                    </motion.div>
                    <div className="text-gray-400">
                      {isOpening ? '抽奖中...' : '点击下方按钮开始'}
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* 按钮 */}
              <button
                onClick={handleOpenBox}
                disabled={isOpening}
                className={`mt-8 px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${
                  isOpening 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400'
                }`}
              >
                {isOpening ? (
                  <><Zap className="w-5 h-5 animate-spin" /> 抽奖中...</>
                ) : (
                  <><Gift className="w-5 h-5" /> 开启盲盒</>
                )}
              </button>
            </div>

            {/* 概率公示 */}
            <div className="bg-gray-900/50 rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3">概率公示</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-gray-400">44%</div>
                  <div className="text-xs text-gray-500">感谢参与</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-400">40%</div>
                  <div className="text-xs text-gray-500">普通碎片</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-purple-400">15%</div>
                  <div className="text-xs text-gray-500">稀有碎片</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-amber-400">1%</div>
                  <div className="text-xs text-gray-500">史诗碎片</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：状态区 */}
          <div className="space-y-4">
            {/* 邀请进度 */}
            <div className="bg-gray-900/80 rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                邀请进度
              </h3>
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-2 rounded-lg ${inviteProgress.friend1 ? 'bg-green-500/20' : 'bg-black/30'}`}>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-400" />
                    <span className="text-sm">1位好友抽盲盒</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {inviteProgress.friend1 && <CheckCircle className="w-4 h-4 text-green-400" />}
                    <span className="text-green-400 text-sm font-bold">+2</span>
                  </div>
                </div>
                <div className={`flex items-center justify-between p-2 rounded-lg ${inviteProgress.friend3 ? 'bg-green-500/20' : 'bg-black/30'}`}>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-400" />
                    <span className="text-sm">3位好友抽盲盒</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {inviteProgress.friend3 && <CheckCircle className="w-4 h-4 text-green-400" />}
                    <span className="text-green-400 text-sm font-bold">+3</span>
                  </div>
                </div>
                <div className={`flex items-center justify-between p-2 rounded-lg ${inviteProgress.friend15 ? 'bg-green-500/20' : 'bg-black/30'}`}>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-sm">15位好友抽盲盒</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {inviteProgress.friend15 && <CheckCircle className="w-4 h-4 text-green-400" />}
                    <span className="text-green-400 text-sm font-bold">+5</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 text-center text-sm text-gray-400">
                今日已获邀请奖励：<span className="text-green-400 font-bold">+2</span>
              </div>
            </div>

            {/* 我的碎片 */}
            <div className="bg-gray-900/80 rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                我的碎片
              </h3>
              <div className="space-y-2">
                {Object.entries(myFragments).map(([key, data]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={key === 'common' ? '/fragment-common.png' : key === 'rare' ? '/fragment-rare.png' : '/fragment-epic.png'} alt={data.name} className="w-8 h-8 object-contain" />
                      <span className="text-sm">{data.name}</span>
                    </div>
                    <span className={`font-bold ${key === 'common' ? 'text-gray-400' : key === 'rare' ? 'text-blue-400' : 'text-amber-400'}`}>
                      {data.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
