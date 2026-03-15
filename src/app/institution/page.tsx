'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Palette, BarChart3, Wallet, Settings, Users, 
  FileText, TrendingUp, Shield, Gift, CreditCard, Headphones,
  ChevronRight, Edit, Trash2, Eye, Plus, Download,
  CheckCircle, Clock, AlertCircle, Star, Crown, Gem, Heart, Vote
} from 'lucide-react';

// 模拟机构数据
const institutionData = {
  name: '星辰艺术馆',
  tier: 'Diamond',
  tierName: 'Diamond',
  status: 'approved',
  joinedAt: '2026-01-15',
  stats: {
    totalSales: 125800,
    totalNFTs: 156,
    totalViews: 89650,
    totalLikes: 12560,
    followers: 8920,
  },
  benefits: {
    discount: '20%',
    priority: true,
    homepage: true,
    auction: true,
    dao: true,
    vipSupport: true,
  }
};

// 作品数据
const nftList = [
  { id: 1, name: '星河系列 #01', status: 'selling', price: 88, views: 1250, likes: 156 },
  { id: 2, name: '星河系列 #02', status: 'selling', price: 88, views: 980, likes: 120 },
  { id: 3, name: '星河系列 #03', status: 'pending', price: 128, views: 0, likes: 0 },
  { id: 4, name: '宇宙漫游 #15', status: 'sold', price: 256, views: 2560, likes: 420 },
  { id: 5, name: '宇宙漫游 #16', status: 'selling', price: 288, views: 890, likes: 98 },
];

// 收益记录
const earningsList = [
  { id: 1, date: '2026-03-15', amount: 1250, type: '销售', status: 'completed' },
  { id: 2, date: '2026-03-14', amount: 980, type: '销售', status: 'completed' },
  { id: 3, date: '2026-03-13', amount: 2560, type: '销售', status: 'completed' },
  { id: 4, date: '2026-03-12', amount: 450, type: '销售', status: 'pending' },
];

const tierConfig: Record<string, { color: string; badge: string; textColor: string }> = {
  Diamond: { color: 'from-cyan-400 to-blue-600', badge: '💎', textColor: 'text-cyan-400' },
  Gold: { color: 'from-yellow-500 to-amber-600', badge: '🥇', textColor: 'text-yellow-400' },
  Silver: { color: 'from-gray-400 to-gray-600', badge: '🥈', textColor: 'text-gray-300' },
  Bronze: { color: 'from-amber-700 to-orange-900', badge: '🥉', textColor: 'text-amber-500' },
};

export default function InstitutionPage() {
  const [activeTab, setActiveTab] = useState('home');
  
  const tabs = [
    { id: 'home', name: '机构主页', icon: Building2 },
    { id: 'nfts', name: '作品管理', icon: Palette },
    { id: 'stats', name: '数据统计', icon: BarChart3 },
    { id: 'finance', name: '财务管理', icon: Wallet },
    { id: 'benefits', name: '权益中心', icon: Gift },
    { id: 'support', name: '客服工单', icon: Headphones },
  ];

  const tier = tierConfig[institutionData.tier];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 头部 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-violet-900/30 to-black py-8">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, violet 0%, transparent 50%)' }} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* 机构信息 */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-4xl">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{institutionData.name}</h1>
                  <span className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${tier.color} text-white`}>
                    {tier.badge} {institutionData.tierName}
                  </span>
                </div>
                <div className="text-sm text-gray-400">入驻时间：{institutionData.joinedAt}</div>
              </div>
            </div>
            
            {/* 快速统计 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-bold text-green-400">{institutionData.stats.totalSales}</div>
                <div className="text-xs text-gray-400">总销售额(SUI)</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-bold text-blue-400">{institutionData.stats.totalNFTs}</div>
                <div className="text-xs text-gray-400">在售NFT</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-bold text-purple-400">{institutionData.stats.totalViews}</div>
                <div className="text-xs text-gray-400">总浏览量</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-bold text-pink-400">{institutionData.stats.followers}</div>
                <div className="text-xs text-gray-400">粉丝数</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <div className="text-xl font-bold text-amber-400">{institutionData.benefits.discount}</div>
                <div className="text-xs text-gray-400">手续费折扣</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab导航 */}
      <div className="border-b border-gray-800 sticky top-0 bg-black z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 whitespace-nowrap border-b-2 transition ${
                  activeTab === tab.id 
                    ? 'border-violet-500 text-white' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        
        {/* 机构主页 */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-violet-400" />
                  机构信息
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">机构名称</span>
                    <span className="font-medium">{institutionData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">入驻等级</span>
                    <span className={`font-bold ${tier.textColor}`}>{tier.badge} {institutionData.tierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">入驻时间</span>
                    <span>{institutionData.joinedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">状态</span>
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> 已认证
                    </span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">
                  <Edit className="w-4 h-4 inline mr-2" /> 编辑机构信息
                </button>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  主页预览
                </h3>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏛️</div>
                    <div className="text-gray-400">点击预览机构主页</div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm transition">
                  查看完整主页 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 作品管理 */}
        {activeTab === 'nfts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">NFT作品管理</h3>
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> 上架新作品
              </button>
            </div>
            
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-black/50">
                  <tr className="text-left text-sm text-gray-400">
                    <th className="p-4">作品</th>
                    <th className="p-4">状态</th>
                    <th className="p-4">价格</th>
                    <th className="p-4">浏览</th>
                    <th className="p-4">点赞</th>
                    <th className="p-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {nftList.map(nft => (
                    <tr key={nft.id} className="border-t border-white/5">
                      <td className="p-4 font-medium">{nft.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          nft.status === 'selling' ? 'bg-green-500/20 text-green-400' :
                          nft.status === 'sold' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {nft.status === 'selling' ? '在售' : nft.status === 'sold' ? '已售' : '待审核'}
                        </span>
                      </td>
                      <td className="p-4">{nft.price} SUI</td>
                      <td className="p-4 text-gray-400">{nft.views}</td>
                      <td className="p-4 text-gray-400">{nft.likes}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 hover:bg-white/10 rounded"><Eye className="w-4 h-4 text-gray-400" /></button>
                          <button className="p-1.5 hover:bg-white/10 rounded"><Edit className="w-4 h-4 text-gray-400" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 数据统计 */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <TrendingUp className="w-4 h-4" /> 销售额
                </div>
                <div className="text-2xl font-bold text-green-400">{institutionData.stats.totalSales} SUI</div>
                <div className="text-xs text-green-400 mt-1">+12.5%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Eye className="w-4 h-4" /> 浏览量
                </div>
                <div className="text-2xl font-bold text-blue-400">{institutionData.stats.totalViews}</div>
                <div className="text-xs text-green-400 mt-1">+8.2%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Heart className="w-4 h-4" /> 点赞数
                </div>
                <div className="text-2xl font-bold text-pink-400">{institutionData.stats.totalLikes}</div>
                <div className="text-xs text-green-400 mt-1">+15.3%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Users className="w-4 h-4" /> 粉丝数
                </div>
                <div className="text-2xl font-bold text-purple-400">{institutionData.stats.followers}</div>
                <div className="text-xs text-green-400 mt-1">+5.8%</div>
              </div>
            </div>
          </div>
        )}

        {/* 财务管理 */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="text-gray-400 mb-2">可提现余额</div>
                <div className="text-3xl font-bold text-green-400">8,520 SUI</div>
                <button className="mt-3 w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm">
                  提现
                </button>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="text-gray-400 mb-2">待结算</div>
                <div className="text-3xl font-bold text-amber-400">1,250 SUI</div>
                <div className="text-xs text-gray-500 mt-3">预计3天后到账</div>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="text-gray-400 mb-2">历史收益</div>
                <div className="text-3xl font-bold">125,800 SUI</div>
                <button className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> 下载账单
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl border border-white/10">
              <div className="p-4 border-b border-white/10 font-bold">收益记录</div>
              {earningsList.map(item => (
                <div key={item.id} className="p-4 border-b border-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.type}</div>
                    <div className="text-xs text-gray-500">{item.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${item.status === 'completed' ? 'text-green-400' : 'text-amber-400'}`}>
                      +{item.amount} SUI
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.status === 'completed' ? '已完成' : '处理中'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 权益中心 */}
        {activeTab === 'benefits' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-xl p-6 border border-violet-500/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{tier.badge}</span>
                <div>
                  <div className="text-xl font-bold">{institutionData.tierName} 等级</div>
                  <div className="text-sm text-gray-400">当前享受的权益</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
                升级等级 →
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: '基础机构主页', icon: Building2, included: true },
                { name: '作品上架', icon: Palette, included: true },
                { name: '交易平台', icon: CreditCard, included: true },
                { name: '精品推荐', icon: Star, included: true },
                { name: '优先展示', icon: Eye, included: true },
                { name: '热门推荐', icon: TrendingUp, included: true },
                { name: '拍卖优先', icon: Gem, included: true },
                { name: '手续费折扣', icon: CreditCard, included: true, value: '20%' },
                { name: '专属客服', icon: Headphones, included: true },
                { name: '首页推荐', icon: Crown, included: true },
                { name: '拍卖合作', icon: Gem, included: true },
                { name: 'DAO投票权', icon: Vote, included: true },
              ].map((benefit, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <benefit.icon className="w-5 h-5 text-gray-400" />
                    <span>{benefit.name}</span>
                  </div>
                  {benefit.value ? (
                    <span className="text-green-400 font-bold">{benefit.value}</span>
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 客服工单 */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">客服工单</h3>
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> 创建工单
              </button>
            </div>

            <div className="text-center py-12 text-gray-500">
              <Headphones className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无工单记录</p>
              <p className="text-sm mt-2">有问题？联系我们！</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
