'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, Lock, Clock, TrendingUp, Zap, Shield, 
  ChevronRight, Info, AlertTriangle, Check, Star,
  Sparkles, Gift, Users, ArrowUpRight, ArrowDownRight,
  X, PieChart
} from 'lucide-react';

// 质押池数据（基于业务文档）
const stakingPools = [
  {
    id: 'box',
    name: 'BOX 代币质押池',
    icon: '💰',
    color: 'cyan',
    total: '650万',
    daily: '5,937',
    basePower: '1-5x',
    openTime: 'TGE',
    poolShare: 16.25,
    lockOptions: [
      { days: 7, power: 1, apy: '8%' },
      { days: 30, power: 2, apy: '15%' },
      { days: 90, power: 3, apy: '25%' },
      { days: 180, power: 4, apy: '40%' },
      { days: 360, power: 5, apy: '60%' },
    ],
    desc: '灵活锁仓，越久收益越高',
    features: ['随时可取', '收益实时计算', 'veBOX时间权重'],
    requirement: '持有BOX代币',
  },
  {
    id: 'sui',
    name: 'SUI 代币质押池',
    icon: '🔷',
    color: 'blue',
    total: '200万',
    daily: '1,826',
    basePower: '1-4x',
    openTime: 'TGE',
    poolShare: 5,
    lockOptions: [
      { days: 30, power: 1, apy: '6%' },
      { days: 90, power: 2, apy: '12%' },
      { days: 180, power: 3, apy: '20%' },
      { days: 360, power: 4, apy: '35%' },
    ],
    desc: 'SUI本位质押，稳定收益',
    features: ['SUI本位收益', '自动复利', '灵活期限'],
    requirement: '持有SUI代币',
  },
  {
    id: 'rare',
    name: '稀有 NFT 质押池',
    icon: '💎',
    color: 'purple',
    total: '150万',
    daily: '1,370',
    basePower: '3x',
    openTime: 'TGE',
    poolShare: 3.75,
    lockOptions: [
      { days: 30, power: 3, apy: '12%' },
    ],
    desc: '质押稀有NFT获取被动收益',
    features: ['锁定30天', '3x基础算力', '每日释放'],
    requirement: '持有稀有NFT',
  },
  {
    id: 'epic',
    name: '史诗 NFT 质押池',
    icon: '⚡',
    color: 'orange',
    total: '550万',
    daily: '5,023',
    basePower: '8x',
    openTime: 'TGE+3月',
    poolShare: 13.75,
    lockOptions: [
      { days: 30, power: 8, apy: '18%' },
    ],
    desc: '史诗NFT专属质押池，高算力',
    features: ['锁定30天', '8x基础算力', 'TGE+3月开放'],
    requirement: '持有史诗NFT',
  },
  {
    id: 'legendary',
    name: '传奇 NFT 质押池',
    icon: '👑',
    color: 'yellow',
    total: '650万',
    daily: '5,937',
    basePower: '20x',
    openTime: 'TGE+3月',
    poolShare: 16.25,
    lockOptions: [
      { days: 30, power: 20, apy: '25%' },
    ],
    desc: '传奇NFT专属，最高算力',
    features: ['锁定30天', '20x基础算力', 'Real Yield分红'],
    requirement: '持有传奇NFT',
  },
  {
    id: 'mixed-rare-epic',
    name: '稀有+史诗 混合池',
    icon: '🎯',
    color: 'pink',
    total: '300万',
    daily: '2,740',
    basePower: '12x',
    openTime: 'TGE+6月',
    poolShare: 7.5,
    lockOptions: [
      { days: 30, power: 12, apy: '20%' },
    ],
    desc: '持有两种NFT，叠加收益',
    features: ['锁定30天', '12x混合算力', '1.5倍加成'],
    requirement: '持有稀有+史诗NFT',
  },
  {
    id: 'mixed-epic-legend',
    name: '史诗+传奇 混合池',
    icon: '🔥',
    color: 'red',
    total: '400万',
    daily: '3,653',
    basePower: '23x',
    openTime: 'TGE+6月',
    poolShare: 10,
    lockOptions: [
      { days: 30, power: 23, apy: '28%' },
    ],
    desc: '顶级组合，极致收益',
    features: ['锁定30天', '23x混合算力', '1.5倍加成'],
    requirement: '持有史诗+传奇NFT',
  },
  {
    id: 'everything',
    name: '万物皆可质押池',
    icon: '🌍',
    color: 'green',
    total: '350万',
    daily: '3,196',
    basePower: '叠加1.5x',
    openTime: 'TGE+6月',
    poolShare: 8.75,
    lockOptions: [
      { days: 30, power: 1.5, apy: '15%' },
    ],
    desc: '任意SUI链NFT + 1000 BOX',
    features: ['需1000BOX', '锁定30天', '叠加1.5倍算力'],
    requirement: '任意NFT + 1000 BOX',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  cyan: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  blue: { bg: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  purple: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  orange: { bg: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  yellow: { bg: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
  pink: { bg: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
  red: { bg: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20' },
  green: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
};

export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState(stakingPools[0]);
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedLock, setSelectedLock] = useState<typeof stakingPools[0]['lockOptions'][0] | null>(null);
  const [filterOpen, setFilterOpen] = useState<'all' | 'open' | 'upcoming'>('all');

  const totalStakingPool = '4000万';
  const totalReleased = '36,783';
  const remainingDays = 1095;

  // 过滤池子
  const filteredPools = stakingPools.filter(pool => {
    if (filterOpen === 'open') return pool.openTime === 'TGE';
    if (filterOpen === 'upcoming') return pool.openTime !== 'TGE';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-800 mb-4">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-400">Staking Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Staking Center
            </span>
          </h1>
          <p className="text-gray-400">4000万 BOX 质押挖矿 · 1095天释放</p>
        </motion.div>

        {/* 概览卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: '质押池总量', value: totalStakingPool, sub: 'BOX', icon: '💰', color: 'cyan' },
            { label: '今日释放', value: totalReleased, sub: 'BOX', icon: '📈', color: 'green' },
            { label: '剩余天数', value: remainingDays.toString(), sub: '天', icon: '⏱️', color: 'purple' },
            { label: '年化收益', value: '8-60%', sub: 'APY', icon: '🚀', color: 'yellow' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span>{item.icon}</span>
                <span className="text-gray-500 text-sm">{item.label}</span>
              </div>
              <p className={`text-2xl md:text-3xl font-black ${colorMap[item.color as keyof typeof colorMap]?.text || 'text-white'}`}>
                {item.value}
              </p>
              <p className="text-gray-500 text-sm">{item.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* 质押规则提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-amber-400 font-bold mb-1">⚠️ 质押须知</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 所有质押池释放时间为 <span className="text-amber-400 font-bold">1095天</span>（3年）</li>
                <li>• 提前解押需扣除 <span className="text-red-400 font-bold">50%收益</span> 作为违约金</li>
                <li>• 质押期间NFT不可交易转让</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* 过滤器 */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-gray-400 text-sm">筛选：</span>
          {[
            { key: 'all', label: '全部' },
            { key: 'open', label: '已开放' },
            { key: 'upcoming', label: '即将开放' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterOpen(filter.key as typeof filterOpen)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterOpen === filter.key
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 主内容 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧池子列表 40% */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-3"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-cyan-400" />
              质押池列表 ({filteredPools.length})
            </h2>

            {filteredPools.map((pool) => {
              const colors = colorMap[pool.color];
              const isSelected = selectedPool.id === pool.id;
              
              return (
                <motion.div
                  key={pool.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedPool(pool)}
                  className={`
                    p-4 rounded-2xl cursor-pointer transition-all border
                    ${isSelected 
                      ? `bg-gradient-to-r ${colors.bg} ${colors.border} shadow-lg ${colors.glow}` 
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center text-2xl`}>
                      {pool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white truncate">{pool.name}</h3>
                        <span className={`px-2 py-0.5 text-xs ${colors.text} bg-black/30 rounded whitespace-nowrap`}>
                          {pool.basePower}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{pool.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-bold ${colors.text}`}>{pool.total}</p>
                      <p className="text-xs text-gray-500">总量</p>
                    </div>
                  </div>

                  {/* 开放时间标签 */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs ${pool.openTime === 'TGE' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'} rounded-full`}>
                      {pool.openTime === 'TGE' ? '✅ 已开放' : `⏰ ${pool.openTime}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      日释放 {pool.daily} BOX
                    </span>
                    <span className="text-xs text-gray-600">
                      占比 {pool.poolShare}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 右侧详情 60% */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            {/* 选中池详情 */}
            <div className={`bg-gray-900 border border-gray-800 rounded-3xl p-6 bg-gradient-to-br ${colorMap[selectedPool.color].bg}`}>
              {/* 顶部信息 */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[selectedPool.color].bg} border ${colorMap[selectedPool.color].border} flex items-center justify-center text-4xl`}>
                  {selectedPool.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-white">{selectedPool.name}</h2>
                  <p className="text-gray-400">{selectedPool.desc}</p>
                </div>
                <span className={`px-4 py-2 ${selectedPool.openTime === 'TGE' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'} rounded-xl font-bold`}>
                  {selectedPool.openTime === 'TGE' ? '✅ 已开放' : selectedPool.openTime}
                </span>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-black/30 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">池子总量</p>
                  <p className={`text-lg font-black ${colorMap[selectedPool.color].text}`}>
                    {selectedPool.total}
                  </p>
                  <p className="text-xs text-gray-600">BOX</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">每日释放</p>
                  <p className={`text-lg font-black ${colorMap[selectedPool.color].text}`}>
                    {selectedPool.daily}
                  </p>
                  <p className="text-xs text-gray-600">BOX</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">基础算力</p>
                  <p className={`text-lg font-black ${colorMap[selectedPool.color].text}`}>
                    {selectedPool.basePower}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">池子占比</p>
                  <p className={`text-lg font-black ${colorMap[selectedPool.color].text}`}>
                    {selectedPool.poolShare}%
                  </p>
                </div>
              </div>

              {/* 锁定期选项 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  选择锁定期
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {selectedPool.lockOptions.map((lock) => (
                    <motion.button
                      key={lock.days}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedLock(lock);
                        setShowLockModal(true);
                      }}
                      className={`
                        p-3 rounded-xl border transition-all text-center
                        ${selectedPool.openTime === 'TGE'
                          ? 'bg-gray-800 border-gray-700 hover:border-cyan-500/50 cursor-pointer'
                          : 'bg-gray-900 border-gray-800 cursor-not-allowed opacity-50'
                        }
                      `}
                      disabled={selectedPool.openTime !== 'TGE'}
                    >
                      <p className="text-xl font-black text-white">{lock.days}天</p>
                      <p className="text-xs text-gray-400">{lock.power}x</p>
                      <p className={`text-sm font-bold ${colorMap[selectedPool.color].text}`}>{lock.apy}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 质押要求 */}
              <div className="p-4 bg-black/30 rounded-xl mb-6">
                <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  质押要求
                </p>
                <p className="text-white font-bold">{selectedPool.requirement}</p>
              </div>

              {/* 特点 */}
              <div className="space-y-2 mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">池子特点</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPool.features.map((feature, i) => (
                    <span key={i} className="px-3 py-1.5 bg-black/30 border border-gray-700 rounded-lg text-sm text-gray-300 flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-400" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* 质押按钮 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={selectedPool.openTime !== 'TGE'}
                className={`
                  w-full py-4 rounded-2xl font-bold text-lg transition-all
                  ${selectedPool.openTime === 'TGE'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {selectedPool.openTime === 'TGE' ? '立即质押' : `即将开放 (${selectedPool.openTime})`}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* 底部说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>💡 质押收益根据算力占总质押算力的比例分配，实时计算</p>
          <p className="mt-1">📊 每日收益按时分配，不累积至次日</p>
        </motion.div>
      </div>

      {/* 质押确认弹窗 */}
      <AnimatePresence>
        {showLockModal && selectedLock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">确认质押</h3>
                <button onClick={() => setShowLockModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between p-3 bg-gray-800 rounded-xl">
                  <span className="text-gray-400">质押池</span>
                  <span className="text-white font-bold">{selectedPool.name}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-800 rounded-xl">
                  <span className="text-gray-400">锁定期</span>
                  <span className="text-white font-bold">{selectedLock.days} 天</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-800 rounded-xl">
                  <span className="text-gray-400">算力倍数</span>
                  <span className="text-cyan-400 font-bold">{selectedLock.power}x</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-800 rounded-xl">
                  <span className="text-gray-400">预期年化</span>
                  <span className="text-green-400 font-bold">{selectedLock.apy}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                ⚠️ 锁定期内不可提前解押，强行解押将扣除50%收益作为违约金
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLockModal(false)}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 font-bold transition-all"
                >
                  取消
                </button>
                <button
                  onClick={() => setShowLockModal(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-xl text-white font-bold transition-all"
                >
                  确认质押
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
