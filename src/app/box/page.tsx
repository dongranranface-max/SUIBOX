'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Star, Crown, TrendingUp, Gift as FreeIcon, Wallet, Sparkles } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

// ==================== 规则配置 ====================

// 概率配置
const PROBABILITY = {
  common: 40,   // 普通碎片 40%
  rare: 19,     // 稀有碎片 19%
  epic: 1,      // 史诗碎片 1%
  none: 40,     // 感谢参与 40%
};

// 保底配置
const GUARANTEE = {
  common: 3,    // 3次感谢 → 普通
  rare: 7,      // 7次感谢 → 稀有
  epic: 35,     // 35次感谢 → 史诗
};

// 邀请奖励配置
const INVITE_REWARDS = [
  { friends: 1, bonus: 1 },
  { friends: 5, bonus: 2 },
  { friends: 10, bonus: 3 },
];

// ==================== 碎片类型 ====================

const FRAGMENT = {
  common: { name: '普通碎片', rarity: 'R', icon: '🎯', color: 'from-gray-400 to-gray-600', text: 'text-gray-300' },
  rare: { name: '稀有碎片', rarity: 'SR', icon: '⭐', color: 'from-blue-400 to-cyan-600', text: 'text-blue-400' },
  epic: { name: '史诗碎片', rarity: 'SSR', icon: '💎', color: 'from-yellow-400 to-amber-600', text: 'text-yellow-400' },
  none: { name: '感谢参与', rarity: '谢谢参与', icon: '🙏', color: 'from-gray-600 to-gray-800', text: 'text-gray-500' },
};

// ==================== 组件 ====================

// 进度条组件
function ProgressBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">{label}</span>
        <span className={color}>{value}/{max}</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${percent}%` }} 
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`} 
        />
      </div>
    </div>
  );
}

// 盲盒卡片组件
function BoxCard({ type, onOpen, disabled, isOpening }: { 
  type: 'common' | 'rare' | 'epic'; 
  onOpen: () => void; 
  disabled: boolean;
  isOpening: boolean;
}) {
  const configs = {
    common: { name: '普通盲盒', price: '免费', icon: '🎯', color: 'from-gray-500 to-gray-700', glow: 'shadow-gray-500/20' },
    rare: { name: '稀有盲盒', price: '免费', icon: '⭐', color: 'from-blue-500 to-cyan-700', glow: 'shadow-blue-500/30' },
    epic: { name: '史诗盲盒', price: '免费', icon: '💎', color: 'from-yellow-500 to-orange-700', glow: 'shadow-yellow-500/40' },
  };
  const config = configs[type];
  
  return (
    <motion.div 
      whileHover={{ scale: disabled ? 1 : 1.03, y: -8 }} 
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all"
    >
      {/* 卡面 */}
      <div className={`h-56 bg-gradient-to-br ${config.color} relative flex items-center justify-center overflow-hidden`}>
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        
        {/* 图标动画 */}
        <motion.div 
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-7xl filter drop-shadow-2xl">{config.icon}</span>
        </motion.div>
        
        {/* 史诗特效 */}
        {type === 'epic' && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute top-4 right-4"
          >
            <Crown className="w-10 h-10 text-yellow-300" />
          </motion.div>
        )}
        
        {/* 免费标签 */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-4 py-1.5 rounded-full">
          <span className="text-green-400 font-bold">{config.price}</span>
        </div>
      </div>
      
      {/* 内容 */}
      <div className="p-6">
        <h3 className="text-2xl font-black mb-2">{config.name}</h3>
        
        {/* 概率 */}
        <div className="flex gap-2 mb-4">
          <span className="text-xs bg-gray-800 px-2 py-1 rounded">🎯40%</span>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded">⭐19%</span>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded">💎1%</span>
        </div>
        
        {/* 按钮 */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          disabled={disabled || isOpening}
          className={`w-full py-4 bg-gradient-to-r ${config.color} rounded-xl font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${config.glow}`}
        >
          {isOpening ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Zap className="w-6 h-6" />
              免费开盒
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// 结果弹窗组件
function ResultModal({ result, onClose }: { 
  result: { type: string; rarity: string; txDigest?: string } | null; 
  onClose: () => void;
}) {
  if (!result) return null;
  
  const f = FRAGMENT[result.type as keyof typeof FRAGMENT] || FRAGMENT.none;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="bg-gray-900 rounded-3xl p-10 max-w-sm w-full text-center border-2 border-gray-700 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 背景渐变 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-20`} />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="relative z-10"
        >
          {/* 图标 */}
          <motion.div 
            animate={{ 
              boxShadow: result.type !== 'none' 
                ? ['0 0 20px rgba(255,255,255,0.3)', '0 0 60px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.3)']
                : 'none'
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-8xl mb-6 inline-block"
          >
            {f.icon}
          </motion.div>
          
          {/* 名称 */}
          <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {f.name}
          </h2>
          
          {/* 稀有度 */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl font-bold mb-6 ${f.text}`}
          >
            {f.rarity}
          </motion.p>
          
          {/* 交易哈希 */}
          {result.txDigest && (
            <p className="text-xs text-gray-600 mb-6 font-mono bg-gray-800 p-2 rounded break-all">
              🔗 {result.txDigest.slice(0, 40)}...
            </p>
          )}
          
          {/* 确认按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`w-full py-4 bg-gradient-to-r ${f.color} rounded-xl font-bold text-lg shadow-lg`}
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
  const [loading, setLoading] = useState(true);
  
  // 用户数据
  const [userData, setUserData] = useState({
    dailyFreeCount: 1,           // 每日免费1次
    inviteBonus: 0,             // 邀请奖励次数
    uniqueFriendsToday: 0,        // 今日不同好友数
    noneCount: 0,               // 累计感谢次数
    totalOpens: 0,               // 总开盒数
    fragments: { common: 0, rare: 0, epic: 0 },  // 碎片数量
  });

  // 计算今日总次数
  const totalDailyCount = userData.dailyFreeCount + userData.inviteBonus;
  const canOpen = totalDailyCount > 0 && wallet.connected;

  // 获取用户数据
  const fetchUserData = useCallback(async () => {
    if (!wallet.account?.address) return;
    try {
      const res = await fetch(`/api/box?address=${wallet.account.address}`);
      const data = await res.json();
      setUserData(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [wallet.account?.address]);

  useEffect(() => {
    if (wallet.connected) fetchUserData();
  }, [wallet.connected, fetchUserData]);

  // 开盲盒
  const handleOpenBox = useCallback(async () => {
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
      // 调用后端扣减次数
      await fetch('/api/box', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: wallet.account?.address, action: 'open_box' }),
      });

      // 模拟开盒延迟
      await new Promise(r => setTimeout(r, 2500));
      
      // 随机结果
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
        if (rand < 1) { resultType = 'epic'; rarity = 'SSR'; }
        else if (rand < 20) { resultType = 'rare'; rarity = 'SR'; }
        else if (rand < 60) { resultType = 'common'; rarity = 'R'; }
        else { resultType = 'none'; rarity = '谢谢参与'; }
      }

      // 生成模拟交易哈希
      const txDigest = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 58)}`;
      
      setResult({ type: resultType, rarity, txDigest });
      setShowResult(true);
      
      // 刷新数据
      fetchUserData();
      
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '开盲盒失败');
    }
    
    setIsOpening(false);
  }, [wallet.connected, wallet.account?.address, totalDailyCount, userData.noneCount, fetchUserData]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-900/30 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        {/* 标题 */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-3">
            NFT 盲盒
          </h1>
          <p className="text-gray-400 text-lg">基于 SUI 区块链 · 公开透明随机</p>
        </motion.div>

        {/* 用户数据面板 */}
        {wallet.connected && !loading && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-gray-800"
          >
            {/* 次数统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl p-4 text-center">
                <FreeIcon className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-gray-400 text-xs">每日免费</p>
                <p className="text-3xl font-bold text-green-400">{userData.dailyFreeCount}次</p>
              </div>
              <div className="bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-violet-400" />
                <p className="text-gray-400 text-xs">邀请奖励</p>
                <p className="text-3xl font-bold text-violet-400">+{userData.inviteBonus}次</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-2xl p-4 text-center">
                <Gift className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-gray-400 text-xs">今日好友</p>
                <p className="text-3xl font-bold text-blue-400">{userData.uniqueFriendsToday}人</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-2xl p-4 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-gray-400 text-xs">今日可开</p>
                <p className="text-3xl font-bold text-yellow-400">{totalDailyCount}次</p>
              </div>
            </div>

            {/* 进度条 */}
            <div className="space-y-4 mb-6">
              {/* 邀请进度 */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">邀请奖励进度</span>
                  <span className="text-green-400 text-sm font-bold">
                    {userData.inviteBonus >= 3 ? '🎉 已达成最高 (+3次)' : 
                     userData.inviteBonus >= 2 ? '✅ +2次' : 
                     userData.inviteBonus >= 1 ? '✅ +1次' : '未达成'}
                  </span>
                </div>
                <ProgressBar value={Math.min(userData.uniqueFriendsToday, 10)} max={10} label="" color="from-green-500 to-green-600" />
              </div>

              {/* 保底进度 */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">保底进度</span>
                  <span className="font-bold text-sm">
                    {userData.noneCount >= GUARANTEE.epic ? '🎉 下一发必中史诗！' :
                     userData.noneCount >= GUARANTEE.rare ? '⭐ 下一发必中稀有！' :
                     userData.noneCount >= GUARANTEE.common ? `🎯 ${GUARANTEE.common - userData.noneCount}次必中普通` :
                     `${userData.noneCount}/35`}
                  </span>
                </div>
                <ProgressBar 
                  value={userData.noneCount} 
                  max={GUARANTEE.epic} 
                  label="" 
                  color={userData.noneCount >= GUARANTEE.epic ? 'from-yellow-500 to-yellow-600' : 
                        userData.noneCount >= GUARANTEE.rare ? 'from-purple-500 to-purple-600' : 
                        'from-blue-500 to-blue-600'} 
                />
              </div>
            </div>

            {/* 碎片展示 */}
            <div className="flex justify-center gap-8 pt-6 border-t border-gray-800">
              {[
                { key: 'common', icon: '🎯', count: userData.fragments.common },
                { key: 'rare', icon: '⭐', count: userData.fragments.rare },
                { key: 'epic', icon: '💎', count: userData.fragments.epic },
              ].map(item => (
                <motion.div key={item.key} whileHover={{ scale: 1.1 }} className="text-center">
                  <div className="text-4xl mb-1">{item.icon}</div>
                  <p className="text-3xl font-black">{item.count}</p>
                  <p className="text-xs text-gray-500">
                    {item.key === 'common' ? '普通' : item.key === 'rare' ? '稀有' : '史诗'}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 连接钱包 */}
        {!wallet.connected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-violet-900/60 to-pink-900/60 border border-violet-500/40 rounded-3xl p-10 mb-8 text-center"
          >
            <Wallet className="w-16 h-16 mx-auto mb-4 text-violet-400" />
            <p className="text-xl text-violet-200 mb-6">连接钱包开始免费抽取盲盒</p>
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
            className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}

        {/* 盲盒卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {(['common', 'rare', 'epic'] as const).map(type => (
            <BoxCard
              key={type}
              type={type}
              onOpen={() => handleOpenBox()}
              disabled={!canOpen}
              isOpening={isOpening}
            />
          ))}
        </div>

        {/* 概率公示 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800"
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            概率公示 · 免费抽取
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🎯', name: '普通碎片', prob: '40%', guarantee: '3次', color: 'text-gray-300' },
              { icon: '⭐', name: '稀有碎片', prob: '19%', guarantee: '7次', color: 'text-blue-400' },
              { icon: '💎', name: '史诗碎片', prob: '1%', guarantee: '35次', color: 'text-yellow-400' },
              { icon: '🙏', name: '感谢参与', prob: '40%', guarantee: '-', color: 'text-gray-500' },
            ].map(item => (
              <div key={item.name} className="text-center p-4 bg-gray-800/50 rounded-2xl">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className={`text-2xl font-black ${item.color}`}>{item.prob}</p>
                {item.guarantee !== '-' && (
                  <p className="text-xs text-gray-500">保底{item.guarantee}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 结果弹窗 */}
        <AnimatePresence>
          {showResult && result && (
            <ResultModal result={result} onClose={() => setShowResult(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
