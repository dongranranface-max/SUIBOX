'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Share2, Gift, Zap, Star, ArrowRight, CheckCircle, Wallet, TrendingUp } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

// 邀请奖励规则
const INVITE_REWARDS = [
  { minFriends: 1, freeOpens: 1, desc: '好友开1次', reward: '+1次/天' },
  { minFriends: 5, freeOpens: 2, desc: '好友开5次', reward: '+2次/天' },
  { minFriends: 10, freeOpens: 3, desc: '好友开10次', reward: '+3次/天' },
];

export default function InvitePage() {
  const wallet = useWallet();
  const [copied, setCopied] = useState(false);
  
  // 模拟数据
  const [inviteData] = useState({
    inviteCount: 12,
    friendsOpenedToday: 3,
    totalFreeOpens: 15,
    inviteCode: 'SUIBOX2026',
  });

  const copyCode = () => {
    navigator.clipboard.writeText(inviteData.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 根据今日好友开盒数计算奖励
  const getTodayBonus = (friendsOpened: number) => {
    if (friendsOpened >= 10) return 3;
    if (friendsOpened >= 5) return 2;
    if (friendsOpened >= 1) return 1;
    return 0;
  };

  const todayBonus = getTodayBonus(inviteData.friendsOpenedToday);
  const totalDailyOpens = 1 + todayBonus;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        
        {/* 标题 */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
            邀请好友
          </h1>
          <p className="text-gray-400">邀请好友开盲盒，双方都获奖励！</p>
        </motion.div>

        {/* 连接钱包 */}
        {!wallet.connected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-violet-900/50 to-pink-900/50 border border-violet-500/30 rounded-2xl p-8 mb-8 text-center"
          >
            <p className="text-xl mb-4 text-violet-300">连接钱包查看邀请数据</p>
            <div className="inline-block">
              <ConnectButton />
            </div>
          </motion.div>
        )}

        {/* 我的邀请数据 */}
        {wallet.connected && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 mb-8 border border-gray-800"
          >
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" />
              我的邀请数据
            </h2>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                <p className="text-3xl font-bold text-blue-400">{inviteData.inviteCount}</p>
                <p className="text-gray-400 text-sm">已邀请好友</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                <p className="text-3xl font-bold text-green-400">{inviteData.friendsOpenedToday}</p>
                <p className="text-gray-400 text-sm">今日好友开盒</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                <p className="text-3xl font-bold text-yellow-400">+{todayBonus}</p>
                <p className="text-gray-400 text-sm">今日获得次数</p>
              </div>
            </div>

            {/* 今日总次数 */}
            <div className="bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl p-4 text-center">
              <p className="text-gray-300 text-sm">今日可开盲盒次数</p>
              <p className="text-4xl font-bold">{totalDailyOpens} <span className="text-lg">次</span></p>
              <p className="text-xs text-gray-300">（每日免费1次 + 邀请奖励{todayBonus}次）</p>
            </div>
          </motion.div>
        )}

        {/* 邀请方式 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 mb-8 border border-gray-800"
        >
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Copy className="w-5 h-5 text-pink-400" />
            邀请方式
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">复制邀请码</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={inviteData.inviteCode}
                  readOnly
                  className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-center font-mono"
                />
                <button 
                  onClick={copyCode}
                  className="px-4 py-2 bg-violet-600 rounded-lg font-bold flex items-center gap-2"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Share2 className="w-4 h-4" />
              <span>或分享链接给好友</span>
            </div>
          </div>
        </motion.div>

        {/* 邀请奖励规则 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 mb-8 border border-gray-800"
        >
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-400" />
            邀请奖励规则
          </h2>
          
          <p className="text-gray-400 text-sm mb-4">
            好友每日开盲盒，你获得免费次数（按好友开盒数计算）：
          </p>

          <div className="space-y-3">
            {INVITE_REWARDS.map((rule, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-full flex items-center justify-center font-bold">
                    {rule.minFriends}
                  </div>
                  <div>
                    <p className="font-bold">{rule.desc}</p>
                    <p className="text-gray-400 text-sm">你获得 {rule.reward}</p>
                  </div>
                </div>
                <div className="text-yellow-400 font-bold text-xl">
                  +{rule.freeOpens}次
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-800/30 rounded-xl">
            <p className="text-gray-400 text-sm text-center">
              📌 每日最多可获得 6 次免费开盒机会（1次免费 + 邀请奖励）
            </p>
          </div>
        </motion.div>

        {/* 说明 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6"
        >
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            如何获得更多免费次数？
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
              邀请更多好友注册并开盲盒
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
              好友每日开盲盒，你自动获得对应次数
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
              好友开得越多，你获得越多！
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
