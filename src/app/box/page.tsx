'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Coins, Zap, Shield, Clock, Info, 
  ChevronRight, Star, Sparkles, TrendingUp,
  Check, AlertTriangle, Package
} from 'lucide-react';

// 开盒结果类型
type BoxResult = {
  type: 'normal' | 'rare' | 'epic' | 'nothing';
  name: string;
  fragment: string;
  probability: number;
  color: string;
  emoji: string;
};

// 开盒概率
const boxProbabilities: BoxResult[] = [
  { type: 'normal', name: '普通碎片', fragment: 'Common Fragment', probability: 50, color: 'gray', emoji: '🔹' },
  { type: 'rare', name: '稀有碎片', fragment: 'Rare Fragment', probability: 15, color: 'purple', emoji: '💎' },
  { type: 'epic', name: '史诗碎片', fragment: 'Epic Fragment', probability: 3, color: 'orange', emoji: '⚡' },
  { type: 'nothing', name: '感谢参与', fragment: 'Better Luck Next Time', probability: 32, color: 'red', emoji: '😅' },
];

// 双通道配置
const channels = [
  {
    id: 'free',
    name: '免费开盒',
    icon: '🎁',
    color: 'green',
    dailyLimit: '1次（传奇5次+）',
    cost: '免费',
    output: '普通/稀有/史诗碎片（概率）',
    desc: 'DAU基本盘，保障日活',
  },
  {
    id: 'premium',
    name: '高级付费开盒',
    icon: '💎',
    color: 'cyan',
    dailyLimit: '不限次',
    cost: '15 BOX',
    output: '100%必出稀有或史诗（各50%）',
    desc: '散户BOX消耗黑洞，截断抛压',
  },
];

export default function BoxPage() {
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<BoxResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalOpened, setTotalOpened] = useState(0);
  const [freeCount, setFreeCount] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState('free');
  const [countdown, setCountdown] = useState('');

  const currentChannel = channels.find(c => c.id === selectedChannel)!;

  // 模拟倒计时（每日重置）
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // 开盒逻辑
  const openBox = () => {
    if (isOpening) return;
    if (selectedChannel === 'free' && freeCount <= 0) return;

    setIsOpening(true);
    setResult(null);
    setShowResult(false);

    // 动画时长
    setTimeout(() => {
      // 根据概率随机
      const rand = Math.random() * 100;
      let cumulative = 0;
      let selected: BoxResult = boxProbabilities[3]; // 默认感谢参与

      for (const prob of boxProbabilities) {
        cumulative += prob.probability;
        if (rand < cumulative) {
          selected = prob;
          break;
        }
      }

      setResult(selected);
      setShowResult(true);
      setIsOpening(false);
      setTotalOpened(t => t + 1);
      if (selectedChannel === 'free') setFreeCount(c => c - 1);
    }, 2000);
  };

  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    gray: { bg: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/30', text: 'text-gray-400', glow: 'shadow-gray-500/20' },
    purple: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
    orange: { bg: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
    red: { bg: 'from-red-500/20 to-pink-500/20', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20' },
    green: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
    cyan: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-800 mb-4">
            <Gift className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">NFT Blind Box</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Mystery Box
            </span>
          </h1>
          <p className="text-gray-400">开启盲盒，获取碎片，合成NFT</p>
        </motion.div>

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: '今日免费次数', value: freeCount.toString(), sub: '次', icon: '🎁', color: 'green' },
            { label: '累计开盒', value: totalOpened.toString(), sub: '次', icon: '📊', color: 'cyan' },
            { label: '每日重置', value: countdown, sub: '', icon: '⏱️', color: 'purple' },
            { label: '下次刷新', value: '00:00', sub: '北京时间', icon: '🔄', color: 'gray' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span>{item.icon}</span>
                <span className="text-gray-500 text-sm">{item.label}</span>
              </div>
              <p className={`text-2xl md:text-3xl font-black ${colorMap[item.color as keyof typeof colorMap]?.text || 'text-white'}`}>
                {item.value}
              </p>
              {item.sub && <p className="text-gray-500 text-sm">{item.sub}</p>}
            </div>
          ))}
        </motion.div>

        {/* 主内容 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧盲盒主体 50% */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center">
              {/* 盲盒主体 */}
              <div className="relative mb-8">
                {/* 外发光 */}
                <motion.div
                  animate={isOpening ? { 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 2, repeat: isOpening ? Infinity : 0 }}
                  className="relative mx-auto w-64 h-64"
                >
                  {/* 盒子 */}
                  <motion.div
                    animate={isOpening ? {
                      y: [0, -20, 0, -10, 0],
                      rotateX: [0, 10, -10, 5, 0],
                    } : {}}
                    transition={{ duration: 0.5, repeat: isOpening ? Infinity : 0 }}
                    className="relative w-full h-full"
                  >
                    {/* 盒子主体 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 rounded-3xl shadow-2xl shadow-purple-500/30">
                      {/* 顶部装饰 */}
                      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl" />
                      
                      {/* 问号 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={isOpening ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="text-8xl"
                        >
                          {isOpening ? '?' : '🎁'}
                        </motion.div>
                      </div>

                      {/* 闪光效果 */}
                      {isOpening && (
                        <div className="absolute inset-0 overflow-hidden rounded-3xl">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              animate={{
                                x: [Math.random() * 256, Math.random() * 256],
                                y: [Math.random() * 256, Math.random() * 256],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 倒影 */}
                    <div 
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-b from-purple-500/30 to-transparent rounded-full blur-lg"
                      style={{ transform: 'scaleY(-0.3)' }}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* 通道选择 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {channels.map((channel) => (
                  <motion.button
                    key={channel.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all
                      ${selectedChannel === channel.id
                        ? channel.id === 'free'
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-cyan-500/20 border-cyan-500'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{channel.icon}</span>
                      <span className="font-bold text-white">{channel.name}</span>
                    </div>
                    <p className={`text-lg font-black ${channel.id === 'free' ? 'text-green-400' : 'text-cyan-400'}`}>
                      {channel.cost}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {channel.id === 'free' ? `剩余 ${freeCount} 次` : '不限次'}
                    </p>
                  </motion.button>
                ))}
              </div>

              {/* 开盒按钮 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openBox}
                disabled={isOpening || (selectedChannel === 'free' && freeCount <= 0)}
                className={`
                  w-full py-5 rounded-2xl font-black text-xl transition-all relative overflow-hidden
                  ${isOpening
                    ? 'bg-gray-700 cursor-wait'
                    : selectedChannel === 'free' && freeCount <= 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 text-white shadow-2xl shadow-purple-500/30'
                  }
                `}
              >
                {isOpening ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                    开启中...
                  </span>
                ) : selectedChannel === 'free' && freeCount <= 0 ? (
                  '今日次数已用完'
                ) : (
                  <>
                    <Sparkles className="inline-block mr-2" />
                    {selectedChannel === 'free' ? '免费开盒' : '付费开盒 (15 BOX)'}
                  </>
                )}
              </motion.button>

              {/* 保底提示 */}
              <div className="mt-4 text-sm text-gray-500">
                <Info className="inline-block w-4 h-4 mr-1" />
                感谢参与累计3次 = 1普通碎片 / 7次 = 1稀有碎片 / 15次 = 1史诗碎片
              </div>
            </div>
          </motion.div>

          {/* 右侧信息 50% */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* 概率展示 */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                开盒概率（Sui Randomness 链上随机）
              </h3>
              
              <div className="space-y-3">
                {boxProbabilities.map((prob, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[prob.color].bg} border ${colorMap[prob.color].border} flex items-center justify-center text-2xl`}>
                      {prob.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{prob.name}</span>
                        <span className={`font-black ${colorMap[prob.color].text}`}>{prob.probability}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prob.probability}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`h-full bg-gradient-to-r ${colorMap[prob.color].bg} rounded-full`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 碎片说明 */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                碎片用途
              </h3>
              
              <div className="space-y-3">
                {[
                  { from: '普通碎片×6', to: '普通NFT + 5 BOX', icon: '🔹', color: 'gray' },
                  { from: '稀有碎片×8', to: '稀有NFT + 8 BOX', icon: '💎', color: 'purple' },
                  { from: '史诗碎片×10', to: '史诗NFT + 15 BOX', icon: '⚡', color: 'orange' },
                  { from: '50普通+25稀有+10史诗', to: '传奇NFT + 100 BOX', icon: '👑', color: 'yellow' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">{item.from}</p>
                      <p className="text-white font-bold">→ {item.to}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 双通道说明 */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                双通道开盒
              </h3>
              
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div key={channel.id} className={`p-4 rounded-xl bg-gradient-to-r ${channel.id === 'free' ? 'from-green-500/10 to-emerald-500/10' : 'from-cyan-500/10 to-blue-500/10'} border border-gray-700`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{channel.icon}</span>
                      <span className="font-bold text-white">{channel.name}</span>
                    </div>
                    <p className="text-sm text-gray-400">{channel.desc}</p>
                    <p className="text-sm mt-1">
                      <span className="text-gray-500">每日次数:</span>
                      <span className={channel.id === 'free' ? 'text-green-400' : 'text-cyan-400'}>{channel.dailyLimit}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">产出:</span>
                      <span className="text-white">{channel.output}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 结果弹窗 */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center"
            >
              {/* 结果图标 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ type: 'spring', duration: 0.8 }}
                className={`w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br ${colorMap[result.color].bg} border-4 ${colorMap[result.color].border} flex items-center justify-center text-8xl shadow-2xl ${colorMap[result.color].glow}`}
              >
                {result.emoji}
              </motion.div>

              {/* 结果文字 */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-4xl font-black mb-2 ${colorMap[result.color].text}`}
              >
                {result.name}
              </motion.h2>
              <p className="text-gray-400 text-xl mb-6">{result.fragment}</p>

              {/* 概率 */}
              <p className="text-sm text-gray-500 mb-8">
                概率: <span className={`font-bold ${colorMap[result.color].text}`}>{result.probability}%</span>
              </p>

              {/* 关闭按钮 */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowResult(false)}
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl text-white font-bold transition-all"
              >
                继续开盒
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
