'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Palette, BarChart3, Wallet, Settings, Users, FileText, TrendingUp, Shield, Gift, CreditCard, ChevronRight, Edit, Trash2, Eye, Plus, Download, CheckCircle, Clock, AlertCircle, Star, Crown, Gem, Heart, Vote, Copy, Check, MessageCircle, Send, Sparkles, Bot, X, Minimize2, Maximize2, Headphones, Phone, Video } from 'lucide-react';

const institutionData = {
  name: '星辰艺术馆',
  tier: 'Diamond',
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

const nftList = [
  { id: 1, name: '星河系列 #01', status: 'selling', price: 88, views: 1250, likes: 156 },
  { id: 2, name: '星河系列 #02', status: 'selling', price: 88, views: 980, likes: 120 },
  { id: 3, name: '星河系列 #03', status: 'pending', price: 128, views: 0, likes: 0 },
  { id: 4, name: '宇宙漫游 #15', status: 'sold', price: 256, views: 2560, likes: 420 },
];

const earningsList = [
  { id: 1, date: '2026-03-15', amount: 1250, type: '销售', status: 'completed' },
  { id: 2, date: '2026-03-14', amount: 980, type: '销售', status: 'completed' },
  { id: 3, date: '2026-03-13', amount: 2560, type: '销售', status: 'completed' },
];

// AI Assistant messages
const aiSuggestions = [
  '分析今日销售数据',
  '优化NFT定价策略',
  '生成推广文案',
  '查看用户画像',
];

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  time: string;
}

export default function InstitutionPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [csChatOpen, setCsChatOpen] = useState(false);
  const [aiMinimized, setAiMinimized] = useState(false);
  const [csMinimized, setCsMinimized] = useState(false);
  const [aiMessages, setAiMessages] = useState<Message[]>([
    { id: 1, role: 'ai', content: '您好！我是AI助手，可以帮您分析数据、优化运营策略等。有什么可以帮您？', time: '10:00' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [csMessages, setCsMessages] = useState<Message[]>([
    { id: 1, role: 'ai', content: '您好！欢迎联系SUIBOX官方客服，请问有什么可以帮助您？', time: '10:00' }
  ]);
  const [csInput, setCsInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const csMessagesEndRef = useRef<HTMLDivElement>(null);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    csMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [csMessages]);
  useEffect(() => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const copyAddress = () => {
    navigator.clipboard.writeText('0x1234...5678');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const newMsg: Message = { id: Date.now(), role: 'user', content: aiInput, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) };
    setAiMessages([...aiMessages, newMsg]);
    setAiInput('');
    setAiTyping(true);
    setTimeout(() => {
      setAiTyping(false);
      const responses = [
        '根据数据分析，您的作品在本周的曝光量提升了35%，建议继续保持当前定价策略。',
        '我帮您生成了一个新的推广方案：结合当下热点话题营销，预计可以提升20%的流量。',
        '根据用户画像分析，目标用户群体主要是18-30岁的年轻人，建议增加时尚潮流类元素。',
      ];
      const aiMsg: Message = { id: Date.now() + 1, role: 'ai', content: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) };
      setAiMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  const handleCsSend = () => {
    if (!csInput.trim()) return;
    const newMsg: Message = { id: Date.now(), role: 'user', content: csInput, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) };
    setCsMessages([...csMessages, newMsg]);
    setCsInput('');
    setTimeout(() => {
      const responses = [
        '感谢您的咨询，您的问题我们已经记录，会尽快处理。',
        '您可以拨打官方热线 400-888-8888 获取更详细的帮助。',
        '我们已经收到您的反馈，会在1-3个工作日内回复您。',
      ];
      const csMsg: Message = { id: Date.now() + 1, role: 'ai', content: responses[Math.floor(Math.random() * responses.length)], time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) };
      setCsMessages(prev => [...prev, csMsg]);
    }, 1000);
  };

  const tabs = [
    { key: 'overview', label: '概览', icon: BarChart3 },
    { key: 'nfts', label: '作品', icon: Palette },
    { key: 'earnings', label: '收益', icon: CreditCard },
    { key: 'settings', label: '设置', icon: Settings },
  ];

  const tierColors: Record<string, string> = {
    Diamond: 'from-cyan-400 to-blue-500',
    Gold: 'from-yellow-400 to-orange-500',
    Silver: 'from-gray-300 to-gray-400',
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-violet-900/30 to-black py-4 md:py-6">
        <div className="max-w-6xl mx-auto px-3 md:px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3 md:gap-4 flex-1 min-w-0">
              <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${tierColors[institutionData.tier]} flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 shadow-lg`}>
                🏛️
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg md:text-2xl font-bold truncate">{institutionData.name}</h1>
                  <span className={`px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold bg-gradient-to-r ${tierColors[institutionData.tier]} text-white`}>
                    {institutionData.tier}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-xs md:text-sm font-mono truncate">0x1234...5678</span>
                  <button onClick={copyAddress} className="p-1 hover:bg-white/10 rounded flex-shrink-0">
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-500" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {/* AI & Customer Service Buttons */}
              <button onClick={() => setAiChatOpen(true)} className="p-2 md:p-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-lg flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">AI助手</span>
              </button>
              <button onClick={() => setCsChatOpen(true)} className="p-2 md:p-3 bg-green-600 hover:bg-green-500 rounded-lg flex items-center gap-1.5">
                <Headphones className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">客服</span>
              </button>
              <button className="p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-lg">
                <Settings className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mt-4 md:mt-6">
            {[
              { label: '总销售额', value: `${(institutionData.stats.totalSales / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'green' },
              { label: '作品数', value: institutionData.stats.totalNFTs, icon: Palette, color: 'violet' },
              { label: '浏览量', value: `${(institutionData.stats.totalViews / 1000).toFixed(1)}K`, icon: Eye, color: 'blue' },
              { label: '获赞', value: `${(institutionData.stats.totalLikes / 1000).toFixed(1)}K`, icon: Heart, color: 'pink' },
              { label: '粉丝', value: `${(institutionData.stats.followers / 1000).toFixed(1)}K`, icon: Users, color: 'cyan' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900/60 rounded-xl p-2 md:p-3 border border-white/5">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                  <stat.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 text-${stat.color}-400`} />
                  <span className="text-gray-500 text-[10px] md:text-xs">{stat.label}</span>
                </div>
                <div className="font-bold text-sm md:text-lg truncate">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 -mt-2 relative z-10">
        <div className="bg-gradient-to-r from-violet-900/40 to-pink-900/40 rounded-xl p-3 md:p-4 border border-violet-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm md:text-base">🏆 等级权益</span>
            <span className="text-xs md:text-sm text-violet-400">{institutionData.benefits.discount} 交易折扣</span>
          </div>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {[
              { label: '首页推荐', active: institutionData.benefits.homepage },
              { label: '优先展示', active: institutionData.benefits.priority },
              { label: '拍卖特权', active: institutionData.benefits.auction },
              { label: 'DAO投票', active: institutionData.benefits.dao },
              { label: 'VIP客服', active: institutionData.benefits.vipSupport },
            ].map((benefit, i) => (
              <span key={i} className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium ${benefit.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-500'}`}>
                {benefit.active ? '✓' : '✗'} {benefit.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 mt-4">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '发布作品', icon: Plus, color: 'violet' },
                { label: '收益明细', icon: CreditCard, color: 'green' },
                { label: '数据报表', icon: BarChart3, color: 'blue' },
                { label: '消息中心', icon: Users, color: 'pink' },
              ].map((action, i) => (
                <button key={i} className="bg-gray-900/60 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all">
                  <action.icon className={`w-5 h-5 md:w-6 md:h-5 text-${action.color}-400 mb-2`} />
                  <div className="font-medium text-sm">{action.label}</div>
                </button>
              ))}
            </div>
            <div className="bg-gray-900/40 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">最近作品</h3>
                <button className="text-violet-400 text-sm">查看全部</button>
              </div>
              <div className="space-y-2">
                {nftList.slice(0, 3).map(nft => (
                  <div key={nft.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-violet-500/30 to-pink-500/30 rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{nft.name}</div>
                        <div className="text-xs text-gray-500">
                          {nft.status === 'selling' ? '🟢 出售中' : nft.status === 'pending' ? '🟡 审核中' : '✅ 已售出'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="font-bold text-sm">{nft.price} SUI</div>
                      <div className="text-xs text-gray-500">👁 {nft.views} ❤️ {nft.likes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {nftList.map(nft => (
              <div key={nft.id} className="bg-gray-900/60 rounded-xl overflow-hidden border border-white/5">
                <div className="aspect-square bg-gradient-to-br from-violet-500/20 to-pink-500/20" />
                <div className="p-3">
                  <div className="font-medium text-sm truncate">{nft.name}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-violet-400">{nft.price} SUI</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${nft.status === 'selling' ? 'bg-green-500/20 text-green-400' : nft.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-600 text-gray-300'}`}>
                      {nft.status === 'selling' ? '出售中' : nft.status === 'pending' ? '审核中' : '已售出'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-3">
            {earningsList.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-900/40 rounded-xl border border-white/5">
                <div>
                  <div className="font-medium text-sm">{item.type}</div>
                  <div className="text-xs text-gray-500">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">+{item.amount} SUI</div>
                  <div className="text-xs text-green-400/70">{item.status === 'completed' ? '已完成' : '处理中'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-gray-900/40 rounded-xl p-4 border border-white/5">
              <h3 className="font-bold mb-4">机构信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">机构名称</span>
                  <span>{institutionData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">等级</span>
                  <span className="text-violet-400">{institutionData.tier}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">入驻时间</span>
                  <span>{institutionData.joinedAt}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {aiChatOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setAiChatOpen(false)}
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className={`bg-gray-900 w-full ${aiMinimized ? 'h-14' : 'h-[70vh]'} md:h-[600px] md:max-w-md rounded-t-2xl md:rounded-2xl border border-white/10 flex flex-col`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="font-bold">AI 运营助手</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAiMinimized(!aiMinimized)} className="p-1 hover:bg-white/10 rounded">
                    {aiMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setAiChatOpen(false)} className="p-1 hover:bg-white/10 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {!aiMinimized && (
                <>
                  {/* Quick Suggestions */}
                  <div className="px-3 py-2 border-b border-white/5 flex gap-2 overflow-x-auto">
                    {aiSuggestions.map((suggestion, i) => (
                      <button key={i} onClick={() => { setAiInput(suggestion); handleAiSend(); }} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs whitespace-nowrap">
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {aiMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-violet-600' : 'bg-white/10'} text-sm`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {aiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 px-4 py-2 rounded-2xl flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    )}
                    <div ref={aiMessagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-white/10 flex gap-2">
                    <input 
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                      placeholder="输入您的问题..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
                    />
                    <button onClick={handleAiSend} className="p-2 bg-violet-600 rounded-full">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Service Modal */}
      <AnimatePresence>
        {csChatOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setCsChatOpen(false)}
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className={`bg-gray-900 w-full ${csMinimized ? 'h-14' : 'h-[70vh]'} md:h-[600px] md:max-w-md rounded-t-2xl md:rounded-2xl border border-white/10 flex flex-col`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold">官方客服</span>
                    <span className="text-xs text-green-400 ml-2">在线</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-white/10 rounded">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-white/10 rounded">
                    <Video className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCsMinimized(!csMinimized)} className="p-1 hover:bg-white/10 rounded">
                    {csMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setCsChatOpen(false)} className="p-1 hover:bg-white/10 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {!csMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {csMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-green-600' : 'bg-white/10'} text-sm`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    <div ref={csMessagesEndRef} />
                  </div>

                  {/* Quick Replies */}
                  <div className="px-3 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
                    {['如何入驻？', '交易问题', '客服热线', '工作时间'].map((reply, i) => (
                      <button key={i} onClick={() => { setCsInput(reply); handleCsSend(); }} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs whitespace-nowrap">
                        {reply}
                      </button>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-white/10 flex gap-2">
                    <input 
                      value={csInput}
                      onChange={e => setCsInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCsSend()}
                      placeholder="输入您的问题..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500"
                    />
                    <button onClick={handleCsSend} className="p-2 bg-green-600 rounded-full">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
