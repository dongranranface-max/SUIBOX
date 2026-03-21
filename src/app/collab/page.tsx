'use client';

import { useState } from 'react';
import { FileText, Sparkles, ArrowRight, Star, Heart, Eye, Zap, Clock, CheckCircle, ExternalLink, Crown, Gem, Shield, Gift } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function CollabPage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('ongoing');

  // IP联名系列
  const collabs = {
    ongoing: [
      {
        id: 1,
        name: '迪士尼公主系列',
        partner: 'Disney',
        image: '/nft-common.png',
        rarity: 'SSR',
        price: 199,
        currency: 'SUI',
        sold: 856,
        total: 1000,
        endTime: '2026-04-15',
        features: ['限定NFT', '专属皮肤', '线下权益'],
        status: '热卖中',
        countdown: undefined as string | undefined,
      },
      {
        id: 2,
        name: '漫威英雄系列',
        partner: 'Marvel',
        image: '/fragment-epic.png',
        rarity: 'SR',
        price: 99,
        currency: 'SUI',
        sold: 2340,
        total: 5000,
        endTime: '2026-05-01',
        features: ['限定NFT', '头像框'],
        status: '热卖中',
        countdown: undefined as string | undefined,
      },
    ],
    upcoming: [
      {
        id: 3,
        name: '宝可梦训练师',
        partner: 'Nintendo',
        image: '/nft-common.png',
        rarity: 'SSR',
        price: 299,
        currency: 'SUI',
        sold: 0,
        total: 2000,
        endTime: '2026-06-01',
        features: ['限定NFT', '游戏道具', '线下活动'],
        status: '即将发售',
        countdown: '15天',
      },
      {
        id: 4,
        name: '星球大战宇宙',
        partner: 'Lucasfilm',
        image: '/fragment-rare.png',
        rarity: 'SSR',
        price: 399,
        currency: 'SUI',
        sold: 0,
        total: 1000,
        endTime: '2026-07-01',
        features: ['限定NFT', '3D头像', '珍藏证书'],
        status: '敬请期待',
        countdown: '45天',
      },
    ],
    past: [
      {
        id: 5,
        name: '初音未来音乐节',
        partner: 'Crypton',
        image: '/nft-common.png',
        rarity: 'SR',
        price: 49,
        currency: 'SUI',
        sold: 5000,
        total: 5000,
        endTime: '2026-02-01',
        features: ['限定NFT', '演唱会门票'],
        status: '已结束',
        countdown: undefined as string | undefined,
      },
    ],
  };

  // 合作流程
  const process = [
    { step: 1, title: '提交申请', desc: '填写合作意向表', icon: FileText },
    { step: 2, title: '商务洽谈', desc: '讨论合作细节', icon: Zap },
    { step: 3, title: '方案设计', desc: 'NFT设计方案', icon: Sparkles },
    { step: 4, title: '合约签署', desc: '签订合作协议', icon: Shield },
    { step: 5, title: '上线发售', desc: '联合营销发售', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/30 to-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">IP联名系列</h1>
              <p className="text-gray-400">知名IP正版授权，独家NFT盲盒</p>
            </div>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-center">
              <Crown className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-400">合作IP</div>
            </div>
            <div className="bg-pink-500/10 rounded-xl p-4 border border-pink-500/20 text-center">
              <Gem className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-sm text-gray-400">售出NFT</div>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 text-center">
              <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">100,000+</div>
              <div className="text-sm text-gray-400">关注用户</div>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 text-center">
              <Heart className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-gray-400">满意度</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 -mt-4">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {[
            { key: 'ongoing', label: '正在热卖', count: collabs.ongoing.length },
            { key: 'upcoming', label: '即将发售', count: collabs.upcoming.length },
            { key: 'past', label: '往期回顾', count: collabs.past.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {tab.label}
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* IP联名列表 */}
        <div className="grid md:grid-cols-2 gap-6">
          {collabs[activeTab].map(item => (
            <div key={item.id} className="bg-gray-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all">
              {/* 图片 */}
              <div className="relative aspect-video bg-gray-800">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.rarity === 'SSR' 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {item.rarity}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-black/60 rounded-full text-xs">
                    {item.partner}
                  </span>
                </div>
                {item.countdown && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-purple-600/80 rounded-full text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.countdown}
                  </div>
                )}
              </div>

              {/* 内容 */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.partner} 正版授权</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.status === '热卖中' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* 进度条 */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">已售</span>
                    <span>{item.sold} / {item.total}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${(item.sold / item.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 特性 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.features.map((f, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                      {f}
                    </span>
                  ))}
                </div>

                {/* 价格和按钮 */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-purple-400">{item.price}</span>
                    <span className="text-gray-400"> {item.currency}</span>
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium flex items-center gap-2 hover:from-purple-500 hover:to-pink-500">
                    {item.status === '敬请期待' ? '提醒我' : '立即购买'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 合作流程 */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-6">IP合作流程</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {process.map((p, i) => (
              <div key={i} className="text-center relative">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-3">
                  <p.icon className="w-6 h-6" />
                </div>
                <div className="font-bold mb-1">{p.step}. {p.title}</div>
                <div className="text-sm text-gray-400">{p.desc}</div>
                {i < process.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              申请IP合作
            </button>
          </div>
        </div>

        {/* 合作优势 */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: '正版授权', desc: '严格版权审核，确保IP正版' },
            { icon: Zap, title: '精准营销', desc: '100万+精准Web3用户' },
            { icon: Gift, title: '多元权益', desc: '线上线下联动，增加曝光' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900/30 rounded-xl p-5 border border-white/10 text-center">
              <item.icon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
