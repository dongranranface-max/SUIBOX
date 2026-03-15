'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, TrendingUp, Wallet, Clock, ArrowRight, Info } from 'lucide-react';

// 模拟BOX质押数据
const boxStakingPools = [
  { 
    id: 1, 
    name: '基础质押池', 
    apy: 15, 
    minStake: 100, 
    totalStaked: '2.5M',
    reward: 'BOX',
    lockPeriod: 7,
    description: '适合新手，低风险稳定收益'
  },
  { 
    id: 2, 
    name: '进阶质押池', 
    apy: 25, 
    minStake: 1000, 
    totalStaked: '1.2M',
    reward: 'BOX',
    lockPeriod: 30,
    description: '中等锁定期，收益更高'
  },
  { 
    id: 3, 
    name: 'VIP质押池', 
    apy: 40, 
    minStake: 10000, 
    totalStaked: '800K',
    reward: 'BOX + SUI',
    lockPeriod: 90,
    description: '高额收益，获得平台VIP权益'
  },
];

// 模拟用户数据
const userStakes = [
  { poolId: 1, amount: 500, reward: 12.5, lockEnd: '2026-03-15' },
  { poolId: 2, amount: 2000, reward: 45.2, lockEnd: '2026-04-10' },
];

export default function BoxStakePage() {
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState('stake');

  const totalStaked = userStakes.reduce((sum, s) => sum + s.amount, 0);
  const totalReward = userStakes.reduce((sum, s) => sum + s.reward, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="min-w-[1024px] max-w-[1400px] mx-auto">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">📦 BOX质押</h1>
            <p className="text-gray-400">质押BOX获取收益，支持多锁定期选择</p>
          </div>

          {/* 用户概览 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-violet-600/20 to-pink-600/20 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Box className="w-5 h-5 text-violet-400" />
                <span className="text-gray-400">总质押BOX</span>
              </div>
              <div className="text-2xl font-bold">{totalStaked.toLocaleString()}</div>
            </div>

            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">累计收益</span>
              </div>
              <div className="text-2xl font-bold">{totalReward.toFixed(1)} BOX</div>
            </div>

            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                <span className="text-gray-400">钱包余额</span>
              </div>
              <div className="text-2xl font-bold">8,500 BOX</div>
            </div>

            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">锁定期</span>
              </div>
              <div className="text-2xl font-bold">2个池</div>
            </div>
          </div>

          {/* Tab切换 */}
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setActiveTab('stake')}
              className={`px-5 py-2.5 rounded-xl font-medium transition ${activeTab === 'stake' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              💰 质押池
            </button>
            <button 
              onClick={() => setActiveTab('my')}
              className={`px-5 py-2.5 rounded-xl font-medium transition ${activeTab === 'my' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              📊 我的质押
            </button>
          </div>

          {/* 质押池列表 */}
          {activeTab === 'stake' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {boxStakingPools.map(pool => (
                <div key={pool.id} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-violet-500/30 transition">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{pool.name}</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                      {pool.apy}% APY
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{pool.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-black/30 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">最低质押</div>
                      <div className="font-bold">{pool.minStake} BOX</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">锁定期</div>
                      <div className="font-bold">{pool.lockPeriod}天</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 col-span-2">
                      <div className="text-xs text-gray-500 mb-1">总质押量</div>
                      <div className="font-bold">{pool.totalStaked} BOX</div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium transition">
                    立即质押
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 我的质押 */}
          {activeTab === 'my' && (
            <div>
              {userStakes.length > 0 ? (
                <div className="space-y-4">
                  {userStakes.map((stake, i) => {
                    const pool = boxStakingPools.find(p => p.id === stake.poolId);
                    return (
                      <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                              <Box className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                              <div className="font-bold">{pool?.name}</div>
                              <div className="text-sm text-gray-400">锁定期至 {stake.lockEnd}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{stake.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">BOX</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-green-400">
                            <TrendingUp className="w-4 h-4" />
                            预计收益: {stake.reward.toFixed(1)} {pool?.reward}
                          </div>
                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
                            解除质押
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Box className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>暂无质押记录</p>
                  <Link href="/box" className="text-violet-400 hover:text-violet-300 mt-2 inline-block">
                    先去获得BOX →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 说明 */}
          <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <div className="font-bold text-blue-400 mb-1">质押说明</div>
                <ul className="space-y-1">
                  <li>• 质押BOX可获得SUI奖励，收益率根据锁定期长短有所不同</li>
                  <li>• 锁定期内无法解除质押，锁定期结束后自动释放本金和奖励</li>
                  <li>• 提前解除质押将扣除50%作为违约金</li>
                  <li>• VIP质押池额外享有平台交易手续费折扣</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
