'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Gift, Zap, Star, Crown, Wallet, Copy, Check, ArrowRight, Lock, Award, TrendingUp, Link, ExternalLink, Share2 } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

// 邀请任务配置
const INVITE_TASKS = [
  { friends: 1, reward: 1, boxReward: 1, refReward: 0.5, label: '1人开盒', tier: 'bronze' },
  { friends: 3, reward: 2, boxReward: 3, refReward: 1.5, label: '3人开盒', tier: 'silver' },
  { friends: 15, reward: 3, boxReward: 10, refReward: 5, label: '15人开盒', tier: 'gold' },
];

const TIER_CONFIG = {
  bronze: { name: '青铜', color: 'from-amber-700 to-amber-600', border: 'border-amber-500', icon: '🥉' },
  silver: { name: '白银', color: 'from-gray-400 to-gray-300', border: 'border-gray-300', icon: '🥈' },
  gold: { name: '黄金', color: 'from-yellow-500 to-amber-500', border: 'border-yellow-400', icon: '🥇' },
};

export default function InvitePage() {
  const wallet = useWallet();
  const [copied, setCopied] = useState(false);
  const [hasEnough, setHasEnough] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 用户数据
  const [userData, setUserData] = useState({
    inviteCode: '',
    totalInvites: 0,
    todayOpened: 0,
    totalBoxEarned: 0,
    pendingBox: 0,
  });

  const canInvite = hasEnough;
  
  // 生成邀请码
  const generateInviteCode = (address: string) => {
    if (!address) return '';
    return 'SUIBOX' + address.slice(2, 8).toUpperCase();
  };

  const inviteCode = wallet.account?.address ? generateInviteCode(wallet.account.address) : '';
  const inviteLink = inviteCode ? `https://suibox.io/r/${inviteCode}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 获取用户数据
  const fetchUserData = useCallback(async () => {
    if (!wallet.account?.address) return;
    try {
      const res = await fetch(`/api/invite?address=${wallet.account.address}`);
      const data = await res.json();
      setUserData({
        inviteCode: data.inviteCode || inviteCode,
        totalInvites: data.totalInvites || 0,
        todayOpened: data.todayOpened || 0,
        totalBoxEarned: data.totalBoxEarned || 0,
        pendingBox: data.pendingBox || 0,
      });
      // 模拟检查是否有10个BOX
      setHasEnough((data.totalBoxEarned || 0) >= 10);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [wallet.account?.address, inviteCode]);

  useEffect(() => {
    if (wallet.connected) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [wallet.connected, fetchUserData]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景 */}
      <div className="fixed inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-violet-950 via-black to-purple-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            邀请好友
          </h1>
          <p className="text-gray-400">邀请好友参与盲盒，双方获得 BOX 空投！</p>
        </motion.div>

        {/* 推荐链接 */}
        {wallet.connected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Link className="w-5 h-5" />
                你的推荐链接
              </h2>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">唯一专属</span>
            </div>
            
            <div className="flex items-center gap-3 bg-black/30 rounded-xl p-1">
              <input 
                value={inviteLink}
                readOnly
                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyLink}
                className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${copied ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30'}`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制'}
              </motion.button>
            </div>
            
            <p className="text-xs text-white/60 mt-2">
              分享链接，好友通过链接参与盲盒即算邀请成功
            </p>
          </motion.div>
        )}

        {/* 邀请条件 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/80 rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">邀请条件</h2>
            </div>
          </div>
          
          <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${canInvite ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
            <div className="flex items-center gap-3">
              <Gift className={`w-8 h-8 ${canInvite ? 'text-green-400' : 'text-red-400'}`} />
              <div>
                <p className="font-bold">持有 10 个 BOX</p>
                <p className="text-sm text-gray-400">当前持有: {userData.totalBoxEarned} BOX</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold ${canInvite ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {canInvite ? '✓ 已解锁' : '🔒 未解锁'}
            </div>
          </div>
        </motion.div>

        {/* 空投奖励 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/80 rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">BOX 空投奖励</h2>
              <p className="text-gray-400 text-sm">好友开盲盒，双方获得 BOX</p>
            </div>
          </div>

          <div className="space-y-3">
            {INVITE_TASKS.map((task) => {
              const config = TIER_CONFIG[task.tier as keyof typeof TIER_CONFIG];
              return (
                <motion.div 
                  key={task.friends}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-gradient-to-r ${config.color} rounded-xl p-4 border-2 ${config.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <p className="font-bold text-white">至少 {task.friends} 人开盲盒</p>
                        <p className="text-xs text-white/70">{config.name}等级</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <p className="text-xs text-white/70">被邀请人</p>
                        <p className="font-bold text-white">+{task.boxReward}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-yellow-300">推荐人</p>
                        <p className="font-bold text-yellow-300">+{task.refReward}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
            <p className="text-sm text-yellow-300 flex items-center gap-2">
              <Award className="w-4 h-4" />
              总空投池: <span className="font-bold">1500万 BOX</span>（1000万 + 500万），送完为止
            </p>
          </div>
        </motion.div>

        {/* 每日次数奖励 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/80 rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">每日抽盒次数</h2>
              <p className="text-gray-400 text-sm">好友开盲盒，你获得额外抽盒次数</p>
            </div>
          </div>

          <div className="space-y-2">
            {INVITE_TASKS.map((task) => (
              <div key={task.friends} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                <span className="text-gray-300">至少 {task.friends} 人开盲盒</span>
                <span className="text-green-400 font-bold">+{task.reward} 次/天</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/30">
            <p className="text-sm text-green-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              每日最多 <span className="font-bold">7 次</span>（1次免费 + 最多6次邀请奖励）
            </p>
          </div>
        </motion.div>

        {/* 我的邀请统计 */}
        {wallet.connected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/80 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg">我的邀请</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-violet-400">{userData.totalInvites}</p>
                <p className="text-xs text-gray-400">累计邀请</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-green-400">{userData.todayOpened}</p>
                <p className="text-xs text-gray-400">今日开盒</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-yellow-400">{userData.totalBoxEarned}</p>
                <p className="text-xs text-gray-400">已获得BOX</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-orange-400">{userData.pendingBox}</p>
                <p className="text-xs text-gray-400">待领取</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 未连接钱包 */}
        {!wallet.connected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-gray-900/80 rounded-2xl p-8 text-center border border-gray-700">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-4">连接钱包获取专属推荐链接</p>
            <ConnectButton />
          </motion.div>
        )}
      </div>
    </div>
  );
}
