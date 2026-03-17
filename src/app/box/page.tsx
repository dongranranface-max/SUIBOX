'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Star, Crown, TrendingUp, Flame, Gift as FreeIcon } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

// ==================== 配置 ====================

const FRAGMENT_TYPES = {
  common: { name: '普通碎片', rarity: 'R', color: 'from-gray-500 to-gray-600', icon: '🎯' },
  rare: { name: '稀有碎片', rarity: 'SR', color: 'from-blue-500 to-cyan-500', icon: '⭐' },
  epic: { name: '史诗碎片', rarity: 'SSR', color: 'from-yellow-500 to-amber-500', icon: '💎' },
  none: { name: '感谢参与', rarity: '谢谢参与', color: 'from-gray-700 to-gray-800', icon: '🙏' },
};

const BOX_CONFIG = {
  common: { name: '普通盲盒', price: 1, desc: '普通奖励', color: 'from-gray-500 to-gray-600' },
  rare: { name: '稀有盲盒', price: 5, desc: '稀有奖励', color: 'from-blue-500 to-cyan-500' },
  epic: { name: '史诗盲盒', price: 10, desc: '史诗奖励', color: 'from-yellow-500 to-amber-500' },
};

const GUARANTEE = {
  common: 3,
  rare: 7,
  epic: 35,
};

// 邀请奖励规则
const INVITE_REWARDS = [
  { minFriends: 1, freeOpens: 1, label: '1人开=1次' },
  { minFriends: 5, freeOpens: 2, label: '5人开=2次' },
  { minFriends: 10, freeOpens: 3, label: '10人开=3次' },
];

// ==================== 组件 ====================

function ProgressBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const percent = Math.min((value / max) * 100, 100);
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className={color}>{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full bg-gradient-to-r ${color.replace('text-', 'from-').replace('-400', '-500')} to-transparent`}
        />
      </div>
    </div>
  );
}

function BoxCard({ type, onOpen, disabled, isOpening }: { 
  type: 'common' | 'rare' | 'epic'; 
  onOpen: () => void; 
  disabled: boolean;
  isOpening: boolean;
}) {
  const config = BOX_CONFIG[type];
  
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03, y: -5 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
    >
      <div className={`h-40 bg-gradient-to-br ${config.color} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gift className="w-20 h-20 text-white drop-shadow-lg" />
        </motion.div>
        {type === 'epic' && (
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-2 right-2"
          >
            <Crown className="w-6 h-6 text-yellow-300" />
          </motion.div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1">{config.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{config.desc}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">{config.price} SUI</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            disabled={disabled || isOpening}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-violet-900/30"
          >
            {isOpening ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            开盒
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ResultModal({ result, onClose }: { 
  result: { type: string; rarity: string; txDigest?: string } | null; 
  onClose: () => void;
}) {
  if (!result) return null;
  
  const fragment = FRAGMENT_TYPES[result.type as keyof typeof FRAGMENT_TYPES] || FRAGMENT_TYPES.none;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="bg-gray-900 rounded-3xl p-10 max-w-md text-center border-2 border-gray-800 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${fragment.color.replace('from-', 'from-').replace('to-', 'to-')}/20`} />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative z-10"
        >
          <motion.div 
            animate={{ 
              boxShadow: result.type !== 'none' 
                ? ['0 0 20px rgba(255,255,255,0.3)', '0 0 60px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.3)']
                : 'none'
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-8xl mb-6 inline-block"
          >
            {fragment.icon}
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {fragment.name}
          </h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`text-2xl font-bold mb-6 ${
              result.type === 'epic' ? 'text-yellow-400' :
              result.type === 'rare' ? 'text-blue-400' :
              result.type === 'common' ? 'text-gray-300' :
              'text-gray-500'
            }`}
          >
            {fragment.rarity}
          </motion.p>
          
          {result.txDigest && (
            <p className="text-xs text-gray-500 mb-6 break-all bg-gray-800 p-2 rounded">
              🔗 {result.txDigest.slice(0, 40)}...
            </p>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-10 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold shadow-lg"
          >
            收下奖励
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ==================== 主页面 ====================

export default function BoxPage() {
  const wallet = useWallet();
  
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{ type: string; rarity: string; txDigest?: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 用户数据
  const [userData, setUserData] = useState({
    dailyCount: 1,        // 每日免费1次
    maxDaily: 1,
    inviteCount: 5,       // 邀请了5人（模拟）
    friendsOpenedToday: 3, // 今日好友开盒数（模拟）
    noneCount: 0,
    totalOpens: 0,
    fragments: { common: 0, rare: 0, epic: 0 },
  });

  // 根据好友开盒数计算额外奖励
  const getInviteBonus = (friendsOpened: number) => {
    if (friendsOpened >= 10) return 3;
    if (friendsOpened >= 5) return 2;
    if (friendsOpened >= 1) return 1;
    return 0;
  };

  const inviteBonus = getInviteBonus(userData.friendsOpenedToday);
  const totalDailyCount = userData.dailyCount + inviteBonus;
  const canOpen = totalDailyCount > 0 && wallet.connected;

  const handleOpenBox = useCallback(async (boxType: 'common' | 'rare' | 'epic') => {
    if (!wallet.connected) {
      setError('请先连接SUI钱包！');
      return;
    }
    
    if (totalDailyCount <= 0) {
      setError('今日开盒次数已用完！');
      return;
    }
    
    setError(null);
    setIsOpening(true);
    setResult(null);
    setShowResult(false);

    try {
      await new Promise(r => setTimeout(r, 2500));
      
      const rand = Math.random() * 100;
      let resultType: string;
      let rarity: string;
      
      // 保底逻辑
      if (userData.noneCount >= GUARANTEE.epic) {
        resultType = 'epic';
        rarity = 'SSR';
      } else if (userData.noneCount >= GUARANTEE.rare) {
        resultType = 'rare';
        rarity = 'SR';
      } else if (userData.noneCount >= GUARANTEE.common) {
        resultType = 'common';
        rarity = 'R';
      } else {
        if (boxType === 'epic') {
          if (rand < 1) { resultType = 'epic'; rarity = 'SSR'; }
          else if (rand < 20) { resultType = 'rare'; rarity = 'SR'; }
          else if (rand < 60) { resultType = 'common'; rarity = 'R'; }
          else { resultType = 'none'; rarity = '谢谢参与'; }
        } else if (boxType === 'rare') {
          if (rand < 3) { resultType = 'rare'; rarity = 'SR'; }
          else if (rand < 43) { resultType = 'common'; rarity = 'R'; }
          else { resultType = 'none'; rarity = '谢谢参与'; }
        } else {
          if (rand < 10) { resultType = 'rare'; rarity = 'SR'; }
          else if (rand < 50) { resultType = 'common'; rarity = 'R'; }
          else { resultType = 'none'; rarity = '谢谢参与'; }
        }
      }

      const txDigest = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 58)}`;
      
      setUserData(prev => {
        const newNoneCount = resultType === 'none' ? prev.noneCount + 1 : 0;
        return {
          ...prev,
          dailyCount: prev.dailyCount - 1,
          noneCount: newNoneCount,
          totalOpens: prev.totalOpens + 1,
          fragments: resultType !== 'none' ? {
            ...prev.fragments,
            [resultType]: prev.fragments[resultType as keyof typeof prev.fragments] + 1
          } : prev.fragments
        };
      });

      setResult({ type: resultType, rarity, txDigest });
      setShowResult(true);
      
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '开盲盒失败');
    }
    
    setIsOpening(false);
  }, [wallet.connected, totalDailyCount, userData.noneCount]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* 标题 */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-4 mb-3"
          >
            <motion.span 
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              🎁
            </motion.span>
            <h1 className="text-5xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              NFT 盲盒
            </h1>
            <motion.span 
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              💎
            </motion.span>
          </motion.div>
          <p className="text-gray-400">基于 SUI 区块链 · 公开透明随机</p>
        </div>

        {/* 用户数据面板 */}
        {wallet.connected && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 mb-8 border border-gray-800"
          >
            {/* 免费次数 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <FreeIcon className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-400 text-xs mb-1">每日免费</p>
                <p className="text-3xl font-bold text-green-400">{userData.dailyCount} <span className="text-lg text-gray-500">次</span></p>
              </div>
              
              {/* 邀请奖励 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-400 text-xs mb-1">邀请奖励</p>
                <p className="text-3xl font-bold text-violet-400">+{inviteBonus} <span className="text-lg text-gray-500">次</span></p>
              </div>
              
              {/* 好友开盒 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-400 text-xs mb-1">今日好友开盒</p>
                <p className="text-3xl font-bold text-blue-400">{userData.friendsOpenedToday} <span className="text-lg text-gray-500">人</span></p>
              </div>
              
              {/* 总次数 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-400 text-xs mb-1">今日可开</p>
                <p className="text-3xl font-bold text-yellow-400">{totalDailyCount} <span className="text-lg text-gray-500">次</span></p>
              </div>
            </div>

            {/* 邀请奖励说明 */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">📋 邀请奖励规则（好友开盒即得）</p>
              <div className="flex justify-center gap-4 text-xs">
                {INVITE_REWARDS.map((reward, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full ${userData.friendsOpenedToday >= reward.minFriends ? 'bg-green-600' : 'bg-gray-700'}`}>
                    {reward.label}
                  </span>
                ))}
              </div>
            </div>

            {/* 保底进度 */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <p className="text-gray-400 text-sm">保底进度</p>
              </div>
              <ProgressBar 
                value={userData.noneCount} 
                max={GUARANTEE.epic} 
                label="" 
                color={
                  userData.noneCount >= GUARANTEE.epic ? 'text-yellow-400' :
                  userData.noneCount >= GUARANTEE.rare ? 'text-purple-400' :
                  userData.noneCount >= GUARANTEE.common ? 'text-blue-400' :
                  'text-gray-400'
                }
              />
              <p className="text-center text-xs text-gray-500">
                {userData.noneCount >= GUARANTEE.epic ? '🎉 下一发必中史诗！' :
                 userData.noneCount >= GUARANTEE.rare ? '⭐ 下一发必中稀有！' :
                 userData.noneCount >= GUARANTEE.common ? '🎯 ' + (GUARANTEE.common - userData.noneCount) + '发必中普通！' :
                 '🔄 继续努力'}
              </p>
            </div>

            {/* 碎片展示 */}
            <div className="pt-6 border-t border-gray-800">
              <p className="text-gray-400 text-sm mb-3 flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                我的碎片
              </p>
              <div className="flex justify-center gap-8">
                {[
                  { type: 'common', icon: '🎯', count: userData.fragments.common },
                  { type: 'rare', icon: '⭐', count: userData.fragments.rare },
                  { type: 'epic', icon: '💎', count: userData.fragments.epic },
                ].map(item => (
                  <motion.div 
                    key={item.type}
                    whileHover={{ scale: 1.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl mb-1">{item.icon}</div>
                    <p className="text-2xl font-bold">{item.count}</p>
                    <p className="text-xs text-gray-500">{item.type === 'common' ? '普通' : item.type === 'rare' ? '稀有' : '史诗'}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 连接钱包 */}
        {!wallet.connected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-violet-900/50 to-pink-900/50 border border-violet-500/30 rounded-2xl p-8 mb-8 text-center"
          >
            <p className="text-xl mb-4 text-violet-300">连接钱包开始抽取盲盒</p>
            <div className="inline-block">
              <ConnectButton />
            </div>
          </motion.div>
        )}

        {/* 错误提示 */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}

        {/* 盲盒卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {(['common', 'rare', 'epic'] as const).map(type => (
            <BoxCard
              key={type}
              type={type}
              onOpen={() => handleOpenBox(type)}
              disabled={!canOpen}
              isOpening={isOpening}
            />
          ))}
        </div>

        {/* 概率说明 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800"
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            概率公示 · 保底机制
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'common', icon: '🎯', name: '普通碎片', prob: '40%', guarantee: '3次' },
              { type: 'rare', icon: '⭐', name: '稀有碎片', prob: '19%', guarantee: '7次' },
              { type: 'epic', icon: '💎', name: '史诗碎片', prob: '1%', guarantee: '35次' },
              { type: 'none', icon: '🙏', name: '感谢参与', prob: '40%', guarantee: '-' },
            ].map(item => (
              <div key={item.type} className="text-center p-4 bg-gray-800/50 rounded-xl">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-yellow-400 font-bold">{item.prob}</p>
                {item.guarantee !== '-' && (
                  <p className="text-xs text-gray-500">保底{item.guarantee}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 开盒结果弹窗 */}
        <AnimatePresence>
          {showResult && result && (
            <ResultModal result={result} onClose={() => setShowResult(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
