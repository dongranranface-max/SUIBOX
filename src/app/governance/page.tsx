'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Vote, TrendingUp, Users, Shield, Zap, Clock, CheckCircle, XCircle, ArrowRight, Gift, Star, Flame, ChevronRight, ThumbsUp, ThumbsDown, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// 倒计时组件
function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [endTime]);
  
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 1;
  
  return (
    <div className={`flex items-center gap-1 text-sm ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>
      <Clock className="w-4 h-4" />
      {timeLeft.days > 0 && <span>{timeLeft.days}天</span>}
      <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
      <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
      <span className={isUrgent ? 'text-red-400 font-bold' : ''}>{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
}

// 模拟提案数据
const proposals = [
  { 
    id: 1, 
    title: '发行新系列NFT - 太空探索者', 
    type: 'issuance',
    typeText: '发行提议',
    desc: '建议发行10000个太空探索者主题NFT，部分收益用于平台回购BOX',
    status: 'voting',
    votes: 125000,
    totalVotes: 250000,
    startTime: '2026-03-15 10:00',
    endTime: '2026-03-18 22:00',
    votesFor: 68,
    votesAgainst: 32,
    reward: 500,
    proposer: '官方团队',
    proposerType: 'official',
    window: '第一轮'
  },
  { 
    id: 2, 
    title: '降低盲盒手续费至5%', 
    type: 'parameter',
    typeText: '参数调整',
    desc: '将盲盒交易手续费从8%降低至5%，增加用户购买意愿',
    status: 'passed',
    votes: 180000,
    totalVotes: 200000,
    startTime: '2026-03-05 10:00',
    endTime: '2026-03-10 22:00',
    votesFor: 75,
    votesAgainst: 25,
    reward: 300,
    proposer: '社区用户',
    proposerType: 'community',
    window: '已结束'
  },
  { 
    id: 3, 
    title: '新增DeFi质押池奖励', 
    type: 'feature',
    typeText: '新功能',
    desc: '为质押用户提供额外BOX奖励，每周分发',
    status: 'voting',
    votes: 80000,
    totalVotes: 200000,
    startTime: '2026-03-16 10:00',
    endTime: '2026-03-20 22:00',
    votesFor: 55,
    votesAgainst: 45,
    reward: 400,
    proposer: '社区用户',
    proposerType: 'community',
    window: '第二轮'
  },
  { 
    id: 4, 
    title: '上线NFT投票功能', 
    type: 'feature',
    typeText: '新功能',
    desc: '允许NFT持有者参与治理投票，持有NFT获得额外投票权重',
    status: 'pending',
    votes: 0,
    totalVotes: 0,
    startTime: '2026-03-20 10:00',
    endTime: '2026-03-25 22:00',
    votesFor: 0,
    votesAgainst: 0,
    reward: 600,
    proposer: '官方团队',
    proposerType: 'official',
    window: '未开始'
  },
  { 
    id: 5, 
    title: '成立生态基金扶持项目', 
    type: 'fund',
    typeText: '资金提案',
    desc: '设立1000万BOX生态基金，扶持SUI链优质项目',
    status: 'voting',
    votes: 45000,
    totalVotes: 300000,
    startTime: '2026-03-14 10:00',
    endTime: '2026-03-22 22:00',
    votesFor: 42,
    votesAgainst: 58,
    reward: 800,
    proposer: '官方团队',
    proposerType: 'official',
    window: '第一轮'
  },
];

const typeFilters = [
  { id: 'all', label: '全部', count: 12 },
  { id: 'issuance', label: '发行提议', count: 3 },
  { id: 'parameter', label: '参数调整', count: 4 },
  { id: 'feature', label: '新功能', count: 3 },
  { id: 'fund', label: '资金提案', count: 2 },
];

export default function GovernancePage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [filterType, setFilterType] = useState('all');
  const [userBox] = useState(12500);
  const [delegated] = useState(5000);
  const [myVotes, setMyVotes] = useState< Record<number, 'for' | 'against' | null>>({});
  const [votingPanel, setVotingPanel] = useState<{proposalId: number; vote: 'for' | 'against'} | null>(null);
  const [voteAmount, setVoteAmount] = useState('');
  
  // 用户NFT持仓（模拟）
  const userNFTs = [
    { rarity: 'epic', name: '稀缺NFT', count: 1, votes: 10 },
    { rarity: 'rare', name: '史诗NFT', count: 2, votes: 6 },
    { rarity: 'common', name: '稀有NFT', count: 3, votes: 3 },
  ];
  
  const totalNFTVotes = userNFTs.reduce((sum, nft) => sum + nft.votes, 0);
  const totalVotes = userBox + totalNFTVotes; // 总投票权
  
  const filteredProposals = filterType === 'all' 
    ? proposals 
    : proposals.filter(p => p.type === filterType);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'voting': 
        return { bg: 'bg-green-500/20', text: 'text-green-400', label: '投票中', icon: Clock };
      case 'passed': 
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '已通过', icon: CheckCircle };
      case 'rejected': 
        return { bg: 'bg-red-500/20', text: 'text-red-400', label: '已否决', icon: XCircle };
      case 'pending': 
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: '待开始', icon: Clock };
      default: 
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: status, icon: Clock };
    }
  };

  const handleVote = (proposalId: number, vote: 'for' | 'against') => {
    // 打开投票面板
    setVotingPanel({ proposalId, vote });
  };

  const confirmVote = () => {
    if (!votingPanel || !voteAmount) return;
    setMyVotes(prev => ({
      ...prev,
      [votingPanel.proposalId]: votingPanel.vote
    }));
    setVotingPanel(null);
    setVoteAmount('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 头部 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-violet-900/30 to-black py-10">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, violet 0%, transparent 50%)' }} />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-3 flex items-center gap-3">
              <Vote className="w-8 h-8 text-violet-400" />
              社区提案
            </h1>
            <p className="text-gray-400 mb-6">持有BOX代币，参与平台决策，共同建设SUIBOX生态</p>
            
            {/* 用户治理概览 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-violet-400">{userBox.toLocaleString()}</div>
                <div className="text-xs text-gray-400">我的BOX</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-blue-400">{delegated.toLocaleString()}</div>
                <div className="text-xs text-gray-400">已委托</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-green-400">5</div>
                <div className="text-xs text-gray-400">参与投票</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-amber-400">1,250</div>
                <div className="text-xs text-gray-400">获得奖励</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 主内容 */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* 提案类型筛选 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {typeFilters.map(type => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filterType === type.id 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </div>

        {/* 提案列表 */}
        <div className="space-y-4">
          {filteredProposals.map((proposal) => {
            const statusConfig = getStatusConfig(proposal.status);
            const StatusIcon = statusConfig.icon;
            const progress = proposal.totalVotes > 0 ? (proposal.votes / proposal.totalVotes) * 100 : 0;
            const userVote = myVotes[proposal.id];
            
            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      <span className="text-xs text-gray-500">{proposal.typeText}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        proposal.proposerType === 'official' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {proposal.proposerType === 'official' ? '🏛️ 官方' : '👥 社区'}
                      </span>
                      <span className="text-xs text-gray-500">
                        提议人: <span className="text-gray-400">{proposal.proposer}</span>
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{proposal.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{proposal.desc}</p>
                  
                  {/* 投票进度条 */}
                  {proposal.status === 'voting' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-400">赞成 {proposal.votesFor}%</span>
                        <span className="text-red-400">反对 {proposal.votesAgainst}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="flex h-full">
                          <div 
                            className="bg-green-500 transition-all" 
                            style={{ width: `${proposal.votesFor}%` }}
                          />
                          <div 
                            className="bg-red-500 transition-all" 
                            style={{ width: `${proposal.votesAgainst}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>已投: {proposal.votes.toLocaleString()}</span>
                        <span>目标: {proposal.totalVotes.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {proposal.status === 'voting' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVote(proposal.id, 'for')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition ${
                              userVote === 'for' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            赞成
                          </button>
                          <button
                            onClick={() => handleVote(proposal.id, 'against')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition ${
                              userVote === 'against' 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            反对
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          投票已结束
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* 投票窗口 */}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        proposal.status === 'voting' 
                          ? 'bg-green-500/20 text-green-400' 
                          : proposal.status === 'pending'
                          ? 'bg-gray-500/20 text-gray-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        📅 {proposal.window}
                      </div>
                      
                      {proposal.status !== 'pending' && (
                        <div className="text-sm text-amber-400 flex items-center gap-1">
                          <Gift className="w-4 h-4" />
                          投票奖励 {proposal.reward} BOX
                        </div>
                      )}
                      {proposal.status === 'voting' && (
                        <CountdownTimer endTime={proposal.endTime} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 投票面板弹窗 */}
        {votingPanel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setVotingPanel(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {votingPanel.vote === 'for' ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <ThumbsUp className="w-5 h-5" /> 赞成投票
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1">
                      <ThumbsDown className="w-5 h-5" /> 反对投票
                    </span>
                  )}
                </h3>
                <button onClick={() => setVotingPanel(null)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>
              
              {/* 我的投票权 */}
              <div className="bg-black/30 rounded-xl p-4 mb-4">
                <div className="text-sm text-gray-400 mb-3">我的投票权</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">{userBox.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">BOX (1票/个)</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">{totalNFTVotes}</div>
                    <div className="text-xs text-gray-500">NFT投票权</div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-lg font-bold">总计: </span>
                  <span className="text-xl font-bold text-green-400">{totalVotes.toLocaleString()} 票</span>
                </div>
              </div>
              
              {/* NFT持仓 */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">我的NFT持仓</div>
                <div className="space-y-2">
                  {userNFTs.map((nft, i) => (
                    <div key={i} className="flex justify-between text-sm bg-white/5 rounded-lg p-2">
                      <span className={nft.rarity === 'epic' ? 'text-amber-400' : nft.rarity === 'rare' ? 'text-blue-400' : 'text-green-400'}>
                        {nft.name} x{nft.count}
                      </span>
                      <span className="text-gray-400">= {nft.votes} 票</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 投票数量输入 */}
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">输入投票数量</div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={voteAmount}
                    onChange={e => setVoteAmount(e.target.value)}
                    placeholder="0"
                    max={totalVotes}
                    className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-xl focus:outline-none focus:border-green-500"
                  />
                  <button
                    onClick={() => setVoteAmount(totalVotes.toString())}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
                  >
                    全部
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  可用票数: {totalVotes.toLocaleString()} 票
                </div>
              </div>
              
              {/* 确认按钮 */}
              <button
                onClick={confirmVote}
                disabled={!voteAmount || parseInt(voteAmount) <= 0 || parseInt(voteAmount) > totalVotes}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                  voteAmount && parseInt(voteAmount) > 0 && parseInt(voteAmount) <= totalVotes
                    ? votingPanel.vote === 'for' 
                      ? 'bg-green-600 hover:bg-green-500' 
                      : 'bg-red-600 hover:bg-red-500'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                {votingPanel.vote === 'for' ? (
                  <>
                    <ThumbsUp className="w-5 h-5" />
                    确认赞成
                  </>
                ) : (
                  <>
                    <ThumbsDown className="w-5 h-5" />
                    确认反对
                  </>
                )}
              </button>
              
              {/* 链上确权提示 */}
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <div className="text-xs text-blue-400 flex items-center gap-2">
                  <span>⛓️</span>
                  <span>投票将作为链上交易记录，不可篡改</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 提案审核 */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            提案审核规则
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 官方提案 */}
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏛️</span>
                <span className="font-bold text-blue-400">官方提案</span>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>无需审核，直接进入投票</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>可直接发起多轮投票</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>优先进入快速通道</span>
                </div>
              </div>
            </div>
            
            {/* 社区提案 */}
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👥</span>
                <span className="font-bold text-amber-400">社区提案</span>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>需提交 500 BOX 审核保证金</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>审核周期 24-48 小时</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>审核通过后进入投票</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>未通过保证金不退</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 审核标准 */}
          <div className="mt-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <div className="text-sm text-amber-400 font-bold mb-2">📋 社区提案审核标准</div>
            <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-400">
              <span>• 符合平台发展规划</span>
              <span>• 有利于生态长期发展</span>
              <span>• 提案内容完整清晰</span>
              <span>• 不违反相关法律法规</span>
              <span>• 技术实现可行性</span>
              <span>• 社区广泛支持</span>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            委托投票权
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 当前委托状态 */}
            <div>
              <div className="text-sm text-gray-400 mb-3">我的委托</div>
              <div className="bg-black/30 rounded-xl p-4">
                {delegated > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                        王
                      </div>
                      <div>
                        <div className="font-bold">社区代表-王</div>
                        <div className="text-xs text-gray-500">委托: {delegated.toLocaleString()} BOX</div>
                      </div>
                    </div>
                    <button className="text-sm text-red-400 hover:text-red-300">取消委托</button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">暂未委托投票权</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 可选代表 */}
            <div>
              <div className="text-sm text-gray-400 mb-3">可委托代表</div>
              <div className="space-y-2">
                {[
                  { name: '社区代表-王', votes: 125000, desc: '专业分析师' },
                  { name: '社区代表-李', votes: 98000, desc: '资深玩家' },
                  { name: '社区代表-张', votes: 76000, desc: '生态贡献者' },
                ].map((rep, i) => (
                  <div key={i} className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold">
                        {rep.name.slice(-1)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{rep.name}</div>
                        <div className="text-xs text-gray-500">{rep.desc} · {rep.votes.toLocaleString()}票</div>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-violet-600 hover:bg-violet-500 rounded-lg transition">
                      委托
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 投票规则 */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            投票窗口期
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📅</span>
                <span className="font-bold text-blue-400">窗口期设置</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">投票窗口</span>
                  <span className="font-medium">每个提案 3 天</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">开放时间</span>
                  <span className="font-medium">10:00 - 22:00 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">窗口轮次</span>
                  <span className="font-medium">可多轮投票</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">计分规则</span>
                  <span className="font-medium">最后一轮结果为准</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⏰</span>
                <span className="font-bold text-amber-400">当前窗口</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">第一轮</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">进行中</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">第二轮</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">即将开始</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">最终轮</span>
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">待开始</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            投票规则与门槛
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* BOX投票规则 */}
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🪙</span>
                <span className="font-bold text-amber-400">BOX 投票权</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">最低持有</span>
                  <span className="font-medium">100 BOX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">投票权重</span>
                  <span className="font-medium">1 BOX = 1 票</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">提案门槛</span>
                  <span className="font-medium">10,000 BOX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">通过条件</span>
                  <span className="font-medium">≥51% 赞成票</span>
                </div>
              </div>
            </div>
            
            {/* NFT投票规则 */}
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🖼️</span>
                <span className="font-bold text-purple-400">NFT 投票权</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">稀缺NFT</span>
                  <span className="font-medium text-amber-400">10 票/NFT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">史诗NFT</span>
                  <span className="font-medium text-blue-400">5 票/NFT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">稀有NFT</span>
                  <span className="font-medium text-green-400">3 票/NFT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">普通NFT</span>
                  <span className="font-medium">1 票/NFT</span>
                </div>
              </div>
            </div>
            
            {/* 提案通过条件 */}
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📋</span>
                <span className="font-bold text-blue-400">提案通过条件</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">最低投票率</span>
                  <span className="font-medium">≥ 10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">赞成票比例</span>
                  <span className="font-medium">≥ 51%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">投票冷却</span>
                  <span className="font-medium">24 小时</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">执行延迟</span>
                  <span className="font-medium">48 小时</span>
                </div>
              </div>
            </div>
            
            {/* 投票奖励 */}
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎁</span>
                <span className="font-bold text-green-400">投票奖励</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">参与投票</span>
                  <span className="font-medium text-green-400">50-100 BOX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">提案通过</span>
                  <span className="font-medium text-green-400">额外 200 BOX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">发起提案</span>
                  <span className="font-medium text-green-400">500-1000 BOX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">投票权重</span>
                  <span className="font-medium">BOX + NFT 叠加</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-400" />
            投票说明
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              持有BOX即可参与提案投票
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              投票即可获得BOX奖励
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              提案需达到法定投票率才能通过
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              可委托投票权给社区代表
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
