'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coins, Lock, TrendingUp, Users, Clock, Award, Wallet, ChevronRight, Sparkles, Diamond, Gem, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

// ============= 质押池配置 =============
const STAKING_POOLS = {
  // 单一资产质押
  single: [
    { id: 'box', name: 'BOX质押', icon: '🪙', totalPool: '1亿', poolAmount: 100000000, color: 'from-amber-500 to-yellow-600', borderColor: 'border-amber-500/50', textColor: 'text-amber-400', apr: '15%', daily: 411, desc: '持有BOX即可参与质押' },
    { id: 'sui', name: 'SUI质押', icon: '🔷', totalPool: '5000万', poolAmount: 50000000, color: 'from-green-500 to-emerald-600', borderColor: 'border-green-500/50', textColor: 'text-green-400', apr: '12%', daily: 164, desc: 'SUI代币质押收益' },
  ],
  // NFT质押
  nft: [
    { id: 'common', name: '精品NFT质押', icon: '✨', totalPool: '5000万', poolAmount: 50000000, color: 'from-violet-500 to-purple-600', borderColor: 'border-violet-500/50', textColor: 'text-violet-400', apr: '18%', daily: 2466, weight: 1, desc: '入门级NFT矿池' },
    { id: 'rare', name: '史诗NFT质押', icon: '💎', totalPool: '3000万', poolAmount: 30000000, color: 'from-blue-500 to-cyan-600', borderColor: 'border-blue-500/50', textColor: 'text-blue-400', apr: '25%', daily: 2055, weight: 3, desc: '稀有NFT专属矿池' },
    { id: 'epic', name: '稀缺NFT质押', icon: '👑', totalPool: '1000万', poolAmount: 10000000, color: 'from-amber-500 to-orange-600', borderColor: 'border-amber-500/50', textColor: 'text-amber-400', apr: '32%', daily: 877, weight: 5, desc: '稀有度最高的NFT矿池' },
  ],
  // 混合质押
  hybrid: [
    { id: 'epic-hybrid', name: '稀缺+尊享', icon: '👑', nft: '稀缺NFT', box: '5000', totalPool: '2800万', poolAmount: 28000000, color: 'from-amber-500 to-red-600', borderColor: 'border-amber-500/50', textColor: 'text-amber-400', apr: '40%', daily: 3070, weight: 8, desc: '稀缺NFT+5000BOX尊享池' },
    { id: 'rare-hybrid', name: '史诗+豪华', icon: '💎', nft: '史诗NFT', box: '10000', totalPool: '3200万', poolAmount: 32000000, color: 'from-purple-500 to-pink-600', borderColor: 'border-purple-500/50', textColor: 'text-purple-400', apr: '35%', daily: 3070, weight: 6, desc: '史诗NFT+10000BOX豪华池' },
    { id: 'common-hybrid', name: '精品+进阶', icon: '✨', nft: '精品NFT', box: '10000', totalPool: '3500万', poolAmount: 35000000, color: 'from-indigo-500 to-blue-600', borderColor: 'border-indigo-500/50', textColor: 'text-indigo-400', apr: '30%', daily: 2877, weight: 4, desc: '精品NFT+10000BOX进阶池' },
  ],
  // 任意NFT池
  any: [
    { id: 'any-nft', name: '万物可质押', icon: '🌐', totalPool: '1.2亿', poolAmount: 120000000, color: 'from-rose-500 to-pink-600', borderColor: 'border-rose-500/50', textColor: 'text-rose-400', apr: '20%', daily: 6575, weight: 2, desc: '任意SUI链NFT+1000BOX', require: '需官方推荐NFT' },
  ],
};

// 趋势图组件
function PoolChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const colors: Record<string, { start: string; end: string }> = {
    amber: { start: '#f59e0b', end: '#fbbf24' },
    green: { start: '#22c55e', end: '#34d399' },
    violet: { start: '#8b5cf6', end: '#a78bfa' },
    blue: { start: '#3b82f6', end: '#06b6d4' },
    purple: { start: '#a855f7', end: '#ec4899' },
    indigo: { start: '#6366f1', end: '#3b82f6' },
    rose: { start: '#f43f5e', end: '#fb7185' },
  };
  
  const c = colors[color] || colors.blue;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="mt-2 h-16 relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
        <polygon points={`0,100 ${points} 100,100`} fill={c.start} fillOpacity="0.15" />
        <polyline points={points} fill="none" stroke={c.end} strokeWidth="2" strokeLinecap="round" />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d - min) / range) * 80 - 10;
          return <circle key={i} cx={x} cy={y} r="1.2" fill="white" />;
        })}
      </svg>
    </div>
  );
}

// 池子卡片组件
function PoolCard({ pool, isSelected, onClick }: { pool: any; isSelected: boolean; onClick: () => void }) {
  const chartData = Array.from({ length: 7 }, () => Math.floor(pool.poolAmount * (0.3 + Math.random() * 0.7)));
  const growth = ((chartData[6] / chartData[0] - 1) * 100).toFixed(0);
  
  // 计算预计开采时间
  const daysLeft = pool.daily > 0 ? Math.floor(pool.poolAmount / pool.daily) : 0;
  const isLongTerm = pool.id === 'box' || pool.id === 'sui';
  const timeDisplay = isLongTerm 
    ? '长期池' 
    : daysLeft > 365 
      ? `${Math.floor(daysLeft/365)}年+` 
      : daysLeft > 30 
        ? `约${Math.floor(daysLeft/30)}个月` 
        : `约${daysLeft}天`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`relative rounded-xl border-2 cursor-pointer transition-all ${isSelected ? `${pool.borderColor} bg-white/10` : 'border-white/10 bg-white/5 hover:border-white/20'}`}
    >
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${pool.color}`} />
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pool.color} flex items-center justify-center text-2xl`}>
              {pool.icon}
            </div>
            <div>
              <h3 className={`font-bold ${pool.textColor}`}>{pool.name}</h3>
              <p className="text-xs text-gray-400">{pool.desc}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${pool.textColor}`}>{pool.totalPool}</div>
            <div className="text-xs text-gray-500">总矿池</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="flex-1 bg-black/30 rounded-lg p-2">
            <div className="text-xs text-gray-500">年化APY</div>
            <div className="font-bold text-green-400">{pool.apr}</div>
          </div>
          <div className="flex-1 bg-black/30 rounded-lg p-2">
            <div className="text-xs text-gray-500">日分配</div>
            <div className="font-bold">{pool.daily?.toLocaleString()}</div>
          </div>
          <div className="flex-1 bg-black/30 rounded-lg p-2">
            <div className="text-xs text-gray-500">预计开采</div>
            <div className={`font-bold ${isLongTerm ? 'text-blue-400' : daysLeft < 30 ? 'text-red-400' : 'text-amber-400'}`}>
              {timeDisplay}
            </div>
          </div>
          {pool.weight && (
            <div className="flex-1 bg-black/30 rounded-lg p-2">
              <div className="text-xs text-gray-500">算力</div>
              <div className="font-bold text-purple-400">{pool.weight}x</div>
            </div>
          )}
        </div>
        
        {/* 趋势图 */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">7日增长</span>
            <span className="text-green-400">+{growth}%</span>
          </div>
          <PoolChart data={chartData} color={pool.color.split(' ')[1].replace('to-', '')} />
        </div>
      </div>
    </motion.div>
  );
}

export default function MiningPage() {
  const router = useRouter();
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('single');
  const [selectedPool, setSelectedPool] = useState<any>(null);

  // 检查登录状态
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/login?redirect=/mine');
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        router.push('/login?redirect=/mine');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }
  
  const sections = [
    { id: 'single', label: '💰 单一资产', pools: STAKING_POOLS.single },
    { id: 'nft', label: '💎 NFT质押', pools: STAKING_POOLS.nft },
    { id: 'hybrid', label: '🏆 混合质押', pools: STAKING_POOLS.hybrid },
    { id: 'any', label: '🌐 任意NFT', pools: STAKING_POOLS.any },
  ];

  const currentPools = STAKING_POOLS[activeSection as keyof typeof STAKING_POOLS] || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 头部 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-violet-900/30 to-black py-10">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, violet 0%, transparent 50%)' }} />
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
              <Coins className="w-8 h-8 text-amber-400" />
              质押挖矿
            </h1>
            <p className="text-gray-400 mb-6 text-center">质押资产参与矿池分红，每日获取BOX奖励</p>
            
            {/* 总统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-bold text-amber-400">5.05亿</div>
                <div className="text-xs text-gray-400">总矿池</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-bold text-green-400">12.3万</div>
                <div className="text-xs text-gray-400">参与人数</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-bold text-blue-400">15.6万</div>
                <div className="text-xs text-gray-400">总质押NFT</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-bold text-purple-400">+2.8万</div>
                <div className="text-xs text-gray-400">今日新增</div>
              </div>
            </div>
            
            {/* 快捷操作 */}
            <div className="flex justify-center gap-4 mt-6">
              <Link href="/mine/stake" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-sm transition flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                我的质押
              </Link>
              <Link href="/mine/claim" className="px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 rounded-full text-sm text-amber-400 transition flex items-center gap-2">
                <Coins className="w-4 h-4" />
                提取收益
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* 分类切换 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => { setActiveSection(section.id); setSelectedPool(null); }}
              className={`px-5 py-2.5 rounded-full font-medium transition ${activeSection === section.id ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* 说明文字 */}
        <div className="mb-6 text-center">
          {activeSection === 'single' && <p className="text-gray-400 text-sm">持有BOX或SUI即可参与质押，获得稳定收益</p>}
          {activeSection === 'nft' && <p className="text-gray-400 text-sm">质押NFT参与分红，稀有度越高算力权重越高</p>}
          {activeSection === 'hybrid' && <p className="text-gray-400 text-sm">持有NFT + BOX组合质押，算力叠加收益翻倍</p>}
          {activeSection === 'any' && <p className="text-gray-400 text-sm">任意SUI链NFT + 1000 BOX即可参与，门槛低覆盖广</p>}
        </div>

        {/* 池子列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPools.map((pool) => (
            <PoolCard 
              key={pool.id} 
              pool={pool} 
              isSelected={selectedPool?.id === pool.id}
              onClick={() => setSelectedPool(pool)}
            />
          ))}
        </div>

        {/* 选中池子详情 */}
        {selectedPool && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedPool.color} flex items-center justify-center text-2xl`}>
                  {selectedPool.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${selectedPool.textColor}`}>{selectedPool.name}</h3>
                  <p className="text-sm text-gray-400">{selectedPool.desc}</p>
                </div>
              </div>
              <button className={`px-6 py-3 bg-gradient-to-r ${selectedPool.color} rounded-xl font-bold flex items-center gap-2`}>
                <Lock className="w-4 h-4" />
                立即质押
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">总矿池</div>
                <div className={`text-2xl font-bold ${selectedPool.textColor}`}>{selectedPool.totalPool} BOX</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">年化收益率</div>
                <div className="text-2xl font-bold text-green-400">{selectedPool.apr}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">每日分配</div>
                <div className="text-2xl font-bold">{selectedPool.daily?.toLocaleString()} BOX</div>
              </div>
            </div>
            
            {selectedPool.box && (
              <div className="mt-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <div className="text-sm text-amber-400">📋 质押要求</div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  <span>• {selectedPool.nft}</span>
                  <span>• + {selectedPool.box} BOX</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 收益计算说明 */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            收益计算说明
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              质押后立即开始计算收益，每日0:00 UTC结算
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              收益 = 你的算力 ÷ 总算力 × 每日分配
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              随时可解除质押，72小时冷却期
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              持有碎片可提升算力倍数，最高2倍
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
