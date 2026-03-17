'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Star, Crown, Wallet, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

const GUARANTEE = { common: 3, rare: 7, epic: 35 };
const INVITE_TASKS = [
  { friends: 1, reward: 1, label: '邀请1人' },
  { friends: 3, reward: 1, label: '邀请3人' },
  { friends: 15, reward: 2, label: '邀请15人' },
];

const FRAGMENT_CONFIG = {
  common: { name: '普通碎片', rarity: 'R', image: '/fragment-common.png', text: 'text-gray-400' },
  rare: { name: '稀有碎片', rarity: 'SR', image: '/fragment-rare.png', text: 'text-blue-400' },
  epic: { name: '史诗碎片', rarity: 'SSR', image: '/fragment-epic.png', text: 'text-yellow-400' },
  none: { name: '感谢参与', rarity: '谢谢参与', icon: '🙏', text: 'text-gray-500' },
};

// 右侧面板组件
function RightPanel({ userData, combo, newFragment }: { userData: any; combo: number; newFragment: string | null }) {
  return (
    <div className="space-y-3">
      {/* 邀请任务 */}
      <div className="bg-gray-900/80 rounded-2xl p-4">
        <p className="text-gray-400 text-sm mb-3">邀请好友抽盲盒</p>
        <div className="space-y-2">
          {INVITE_TASKS.map(task => (
            <div key={task.friends} className={`flex items-center justify-between p-2.5 rounded-xl ${userData.inviteCount >= task.friends ? 'bg-green-500/20' : 'bg-gray-800/50'}`}>
              <div className="flex items-center gap-2">
                {userData.inviteCount >= task.friends ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-600" />
                )}
                <span className={`text-sm ${userData.inviteCount >= task.friends ? 'text-green-400' : 'text-gray-400'}`}>{task.label}</span>
              </div>
              <span className="text-xs text-gray-500">+{task.reward}次</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
          <span className="text-sm text-gray-400">今日已获邀请奖励</span>
          <span className="text-xl font-bold text-green-400">+{userData.inviteBonus}次</span>
        </div>
      </div>

      {/* 我的碎片 */}
      <div className="bg-gray-900/80 rounded-2xl p-4">
        <p className="text-gray-400 text-sm mb-3">我的碎片</p>
        <div className="flex justify-around">
          {[
            { key: 'common', config: FRAGMENT_CONFIG.common, count: userData.fragments.common },
            { key: 'rare', config: FRAGMENT_CONFIG.rare, count: userData.fragments.rare },
            { key: 'epic', config: FRAGMENT_CONFIG.epic, count: userData.fragments.epic },
          ].map(item => (
            <motion.div key={item.key} animate={newFragment === item.key ? { scale: [1, 1.2, 1] } : {}} className="text-center">
              <div className="w-14 h-14 mx-auto mb-1 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                <img src={item.config.image} alt={item.config.name} className="w-full h-full object-contain p-1" />
              </div>
              <p className="text-xl font-bold">{item.count}</p>
              <p className="text-xs text-gray-500">{item.key === 'common' ? '普通' : item.key === 'rare' ? '稀有' : '史诗'}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 保底进度 */}
      <div className="bg-gray-900/80 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">保底进度</span>
          <span className={`text-sm font-bold ${
            userData.noneCount >= 35 ? 'text-yellow-400' : 
            userData.noneCount >= 7 ? 'text-blue-400' : 
            userData.noneCount >= 3 ? 'text-green-400' : 'text-gray-500'
          }`}>
            {userData.noneCount >= 35 ? '🔥 必中史诗' : 
             userData.noneCount >= 7 ? '⭐ 必中稀有' : 
             userData.noneCount >= 3 ? `🎯 ${3 - userData.noneCount}次必中` : 
             `${userData.noneCount}/35`}
          </span>
        </div>
        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((userData.noneCount / 35) * 100, 100)}%` }}
            className={`h-full bg-gradient-to-r ${
              userData.noneCount >= 35 ? 'from-yellow-500 to-yellow-400' : 
              userData.noneCount >= 7 ? 'from-blue-500 to-cyan-400' : 
              'from-green-500 to-emerald-400'
            } rounded-full`}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs">
          <span className={userData.noneCount >= 3 ? 'text-green-400' : 'text-gray-600'}>🎯 3</span>
          <span className={userData.noneCount >= 7 ? 'text-blue-400' : 'text-gray-600'}>⭐ 7</span>
          <span className={userData.noneCount >= 35 ? 'text-yellow-400' : 'text-gray-600'}>💎 35</span>
        </div>
      </div>
    </div>
  );
}

// 结果弹窗
function ResultModal({ result, onClose }: { result: { type: string }; onClose: () => void }) {
  const config = FRAGMENT_CONFIG[result.type as keyof typeof FRAGMENT_CONFIG] || FRAGMENT_CONFIG.none;
  const isEpic = result.type === 'epic';
  const isRare = result.type === 'rare';
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0, rotate: -180 }} 
        animate={{ scale: 1, rotate: 0 }} 
        className={`bg-gradient-to-br ${isEpic ? 'from-yellow-600 to-orange-700' : isRare ? 'from-blue-600 to-cyan-700' : 'from-gray-700 to-gray-800'} rounded-3xl p-8 text-center max-w-sm w-full`} 
        onClick={e => e.stopPropagation()}
      >
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden bg-black/30 flex items-center justify-center">
          {config.image ? <img src={config.image} alt={config.name} className="w-full h-full object-contain p-2" /> : <span className="text-5xl">{config.icon}</span>}
        </motion.div>
        <h2 className="text-2xl font-black text-white mb-1">{config.name}</h2>
        <p className={`text-3xl font-black mb-4 ${config.text}`}>{config.rarity}</p>
        {isEpic && <p className="text-yellow-300 mb-4">🔥 史诗级稀有！</p>}
        {isRare && <p className="text-blue-300 mb-4">⭐ 稀有获得！</p>}
        <button onClick={onClose} className="px-8 py-3 bg-white text-black rounded-full font-bold">收下</button>
      </motion.div>
    </motion.div>
  );
}

// 开盒动画
function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2500);
    const t4 = setTimeout(onComplete, 3500);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div animate={phase >= 1 ? { x: [-10, 10, -10, 10, 0] } : {}}>
          <Gift className="w-28 h-28 mx-auto text-violet-500" />
        </motion.div>
        {phase >= 2 && (
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1.5 }} className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-40 h-40 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full blur-3xl" />
          </motion.div>
        )}
        {phase >= 3 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 2 }} className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div key={i} initial={{ x: 0, y: 0 }} animate={{ x: Math.cos(i * 30 * Math.PI / 180) * 200, y: Math.sin(i * 30 * Math.PI / 180) * 200, opacity: 0 }} transition={{ duration: 0.8 }} className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full" />
            ))}
          </motion.div>
        )}
        <p className="mt-6 text-xl font-bold text-white">{phase >= 2 ? '✨ 恭喜！' : '🎁 开启中...'}</p>
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
  const [newFragment, setNewFragment] = useState<string | null>(null);
  
  const [userData, setUserData] = useState({
    dailyFreeCount: 1,
    inviteBonus: 0,
    inviteCount: 0,
    noneCount: 0,
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
    setError(null); setIsOpening(true); setShowOpening(true); setCombo(c => c + 1);
    
    try {
      await fetch('/api/box', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: wallet.account?.address, action: 'open_box' }) });
      await new Promise(r => setTimeout(r, 3000));
      
      const rand = Math.random() * 100;
      let rt: string;
      if (userData.noneCount >= 35) rt = 'epic';
      else if (userData.noneCount >= 7) rt = 'rare';
      else if (userData.noneCount >= 3) rt = 'common';
      else rt = rand < 1 ? 'epic' : rand < 20 ? 'rare' : rand < 60 ? 'common' : 'none';
      
      setResult({ type: rt }); setShowOpening(false); setShowResult(true); setNewFragment(rt);
      setTimeout(() => setNewFragment(null), 800);
      fetchUserData();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : '开盒失败'); setCombo(0); }
    setIsOpening(false);
  }, [wallet.connected, wallet.account?.address, totalDailyCount, userData.noneCount, fetchUserData]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景 */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* 标题 */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">NFT 盲盒</h1>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* 左侧 - 大盲盒 */}
          <div className="md:col-span-2">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-violet-600 via-pink-600 to-purple-700 rounded-2xl p-6 md:p-10 text-center relative overflow-hidden">
              {/* 连击 */}
              {combo >= 2 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full text-sm font-bold">
                  🔥 {combo}连击
                </motion.div>
              )}
              
              {/* 盲盒 */}
              <motion.div animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="cursor-pointer" onClick={canOpen && !isOpening ? handleOpen : undefined}>
                <div className="relative inline-block">
                  <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl -z-10" />
                  <Gift className="w-32 h-32 md:w-44 md:h-44 mx-auto text-white drop-shadow-2xl" />
                </div>
              </motion.div>

              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="mt-4">
                <Sparkles className="w-6 h-6 mx-auto text-yellow-300" />
              </motion.div>

              {/* 按钮 */}
              <div className="mt-6">
                {!wallet.connected ? (
                  <ConnectButton />
                ) : (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleOpen} disabled={!canOpen || isOpening} className="px-10 py-3.5 bg-white text-violet-600 rounded-full font-bold text-lg disabled:opacity-50 flex items-center gap-2 mx-auto">
                    {isOpening ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                    {isOpening ? '开启中...' : '免费开盒'}
                  </motion.button>
                )}
              </div>

              {wallet.connected && <p className="mt-3 text-white/70">今日剩余 <span className="text-yellow-300 font-bold text-xl">{totalDailyCount}</span> 次</p>}

              {/* 概率 */}
              <div className="mt-6 flex justify-center gap-4 md:gap-6">
                {[{ icon: '🎯', p: '40%' }, { icon: '⭐', p: '19%' }, { icon: '💎', p: '1%' }, { icon: '🙏', p: '40%' }].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl">{item.icon}</div>
                    <p className="text-yellow-400 font-bold text-sm">{item.p}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 右侧 */}
          <div>
            {wallet.connected && !loading ? (
              <RightPanel userData={userData} combo={combo} newFragment={newFragment} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-900/80 rounded-2xl p-8 text-center">
                <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400 mb-4">连接钱包开始抽取</p>
                <ConnectButton />
              </motion.div>
            )}
          </div>
        </div>

        {/* 错误 */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-2.5 rounded-full text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />{error}
          </motion.div>
        )}

        <AnimatePresence>{showOpening && <OpeningAnimation onComplete={() => {}} />}</AnimatePresence>
        <AnimatePresence>{showResult && result && <ResultModal result={result} onClose={() => setShowResult(false)} />}</AnimatePresence>
      </div>
    </div>
  );
}
