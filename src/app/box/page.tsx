'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Calendar, Star, RefreshCw } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

// ==================== 配置 ====================

// 碎片数据
const FRAGMENT_TYPES = {
  common: { name: '普通碎片', rarity: 'R', color: 'from-gray-500 to-gray-600', icon: '🎯' },
  rare: { name: '稀有碎片', rarity: 'SR', color: 'from-blue-500 to-cyan-500', icon: '⭐' },
  epic: { name: '史诗碎片', rarity: 'SSR', color: 'from-yellow-500 to-amber-500', icon: '💎' },
  none: { name: '感谢参与', rarity: '谢谢参与', color: 'from-gray-700 to-gray-800', icon: '🙏' },
};

// 概率配置
const PROBABILITY = {
  common: 40,    // 40%
  rare: 19,      // 19%
  epic: 1,       // 1%
  none: 40,     // 40%
};

// 保底配置
const GUARANTEE = {
  common: 3,   // 3次感谢参与 → 必得普通
  rare: 7,     // 7次 → 必得稀有
  epic: 35,    // 35次 → 必得史诗
};

// 盒子价格配置
const BOX_CONFIG = {
  common: { name: '普通盲盒', price: 1, desc: '基础奖励', color: 'from-gray-500 to-gray-600' },
  rare: { name: '稀有盲盒', price: 5, desc: '更高几率稀有', color: 'from-blue-500 to-cyan-500' },
  epic: { name: '史诗盲盒', nameEn: 'Epic', price: 10, desc: '最高1%史诗', color: 'from-yellow-500 to-amber-500' },
};

// ==================== 组件 ====================

function BoxCard({ type, onOpen, disabled, isOpening }: { 
  type: 'common' | 'rare' | 'epic'; 
  onOpen: () => void; 
  disabled: boolean;
  isOpening: boolean;
}) {
  const config = BOX_CONFIG[type];
  
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className="bg-gray-900 rounded-2xl overflow-hidden"
    >
      <div className={`h-32 bg-gradient-to-br ${config.color} flex items-center justify-center`}>
        <Gift className="w-16 h-16 text-white" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{config.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{config.desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-400">{config.price} SUI</span>
          <button
            onClick={onOpen}
            disabled={disabled || isOpening}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isOpening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            开盒
          </button>
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
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="bg-gray-900 rounded-2xl p-8 max-w-md text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className={`text-6xl mb-4 ${fragment.color} bg-clip-text text-transparent`}>
          {fragment.icon}
        </div>
        <h2 className="text-2xl font-bold mb-2">{fragment.name}</h2>
        <p className={`text-lg font-bold mb-4 ${fragment.color.replace('from-', 'text-').replace(' to-', '-')}`}>
          {fragment.rarity}
        </p>
        {result.txDigest && (
          <p className="text-xs text-gray-500 mb-4 break-all">
            🔗 {result.txDigest.slice(0, 30)}...
          </p>
        )}
        <button
          onClick={onClose}
          className="px-8 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg font-bold"
        >
          确认
        </button>
      </motion.div>
    </motion.div>
  );
}

// ==================== 主页面 ====================

export default function BoxPage() {
  const wallet = useWallet();
  
  // 状态
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{ type: string; rarity: string; txDigest?: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 用户数据（模拟）
  const [userData, setUserData] = useState({
    dailyFreeUsed: false,
    dailyCount: 1,
    maxDaily: 1,
    inviteCount: 0,
    noneCount: 0,
    totalOpens: 0,
    fragments: { common: 0, rare: 0, epic: 0 },
  });

  // 检查是否还能开盒
  const canOpen = userData.dailyCount > 0 && wallet.connected;

  // 开盲盒逻辑
  const handleOpenBox = useCallback(async (boxType: 'common' | 'rare' | 'epic') => {
    if (!wallet.connected) {
      setError('请先连接SUI钱包！');
      return;
    }
    
    if (userData.dailyCount <= 0) {
      setError('今日开盒次数已用完，请明天再来或邀请好友！');
      return;
    }
    
    setError(null);
    setIsOpening(true);
    setResult(null);
    setShowResult(false);

    try {
      // 模拟链上随机（实际应该调用合约的 SUI Randomness）
      await new Promise(r => setTimeout(r, 2000));
      
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
        // 正常概率
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

      // 生成模拟交易哈希
      const txDigest = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 58)}`;
      
      // 更新用户数据
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
      console.error('开盲盒失败:', e);
      setError(e instanceof Error ? e.message : '开盲盒失败');
    }
    
    setIsOpening(false);
  }, [wallet.connected, userData.dailyCount, userData.noneCount]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* 标题 */}
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
          <p className="text-gray-400">SUI Devnet 链上随机 · 公开透明</p>
        </div>

        {/* 用户数据面板 */}
        {wallet.connected && (
          <div className="bg-gray-900 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs">今日次数</p>
                <p className="text-2xl font-bold text-yellow-400">{userData.dailyCount}/{userData.maxDaily}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">已邀请</p>
                <p className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />{userData.inviteCount}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">保底进度</p>
                <p className="text-2xl font-bold text-purple-400">{userData.noneCount}/{GUARANTEE.common}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">累计抽取</p>
                <p className="text-2xl font-bold text-green-400">{userData.totalOpens}</p>
              </div>
            </div>
          </div>
        )}

        {/* 碎片展示 */}
        {wallet.connected && (
          <div className="bg-gray-900 rounded-xl p-4 mb-6">
            <p className="text-gray-400 text-sm mb-3">我的碎片</p>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <span className="text-2xl">🎯</span>
                <p className="text-gray-400 text-sm">普通: {userData.fragments.common}</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">⭐</span>
                <p className="text-gray-400 text-sm">稀有: {userData.fragments.rare}</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">💎</span>
                <p className="text-gray-400 text-sm">史诗: {userData.fragments.epic}</p>
              </div>
            </div>
          </div>
        )}

        {/* 连接钱包 */}
        {!wallet.connected && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6 text-center">
            <p className="text-amber-400 mb-4">请先连接SUI钱包体验链上开盲盒！</p>
            <ConnectButton />
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* 盲盒卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            概率公示
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-2xl mb-1">🎯</p>
              <p className="font-bold">普通碎片</p>
              <p className="text-gray-400 text-sm">40%</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-2xl mb-1">⭐</p>
              <p className="font-bold">稀有碎片</p>
              <p className="text-gray-400 text-sm">19%</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-2xl mb-1">💎</p>
              <p className="font-bold">史诗碎片</p>
              <p className="text-gray-400 text-sm">1%</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-2xl mb-1">🙏</p>
              <p className="font-bold">感谢参与</p>
              <p className="text-gray-400 text-sm">40%</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-purple-900/30 rounded-lg">
            <p className="text-purple-400 text-sm">
              <Star className="w-4 h-4 inline mr-1" />
              保底机制：3次感谢→普通 | 7次感谢→稀有 | 35次感谢→史诗
            </p>
          </div>
        </div>

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
