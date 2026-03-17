'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2, Users, Star, Crown, Wallet, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

// 规则配置
const PROBABILITY = { common: 40, rare: 19, epic: 1, none: 40 };
const GUARANTEE = { common: 3, rare: 7, epic: 35 };

const FRAGMENT = {
  common: { name: '普通碎片', rarity: 'R', icon: '🎯', color: 'from-gray-400 to-gray-600', text: 'text-gray-300' },
  rare: { name: '稀有碎片', rarity: 'SR', icon: '⭐', color: 'from-blue-400 to-cyan-600', text: 'text-blue-400' },
  epic: { name: '史诗碎片', rarity: 'SSR', icon: '💎', color: 'from-yellow-400 to-amber-600', text: 'text-yellow-400' },
  none: { name: '感谢参与', rarity: '谢谢参与', icon: '🙏', color: 'from-gray-600 to-gray-800', text: 'text-gray-500' },
};

// 碎片展示组件
function FragmentDisplay({ fragments }: { fragments: { common: number; rare: number; epic: number } }) {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-4">
      <p className="text-gray-400 text-sm mb-3">我的碎片</p>
      <div className="flex justify-around">
        {[
          { key: 'common', icon: '🎯', count: fragments.common },
          { key: 'rare', icon: '⭐', count: fragments.rare },
          { key: 'epic', icon: '💎', count: fragments.epic },
        ].map(item => (
          <div key={item.key} className="text-center">
            <div className="text-3xl mb-1">{item.icon}</div>
            <p className="text-2xl font-bold">{item.count}</p>
            <p className="text-xs text-gray-500">{item.key === 'common' ? '普通' : item.key === 'rare' ? '稀有' : '史诗'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 邀请面板
function InvitePanel({ inviteCode, onCopy }: { inviteCode: string; onCopy: () => void }) {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-4">
      <p className="text-gray-400 text-sm mb-3">邀请好友得免费次数</p>
      <div className="flex items-center gap-2">
        <input 
          value={inviteCode} 
          readOnly 
          className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm font-mono"
        />
        <button onClick={onCopy} className="p-2 bg-violet-600 rounded-lg">
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// 主页面
export default function BoxPage() {
  const wallet = useWallet();
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{ type: string; rarity: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [userData, setUserData] = useState({
    dailyFreeCount: 1,
    inviteBonus: 0,
    uniqueFriendsToday: 0,
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
    
    setError(null); setIsOpening(true);
    
    try {
      await fetch('/api/box', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: wallet.account?.address, action: 'open_box' }) });
      await new Promise(r => setTimeout(r, 2000));
      
      const rand = Math.random() * 100;
      let rt: string, rr: string;
      
      if (userData.noneCount >= GUARANTEE.epic) { rt = 'epic'; rr = 'SSR'; }
      else if (userData.noneCount >= GUARANTEE.rare) { rt = 'rare'; rr = 'SR'; }
      else if (userData.noneCount >= GUARANTEE.common) { rt = 'common'; rr = 'R'; }
      else {
        if (rand < 1) { rt = 'epic'; rr = 'SSR'; }
        else if (rand < 20) { rt = 'rare'; rr = 'SR'; }
        else if (rand < 60) { rt = 'common'; rr = 'R'; }
        else { rt = 'none'; rr = '谢谢参与'; }
      }
      
      setResult({ type: rt, rarity: rr });
      setShowResult(true);
      fetchUserData();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : '开盒失败'); }
    setIsOpening(false);
  }, [wallet.connected, wallet.account?.address, totalDailyCount, userData.noneCount, fetchUserData]);

  const copyCode = () => {
    navigator.clipboard.writeText(userData.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景 */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-900/30 via-black to-pink-900/30" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            NFT 盲盒
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧 - 大盲盒 */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            >
              {/* 装饰 */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
              
              {/* 盲盒图标 */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative z-10"
              >
                <Gift className="w-32 h-32 md:w-48 md:h-48 mx-auto text-white/90 drop-shadow-2xl" />
              </motion.div>

              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10 mt-6"
              >
                <Sparkles className="w-6 h-6 mx-auto text-yellow-300" />
              </motion.div>

              {/* 按钮 */}
              <div className="relative z-10 mt-8">
                {!wallet.connected ? (
                  <ConnectButton />
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpen}
                    disabled={!canOpen || isOpening}
                    className="px-10 py-4 bg-white text-violet-600 rounded-full font-bold text-xl disabled:opacity-50 flex items-center gap-3 mx-auto"
                  >
                    {isOpening ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                    {isOpening ? '开启中...' : '免费开盒'}
                  </motion.button>
                )}
              </div>

              {/* 剩余次数 */}
              {wallet.connected && (
                <p className="relative z-10 mt-4 text-white/70">
                  今日剩余 {totalDailyCount} 次
                </p>
              )}
            </motion.div>

            {/* 概率 */}
            <div className="mt-6 bg-gray-900/50 rounded-2xl p-4">
              <p className="text-center text-gray-400 text-sm mb-3">概率公示</p>
              <div className="flex justify-center gap-4 md:gap-8">
                {[
                  { icon: '🎯', p: '40%', g: '3次' },
                  { icon: '⭐', p: '19%', g: '7次' },
                  { icon: '💎', p: '1%', g: '35次' },
                  { icon: '🙏', p: '40%', g: '-' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl">{item.icon}</div>
                    <p className="text-yellow-400 font-bold">{item.p}</p>
                    <p className="text-xs text-gray-500">{item.g !== '-' ? `保${item.g}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧 */}
          <div className="space-y-4">
            {/* 用户信息 */}
            {wallet.connected && !loading && (
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* 进度 */}
                <div className="bg-gray-900/50 rounded-2xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">保底进度</span>
                    <span className={userData.noneCount >= 35 ? 'text-yellow-400' : userData.noneCount >= 7 ? 'text-purple-400' : 'text-blue-400'}>
                      {userData.noneCount >= 35 ? '🎉 下一发必中' : userData.noneCount >= 7 ? '⭐ 下一发必中' : userData.noneCount >= 3 ? `🎯 ${3 - userData.noneCount}次必中` : `${userData.noneCount}/35`}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((userData.noneCount / 35) * 100, 100)}%` }}
                      className={`h-full bg-gradient-to-r ${userData.noneCount >= 35 ? 'from-yellow-500' : userData.noneCount >= 7 ? 'from-purple-500' : 'from-blue-500'} to-transparent rounded-full`}
                    />
                  </div>
                </div>

                {/* 碎片 */}
                <FragmentDisplay fragments={userData.fragments} />

                {/* 邀请 */}
                <InvitePanel inviteCode={userData.inviteCode} onCopy={copyCode} />
              </motion.div>
            )}

            {/* 未连接 */}
            {!wallet.connected && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-900/50 rounded-2xl p-8 text-center"
              >
                <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400 mb-4">连接钱包开始抽取</p>
                <ConnectButton />
              </motion.div>
            )}
          </div>
        </div>

        {/* 错误 */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* 结果弹窗 */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setShowResult(false)}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-gray-900 rounded-3xl p-8 text-center max-w-sm"
                onClick={e => e.stopPropagation()}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  {FRAGMENT[result.type as keyof typeof FRAGMENT]?.icon || '🙏'}
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">
                  {FRAGMENT[result.type as keyof typeof FRAGMENT]?.name || '感谢参与'}
                </h2>
                <p className={`text-3xl font-black mb-6 ${FRAGMENT[result.type as keyof typeof FRAGMENT]?.text}`}>
                  {result.rarity}
                </p>
                <button onClick={() => setShowResult(false)} className="px-8 py-3 bg-violet-600 rounded-full font-bold">
                  收下
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
