'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Coins, Clock, ArrowUpRight, ArrowDownRight, Lock, Unlock, ChevronRight, History, TrendingUp, Gem, Crown, Sparkles } from 'lucide-react';

// 模拟用户质押数据
const mockStakes = [
  { id: 1, pool: '稀缺NFT', type: 'epic', nft: '星辰大海 #88', stakedAt: '2026-03-10', days: 5, weight: 5, earnings: 125.5, lockUntil: '2026-03-13' },
  { id: 2, pool: '史诗NFT', type: 'rare', nft: '烈焰麒麟 #66', stakedAt: '2026-03-08', days: 7, weight: 3, earnings: 89.2, lockUntil: '2026-03-11' },
  { id: 3, pool: '精品NFT', type: 'common', nft: '机械之心 #77', stakedAt: '2026-03-12', days: 3, weight: 1, earnings: 45.8, lockUntil: '2026-03-15' },
];

const mockEarnings = [
  { date: '2026-03-15', amount: 45.6, type: '稀缺NFT #88' },
  { date: '2026-03-14', amount: 38.2, type: '稀缺NFT #88' },
  { date: '2026-03-14', amount: 25.4, type: '史诗NFT #66' },
  { date: '2026-03-13', amount: 41.8, type: '稀缺NFT #88' },
  { date: '2026-03-13', amount: 22.1, type: '精品NFT #77' },
];

const poolConfig: Record<string, { icon: string; color: string; textColor: string }> = {
  epic: { icon: '👑', color: 'from-amber-500 to-orange-600', textColor: 'text-amber-400' },
  rare: { icon: '💎', color: 'from-blue-500 to-cyan-600', textColor: 'text-blue-400' },
  common: { icon: '✨', color: 'from-violet-500 to-purple-600', textColor: 'text-violet-400' },
};

export default function StakePage() {
  const [activeTab, setActiveTab] = useState<'stakes' | 'earnings' | 'unstake'>('stakes');
  const [selectedStake, setSelectedStake] = useState<number | null>(null);

  const totalEarnings = mockStakes.reduce((sum, s) => sum + s.earnings, 0);
  const totalWeight = mockStakes.reduce((sum, s) => sum + s.weight, 0);
  const todayEarnings = mockEarnings[0]?.amount || 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 头部 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-violet-900/30 to-black py-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Wallet className="w-7 h-7 text-violet-400" />
              我的质押
            </h1>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Coins className="w-4 h-4" />
                  <span className="text-sm">累计收益</span>
                </div>
                <div className="text-3xl font-bold text-amber-400">{totalEarnings.toFixed(1)}</div>
                <div className="text-xs text-gray-500">BOX</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">今日收益</span>
                </div>
                <div className="text-3xl font-bold text-green-400">+{todayEarnings.toFixed(1)}</div>
                <div className="text-xs text-gray-500">BOX</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Gem className="w-4 h-4" />
                  <span className="text-sm">总算力</span>
                </div>
                <div className="text-3xl font-bold text-purple-400">{totalWeight}x</div>
                <div className="text-xs text-gray-500">权重</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('stakes')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${activeTab === 'stakes' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            📊 我的质押
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${activeTab === 'earnings' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            💰 收益记录
          </button>
          <button
            onClick={() => setActiveTab('unstake')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${activeTab === 'unstake' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            🔓 解除质押
          </button>
        </div>

        {/* 我的质押 */}
        {activeTab === 'stakes' && (
          <div className="space-y-4">
            {mockStakes.map((stake) => {
              const config = poolConfig[stake.type];
              return (
                <motion.div
                  key={stake.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl`}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="font-bold">{stake.nft}</div>
                        <div className={`text-sm ${config.textColor}`}>{stake.pool}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          质押于 {stake.stakedAt} · 已质押 {stake.days} 天
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-400">+{stake.earnings.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">累计收益</div>
                      <div className="text-sm text-purple-400 mt-1">{stake.weight}x 算力</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {mockStakes.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Gem className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无质押记录</p>
                <p className="text-sm mt-2">去质押页面开始质押吧</p>
              </div>
            )}
          </div>
        )}

        {/* 收益记录 */}
        {activeTab === 'earnings' && (
          <div className="space-y-3">
            {mockEarnings.map((record, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <ArrowDownRight className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">{record.type}</div>
                    <div className="text-xs text-gray-500">{record.date}</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-green-400">+{record.amount}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 解除质押 */}
        {activeTab === 'unstake' && (
          <div className="space-y-4">
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30 mb-6">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold">解除质押冷却期</span>
              </div>
              <p className="text-sm text-gray-400">
                解除质押后需等待 72 小时才能提取NFT到钱包
              </p>
            </div>

            {mockStakes.map((stake) => {
              const config = poolConfig[stake.type];
              const isUnlocked = new Date(stake.lockUntil) <= new Date();
              return (
                <motion.div
                  key={stake.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white/5 rounded-xl p-4 border ${selectedStake === stake.id ? 'border-violet-500' : 'border-white/10'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => setSelectedStake(selectedStake === stake.id ? null : stake.id)}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition ${
                          selectedStake === stake.id ? 'border-violet-500 bg-violet-500' : 'border-gray-500'
                        }`}
                      >
                        {selectedStake === stake.id && <Sparkles className="w-4 h-4 text-white" />}
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-xl`}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="font-bold">{stake.nft}</div>
                        <div className={`text-sm ${config.textColor}`}>{stake.pool}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isUnlocked ? (
                        <span className="text-green-400 text-sm flex items-center gap-1">
                          <Unlock className="w-4 h-4" /> 可解除
                        </span>
                      ) : (
                        <span className="text-amber-400 text-sm flex items-center gap-1">
                          <Lock className="w-4 h-4" /> {stake.lockUntil}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {selectedStake && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Unlock className="w-5 h-5" />
                确认解除质押
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
