'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Wallet, Sparkles, Crown, Flame, Trophy, CheckCircle, UserPlus, Star, Heart, Sparkle } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

const GUARANTEE = { common: 3, rare: 7, epic: 35 };

// 邀请任务配置
const INVITE_TASKS = [
  { friends: 1, reward: 1, label: '1位好友开盒', desc: '基础奖励', icon: '👋' },
  { friends: 3, reward: 2, label: '3位好友开盒', desc: '进阶奖励', icon: '🎉' },
  { friends: 15, reward: 3, label: '15位好友开盒', desc: '豪华大奖', icon: '👑' },
];

const FRAGMENT_CONFIG = {
  common: { name: '普通碎片', rarity: 'R', image: '/fragment-common.png', color: 'from-gray-500 to-gray-700', border: 'border-gray-500' },
  rare: { name: '稀有碎片', rarity: 'SR', image: '/fragment-rare.png', color: 'from-blue-500 to-cyan-600', border: 'border-blue-500' },
  epic: { name: '史诗碎片', rarity: 'SSR', image: '/fragment-epic.png', color: 'from-yellow-500 to-orange-600', border: 'border-yellow-500' },
  none: { name: '感谢参与', rarity: '谢谢参与', icon: '🙏', color: 'from-gray-700 to-gray-900', border: 'border-gray-600' },
};

// 能量条
function EnergyBar({ count, max }: { count: number; max: number }) {
  const percent = Math.min((count / max) * 100, 100);
  const stage = count >= 35 ? 'epic' : count >= 7 ? 'rare' : count >= 3 ? 'common' : 'none';
  
  return (
    <div className="bg-gray-900/95 rounded-2xl p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${stage === 'epic' ? 'text-yellow-400' : stage === 'rare' ? 'text-blue-400' : 'text-orange-500'}`} />
          <span className="text-gray-300 font-medium">保底能量</span>
        </div>
        <span className={`font-bold ${stage === 'epic' ? 'text-yellow-400' : stage === 'rare' ? 'text-blue-400' : 'text-orange-400'}`}>
          {count >= 35 ? '🎉 必中史诗！' : count >= 7 ? '⭐ 下一发必中稀有' : count >= 3 ? `🎯 ${3 - count}次必中普通` : `${count}/${max}`}
        </span>
      </div>
      <div className="h-5 bg-gray-800 rounded-full overflow-hidden relative">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className={`absolute inset-y-0 left-0 rounded-full ${
          stage === 'epic' ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500' :
          stage === 'rare' ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400' :
          'bg-gradient-to-r from-orange-500 via-red-500 to-orange-400'
        }`} />
        <motion.div animate={{ left: `${percent}%` }} transition={{ type: 'spring' }} className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" style={{ transform: 'translate(-50%, -50%)' }} />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span className={count >= 3 ? 'text-green-400' : ''}>🎯 3次</span>
        <span className={count >= 7 ? 'text-blue-400' : ''}>⭐ 7次</span>
        <span className={count >= 35 ? 'text-yellow-400' : ''}>💎 35次</span>
      </div>
    </div>
  );
}

// 宝箱
function LootBox({ isEpic, isOpening }: { isEpic: boolean; isOpening: boolean }) {
  return (
    <motion.div animate={isOpening ? { rotate: [0, 15, -15, 0] } : { y: [0, -15, 0], rotate: [0, 3, -3, 0] }} transition={{ duration: isOpening ? 0.5 : 2.5, repeat: Infinity }} className="relative cursor-pointer">
      <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: isEpic ? 1 : 2, repeat: Infinity }} className={`absolute inset-0 rounded-full ${isEpic ? 'bg-yellow-500' : 'bg-pink-500'} blur-3xl -z-10 mx-8`} />
      <div className={`w-36 h-36 md:w-48 md:h-48 mx-auto rounded-3xl bg-gradient-to-br ${isEpic ? 'from-yellow-500 via-orange-600 to-red-600' : 'from-violet-600 via-pink-600 to-purple-700'} flex items-center justify-center shadow-2xl ${isEpic ? 'shadow-yellow-500/50' : 'shadow-pink-500/50'}`}>
        <Gift className="w-16 h-16 md:w-24 md:h-24 text-white" />
      </div>
    </motion.div>
  );
}

// 奖励卡
function RewardCard({ type, count }: { type: string; count: number }) {
  const config = FRAGMENT_CONFIG[type as keyof typeof FRAGMENT_CONFIG] || FRAGMENT_CONFIG.none;
  const isEpic = type === 'epic';
  const isRare = type === 'rare';
  
  return (
    <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className={`relative bg-gradient-to-br ${config.color} rounded-xl p-3 border-2 ${config.border}`}>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-lg bg-black/40 flex items-center justify-center">
          {config.image ? <img src={config.image} alt={config.name} className="w-full h-full object-contain p-1.5" /> : <span className="text-3xl">{config.icon}</span>}
        </div>
        <div>
          <p className="font-bold text-white text-sm">{config.name}</p>
          <p className={`text-2xl font-black ${isEpic ? 'text-yellow-300' : isRare ? 'text-blue-300' : 'text-gray-200'}`}>{count}</p>
        </div>
      </div>
      {isEpic && <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-2 -right-2"><Crown className="w-7 h-7 text-yellow-400" /></motion.div>}
    </motion.div>
  );
}

// 邀请任务卡片 - 优化版
function InviteTaskCard({ task, completed, progress }: { task: typeof INVITE_TASKS[0]; completed: boolean; progress: number }) {
  return (
    <motion.div 
      whileHover={!completed ? { scale: 1.02 } : {}}
      className={`relative overflow-hidden rounded-xl border-2 transition-all ${
        completed 
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 border-green-500/50' 
          : 'bg-gray-800/30 border-gray-700/50'
      }`}
    >
      {/* 进度填充 */}
      {!completed && (
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${Math.min((progress / task.friends) * 100, 100)}%` }} 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500/30 to-green-500/10"
        />
      )}
      
      <div className="relative p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 图标 */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${
            completed ? 'bg-green-500/30' : 'bg-gray-700'
          }`}>
            {completed ? <CheckCircle className="w-6 h-6 text-green-400" /> : task.icon}
          </div>
          
          {/* 文字 */}
          <div>
            <p className={`font-bold text-sm ${completed ? 'text-green-400' : 'text-white'}`}>
              {task.label}
            </p>
            <p className="text-xs text-gray-500">{task.desc}</p>
          </div>
        </div>
        
        {/* 奖励 */}
        <div className={`text-right`}>
          <motion.span 
            animate={completed ? { scale: [1, 1.2, 1] } : {}}
            className={`text-lg font-bold block ${completed ? 'text-green-400' : 'text-yellow-400'}`}
          >
            +{task.reward}
          </motion.span>
          <span className="text-xs text-gray-500">次</span>
        </div>
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }} className={`relative w-full max-w-sm bg-gradient-to-b ${isEpic ? 'from-yellow-600 to-orange-800' : isRare ? 'from-blue-600 to-cyan-800' : 'from-gray-800 to-gray-900'} rounded-3xl p-8 text-center`} onClick={e => e.stopPropagation()}>
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(15)].map((_, i) => (<motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }} className="absolute w-2 h-2 bg-white rounded-full" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />))}
        </div>
        
        <motion.div className="relative z-10">
          {isEpic && <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-2xl font-black text-yellow-300 mb-3">🎉 史诗降临！🎉</motion.div>}
          {isRare && <div className="text-xl font-bold text-blue-300 mb-3">⭐ 稀有掉落！</div>}
          
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring' }} className={`w-32 h-32 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center border-4 ${config.border}`}>
            {config.image ? <img src={config.image} alt={config.name} className="w-24 h-24 object-contain" /> : <span className="text-5xl">{config.icon}</span>}
          </motion.div>
          
          <h2 className="text-2xl font-black text-white mb-1">{config.name}</h2>
          <p className={`text-3xl font-black mb-5 ${config.text || 'text-gray-400'}`}>{config.rarity}</p>
          
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="px-10 py-3.5 bg-white text-black rounded-full font-bold text-lg shadow-lg">收下奖励</motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// 开盒动画
function OpeningAnimation() {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div animate={phase >= 1 ? { x: [-25, 25, -25, 25, 0] } : {}} transition={{ duration: 0.4 }}><Gift className="w-28 h-28 text-yellow-500" /></motion.div>
        {phase >= 2 && <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 2, 3] }} className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-60 h-60 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full blur-3xl opacity-40" /></motion.div>}
        {phase >= 3 && <motion.div className="absolute inset-0 pointer-events-none">{[...Array(20)].map((_, i) => (<motion.div key={i} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: (Math.random() - 0.5) * 500, y: (Math.random() - 0.5) * 500, opacity: 0 }} transition={{ duration: 0.8 }} className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${i % 4 === 0 ? 'bg-yellow-400' : i % 4 === 1 ? 'bg-orange-400' : i % 4 === 2 ? 'bg-red-400' : 'bg-white'}`} />))}</motion.div>}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }} className="mt-8 text-2xl font-black text-white">{phase >= 3 ? '✨ 恭喜！' : '🎁 开启中...'}</motion.p>
      </div>
    </motion.div>
  );
}

export default function BoxPage() {
  const wallet = useWallet();
  const [isOpening, setIsOpening] = useState(false);
  const [showOpening, setShowOpening] = useState(false);
  const [result, setResult] = useState<{ type: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [combo, setCombo] = useState(0);
  
  const [userData, setUserData] = useState({
    dailyFreeCount: 1,
    inviteBonus: 0,
    uniqueFriendsToday: 0,
    noneCount: 0,
    fragments: { common: 0, rare: 0, epic: 0 },
  });

  const totalDailyCount = userData.dailyFreeCount + userData.inviteBonus;
  const canOpen = totalDailyCount > 0 && wallet.connected;
  const isEpic = userData.noneCount >= 35;

  const calculateBonus = (friends: number) => {
    if (friends >= 15) return 3;
    if (friends >= 3) return 2;
    if (friends >= 1) return 1;
    return 0;
  };

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
    setError(null); setIsOpening(true); setShowOpening(true); setCombo(c => c + 1);
    
    try {
      await fetch('/api/box', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: wallet.account?.address, action: 'open_box' }) });
      await new Promise(r => setTimeout(r, 2500));
      
      const rand = Math.random() * 100;
      let rt: string;
      if (userData.noneCount >= 35) rt = 'epic';
      else if (userData.noneCount >= 7) rt = 'rare';
      else if (userData.noneCount >= 3) rt = 'common';
      else rt = rand < 1 ? 'epic' : rand < 20 ? 'rare' : rand < 60 ? 'common' : 'none';
      
      setResult({ type: rt }); setShowOpening(false); setShowResult(true);
      fetchUserData();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : '开盒失败'); setCombo(0); }
    setIsOpening(false);
  }, [wallet.connected, wallet.account?.address, totalDailyCount, userData.noneCount, fetchUserData]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-violet-950 via-black to-orange-950" />
        <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-0 left-1/4 w-80 h-80 bg-yellow-600/20 rounded-full blur-[120px]" />
        <motion.div animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 py-5">
        {/* 标题 */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-5">
          <motion.h1 animate={{ textShadow: ['0 0 10px rgba(139,92,246,0.5)', '0 0 30px rgba(139,92,246,0.8)', '0 0 10px rgba(139,92,246,0.5)'] }} transition={{ duration: 2, repeat: Infinity }} className="text-3xl md:text-5xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            SUIBOX
          </motion.h1>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* 左侧 */}
          <div className="md:col-span-2">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-b from-gray-900/95 to-black/95 rounded-2xl p-5 md:p-8 text-center border border-gray-800">
              {combo >= 2 && <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full font-bold text-sm z-10">🔥 {combo}连击</motion.div>}
              
              <div className="mb-5"><EnergyBar count={userData.noneCount} max={35} /></div>
              
              <div className="py-2"><LootBox isEpic={isEpic} isOpening={isOpening} /></div>

              <div className="mt-6">
                {!wallet.connected ? (
                  <ConnectButton />
                ) : (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleOpen} disabled={!canOpen || isOpening} className={`px-10 py-3.5 rounded-full font-bold text-lg flex items-center gap-2 mx-auto shadow-xl ${canOpen && !isOpening ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white hover:shadow-orange-500/40' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
                    {isOpening ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                    {isOpening ? '开启中...' : '开始抽奖'}
                  </motion.button>
                )}
              </div>

              {wallet.connected && <p className="mt-3 text-gray-400 text-sm">剩余 <span className="text-orange-400 font-bold text-xl">{totalDailyCount}</span> 次</p>}

              <div className="mt-5">
                <p className="text-gray-500 text-xs mb-2">概率公示</p>
                <div className="flex justify-center gap-2">
                  {[
                    { img: '/fragment-common.png', p: '40%', g: '3' },
                    { img: '/fragment-rare.png', p: '19%', g: '7' },
                    { img: '/fragment-epic.png', p: '1%', g: '35' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-800/80 rounded-xl px-3 py-2 text-center flex flex-col items-center">
                      <img src={item.img} alt="" className="w-10 h-10 object-contain mb-1" />
                      <p className="text-yellow-400 font-bold text-sm">{item.p}</p>
                      <p className="text-gray-600 text-xs">保{item.g}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* 右侧 */}
          <div className="space-y-3">
            {wallet.connected && !loading && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                {/* 战利品 */}
                <div className="bg-gray-900/95 rounded-2xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-3"><Trophy className="w-5 h-5 text-yellow-500" /><span className="text-gray-300 font-medium">我的战利品</span></div>
                  <div className="space-y-2">
                    <RewardCard type="common" count={userData.fragments.common} />
                    <RewardCard type="rare" count={userData.fragments.rare} />
                    <RewardCard type="epic" count={userData.fragments.epic} />
                  </div>
                </div>

                {/* 好友助攻 - 优化版 */}
                <div className="bg-gray-900/95 rounded-2xl p-4 border border-gray-700 overflow-hidden">
                  {/* 头部 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-300 font-medium">好友助攻</span>
                    </div>
                    <div className="text-right">
                      <motion.span 
                        key={userData.inviteBonus}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-green-400"
                      >
                        +{userData.inviteBonus}
                      </motion.span>
                      <span className="text-xs text-gray-500 ml-1">次</span>
                    </div>
                  </div>
                  
                  {/* 当前状态 */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 rounded-xl p-3 mb-4 border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-sm">今日助攻好友</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-3xl font-black text-green-400">{userData.uniqueFriendsToday}</span>
                        <span className="text-gray-500 text-sm">人</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 任务列表 */}
                  <div className="space-y-2">
                    {INVITE_TASKS.map((task, index) => (
                      <motion.div
                        key={task.friends}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <InviteTaskCard 
                          task={task} 
                          completed={userData.uniqueFriendsToday >= task.friends}
                          progress={userData.uniqueFriendsToday}
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* 底部提示 */}
                  <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Sparkle className="w-3 h-3" />
                    <span>好友开盲盒，你获免费次数</span>
                    <Sparkle className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            )}

            {!wallet.connected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-900/95 rounded-2xl p-8 text-center border border-gray-700">
                <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400 mb-4">连接钱包开始抽奖</p>
                <ConnectButton />
              </motion.div>
            )}
          </div>
        </div>

        {error && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-2.5 rounded-full text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</motion.div>}

        <AnimatePresence>{showOpening && <OpeningAnimation />}</AnimatePresence>
        <AnimatePresence>{showResult && result && <ResultModal result={result} onClose={() => setShowResult(false)} />}</AnimatePresence>
      </div>
    </div>
  );
}
