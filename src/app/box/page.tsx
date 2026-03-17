'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Wallet, Sparkles, Star, TreasureChest, Coins, Crown, Flame, Target, TrendingUp } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

const GUARANTEE = { common: 3, rare: 7, epic: 35 };
const INVITE_TASKS = [
  { friends: 1, reward: 1, label: '邀请1人' },
  { friends: 3, reward: 1, label: '邀请3人' },
  { friends: 15, reward: 2, label: '邀请15人' },
];

const FRAGMENT_CONFIG = {
  common: { name: '普通碎片', rarity: 'R', image: '/fragment-common.png', color: 'from-gray-500 to-gray-700', border: 'border-gray-500', glow: 'shadow-gray-500/30' },
  rare: { name: '稀有碎片', rarity: 'SR', image: '/fragment-rare.png', color: 'from-blue-500 to-cyan-600', border: 'border-blue-500', glow: 'shadow-blue-500/40' },
  epic: { name: '史诗碎片', rarity: 'SSR', image: '/fragment-epic.png', color: 'from-yellow-500 to-orange-600', border: 'border-yellow-500', glow: 'shadow-yellow-500/50' },
  none: { name: '感谢参与', rarity: '谢谢参与', icon: '🙏', color: 'from-gray-700 to-gray-900', border: 'border-gray-600', glow: '' },
};

// 能量条组件
function EnergyBar({ count, max }: { count: number; max: number }) {
  const percent = Math.min((count / max) * 100, 100);
  
  return (
    <div className="bg-gray-900/90 rounded-2xl p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-gray-300 font-medium">能量值</span>
        </div>
        <span className="text-orange-400 font-bold">{count}/{max}</span>
      </div>
      <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-full"
        />
        {/* 火花效果 */}
        {percent > 0 && (
          <motion.div 
            animate={{ left: `${percent}%` }}
            transition={{ type: 'spring' }}
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg"
            style={{ transform: 'translate(-50%, -50%)' }}
          />
        )}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>🎯 3次 = 普通</span>
        <span>⭐ 7次 = 稀有</span>
        <span>💎 35次 = 史诗</span>
      </div>
    </div>
  );
}

// 战利品展示
function LootBox({ isEpic }: { isEpic: boolean }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className="relative"
    >
      {/* 光晕 */}
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`absolute inset-0 rounded-full ${isEpic ? 'bg-yellow-500' : 'bg-violet-500'} blur-3xl -z-10`}
      />
      
      {/* 主箱 */}
      <div className={`w-40 h-40 md:w-56 md:h-56 mx-auto rounded-3xl bg-gradient-to-br ${isEpic ? 'from-yellow-500 via-orange-600 to-red-600' : 'from-violet-600 via-pink-600 to-purple-700'} flex items-center justify-center shadow-2xl ${isEpic ? 'shadow-yellow-500/50' : 'shadow-pink-500/50'}`}>
        <TreasureChest className="w-20 h-20 md:w-28 md:h-28 text-white" />
      </div>
      
      {/* 浮动粒子 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -50],
            opacity: [1, 0],
            x: [0, (i - 3) * 20],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${isEpic ? 'bg-yellow-400' : 'bg-pink-400'}`}
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      ))}
    </motion.div>
  );
}

// 奖励卡
function RewardCard({ type, count }: { type: string; count: number }) {
  const config = FRAGMENT_CONFIG[type as keyof typeof FRAGMENT_CONFIG] || FRAGMENT_CONFIG.none;
  const isEpic = type === 'epic';
  const isRare = type === 'rare';
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`relative bg-gradient-to-br ${config.color} rounded-xl p-3 border-2 ${config.border} ${config.glow}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center">
          {config.image ? (
            <img src={config.image} alt={config.name} className="w-full h-full object-contain p-1" />
          ) : (
            <span className="text-2xl">{config.icon}</span>
          )}
        </div>
        <div>
          <p className="font-bold text-white text-sm">{config.name}</p>
          <p className={`font-black ${isEpic ? 'text-yellow-300' : isRare ? 'text-blue-300' : 'text-gray-300'}`}>{count}</p>
        </div>
      </div>
      {isEpic && (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute -top-2 -right-2">
          <Crown className="w-6 h-6 text-yellow-400" />
        </motion.div>
      )}
    </motion.div>
  );
}

// 结果弹窗 - 豪礼掉落
function ResultModal({ result, onClose }: { result: { type: string }; onClose: () => void }) {
  const config = FRAGMENT_CONFIG[result.type as keyof typeof FRAGMENT_CONFIG] || FRAGMENT_CONFIG.none;
  const isEpic = result.type === 'epic';
  const isRare = result.type === 'rare';
  const isNone = result.type === 'none';
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className={`relative w-full max-w-md bg-gradient-to-b ${isEpic ? 'from-yellow-600 to-orange-800' : isRare ? 'from-blue-600 to-cyan-800' : 'from-gray-800 to-gray-900'} rounded-3xl p-8 text-center overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {/* 闪光背景 */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%` 
              }}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="relative z-10"
        >
          {/* 恭喜文字 */}
          {isEpic ? (
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-3xl font-black text-yellow-300 mb-2">
              🎉 史诗降临！🎉
            </motion.div>
          ) : isRare ? (
            <div className="text-2xl font-bold text-blue-300 mb-2">⭐ 稀有掉落！</div>
          ) : isNone ? (
            <div className="text-xl font-bold text-gray-400 mb-2">🙏 谢谢参与</div>
          ) : (
            <div className="text-xl font-bold text-gray-300 mb-2">🎯 获得碎片</div>
          )}
          
          {/* 物品展示 */}
          <motion.div
            animate={isEpic ? { 
              boxShadow: ['0 0 20px rgba(255,215,0,0.5)', '0 0 60px rgba(255,215,0,0.8)', '0 0 20px rgba(255,215,0,0.5)']
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className={`w-36 h-36 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center border-4 ${config.border}`}
          >
            {config.image ? (
              <img src={config.image} alt={config.name} className="w-28 h-28 object-contain" />
            ) : (
              <span className="text-6xl">{config.icon}</span>
            )}
          </motion.div>
          
          <h2 className={`text-3xl font-black mb-1 ${isEpic ? 'text-yellow-300' : isRare ? 'text-blue-300' : 'text-white'}`}>
            {config.name}
          </h2>
          <p className={`text-4xl font-black mb-6 ${config.text || 'text-gray-400'}`}>
            {config.rarity}
          </p>
          
          {/* 按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`px-10 py-4 bg-white text-black rounded-full font-bold text-lg shadow-lg`}
          >
            收下奖励
          </motion.button>
        </motion.div>
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
    const t3 = setTimeout(() => setPhase(3), 2800);
    const t4 = setTimeout(onComplete, 3500);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="text-center">
        {/* 箱子震动 */}
        <motion.div animate={phase >= 1 ? { x: [-20, 20, -20, 20, 0] } : {}} transition={{ duration: 0.5 }}>
          <TreasureChest className="w-32 h-32 text-yellow-500" />
        </motion.div>
        
        {/* 发光 */}
        {phase >= 2 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [1, 3, 5] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-60 h-60 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full blur-3xl opacity-50" />
          </motion.div>
        )}
        
        {/* 爆炸 */}
        {phase >= 3 && (
          <motion.div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 1 }}
                animate={{ 
                  x: (Math.random() - 0.5) * 600, 
                  y: (Math.random() - 0.5) * 600,
                  scale: 0,
                }}
                transition={{ duration: 1 }}
                className={`absolute top-1/2 left-1/2 w-4 h-4 rounded-full ${
                  i % 3 === 0 ? 'bg-yellow-400' : i % 3 === 1 ? 'bg-orange-400' : 'bg-white'
                }`}
              />
            ))}
          </motion.div>
        )}
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
          className="relative z-10 mt-8 text-2xl font-black text-white"
        >
          {phase >= 3 ? '✨ 恭喜获得！' : '🎁 开启中...'}
        </motion.p>
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
    inviteCount: 0,
    noneCount: 0,
    fragments: { common: 0, rare: 0, epic: 0 },
  });

  const totalDailyCount = userData.dailyFreeCount + userData.inviteBonus;
  const canOpen = totalDailyCount > 0 && wallet.connected;
  const isEpic = userData.noneCount >= 35;

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
        <motion.div animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600/20 rounded-full blur-[150px]" />
        <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* 标题 */}
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
          <motion.h1 
            animate={{ 
              textShadow: ['0 0 10px rgba(255,200,0,0.5)', '0 0 30px rgba(255,200,0,0.8)', '0 0 10px rgba(255,200,0,0.5)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
          >
            🎰 盲盒大奖 🎰
          </motion.h1>
          <p className="text-gray-400 mt-1">试试你的运气！</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* 左侧 - 宝箱 */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-b from-gray-900/90 to-black/90 rounded-2xl p-6 md:p-10 text-center border border-gray-800 relative overflow-hidden"
            >
              {/* 连击 */}
              {combo >= 2 && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1.5 rounded-full font-bold text-sm z-10"
                >
                  🔥 {combo}连击
                </motion.div>
              )}
              
              {/* 能量值 */}
              <div className="mb-6">
                <EnergyBar count={userData.noneCount} max={35} />
              </div>
              
              {/* 宝箱 */}
              <LootBox isEpic={isEpic} />

              {/* 按钮 */}
              <div className="mt-8">
                {!wallet.connected ? (
                  <ConnectButton />
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpen}
                    disabled={!canOpen || isOpening}
                    className={`px-12 py-4 rounded-full font-bold text-xl flex items-center gap-3 mx-auto shadow-2xl ${
                      canOpen && !isOpening 
                        ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white hover:shadow-orange-500/50' 
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isOpening ? (
                      <Loader2 className="w-7 h-7 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-7 h-7" />
                        {isOpening ? '开启中...' : '开始抽奖'}
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              {wallet.connected && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-gray-400"
                >
                  剩余次数: <span className="text-orange-400 font-bold text-2xl">{totalDailyCount}</span> 次
                </motion.p>
              )}

              {/* 概率 */}
              <div className="mt-6 flex justify-center gap-3">
                {[{ icon: '🎯', p: '40%', c: 'text-gray-400' }, { icon: '⭐', p: '19%', c: 'text-blue-400' }, { icon: '💎', p: '1%', c: 'text-yellow-400' }, { icon: '🙏', p: '40%', c: 'text-gray-600' }].map((item, i) => (
                  <div key={i} className="bg-gray-800/80 rounded-lg px-3 py-2 text-center">
                    <div className="text-lg">{item.icon}</div>
                    <p className={`font-bold text-sm ${item.c}`}>{item.p}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 右侧 */}
          <div className="space-y-3">
            {wallet.connected && !loading && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                {/* 战利品 */}
                <div className="bg-gray-900/90 rounded-2xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-300 font-medium">我的战利品</span>
                  </div>
                  <div className="space-y-2">
                    <RewardCard type="common" count={userData.fragments.common} />
                    <RewardCard type="rare" count={userData.fragments.rare} />
                    <RewardCard type="epic" count={userData.fragments.epic} />
                  </div>
                </div>

                {/* 邀请任务 */}
                <div className="bg-gray-900/90 rounded-2xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-gray-300 font-medium">邀请任务</span>
                  </div>
                  <div className="space-y-2">
                    {INVITE_TASKS.map(task => (
                      <div key={task.friends} className={`flex items-center justify-between p-2 rounded-lg ${userData.inviteCount >= task.friends ? 'bg-green-500/20' : 'bg-gray-800/50'}`}>
                        <span className={`text-sm ${userData.inviteCount >= task.friends ? 'text-green-400' : 'text-gray-400'}`}>{task.label}</span>
                        <span className="text-xs text-gray-500">+{task.reward}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between">
                    <span className="text-sm text-gray-400">邀请奖励</span>
                    <span className="text-green-400 font-bold">+{userData.inviteBonus}次</span>
                  </div>
                </div>
              </motion.div>
            )}

            {!wallet.connected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-900/90 rounded-2xl p-8 text-center border border-gray-700">
                <Wallet className="w-14 h-14 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400 mb-4">连接钱包开始抽奖</p>
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
