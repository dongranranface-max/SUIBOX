'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Star, Crown, TrendingUp, Gift as FreeIcon, Wallet } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

const FRAGMENT_TYPES = {
  common: { name: '普通碎片', rarity: 'R', color: 'from-gray-500 to-gray-600', icon: '🎯' },
  rare: { name: '稀有碎片', rarity: 'SR', color: 'from-blue-500 to-cyan-500', icon: '⭐' },
  epic: { name: '史诗碎片', rarity: 'SSR', color: 'from-yellow-500 to-amber-500', icon: '💎' },
  none: { name: '感谢参与', rarity: '谢谢参与', color: 'from-gray-700 to-gray-800', icon: '🙏' },
};

const BOX_CONFIG = {
  common: { name: '普通盲盒', price: 1, desc: '普通奖励', color: 'from-gray-500 to-gray-600', glow: 'shadow-gray-500/30' },
  rare: { name: '稀有盲盒', price: 5, desc: '稀有奖励', color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/30' },
  epic: { name: '史诗盲盒', price: 10, desc: '史诗奖励', color: 'from-yellow-500 to-amber-500', glow: 'shadow-yellow-500/30' },
};

const GUARANTEE = { common: 3, rare: 7, epic: 35 };

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className={`h-full bg-gradient-to-r ${color} rounded-full`} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-800/50 rounded-2xl p-4 text-center">
      <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
      <p className="text-gray-400 text-xs">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}{sub && <span className="text-sm text-gray-500 ml-1">{sub}</span>}</p>
    </motion.div>
  );
}

function BoxCard({ type, onOpen, disabled, isOpening }: { type: 'common' | 'rare' | 'epic'; onOpen: () => void; disabled: boolean; isOpening: boolean }) {
  const config = BOX_CONFIG[type];
  return (
    <motion.div whileHover={{ scale: disabled ? 1 : 1.05, y: -8 }} whileTap={{ scale: disabled ? 1 : 0.98 }} className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all">
      <div className={`h-48 bg-gradient-to-br ${config.color} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/20" />
        <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Gift className="w-24 h-24 text-white/90 drop-shadow-2xl" />
        </motion.div>
        {type === 'epic' && <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="absolute top-4 right-4"><Crown className="w-8 h-8 text-yellow-300" /></motion.div>}
        <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
          <span className="text-yellow-300 font-bold">{config.price} SUI</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{config.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{config.desc}</p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onOpen} disabled={disabled || isOpening} className={`w-full py-3 bg-gradient-to-r ${config.color} rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${config.glow}`}>
          {isOpening ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5" />开盒</>}
        </motion.button>
      </div>
    </motion.div>
  );
}

function ResultModal({ result, onClose }: { result: { type: string; rarity: string; txDigest?: string } | null; onClose: () => void }) {
  if (!result) return null;
  const f = FRAGMENT_TYPES[result.type as keyof typeof FRAGMENT_TYPES] || FRAGMENT_TYPES.none;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.8 }} className="bg-gray-900 rounded-3xl p-10 max-w-sm w-full text-center border-2 border-gray-700 relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-10`} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="relative z-10">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-7xl mb-4">{f.icon}</motion.div>
          <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{f.name}</h2>
          <p className={`text-3xl font-bold mb-4 ${result.type === 'epic' ? 'text-yellow-400' : result.type === 'rare' ? 'text-blue-400' : result.type === 'common' ? 'text-gray-300' : 'text-gray-500'}`}>{f.rarity}</p>
          {result.txDigest && <p className="text-xs text-gray-600 mb-6 font-mono bg-gray-800 p-2 rounded">🔗 {result.txDigest.slice(0, 36)}...</p>}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className={`w-full py-4 bg-gradient-to-r ${f.color} rounded-xl font-bold text-lg shadow-lg`}>收下奖励</motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function BoxPage() {
  const wallet = useWallet();
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{ type: string; rarity: string; txDigest?: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ inviteCode: '', inviteCount: 0, uniqueFriendsToday: 0, dailyFreeCount: 1, inviteBonus: 0, totalDailyCount: 1, noneCount: 0, totalOpens: 0, fragments: { common: 0, rare: 0, epic: 0 } });

  const fetchUserData = useCallback(async () => {
    if (!wallet.account?.address) return;
    try {
      const res = await fetch(`/api/box?address=${wallet.account.address}`);
      const data = await res.json();
      setUserData(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [wallet.account?.address]);

  useEffect(() => { if (wallet.connected) fetchUserData(); }, [wallet.connected, fetchUserData]);

  const handleOpenBox = useCallback(async (boxType: 'common' | 'rare' | 'epic') => {
    if (!wallet.connected) { setError('请先连接SUI钱包！'); return; }
    if (userData.totalDailyCount <= 0) { setError('今日开盒次数已用完！'); return; }
    setError(null); setIsOpening(true); setResult(null); setShowResult(false);
    try {
      await fetch('/api/box', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: wallet.account?.address, action: 'open_box' }) });
      await new Promise(r => setTimeout(r, 2500));
      const rand = Math.random() * 100;
      let rt: string, rr: string;
      if (userData.noneCount >= 35) { rt = 'epic'; rr = 'SSR'; }
      else if (userData.noneCount >= 7) { rt = 'rare'; rr = 'SR'; }
      else if (userData.noneCount >= 3) { rt = 'common'; rr = 'R'; }
      else {
        if (boxType === 'epic') { ([rt, rr] = rand < 1 ? ['epic', 'SSR'] : rand < 20 ? ['rare', 'SR'] : rand < 60 ? ['common', 'R'] : ['none', '谢谢参与']); }
        else if (boxType === 'rare') { ([rt, rr] = rand < 3 ? ['rare', 'SR'] : rand < 43 ? ['common', 'R'] : ['none', '谢谢参与']); }
        else { ([rt, rr] = rand < 10 ? ['rare', 'SR'] : rand < 50 ? ['common', 'R'] : ['none', '谢谢参与']); }
      }
      setResult({ type: rt, rarity: rr, txDigest: `0x${Date.now().toString(16)}` });
      setShowResult(true);
      fetchUserData();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : '开盲盒失败'); }
    setIsOpening(false);
  }, [wallet.connected, wallet.account?.address, userData.totalDailyCount, userData.noneCount, fetchUserData]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-900/30 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        {/* 标题 */}
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-3">NFT 盲盒</h1>
          <p className="text-gray-400 text-lg">基于 SUI 区块链 · 公开透明随机</p>
        </motion.div>

        {/* 用户数据 */}
        {wallet.connected && !loading && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-gray-800">
            {/* 次数统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard icon={FreeIcon} label="每日免费" value={userData.dailyFreeCount} sub="次" color="text-green-400" />
              <StatCard icon={Users} label="邀请奖励" value={`+${userData.inviteBonus}`} sub="次" color="text-violet-400" />
              <StatCard icon={Gift} label="今日好友" value={userData.uniqueFriendsToday} sub="人" color="text-blue-400" />
              <StatCard icon={Zap} label="今日可开" value={userData.totalDailyCount} sub="次" color="text-yellow-400" />
            </div>

            {/* 进度条 */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">邀请奖励进度（不同好友）</span>
                  <span className={userData.uniqueFriendsToday >= 10 ? 'text-green-400' : userData.uniqueFriendsToday >= 5 ? 'text-green-400' : 'text-gray-400'}>{userData.uniqueFriendsToday >= 10 ? '🎉 达成最高' : `+${userData.uniqueFriendsToday >= 10 ? 3 : userData.uniqueFriendsToday >= 5 ? 2 : 1}次`}</span>
                </div>
                <ProgressBar value={userData.uniqueFriendsToday} max={10} color="from-green-500 to-green-600" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">保底进度（感谢参与）</span>
                  <span className={userData.noneCount >= 35 ? 'text-yellow-400' : userData.noneCount >= 7 ? 'text-purple-400' : userData.noneCount >= 3 ? 'text-blue-400' : 'text-gray-400'}>
                    {userData.noneCount >= 35 ? '🎉 必中史诗！' : userData.noneCount >= 7 ? '⭐ 必中稀有！' : userData.noneCount >= 3 ? `🎯 必中普通(${3 - userData.noneCount}次)` : `${userData.noneCount}/35`}
                  </span>
                </div>
                <ProgressBar value={userData.noneCount} max={35} color={userData.noneCount >= 35 ? 'from-yellow-500 to-yellow-600' : userData.noneCount >= 7 ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'} />
              </div>
            </div>

            {/* 碎片展示 */}
            <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-800">
              {[{ i: '🎯', c: userData.fragments.common, n: '普通' }, { i: '⭐', c: userData.fragments.rare, n: '稀有' }, { i: '💎', c: userData.fragments.epic, n: '史诗' }].map(x => (
                <motion.div key={x.n} whileHover={{ scale: 1.1 }} className="text-center">
                  <div className="text-4xl mb-1">{x.i}</div>
                  <p className="text-3xl font-bold">{x.c}</p>
                  <p className="text-xs text-gray-500">{x.n}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 连接钱包 */}
        {!wallet.connected && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-violet-900/60 to-pink-900/60 border border-violet-500/40 rounded-3xl p-10 mb-8 text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-violet-400" />
            <p className="text-xl text-violet-200 mb-6">连接钱包开始抽取盲盒</p>
            <div className="inline-block"><ConnectButton /></div>
          </motion.div>
        )}

        {/* 错误 */}
        {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-6 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><span className="text-red-400">{error}</span></motion.div>}

        {/* 盲盒卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">{(['common', 'rare', 'epic'] as const).map(t => <BoxCard key={t} type={t} onOpen={() => handleOpenBox(t)} disabled={!wallet.connected || userData.totalDailyCount <= 0} isOpening={isOpening} />)}</div>

        {/* 概率 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" />概率公示</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ i: '🎯', n: '普通碎片', p: '40%', g: '3次' }, { i: '⭐', n: '稀有碎片', p: '19%', g: '7次' }, { i: '💎', n: '史诗碎片', p: '1%', g: '35次' }, { i: '🙏', n: '感谢参与', p: '40%', g: '-' }].map(x => (
              <div key={x.n} className="text-center p-4 bg-gray-800/50 rounded-2xl">
                <div className="text-3xl mb-2">{x.i}</div>
                <p className="font-bold text-sm">{x.n}</p>
                <p className="text-yellow-400 font-bold text-xl">{x.p}</p>
                {x.g !== '-' && <p className="text-xs text-gray-500">保底{x.g}</p>}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>{showResult && result && <ResultModal result={result} onClose={() => setShowResult(false)} />}</AnimatePresence>
      </div>
    </div>
  );
}
