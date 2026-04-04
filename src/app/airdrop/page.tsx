'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Copy, Check, Gift, Users, Zap, Trophy, X, ChevronRight, Clock, Star, TrendingUp, Shield, MessageCircle } from 'lucide-react';

// 数字滚动动画
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(value);
  
  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    prevRef.current = end;
  }, [value]);
  
  return <>{display.toLocaleString()}</>;
}

// 排行榜数据
const leaderboard = [
  { rank: 1, handle: '@SuiWhale', points: 28500, emoji: '🐋' },
  { rank: 2, handle: '@MetaDegen', points: 24100, emoji: '🎯' },
  { rank: 3, handle: '@NFTCollector', points: 19800, emoji: '🎨' },
  { rank: 4, handle: '@SuiMaximalist', points: 17500, emoji: '💎' },
  { rank: 5, handle: '@CryptoKing', points: 15200, emoji: '👑' },
  { rank: 6, handle: '@BlindBoxLover', points: 13800, emoji: '📦' },
  { rank: 7, handle: '@DeFiFarmer', points: 12400, emoji: '🌾' },
  { rank: 8, handle: '@SuiAsia', points: 11200, emoji: '🌏' },
  { rank: 9, handle: '@Web3Builder', points: 9800, emoji: '🔧' },
  { rank: 10, handle: '@GenesisHolder', points: 8500, emoji: '🚀' },
];

// 任务类型
interface Task {
  id: string;
  icon: React.ReactNode;
  title: string;
  titleEn: string;
  description: string;
  points: number;
  color: string;
  type: 'daily' | 'social' | 'invite';
  completed: boolean;
  requirement?: string;
  progress?: number;
  total?: number;
}

// 所有任务
const allTasks: Task[] = [
  {
    id: 'daily',
    icon: <Gift className="w-6 h-6" />,
    title: '每日签到',
    titleEn: 'Daily Check-in',
    description: '每日签到获取积分，连续签到额外奖励',
    points: 10,
    color: 'green',
    type: 'daily',
    completed: false,
  },
  {
    id: 'retweet',
    icon: <Twitter className="w-6 h-6" />,
    title: '转发创世纪帖子',
    titleEn: 'Retweet the Genesis Post',
    description: '转发官方空投推广推文并@3位好友',
    points: 50,
    color: 'cyan',
    type: 'social',
    completed: false,
  },
  {
    id: 'invite',
    icon: <Users className="w-6 h-6" />,
    title: '邀请好友加入',
    titleEn: 'Invite Friends',
    description: '每成功邀请1位好友 +100积分，无上限',
    points: 100,
    color: 'purple',
    type: 'invite',
    completed: false,
    progress: 23,
    total: 100,
  },
  {
    id: 'discord',
    icon: <MessageCircle className="w-6 h-6" />,
    title: '加入 Discord',
    titleEn: 'Join Discord',
    description: '加入 SUIBOX Discord 社区并完成验证',
    points: 80,
    color: 'blue',
    type: 'social',
    completed: false,
  },
  {
    id: 'swap',
    icon: <TrendingUp className="w-6 h-6" />,
    title: '完成 Swap 交易',
    titleEn: 'Complete Swap',
    description: '在 Cetus DEX 完成任意代币 swap',
    points: 200,
    color: 'orange',
    type: 'social',
    completed: false,
  },
  {
    id: 'hold-sui',
    icon: <Shield className="w-6 h-6" />,
    title: '持有 100 SUI',
    titleEn: 'Hold 100 SUI',
    description: '钱包余额保持 100 SUI 以上超过 7 天',
    points: 400,
    color: 'yellow',
    type: 'social',
    completed: false,
  },
];

export default function AirdropPage() {
  const [points, setPoints] = useState(12500);
  const [copied, setCopied] = useState(false);
  const [tasks, setTasks] = useState(allTasks);
  const [showModal, setShowModal] = useState<Task | null>(null);
  const [inviteCount, setInviteCount] = useState(23);

  const referralLink = 'https://suibox.io/r/suidogen2026';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
      setPoints(p => p + task.points);
      
      // 如果是邀请任务，增加邀请计数
      if (taskId === 'invite') {
        setInviteCount(c => c + 1);
      }
    }
  };

  const colorMap: Record<string, { bg: string; border: string; hover: string; text: string }> = {
    green: { bg: 'from-green-500 to-emerald-500', border: 'border-green-500/50', hover: 'hover:border-green-500', text: 'text-green-400' },
    cyan: { bg: 'from-cyan-500 to-blue-500', border: 'border-cyan-500/50', hover: 'hover:border-cyan-500', text: 'text-cyan-400' },
    purple: { bg: 'from-purple-500 to-pink-500', border: 'border-purple-500/50', hover: 'hover:border-purple-500', text: 'text-purple-400' },
    blue: { bg: 'from-blue-500 to-indigo-500', border: 'border-blue-500/50', hover: 'hover:border-blue-500', text: 'text-blue-400' },
    orange: { bg: 'from-orange-500 to-red-500', border: 'border-orange-500/50', hover: 'hover:border-orange-500', text: 'text-orange-400' },
    yellow: { bg: 'from-yellow-500 to-amber-500', border: 'border-yellow-500/50', hover: 'hover:border-yellow-500', text: 'text-yellow-400' },
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-gray-900 rounded-full border border-gray-800 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-gray-300">SEASON 0</span>
            <span className="text-gray-600">•</span>
            <span className="text-sm font-medium text-cyan-400">Genesis Airdrop Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quest Hub
            </span>
          </h1>
          <p className="text-gray-400">完成积分任务，解锁更多 $BOX 空投份额</p>
        </motion.div>

        {/* 主内容 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧用户面板 30% */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24 bg-gray-900 border border-gray-800 rounded-3xl p-6">
              {/* 顶部渐变线 */}
              <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full mb-6" />

              {/* 用户信息 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-3xl">
                  🎯
                </div>
                <div>
                  <h2 className="font-bold text-lg text-white">SuiDegen</h2>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Twitter className="w-3 h-3" /> @SuiDegen
                  </p>
                </div>
              </div>

              {/* 积分显示 */}
              <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">我的积分</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    <AnimatedNumber value={points} />
                  </span>
                  <span className="text-lg text-gray-400 font-medium">POINTS</span>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-gray-400">全球排名</span>
                  <span className="font-bold text-yellow-400">#1,247</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">完成任务</span>
                  <span className="font-bold text-green-400">{completedCount}/{tasks.length}</span>
                </div>
              </div>

              {/* 邀请链接 */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" /> 专属邀请链接
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 truncate font-mono">
                    {referralLink}
                  </div>
                  <button
                    onClick={copyLink}
                    className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all text-white"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 邀请统计 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-xl p-3 text-center border border-gray-700">
                  <p className="text-2xl font-bold text-cyan-400">{inviteCount}</p>
                  <p className="text-xs text-gray-400">已邀请</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 text-center border border-gray-700">
                  <p className="text-2xl font-bold text-purple-400">{inviteCount * 100}</p>
                  <p className="text-xs text-gray-400">邀请积分</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧任务列表 70% */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-4"
          >
            {tasks.map((task) => {
              const colors = colorMap[task.color];
              return (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-gray-900 border border-gray-800 ${colors.hover} rounded-2xl p-6 transition-all cursor-pointer`}
                  onClick={() => setShowModal(task)}
                >
                  <div className="flex items-center gap-4">
                    {/* 图标 */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white`}>
                      {task.icon}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white">{task.title}</h3>
                        {task.completed && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> 已完成
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{task.description}</p>

                      {/* 进度条 */}
                      {task.progress !== undefined && task.total && (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${colors.bg} rounded-full`}
                              style={{ width: `${(task.progress / task.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{task.progress}/{task.total}</span>
                        </div>
                      )}
                    </div>

                    {/* 积分和按钮 */}
                    <div className="text-right">
                      <div className={`text-2xl font-black ${colors.text} mb-2`}>+{task.points}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          completeTask(task.id);
                        }}
                        disabled={task.completed}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                          task.completed
                            ? 'bg-gray-700 text-gray-400 cursor-default'
                            : `bg-gradient-to-r ${colors.bg} text-white`
                        }`}
                      >
                        {task.completed ? (
                          <span className="flex items-center gap-2"><Check className="w-4 h-4" /> 已完成</span>
                        ) : (
                          '领取'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* 更多任务提示 */}
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">更多任务即将开放...</p>
            </div>
          </motion.div>
        </div>

        {/* 底部排行榜 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gray-900 border border-gray-800 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Leaderboard</h2>
                <p className="text-sm text-gray-400">积分排行榜 · Top 10</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm text-gray-400 hover:text-white transition-all">
              查看全部 →
            </button>
          </div>

          <div className="space-y-2">
            {leaderboard.map((user, index) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  index < 3
                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20'
                    : 'bg-gray-800 hover:bg-gray-750'
                }`}
              >
                <div className="w-12 text-center">
                  {index === 0 ? <span className="text-3xl">🥇</span>
                    : index === 1 ? <span className="text-3xl">🥈</span>
                    : index === 2 ? <span className="text-3xl">🥉</span>
                    : <span className="text-lg font-bold text-gray-500">#{user.rank}</span>}
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                  index < 3 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gray-700'
                }`}>
                  {user.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{user.handle}</p>
                  <p className="text-xs text-gray-400">已邀请 {Math.floor(Math.random() * 50) + 10} 人</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${
                    index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-cyan-400'
                  }`}>
                    {user.points.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">积分</p>
                </div>
                {index < 3 && (
                  <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">
                    TOP {index + 1}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">💡 完成更多任务提升排名，排名越高，空投份额越多！</p>
          <p className="text-gray-600 text-xs mt-2">Complete more quests to climb the leaderboard. Higher rank = More airdrop allocation!</p>
        </div>
      </div>

      {/* 任务详情弹窗 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">任务详情</h3>
                <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[showModal.color].bg} flex items-center justify-center text-white`}>
                  {showModal.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{showModal.title}</h4>
                  <p className="text-sm text-gray-400">{showModal.titleEn}</p>
                </div>
              </div>

              <p className="text-gray-400 mb-4">{showModal.description}</p>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Star className="w-4 h-4" />
                <span>奖励: <span className={`font-bold ${colorMap[showModal.color].text}`}>+{showModal.points} 积分</span></span>
              </div>

              <button
                onClick={() => {
                  completeTask(showModal.id);
                  setShowModal(null);
                }}
                disabled={showModal.completed}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  showModal.completed
                    ? 'bg-gray-700 text-gray-400 cursor-default'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400'
                }`}
              >
                {showModal.completed ? '已领取' : '立即领取'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
