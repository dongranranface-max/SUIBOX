'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Star, Crown, TrendingUp, Gift as FreeIcon } from 'lucide-react';
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

const INVITE_REWARDS = [
  { uniqueFriends: 1, freeOpens: 1, label: '1人开=1次' },
  { uniqueFriends: 5, freeOpens: 2, label: '5人开=2次' },
  { uniqueFriends: 10, freeOpens: 3, label: '10人开=3次' },
];

// ==================== 组件 ====================

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percent = Math.min((value / max) * 100, 100);
  
  return (
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5 }}
        className={`h-full bg-gradient-to-r ${color}`}
      />
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
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Gift className="w-20 h-20 text-white drop-shadow-lg" />
        </motion.div>
        {type === 'epic' && (
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute top-2 right-2">
            <Crown className="w-6 h-6 text-yellow-300" />
          </motion.div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1">{config.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{config.desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-400">{config.price} SUI</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            disabled={disabled || isOpening}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold disabled:opacity-40 flex items-center gap-2"
          >
            {isOpening ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            开盒
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ResultModal({ result, onClose }: { result: { type: string; rarity: string; txDigest?: string } | null; onClose: () => void }) {
  if (!result) return null;
  const fragment = FRAGMENT_TYPES[result.type as keyof typeof FRAGMENT_TYPES] || FRAGMENT_TYPES.none;
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-gray-900 rounded-3xl p-10 text-center border-2 border-gray-800" onClick={e => e.stopPropagation()}>
        <div className="text-8xl mb-6">{fragment.icon}</div>
        <h2 className="text-3xl font-bold mb-2">{fragment.name}</h2>
        <p className="text-2xl font-bold mb-6 text-yellow-400">{fragment.rarity}</p>
        {result.txDigest && <p className="text-xs text-gray-500 mb-6">🔗 {result.txDigest.slice(0, 30)}...</p>}
        <button onClick={onClose} className="px-10 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold">收下奖励</button>
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
  const [loading, setLoading] = useState(true);
  
  // 后端数据
  const [userData, setUserData] = useState({
    inviteCode: '',
    inviteCount: 0,
    uniqueFriendsToday: 0,
    dailyFreeCount: 1,
    inviteBonus: 0,
    totalDailyCount: 1,
    noneCount: 0,
    totalOpens: 0,
    fragments: { common: 0, rare: 0, epic: 0 },
  });

  // 从后端获取数据
  const fetchUserData = useCallback(async () => {
    if (!wallet.account?.address) return;
    
    try {
      const res = await fetch(`/api/box?address=${wallet.account.address}`);
      const data = await res.json();
      setUserData(data);
    } catch (e) {
      console.error('获取用户数据失败', e);
    } finally {
      setLoading(false);
    }
  }, [wallet.account?.address]);

  useEffect(() => {
    if (wallet.connected) {
      fetchUserData();
    }
  }, [wallet.connected, fetchUserData]);

  const canOpen = userData.totalDailyCount > 0 && wallet.connected;

  const handleOpenBox = useCallback(async (boxType: 'common' | 'rare' | 'epic') => {
    if (!wallet.connected) {
      setError('请先连接SUI钱包！');
      return;
    }
    
    if (userData.totalDailyCount <= 0) {
      setError('今日开盒次数已用完！');
      return;
    }
    
    setError(null);
    setIsOpening(true);
    setResult(null);
    setShowResult(false);

    try {
      // 调用后端API开盲盒
      const res = await fetch('/api/box', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address: wallet.account?.address, 
          action: 'open_box' 
        }),
      });
      
      if (!res.ok) throw new Error('开盲盒失败');
      
      // 模拟开盒结果（实际应该从链上获取）
      await new Promise(r => setTimeout(r, 2500));
      
      const rand = Math.random() * 100;
      let resultType: string;
      let rarity: string;
      
      if (userData.noneCount >= GUARANTEE.epic) {
        resultType = 'epic'; rarity = 'SSR';
      } else if (userData.noneCount >= GUARANTEE.rare) {
        resultType = 'rare'; rarity = 'SR';
      } else if (userData.noneCount >= GUARANTEE.common) {
        resultType = 'common'; rarity = 'R';
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

      setResult({ type: resultType, rarity, txDigest: `0x${Date.now()}` });
      setShowResult(true);
      
      // 刷新用户数据
      fetchUserData();
      
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '开盲盒失败');
    }
    
    setIsOpening(false);
  }, [wallet.connected, wallet.account?.address, userData.totalDailyCount, userData.noneCount, fetchUserData]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
            NFT 盲盒
          </h1>
          <p className="text-gray-400">基于 SUI 区块链 · 公开透明随机</p>
        </div>

        {/* 用户数据 */}
        {wallet.connected && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/80 rounded-2xl p-6 mb-8 border border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <FreeIcon className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-gray-400 text-xs">每日免费</p>
                <p className="text-3xl font-bold text-green-400">{userData.dailyFreeCount}次</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-violet-400" />
                <p className="text-gray-400 text-xs">邀请奖励</p>
                <p className="text-3xl font-bold text-violet-400">+{userData.inviteBonus}次</p>
              </div>
              <div className="text-center">
                <Gift className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-gray-400 text-xs">今日不同好友</p>
                <p className="text-3xl font-bold text-blue-400">{userData.uniqueFriendsToday}人</p>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-gray-400 text-xs">今日可开</p>
                <p className="text-3xl font-bold text-yellow-400">{userData.totalDailyCount}次</p>
              </div>
            </div>

            {/* 邀请奖励进度 */}
            <div className="bg-gray-800/50 rounded-xl p-3 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">邀请奖励进度</span>
                <span className={userData.uniqueFriendsToday >= 10 ? 'text-green-400' : userData.uniqueFriendsToday >= 5 ? 'text-green-400' : 'text-gray-400'}>
                  {userData.uniqueFriendsToday >= 10 ? '已达成最高' : userData.uniqueFriendsToday >= 5 ? '+2次' : userData.uniqueFriendsToday >= 1 ? '+1次' : '未达成'}
                </span>
              </div>
              <ProgressBar value={userData.uniqueFriendsToday} max={10} color="from-green-500 to-green-600" />
            </div>

            {/* 保底进度 */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">保底进度</span>
                <span className={userData.noneCount >= 35 ? 'text-yellow-400' : userData.noneCount >= 7 ? 'text-purple-400' : userData.noneCount >= 3 ? 'text-blue-400' : 'text-gray-400'}>
                  {userData.noneCount >= 35 ? '必中史诗！' : userData.noneCount >= 7 ? '必中稀有！' : userData.noneCount >= 3 ? '必中普通！' : `${userData.noneCount}/35`}
                </span>
              </div>
              <ProgressBar value={userData.noneCount} max={35} color={userData.noneCount >= 35 ? 'from-yellow-500 to-yellow-600' : userData.noneCount >= 7 ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'} />
            </div>

            {/* 碎片 */}
            <div className="flex justify-center gap-8 pt-4 border-t border-gray-800">
              {[{ icon: '🎯', count: userData.fragments.common, name: '普通' }, { icon: '⭐', count: userData.fragments.rare, name: '稀有' }, { icon: '💎', count: userData.fragments.epic, name: '史诗' }].map(item => (
                <div key={item.name} className="text-center">
                  <div className="text-3xl">{item.icon}</div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs text-gray-500">{item.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 连接钱包 */}
        {!wallet.connected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-violet-900/50 border border-violet-500/30 rounded-2xl p-8 mb-8 text-center">
            <p className="text-xl mb-4 text-violet-300">连接钱包开始抽取盲盒</p>
            <ConnectButton />
          </motion.div>
        )}

        {/* 错误 */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}

        {/* 盲盒卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {(['common', 'rare', 'epic'] as const).map(type => (
            <BoxCard key={type} type={type} onOpen={() => handleOpenBox(type)} disabled={!canOpen} isOpening={isOpening} />
          ))}
        </div>

        {/* 概率 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/80 rounded-2xl p-6 border border-gray-800">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" />概率公示 · 保底机制</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ icon: '🎯', name: '普通碎片', prob: '40%', g: '3次' }, { icon: '⭐', name: '稀有碎片', prob: '19%', g: '7次' }, { icon: '💎', name: '史诗碎片', prob: '1%', g: '35次' }, { icon: '🙏', name: '感谢参与', prob: '40%', g: '-' }].map(item => (
              <div key={item.name} className="text-center p-4 bg-gray-800/50 rounded-xl">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-yellow-400 font-bold">{item.prob}</p>
                {item.g !== '-' && <p className="text-xs text-gray-500">保底{item.g}</p>}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>{showResult && result && <ResultModal result={result} onClose={() => setShowResult(false)} />}</AnimatePresence>
      </div>
    </div>
  );
}
