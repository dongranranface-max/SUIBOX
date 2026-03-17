'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Star, Crown, Wallet, Sparkles, CheckCircle2, Circle, Flame, Trophy, Zap as Flash } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

// 规则
const GUARANTEE = { common: 3, rare: 7, epic: 35 };

// 邀请任务
const INVITE_TASKS = [
  { friends: 1, reward: 1, label: '邀请1人' },
  { friends: 3, reward: 1, label: '邀请3人' },
  { friends: 15, reward: 2, label: '邀请15人' },
];

// 碎片配置 - 使用本地图片
const FRAGMENT_CONFIG = {
  common: { name: '普通碎片', rarity: 'R', image: '/fragment-common.png', text: 'text-gray-400', bg: 'from-gray-600 to-gray-800', glow: 'shadow-gray-500/50' },
  rare: { name: '稀有碎片', rarity: 'SR', image: '/fragment-rare.png', text: 'text-blue-400', bg: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/50' },
  epic: { name: '史诗碎片', rarity: 'SSR', image: '/fragment-epic.png', text: 'text-yellow-400', bg: 'from-yellow-500 to-orange-600', glow: 'shadow-yellow-500/50' },
  none: { name: '感谢参与', rarity: '谢谢参与', icon: '🙏', text: 'text-gray-500', bg: 'from-gray-700 to-gray-900' },
};

// 保底进度条组件 - 三阶段
function GuaranteeProgress({ count }: { count: number }) {
  const stage = count >= 35 ? 'epic' : count >= 7 ? 'rare' : count >= 3 ? 'common' : 'none';
  
  return (
    <div className="bg-gray-800/80 rounded-2xl p-4 backdrop-blur">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-400 text-sm">保底进度</span>
        <motion.span 
          key={stage}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className={`text-sm font-bold ${
            stage === 'epic' ? 'text-yellow-400' : 
            stage === 'rare' ? 'text-blue-400' : 
            stage === 'common' ? 'text-green-400' : 'text-gray-500'
          }`}
        >
          {stage === 'epic' ? '🔥 下一发必中史诗！' : 
           stage === 'rare' ? '⭐ 下一发必中稀有！' : 
           stage === 'common' ? `🎯 ${3 - count}次必中普通` : 
           `${count}/35`}
        </motion.span>
      </div>
      
      {/* 三阶段进度条 */}
      <div className="relative h-4 bg-gray-900 rounded-full overflow-hidden">
        {/* 普通阶段 */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((Math.max(count, 0) / GUARANTEE.epic) * 100, 100)}%` }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full"
        />
        
        {/* 发光效果 */}
        {stage !== 'none' && (
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-white/50 to-transparent rounded-full"
          />
        )}
      </div>
      
      {/* 阶段标记 */}
      <div className="flex justify-between mt-2 text-xs">
        <span className={count >= GUARANTEE.common ? 'text-green-400' : 'text-gray-600'}>🎯 普通 3次</span>
        <span className={count >= GUARANTEE.rare ? 'text-blue-400' : 'text-gray-600'}>⭐ 稀有 7次</span>
        <span className={count >= GUARANTEE.epic ? 'text-yellow-400' : 'text-gray-600'}>💎 史诗 35次</span>
      </div>
    </div>
  );
}

// 碎片展示
function MyFragments({ fragments }: { fragments: { common: number; rare: number; epic: number } }) {
  return (
    <div className="bg-gray-800/80 rounded-2xl p-4 backdrop-blur">
      <p className="text-gray-400 text-sm mb-3">我的碎片</p>
      <div className="flex justify-around">
        {[
          { key: 'common', config: FRAGMENT_CONFIG.common, count: fragments.common },
          { key: 'rare', config: FRAGMENT_CONFIG.rare, count: fragments.rare },
          { key: 'epic', config: FRAGMENT_CONFIG.epic, count: fragments.epic },
        ].map(item => (
          <motion.div 
            key={item.key}
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-2 rounded-xl overflow-hidden bg-gray-700 flex items-center justify-center">
              <img src={item.config.image} alt={item.config.name} className="w-full h-full object-contain" />
            </div>
            <p className="text-2xl font-black">{item.count}</p>
            <p className="text-xs text-gray-500">{item.key === 'common' ? '普通' : item.key === 'rare' ? '稀有' : '史诗'}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 开盒动画组件
function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(onComplete, 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* 阶段1: 震动 */}
        <motion.div
          animate={phase >= 1 ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Gift className="w-32 h-32 mx-auto text-violet-500" />
        </motion.div>
        
        {/* 阶段2: 发光 */}
        {phase >= 2 && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="w-40 h-40 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full blur-3xl"
            />
          </motion.div>
        )}
        
        {/* 阶段3: 爆炸 */}
        {phase >= 3 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 2, 3] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  x: Math.cos(i * 30 * Math.PI / 180) * 200,
                  y: Math.sin(i * 30 * Math.PI / 180) * 200,
                  opacity: 0
                }}
                transition={{ duration: 0.8 }}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full"
              />
            ))}
          </motion.div>
        )}
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
          className="mt-8 text-2xl font-bold text-white"
        >
          {phase === 1 && '🎁 盒子正在开启...'}
          {phase === 2 && '✨ 恭喜获得！'}
          {phase === 3 && '🎉'}
        </motion.p>
      </div>
    </motion.div>
  );
}

// 结果弹窗
function ResultModal({ result, onClose }: { result: { type: string }; onClose: () => void }) {
  const config = FRAGMENT_CONFIG[result.type as keyof typeof FRAGMENT_CONFIG] || FRAGMENT_CONFIG.none;
  const isEpic = result.type === 'epic';
  const isRare = result.type === 'rare';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className={`relative bg-gradient-to-br ${config.bg} rounded-3xl p-10 text-center max-w-sm w-full overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {/* 光效背景 */}
        {isEpic && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl"
          />
        )}
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="relative z-10"
        >
          {/* 碎片图片 */}
          <motion.div
            animate={isEpic ? { 
              boxShadow: ['0 0 20px rgba(255,215,0,0.5)', '0 0 60px rgba(255,215,0,0.8)', '0 0 20px rgba(255,215,0,0.5)']
            } : isRare ? {
              boxShadow: ['0 0 20px rgba(59,130,246,0.5)', '0 0 40px rgba(59,130,246,0.8)', '0 0 20px rgba(59,130,246,0.5)']
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden bg-black/30 flex items-center justify-center"
          >
            {config.image ? (
              <img src={config.image} alt={config.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-6xl">{config.icon}</span>
            )}
          </motion.div>
          
          <h2 className="text-3xl font-black text-white mb-2">{config.name}</h2>
          <p className={`text-4xl font-black mb-6 ${config.text}`}>{config.rarity}</p>
          
          {/* 特效文字 */}
          {isEpic && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-yellow-300 text-lg mb-6"
            >
              🔥 史诗级稀有！运气爆棚！🔥
            </motion.div>
          )}
          
          {isRare && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-blue-300 text-lg mb-6"
            >
              ⭐ 稀有获得！
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg shadow-lg"
          >
            收下奖励
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// 主页面
export default function BoxPage() {
  const wallet = useWallet();
  const [isOpening, setIsOpening] = useState(false);
  const [showOpening, setShowOpening] = useState(false);
  const [result, setResult] = useState<{ type: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [userData, setUserData] = useState({
    dailyFreeCount: 1,
    inviteBonus: 0,
    inviteCount: 0,
    noneCount: 0,
    inviteCode: 'SUIBOX001',
    fragments: { common: 0, rare: 0, epic: 0 },
  });

  const totalDailyCount = userData.dailyFreeCount + userData.inviteBonus;
  const canOpen = totalDailyCount > 0 && wallet.connected;

  const fetchUserData = useCallback(async () => {
    if (!wallet.account?.address) return;
    try {
      const res = await fetch(`/api/box?address=${wallet.account.address}`);
      const data = await res.json();
      setUserData(prev => ({ ...prev, ...data }));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [wallet.account?.address]);

  useEffect(() => { if (wallet.connected) fetchUserData(); }, [wallet.connected, fetchUserData]);

  const handleOpen = useCallback(async () => {
    if (!wallet.connected) { setError('请先连接钱包！'); return; }
    if (totalDailyCount <= 0) { setError('今日次数已用完！'); return; }
    
    setError(null);
    setIsOpening(true);
    setShowOpening(true);
    
    try {
      await fetch('/api/box', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: wallet.account?.address, action: 'open_box' }) });
      await new Promise(r => setTimeout(r, 3000));
      
      const rand = Math.random() * 100;
      let rt: string;
      
      if (userData.noneCount >= GUARANTEE.epic) rt = 'epic';
      else if (userData.noneCount >= GUARANTEE.rare) rt = 'rare';
      else if (userData.noneCount >= GUARANTEE.common) rt = 'common';
      else {
        rt = rand < 1 ? 'epic' : rand < 20 ? 'rare' : rand < 60 ? 'common' : 'none';
      }
      
      setResult({ type: rt });
      setShowOpening(false);
      setShowResult(true);
      fetchUserData();
    } catch (e: unknown) { 
      setError(e instanceof Error ? e.message : '开盒失败'); 
    }
    setIsOpening(false);
  }, [wallet.connected, wallet.account?.address, totalDailyCount, userData.noneCount, fetchUserData]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            NFT 盲盒
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧 - 大盲盒 */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-violet-600 via-pink-600 to-purple-700 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
            >
              {/* 背景装饰 */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
              
              {/* 盲盒 - 等待点击时浮动动画 */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="relative z-10 cursor-pointer"
                onClick={canOpen && !isOpening ? handleOpen : undefined}
              >
                {/* 光晕效果 */}
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl -z-10"
                />
                
                <Gift className="w-40 h-40 md:w-56 md:h-56 mx-auto text-white drop-shadow-2xl" />
              </motion.div>

              {/* 闪烁特效 */}
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10 mt-8"
              >
                <Sparkles className="w-8 h-8 mx-auto text-yellow-300" />
              </motion.div>

              {/* 按钮 */}
              <div className="relative z-10 mt-10">
                {!wallet.connected ? (
                  <ConnectButton />
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpen}
                    disabled={!canOpen || isOpening}
                    className="group px-12 py-5 bg-white text-violet-600 rounded-full font-bold text-2xl disabled:opacity-50 flex items-center gap-3 mx-auto shadow-2xl hover:shadow-yellow-400/50 transition-shadow"
                  >
                    {isOpening ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-8 h-8 group-hover:text-yellow-500 transition-colors" />
                        <span>免费开盒</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              {wallet.connected && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 mt-6 text-white/80 text-lg"
                >
                  今日剩余 <span className="text-yellow-300 font-bold text-2xl">{totalDailyCount}</span> 次机会
                </motion.p>
              )}
            </motion.div>

            {/* 概率 */}
            <div className="mt-6 bg-gray-900/60 backdrop-blur rounded-2xl p-4">
              <p className="text-center text-gray-400 text-sm mb-3">概率公示 · 保底机制</p>
              <div className="flex justify-center gap-4 md:gap-8">
                {[
                  { icon: '🎯', p: '40%', g: '3次', color: 'text-gray-400' },
                  { icon: '⭐', p: '19%', g: '7次', color: 'text-blue-400' },
                  { icon: '💎', p: '1%', g: '35次', color: 'text-yellow-400' },
                  { icon: '🙏', p: '40%', g: '-', color: 'text-gray-600' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl">{item.icon}</div>
                    <p className={`font-bold ${item.color}`}>{item.p}</p>
                    <p className="text-xs text-gray-600">{item.g !== '-' ? `保${item.g}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧 */}
          <div className="space-y-4">
            {wallet.connected && !loading && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {/* 保底进度 */}
                <GuaranteeProgress count={userData.noneCount} />

                {/* 碎片 */}
                <MyFragments fragments={userData.fragments} />

                {/* 邀请任务 */}
                <div className="bg-gray-800/80 rounded-2xl p-4 backdrop-blur">
                  <p className="text-gray-400 text-sm mb-3">邀请好友抽盲盒</p>
                  <div className="space-y-2">
                    {INVITE_TASKS.map(task => (
                      <div 
                        key={task.friends} 
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          userData.inviteCount >= task.friends ? 'bg-green-500/20' : 'bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {userData.inviteCount >= task.friends ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-600" />
                          )}
                          <div>
                            <p className={`font-medium ${userData.inviteCount >= task.friends ? 'text-green-400' : 'text-gray-300'}`}>{task.label}</p>
                            <p className="text-xs text-gray-500">+{task.reward}次</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-sm text-gray-400">今日已获邀请奖励</p>
                    <p className="text-2xl font-bold text-green-400">+{userData.inviteBonus}次</p>
                  </div>
                </div>
              </motion.div>
            )}

            {!wallet.connected && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="bg-gray-900/50 rounded-2xl p-8 text-center"
              >
                <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400 mb-4">连接钱包开始抽取</p>
                <ConnectButton />
              </motion.div>
            )}
          </div>
        </div>

        {/* 错误 */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* 开盒动画 */}
        <AnimatePresence>
          {showOpening && <OpeningAnimation onComplete={() => {}} />}
        </AnimatePresence>

        {/* 结果弹窗 */}
        <AnimatePresence>
          {showResult && result && <ResultModal result={result} onClose={() => setShowResult(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
