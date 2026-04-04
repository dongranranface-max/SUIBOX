'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Coins, DollarSign, Shield, Zap,
  ChevronRight, Info, Clock, Users, ArrowUpRight,
  BarChart3, PieChart, Activity, Wallet
} from 'lucide-react';

// 收益数据
const yieldStats = {
  totalValue: '1,234,567',
  dailyYield: '3,456',
  annualYield: '1,234,567',
  apy: '12.5%',
};

// 金库分布
const treasuryAllocation = [
  { protocol: 'Navi Protocol', logo: '📊', allocation: 40, tvl: '180M', color: 'cyan' },
  { protocol: 'Scallop', logo: '🐚', allocation: 30, tvl: '120M', color: 'purple' },
  { protocol: 'LST Staking', logo: '💎', allocation: 30, tvl: '90M', color: 'green' },
];

// 分红记录
const dividendHistory = [
  { date: '2026-04-04', amount: '1,234 SUI', recipients: 156, type: 'Legendary Holders' },
  { date: '2026-04-03', amount: '980 SUI', recipients: 142, type: 'veBOX Stakers' },
  { date: '2026-04-02', amount: '1,456 SUI', recipients: 168, type: 'Legendary Holders' },
  { date: '2026-04-01', amount: '2,100 SUI', recipients: 201, type: 'All NFT Stakers' },
  { date: '2026-03-31', amount: '890 SUI', recipients: 98, type: 'veBOX Stakers' },
];

// 双引擎配置
const engines = [
  {
    id: 'inflation',
    name: '通胀补贴引擎',
    period: 'TGE后 1-60天',
    status: 'past',
    icon: '🚀',
    color: 'orange',
    desc: '高额BOX代币奖励补贴早期参与者',
    features: [
      '质押高额BOX奖励',
      '开盒挖矿奖励',
      '邀请合成奖励',
    ],
    yield: '高额代币释放',
  },
  {
    id: 'realyield',
    name: 'Real Yield引擎',
    period: 'TGE 60天后',
    status: 'active',
    icon: '💰',
    color: 'green',
    desc: '真实SUI利息全量分红接棒',
    features: [
      '国库真实SUI利息',
      '100%透明分配',
      '持币躺赚分红',
    ],
    yield: '真实收益分红',
  },
];

export default function YieldPage() {
  const [currentYield, setCurrentYield] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    daily: 0,
    annual: 0,
  });

  // 数字动画
  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setCurrentYield(eased * 12.5);
      setAnimatedStats({
        total: Math.floor(eased * 1234567),
        daily: Math.floor(eased * 3456),
        annual: Math.floor(eased * 1234567),
      });
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, []);

  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    cyan: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    purple: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
    green: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
    orange: { bg: 'from-orange-500/20 to-yellow-500/20', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
    yellow: { bg: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-500/5 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/30 mb-4">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Real Yield · 真实收益</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Real Yield Hub
            </span>
          </h1>
          <p className="text-gray-400">资金涌入 → 生息放大 → 利润反哺生态</p>
        </motion.div>

        {/* 核心数据 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: '金库总价值', value: animatedStats.total.toLocaleString(), sub: 'SUI', icon: '💰', color: 'green' },
            { label: '今日收益', value: animatedStats.daily.toLocaleString(), sub: 'SUI', icon: '📈', color: 'cyan' },
            { label: '年化收益', value: animatedStats.annual.toLocaleString(), sub: 'SUI', icon: '📊', color: 'purple' },
            { label: '当前APY', value: `${currentYield.toFixed(1)}%`, sub: '实时', icon: '🚀', color: 'yellow' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span>{item.icon}</span>
                <span className="text-gray-500 text-sm">{item.label}</span>
              </div>
              <p className={`text-2xl md:text-3xl font-black ${colorMap[item.color as keyof typeof colorMap]?.text || 'text-white'}`}>
                {item.value}
              </p>
              <p className="text-gray-500 text-sm">{item.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* 双引擎切换 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            双引擎动力学
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engines.map((engine) => (
              <div
                key={engine.id}
                className={`
                  p-6 rounded-3xl border-2 transition-all
                  ${engine.status === 'active'
                    ? `bg-gradient-to-br ${colorMap[engine.color].bg} ${colorMap[engine.color].border} shadow-lg ${colorMap[engine.color].glow}`
                    : 'bg-gray-900 border-gray-800 opacity-70'
                  }
                `}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${engine.status === 'active' ? 'bg-green-500/30' : 'bg-gray-800'} flex items-center justify-center text-3xl`}>
                    {engine.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{engine.name}</h3>
                      {engine.status === 'active' && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                          运行中
                        </span>
                      )}
                      {engine.status === 'past' && (
                        <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs font-bold rounded-full">
                          已结束
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{engine.period}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{engine.desc}</p>

                <div className="space-y-2">
                  {engine.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className={engine.status === 'active' ? 'text-green-400' : 'text-gray-500'}>✓</span>
                      <span className={engine.status === 'active' ? 'text-white' : 'text-gray-500'}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={`mt-4 p-3 rounded-xl ${engine.status === 'active' ? 'bg-green-500/20' : 'bg-gray-800'}`}>
                  <p className="text-xs text-gray-400">收益模式</p>
                  <p className={`font-bold ${engine.status === 'active' ? 'text-green-400' : 'text-gray-500'}`}>
                    {engine.yield}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 主内容 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧金库分布 50% */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyan-400" />
                Real Yield 金库分布
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                传奇NFT销售募集的SUI资金，70%进入Real Yield金库进行DeFi生息
              </p>

              {/* 饼图模拟 */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  {/* 外圈 */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="24"
                      strokeDasharray={`${0.4 * 502.65} 502.65`}
                      className="drop-shadow-lg"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="24"
                      strokeDasharray={`${0.3 * 502.65} 502.65`}
                      strokeDashoffset={`${-0.4 * 502.65} 502.65`}
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="24"
                      strokeDasharray={`${0.3 * 502.65} 502.65`}
                      strokeDashoffset={`${-0.7 * 502.65} 502.65`}
                    />
                  </svg>
                  {/* 中心 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl">📊</p>
                    <p className="text-sm text-gray-400">390M SUI</p>
                  </div>
                </div>
              </div>

              {/* 图例 */}
              <div className="space-y-3">
                {treasuryAllocation.map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl bg-gradient-to-r ${colorMap[item.color].bg} border ${colorMap[item.color].border}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.logo}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{item.protocol}</span>
                          <span className={`font-black ${colorMap[item.color].text}`}>{item.allocation}%</span>
                        </div>
                        <p className="text-sm text-gray-400">TVL: {item.tvl} SUI</p>
                      </div>
                    </div>
                    {/* 进度条 */}
                    <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colorMap[item.color].bg} rounded-full`}
                        style={{ width: `${item.allocation}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 收益说明 */}
            <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Real Yield 核心优势
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '💎', text: '真实SUI利息，非凭空铸造的代币' },
                  { icon: '🔒', text: '智能合约100%透明分配' },
                  { icon: '📈', text: 'DeFi积木自动复利循环' },
                  { icon: '🛡️', text: '躺赚分红，砸盘等于放弃收益' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右侧分红记录 50% */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                实时分红记录
              </h3>

              <div className="space-y-3">
                {dividendHistory.map((record, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-green-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{record.type}</span>
                          <span className="text-green-400 font-black">+{record.amount}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {record.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {record.recipients} 人
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all">
                查看更多 →
              </button>
            </div>

            {/* 分红资格 */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-400" />
                分红资格说明
              </h3>

              <div className="space-y-4">
                {[
                  { 
                    tier: '五星传奇NFT持有者', 
                    icon: '👑', 
                    color: 'yellow',
                    yield: '按持仓权重获得 SUI 本位分红',
                    requirement: '传奇NFT升级至五星'
                  },
                  { 
                    tier: 'veBOX 长期锁仓者', 
                    icon: '💎', 
                    color: 'purple',
                    yield: '按锁仓比例瓜分 SUI 本位收益',
                    requirement: 'BOX单币池90天+锁仓'
                  },
                  { 
                    tier: 'NFT质押用户', 
                    icon: '📦', 
                    color: 'cyan',
                    yield: '史诗/传奇NFT质押每日释放',
                    requirement: '质押NFT至指定池子'
                  },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl bg-gradient-to-r ${colorMap[item.color].bg} border ${colorMap[item.color].border}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-bold text-white">{item.tier}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">收益: <span className={`font-bold ${colorMap[item.color].text}`}>{item.yield}</span></p>
                    <p className="text-xs text-gray-500">条件: {item.requirement}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 底部核心逻辑 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-block p-6 bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-purple-500/10 border border-green-500/20 rounded-3xl">
            <p className="text-lg font-bold text-white mb-2">💡 核心逻辑反转</p>
            <p className="text-gray-400">
              在 SUIBOX，你不仅在赚取代币的溢价，你更在按比例躺赚整个项目销售资金池的
              <span className="text-green-400 font-bold"> 真实 SUI 利息</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              砸盘 = 放弃源源不断的 SUI 真金分红 · 持有 = 躺赚 Real Yield
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
