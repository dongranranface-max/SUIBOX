'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Lock, Unlock, Wallet, TrendingUp, Users, Shield, Gift, Clock, Flame, CheckCircle } from 'lucide-react';

// ========== 类型定义 ==========
type PoolType = 'common' | 'premium' | 'vip';

interface StakedNFT {
  id: string;
  name: string;
  image: string;
  rarity: string;
  stakedDays: number;
}

interface Pool {
  type: PoolType;
  name: string;
  minCount: number;
  multiplier: number;
  color: string;
  bgGradient: string;
  icon: string;
}

// ========== 常量数据 ==========
const POOLS: Pool[] = [
  { type: 'common', name: '普通池', minCount: 1, multiplier: 1, color: 'gray', bgGradient: 'from-gray-600/20 to-gray-700/20', icon: '/fragment-common.png' },
  { type: 'premium', name: '高级池', minCount: 5, multiplier: 1.5, color: 'blue', bgGradient: 'from-blue-600/20 to-cyan-600/20', icon: '/fragment-rare.png' },
  { type: 'vip', name: '尊享池', minCount: 20, multiplier: 2, color: 'purple', bgGradient: 'from-purple-600/20 to-pink-600/20', icon: '/fragment-epic.png' },
];

const RULES = [
  { title: '质押收益', desc: '质押NFT每日获得BOX代币奖励，收益率根据池子等级浮动' },
  { title: '自动复投', desc: '收益自动计入当日累计，支持随时解押' },
  { title: '等级提升', desc: '质押数量达标可自动升级池子等级' },
  { title: '安全锁定', desc: '质押资产存于合约，解押需等待7天冷却' },
];

// ========== 安全工具 ==========
const Security = {
  sanitize: (str: string): string => typeof str === 'string' ? str.replace(/[<>"'&]/g, '') : '',
  canStake: (lastTime: number, minInterval = 3000): boolean => Date.now() - lastTime >= minInterval,
};

// NFT图片组件
function NFTImage({ src, alt, size = 40 }: { src: string; alt: string; size?: number }) {
  if (src.startsWith('/') || src.endsWith('.png')) {
    return <Image src={src} alt={alt} width={size} height={size} className="object-contain" />;
  }
  return <span className="text-2xl">{src}</span>;
}

// ========== 主组件 ==========
export default function StakePage() {
  const [userStatus] = useState(() => ({
    totalNFTs: 12,
    stakedCount: 5,
    dailyEarnings: 15.5,
    totalEarnings: 1280,
    nfts: [
      { id: '1', name: '星辰大海 #01', image: '/fragment-epic.png', rarity: '传说', stakedDays: 30 },
      { id: '2', name: '烈焰麒麟 #05', image: '/fragment-epic.png', rarity: '史诗', stakedDays: 25 },
      { id: '3', name: '冰晶之心 #12', image: '/fragment-rare.png', rarity: '稀有', stakedDays: 20 },
      { id: '4', name: '机械之心 #33', image: '/fragment-epic.png', rarity: '史诗', stakedDays: 15 },
      { id: '5', name: '暗黑天使 #08', image: '/fragment-common.png', rarity: '普通', stakedDays: 10 },
    ] as StakedNFT[],
  }));

  const [selectedPool, setSelectedPool] = useState<PoolType>('common');
  const [activeTab, setActiveTab] = useState<'stake' | 'pools' | 'rules'>('stake');
  const [lastActionTime, setLastActionTime] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  const currentPool = useMemo(() => {
    if (userStatus.stakedCount >= 20) return POOLS[2];
    if (userStatus.stakedCount >= 5) return POOLS[1];
    return POOLS[0];
  }, [userStatus.stakedCount]);

  const [leaderboard] = useState(() => [
    { rank: 1, name: '0x7a23...8f91', staked: 156, earnings: 2580, avatar: '🐋' },
    { rank: 2, name: '0x3b12...4c56', staked: 98, earnings: 1820, avatar: '🦊' },
    { rank: 3, name: '0x9e45...2d78', staked: 67, earnings: 1450, avatar: '🦁' },
    { rank: 4, name: '0x2f89...1a34', staked: 45, earnings: 980, avatar: '🐼' },
    { rank: 5, name: '0x6c78...9b12', staked: 32, earnings: 650, avatar: '🐨' },
  ]);

  const handleStake = async () => {
    if (!Security.canStake(lastActionTime)) return;
    setActionLoading(true);
    setLastActionTime(Date.now());
    await new Promise(r => setTimeout(r, 1500));
    setActionLoading(false);
  };

  const handleUnstake = async (nftId: string) => {
    if (!Security.canStake(lastActionTime)) return;
    setActionLoading(true);
    setLastActionTime(Date.now());
    await new Promise(r => setTimeout(r, 1500));
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">💎 NFT质押</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            <span>合约安全审计通过</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          {[
            { key: 'stake', label: '🎯 我的质押', icon: Lock },
            { key: 'pools', label: '🏊 质押池', icon: Gift },
            { key: 'rules', label: '📖 规则', icon: Clock },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition ${activeTab === tab.key ? 'bg-violet-600' : 'bg-white/5 hover:bg-white/10'}`}>
              <tab.icon className="w-5 h-5" />{tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'stake' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-green-400" /><span className="text-sm text-gray-400">今日收益</span></div>
                  <div className="text-2xl font-bold text-green-400">{userStatus.dailyEarnings}</div>
                  <div className="text-xs text-gray-500">BOX</div>
                </div>
                <div className="bg-gradient-to-br from-violet-600/20 to-pink-600/20 rounded-xl p-4 border border-violet-500/30">
                  <div className="flex items-center gap-2 mb-1"><Wallet className="w-4 h-4 text-violet-400" /><span className="text-sm text-gray-400">累计收益</span></div>
                  <div className="text-2xl font-bold text-violet-400">{userStatus.totalEarnings}</div>
                  <div className="text-xs text-gray-500">BOX</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-blue-400" /><span className="text-sm text-gray-400">质押中</span></div>
                  <div className="text-2xl font-bold text-blue-400">{userStatus.stakedCount}</div>
                  <div className="text-xs text-gray-500">/ {userStatus.totalNFTs} NFT</div>
                </div>
              </div>

              <div className={`bg-gradient-to-r ${currentPool.bgGradient} rounded-xl p-5 border border-${currentPool.color}-500/30`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 relative">
                      <NFTImage src={currentPool.icon} alt={currentPool.name} size={64} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">当前质押池</div>
                      <div className="text-xl font-bold">{currentPool.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">收益率</div>
                    <div className="text-2xl font-bold text-green-400">×{currentPool.multiplier}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="font-bold mb-4">📦 质押中的NFT</h3>
                <div className="space-y-3">
                  {userStatus.nfts.map(nft => (
                    <div key={nft.id} className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative">
                          <NFTImage src={nft.image} alt={nft.name} size={48} />
                        </div>
                        <div>
                          <div className="font-medium">{nft.name}</div>
                          <div className="text-xs text-gray-400">{nft.rarity} · 已质押{nft.stakedDays}天</div>
                        </div>
                      </div>
                      <button onClick={() => handleUnstake(nft.id)} disabled={actionLoading} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm flex items-center gap-1">
                        <Unlock className="w-4 h-4" />解押
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Flame className="w-5 h-5 text-orange-400" />质押排行榜</h3>
                <div className="space-y-2">
                  {leaderboard.map(user => (
                    <div key={user.rank} className={`flex items-center justify-between p-3 rounded-xl ${user.rank <= 3 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-black/30'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : user.rank === 3 ? 'bg-amber-600' : 'bg-white/10'}`}>
                          {user.rank}
                        </span>
                        <span className="text-xl">{user.avatar}</span>
                        <span className="text-sm text-gray-400">{user.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{user.staked}</div>
                        <div className="text-xs text-gray-500">质押</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-5 border border-amber-500/30">
                <h3 className="font-bold mb-2">💰 收益计算器</h3>
                <div className="text-sm text-gray-400 mb-3">质押NFT数量 × 基础收益率 × 池子倍率</div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span>5 NFT × 1.0 × {currentPool.multiplier}</span>
                    <span className="text-green-400">= {5 * currentPool.multiplier} BOX/天</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pools' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {POOLS.map(pool => (
                <motion.div key={pool.type} whileHover={{ scale: 1.02 }} className={`bg-gradient-to-br ${pool.bgGradient} rounded-2xl p-6 border ${selectedPool === pool.type ? `border-${pool.color}-500/50` : 'border-white/10'} cursor-pointer transition-all`} onClick={() => setSelectedPool(pool.type)}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 relative">
                      <NFTImage src={pool.icon} alt={pool.name} size={64} />
                    </div>
                    {userStatus.stakedCount >= pool.minCount && <CheckCircle className="w-6 h-6 text-green-400" />}
                  </div>
                  <div className="text-xl font-bold mb-1">{pool.name}</div>
                  <div className="text-sm text-gray-400 mb-4">最低{pool.minCount}个NFT</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-400">×{pool.multiplier}</span>
                    <span className="text-gray-400">收益率</span>
                  </div>
                  {userStatus.stakedCount < pool.minCount && (
                    <div className="mt-4 text-xs text-gray-500">还需 {pool.minCount - userStatus.stakedCount} 个NFT解锁</div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold mb-4">📊 池子对比</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4">池子</th>
                      <th className="text-right py-3 px-4">最低要求</th>
                      <th className="text-right py-3 px-4">收益率</th>
                      <th className="text-right py-3 px-4">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {POOLS.map(pool => (
                      <tr key={pool.type} className="border-b border-white/5">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <div className="w-8 h-8 relative"><NFTImage src={pool.icon} alt={pool.name} size={32} /></div>
                          {pool.name}
                        </td>
                        <td className="text-right py-3 px-4">{pool.minCount} NFT</td>
                        <td className="text-right py-3 px-4 text-green-400">×{pool.multiplier}</td>
                        <td className="text-right py-3 px-4">
                          {userStatus.stakedCount >= pool.minCount ? <span className="text-green-400">✓ 已解锁</span> : <span className="text-gray-500">🔒 锁定</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RULES.map((rule, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold">
                    {i + 1}
                  </div>
                  <div className="font-bold">{rule.title}</div>
                </div>
                <div className="text-sm text-gray-400 pl-13">{rule.desc}</div>
              </div>
            ))}
            
            <div className="md:col-span-2 bg-amber-500/10 rounded-xl p-5 border border-amber-500/30">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-amber-400" />解押说明</h3>
              <div className="text-sm text-gray-400 space-y-2">
                <p>• 发起解押后，NFT将进入7天冷却期</p>
                <p>• 冷却期内可取消解押，恢复质押状态</p>
                <p>• 冷却期结束后，NFT自动回到钱包</p>
                <p>• 冷却期内不产生收益</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
