'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, FileText, Shield, Coins, CheckCircle, AlertCircle, Upload, DollarSign, Lock, TrendingUp, Users, Eye, Star, Award, Crown, Gem, Wallet, Palette, Store, User, Briefcase, ChevronRight, BarChart3, ShoppingCart, Heart, Clock } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// 入驻类型
const joinTypes = [
  { id: 'gallery', name: '艺术机构', icon: Building2, desc: '画廊、拍卖行、艺术馆' },
  { id: 'collection', name: '收藏公司', icon: Gem, desc: '收藏品公司、NFT发行方' },
  { id: 'studio', name: '数字工作室', icon: Palette, desc: '数字艺术创作团队' },
  { id: 'creator', name: '个人创作者', icon: User, desc: '独立艺术家、设计师' },
  { id: 'other', name: '其他', icon: Briefcase, desc: '其他相关机构' },
];

// 等级体系 - 国际通用等级
const tierInfo = [
  { 
    id: 'D', 
    name: 'Bronze', 
    stake: 1000, 
    nft: '史诗NFT',
    pledge: 10000,
    color: 'from-amber-700 to-orange-900',
    borderColor: 'border-amber-600/30',
    textColor: 'text-amber-500',
    badge: '🥉',
    requirements: '质押1000 BOX + 持有史诗NFT + 质押10000 BOX',
    benefits: [
      { name: '基础机构主页', included: true },
      { name: '作品上架', included: true },
      { name: '交易平台', included: true },
      { name: '精品推荐', included: false },
      { name: '优先展示', included: false },
      { name: '热门推荐', included: false },
      { name: '拍卖优先', included: false },
      { name: '手续费折扣', value: '0%' },
      { name: '专属客服', included: false },
      { name: '首页推荐', included: false },
      { name: '拍卖合作', included: false },
      { name: 'DAO投票权', included: false },
    ]
  },
  { 
    id: 'C', 
    name: 'Silver', 
    stake: 10000, 
    nft: '史诗NFT',
    pledge: 10000,
    color: 'from-gray-300 to-gray-500',
    borderColor: 'border-gray-400/30',
    textColor: 'text-gray-300',
    badge: '🥈',
    requirements: '质押10000 BOX + 持有史诗NFT + 质押10000 BOX',
    benefits: [
      { name: '基础机构主页', included: true },
      { name: '作品上架', included: true },
      { name: '交易平台', included: true },
      { name: '精品推荐', included: true },
      { name: '优先展示', included: true },
      { name: '热门推荐', included: false },
      { name: '拍卖优先', included: false },
      { name: '手续费折扣', value: '10%' },
      { name: '专属客服', included: false },
      { name: '首页推荐', included: false },
      { name: '拍卖合作', included: false },
      { name: 'DAO投票权', included: false },
    ]
  },
  { 
    id: 'B', 
    name: 'Gold', 
    stake: 50000, 
    nft: '史诗NFT',
    pledge: 10000,
    color: 'from-yellow-500 to-amber-600',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    badge: '🥇',
    requirements: '质押50000 BOX + 持有史诗NFT + 质押10000 BOX',
    benefits: [
      { name: '基础机构主页', included: true },
      { name: '作品上架', included: true },
      { name: '交易平台', included: true },
      { name: '精品推荐', included: true },
      { name: '优先展示', included: true },
      { name: '热门推荐', included: true },
      { name: '拍卖优先', included: true },
      { name: '手续费折扣', value: '15%' },
      { name: '专属客服', included: true },
      { name: '首页推荐', included: false },
      { name: '拍卖合作', included: false },
      { name: 'DAO投票权', included: false },
    ]
  },
  { 
    id: 'A', 
    name: 'Diamond', 
    stake: 100000, 
    nft: '史诗NFT',
    pledge: 10000,
    color: 'from-cyan-400 to-blue-600',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    badge: '💎',
    requirements: '质押100000 BOX + 持有史诗NFT + 质押10000 BOX',
    benefits: [
      { name: '基础机构主页', included: true },
      { name: '作品上架', included: true },
      { name: '交易平台', included: true },
      { name: '精品推荐', included: true },
      { name: '优先展示', included: true },
      { name: '热门推荐', included: true },
      { name: '拍卖优先', included: true },
      { name: '手续费折扣', value: '20%' },
      { name: '专属客服', included: true },
      { name: '首页推荐', included: true },
      { name: '拍卖合作', included: true },
      { name: 'DAO投票权', included: true },
    ]
  },
];

// 模拟数据
const myInstitution = {
  id: '1',
  name: '星辰艺术工作室',
  type: 'studio',
  tier: 'gold',
  status: 'approved',
  stats: {
    totalSales: 125800,
    totalNFTs: 45,
    views: 8960,
    likes: 1256,
    followers: 892,
  },
  pendingNFTs: 3,
  approvedNFTs: 42,
};

const pendingNFTs = [
  { id: 1, name: '星河 #01', price: 88, status: 'pending', submitTime: '2小时前' },
  { id: 2, name: '星河 #02', price: 88, status: 'pending', submitTime: '5小时前' },
  { id: 3, name: '星河 #03', price: 128, status: 'rejected', rejectReason: '图片不清晰', submitTime: '1天前' },
];

export default function JoinPage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [view, setView] = useState<'apply' | 'dashboard'>('apply');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    joinType: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    boxAddress: '',
    stakeAmount: 30000,
  });
  const [agreed, setAgreed] = useState(false);

  const currentTier = tierInfo.find(t => t.id === myInstitution.tier) || tierInfo[0];

  const handleSubmit = () => {
    if (!formData.joinType || !formData.companyName || !formData.contactName || !formData.email || !formData.boxAddress) {
      alert('请填写完整信息');
      return;
    }
    if (!agreed) {
      alert('请同意入驻协议');
      return;
    }
    setStep(2);
  };

  // 已入驻机构仪表盘
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-black text-white pb-20 md:pb-6">
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* 机构信息卡片 */}
          <div className="bg-gradient-to-r from-violet-600/20 to-pink-600/20 rounded-xl p-6 border border-violet-500/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-violet-500/20 rounded-xl flex items-center justify-center text-3xl">
                  🎨
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{myInstitution.name}</h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${currentTier.color} text-white`}>
                      {currentTier.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
                      已认证
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {joinTypes.find(t => t.id === myInstitution.type)?.name}
                  </p>
                </div>
              </div>
              <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm">
                查看主页 →
              </Link>
            </div>
          </div>

          {/* 数据统计 */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">销售额</span>
              </div>
              <div className="text-xl font-bold text-green-400">{myInstitution.stats.totalSales.toLocaleString()}</div>
              <div className="text-xs text-gray-500">SUI</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Palette className="w-4 h-4" />
                <span className="text-xs">作品数</span>
              </div>
              <div className="text-xl font-bold">{myInstitution.stats.totalNFTs}</div>
              <div className="text-xs text-gray-500">已上架</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs">浏览量</span>
              </div>
              <div className="text-xl font-bold text-blue-400">{myInstitution.stats.views.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs">获赞</span>
              </div>
              <div className="text-xl font-bold text-pink-400">{myInstitution.stats.likes.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">粉丝</span>
              </div>
              <div className="text-xl font-bold text-violet-400">{myInstitution.stats.followers.toLocaleString()}</div>
            </div>
          </div>

          {/* 待审核作品 */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                待审核作品
                <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-xs">
                  {pendingNFTs.filter(n => n.status === 'pending').length}
                </span>
              </h2>
              <button className="text-sm text-violet-400 hover:text-violet-300">
                上传新作品 →
              </button>
            </div>
            <div className="space-y-2">
              {pendingNFTs.map(nft => (
                <div key={nft.id} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">🎨</div>
                    <div>
                      <div className="font-medium">{nft.name}</div>
                      <div className="text-xs text-gray-400">{nft.submitTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {nft.status === 'pending' && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">审核中</span>
                    )}
                    {nft.status === 'rejected' && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">已拒绝</span>
                    )}
                    {nft.status === 'approved' && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">已通过</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 等级权益 */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              当前等级权益
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {currentTier.benefits.map((benefit: any, i: number) => (
                <div key={i} className="bg-black/30 rounded-lg p-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-sm">{benefit.name || benefit}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg text-sm text-blue-300">
              💡 质押更多BOX可升级等级，解锁更多权益
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition flex flex-col items-center gap-2">
              <Palette className="w-8 h-8 text-violet-400" />
              <span className="text-sm font-medium">上传作品</span>
            </button>
            <button className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition flex flex-col items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <span className="text-sm font-medium">数据看板</span>
            </button>
            <button className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition flex flex-col items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-green-400" />
              <span className="text-sm font-medium">商品管理</span>
            </button>
            <button className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-pink-400" />
              <span className="text-sm font-medium">粉丝管理</span>
            </button>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setView('apply')}
              className="text-violet-400 hover:text-violet-300 text-sm"
            >
              ← 返回入驻申请
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 入驻申请页面
  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-6">
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 切换按钮 */}
        <div className="flex justify-center">
          <div className="bg-white/10 rounded-xl p-1 flex">
            <button 
              onClick={() => setView('apply')}
              className={`px-6 py-2 rounded-lg font-medium transition ${view === 'apply' ? 'bg-violet-600' : ''}`}
            >
              申请入驻
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className={`px-6 py-2 rounded-lg font-medium transition ${view === 'dashboard' ? 'bg-violet-600' : ''}`}
            >
              机构中心
            </button>
          </div>
        </div>

        {/* 页面标题 */}
        <div className="text-center">
          <div className="text-5xl mb-4">🏢</div>
          <h1 className="text-3xl font-bold mb-2">机构入驻</h1>
          <p className="text-gray-400">艺术机构或公司申请入住SUIBOX平台</p>
        </div>

        {/* 入驻要求 */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-400 mb-2">入驻要求</div>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  需要提供合法营业执照
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  需质押不同数量BOX享受对应等级权益 <span className="text-amber-400 font-bold">（必须在质押中，才能享受权益）</span>
                </li>
                <li className="ml-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">🥉 Bronze:</span>
                    <span>质押 1,000 BOX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">🥈 Silver:</span>
                    <span>质押 10,000 BOX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">🥇 Gold:</span>
                    <span>质押 50,000 BOX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">💎 Diamond:</span>
                    <span>质押 100,000 BOX</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 入驻流程 */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            入驻流程
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {[
              { step: 1, title: '提交申请', desc: '填写基本信息', icon: '📝' },
              { step: 2, title: '资料审核', desc: '1-3个工作日', icon: '🔍' },
              { step: 3, title: '质押BOX', desc: '选择等级质押', icon: '💰' },
              { step: 4, title: '完成入驻', desc: '正式成为合作方', icon: '🎉' },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl mb-2">
                    {item.icon}
                  </div>
                  <div className="text-sm font-bold">{item.step}. {item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
                {i < 3 && <ChevronRight className="w-5 h-5 text-gray-600 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* 审核时间 */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-blue-400 mb-1">审核周期说明</div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 普通审核：1-3个工作日内完成</li>
                <li>• 加急审核：24小时内完成（需额外500 BOX）</li>
                <li>• 节假日顺延至下一个工作日</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 已入驻机构 */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-400" />
            已入驻机构
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '星辰艺术馆', tier: 'Diamond', emoji: '🏛️' },
              { name: '麒麟工作室', tier: 'Gold', emoji: '🎨' },
              { name: '蓝色创想', tier: 'Silver', emoji: '💙' },
              { name: '元素艺术', tier: 'Silver', emoji: '✨' },
              { name: '暗夜工坊', tier: 'Bronze', emoji: '🌙' },
              { name: '极光画廊', tier: 'Bronze', emoji: '🌌' },
              { name: '熔岩创意', tier: 'Bronze', emoji: '🔥' },
              { name: '量子艺术', tier: 'Bronze', emoji: '⚡' },
            ].map((org, i) => (
              <div key={i} className="bg-black/30 rounded-lg p-3 flex items-center gap-2 hover:bg-black/50 transition">
                <span className="text-2xl">{org.emoji}</span>
                <div>
                  <div className="text-sm font-bold truncate">{org.name}</div>
                  <div className={`text-xs ${
                    org.tier === 'Diamond' ? 'text-cyan-400' :
                    org.tier === 'Gold' ? 'text-yellow-400' :
                    org.tier === 'Silver' ? 'text-gray-300' : 'text-amber-600'
                  }`}>{org.tier}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            常见问题
          </h2>
          <div className="space-y-3">
            {[
              { q: '审核需要多长时间？', a: '普通审核1-3个工作日，加急24小时内' },
              { q: '保证金什么时候退还？', a: '退出入驻时扣除违规处罚后无息退还' },
              { q: '等级可以升级吗？', a: '可以，补充质押差額即可升级' },
              { q: '需要提供哪些材料？', a: '营业执照、法人身份证、机构介绍' },
              { q: '违规会扣除保证金吗？', a: '严重违规（如售假）将扣除部分或全部保证金' },
            ].map((faq, i) => (
              <details key={i} className="bg-black/30 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer font-medium hover:bg-black/20 transition">
                  {faq.q}
                </summary>
                <div className="px-4 py-3 text-sm text-gray-400 border-t border-white/5">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* 入驻权益 */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-green-400 mb-2">入驻权益</div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✓ 获得官方认证<span className="text-green-400 font-bold">机构NFT</span>标识</li>
                <li>✓ 精品NFT板块展示机会</li>
                <li>✓ 优先参与拍卖合作</li>
                <li>✓ 平台交易手续费折扣</li>
                <li>✓ DAO治理投票权重加成</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 等级体系 */}
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            等级体系
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {tierInfo.map(tier => (
              <div key={tier.id} className={`bg-black/30 rounded-xl p-4 border ${tier.borderColor}`}>
                <div className="text-center mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${tier.color} text-white`}>
                    {tier.badge} {tier.name}
                  </span>
                </div>
                <div className="text-center text-sm text-gray-400 mb-2">
                  质押 {tier.stake.toLocaleString()} BOX
                </div>
                <div className="space-y-1">
                  {tier.benefits.map((b, i) => (
                    <div key={i} className="text-xs flex items-center justify-between">
                      <span className={b.included ? 'text-gray-300' : 'text-gray-600'}>
                        {b.name}
                      </span>
                      {b.value ? (
                        <span className="text-green-400 font-bold">{b.value}</span>
                      ) : b.included ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 步骤1: 填写信息 */}
        {step === 1 && (
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-violet-400" />
              选择入驻类型
            </h2>

            {/* 入驻类型选择 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {joinTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setFormData({...formData, joinType: type.id})}
                  className={`p-4 rounded-xl border text-left transition ${
                    formData.joinType === type.id 
                      ? 'border-violet-500 bg-violet-500/20' 
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <type.icon className={`w-8 h-8 mb-2 ${formData.joinType === type.id ? 'text-violet-400' : 'text-gray-400'}`} />
                  <div className="font-bold">{type.name}</div>
                  <div className="text-xs text-gray-500">{type.desc}</div>
                </button>
              ))}
            </div>

            {/* 基本信息 */}
            <h2 className="font-bold text-lg flex items-center gap-2 pt-4">
              <User className="w-5 h-5 text-violet-400" />
              基本信息
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">公司/机构名称 *</label>
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="请输入公司全称"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">联系人 *</label>
                <input 
                  type="text" 
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  placeholder="请输入联系人姓名"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">邮箱 *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="example@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">联系电话</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="请输入联系电话"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">营业执照注册号 *</label>
              <input 
                type="text" 
                value={formData.licenseNumber}
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                placeholder="请输入营业执照注册号"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">营业执照电子版 *</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-violet-500 transition">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <div className="text-sm text-gray-400">点击上传营业执照</div>
                <div className="text-xs text-gray-500 mt-1">支持 JPG、PNG、PDF 格式</div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">SUI钱包地址 *</label>
              <input 
                type="text" 
                value={formData.boxAddress}
                onChange={(e) => setFormData({...formData, boxAddress: e.target.value})}
                placeholder="0x..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">选择入驻等级 * <span className="text-gray-500">(质押BOX数量)</span></label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {tierInfo.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setFormData({...formData, stakeAmount: tier.stake})}
                    className={`p-3 rounded-xl border text-center transition ${
                      formData.stakeAmount === tier.stake 
                        ? `border ${tier.borderColor} bg-violet-500/20` 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className={`text-sm font-bold ${tier.textColor}`}>{tier.badge} {tier.name}</div>
                    <div className="text-xs text-gray-500">{tier.stake.toLocaleString()} BOX</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 协议确认 */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-violet-500"
                />
                <div className="text-sm">
                  <div className="font-bold text-blue-400 mb-1">入驻协议</div>
                  <ul className="text-gray-400 space-y-1 text-xs">
                    <li>• 同意缴纳10,000 BOX保证金，违规将全额扣除</li>
                    <li>• 同意质押{formData.stakeAmount.toLocaleString()}+ BOX参与平台治理</li>
                    <li>• 保证所提供资料真实合法</li>
                    <li>• 遵守SUIBOX平台规则及相关法律法规</li>
                  </ul>
                </div>
              </label>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold text-lg transition"
            >
              提交申请
            </button>
          </div>
        )}

        {/* 步骤2: 确认支付 */}
        {step === 2 && (
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              确认支付
            </h2>

            <div className="bg-black/30 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">入驻类型</span>
                <span className="font-bold">{joinTypes.find(t => t.id === formData.joinType)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">公司名称</span>
                <span className="font-bold">{formData.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">联系人</span>
                <span className="font-bold">{formData.contactName}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">保证金</span>
                  <span className="font-bold text-amber-400">10,000 BOX</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">入驻等级</span>
                  <span className="font-bold text-violet-400">{tierInfo.find(t => t.stake === formData.stakeAmount)?.name}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">质押数量</span>
                  <span className="font-bold">{formData.stakeAmount.toLocaleString()} BOX</span>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                <Lock className="w-5 h-5" />
                重要提醒
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 保证金将在质押期间锁定</li>
                <li>• 如有违规行为，10,000 BOX将被扣除</li>
                <li>• 质押不满90天解除将收取20%违约金</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition"
              >
                返回修改
              </button>
              <button className="flex-1 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition">
                确认支付
              </button>
            </div>
          </div>
        )}

        {/* 流程说明 */}
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <h3 className="font-bold mb-4">入驻流程</h3>
          <div className="flex items-center justify-between">
            {[
              { step: 1, icon: '📝', title: '提交资料', desc: '填写机构信息' },
              { step: 2, icon: '💰', title: '支付保证金', desc: '缴纳BOX' },
              { step: 3, icon: '✅', title: '审核通过', desc: '1-3工作日' },
              { step: 4, icon: '🎉', title: '正式入驻', desc: '开始运营' },
            ].map((item) => (
              <div key={item.step} className="flex-1 text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mx-auto mb-2 ${
                  step >= item.step ? 'bg-violet-600' : 'bg-white/10'
                }`}>
                  {item.icon}
                </div>
                <div className="text-sm font-bold">{item.title}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>如有疑问请联系：support@suibox.io</p>
        </div>
      </main>
    </div>
  );
}
