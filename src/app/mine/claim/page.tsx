'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowDownRight, ArrowUpRight, Clock, CheckCircle, Wallet, History, ChevronRight } from 'lucide-react';

// 模拟数据
const mockPendingClaim = 125.5;
const mockClaimHistory = [
  { id: 1, amount: 50, time: '2026-03-14 15:30', status: 'completed', tx: '0x1a2b3c...' },
  { id: 2, amount: 30, time: '2026-03-12 10:15', status: 'completed', tx: '0x2b3c4d...' },
  { id: 3, amount: 80, time: '2026-03-10 08:45', status: 'completed', tx: '0x3c4d5e...' },
  { id: 4, amount: 45, time: '2026-03-08 18:20', status: 'completed', tx: '0x4d5e6f...' },
];

export default function ClaimPage() {
  const [claimAmount, setClaimAmount] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClaim = () => {
    if (!claimAmount || parseFloat(claimAmount) <= 0) return;
    setIsClaiming(true);
    // 模拟提取
    setTimeout(() => {
      setIsClaiming(false);
      setShowSuccess(true);
      setClaimAmount('');
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const setMax = () => {
    setClaimAmount(mockPendingClaim.toString());
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 头部 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-900/30 to-black py-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Coins className="w-7 h-7 text-amber-400" />
              提取收益
            </h1>
            
            {/* 可提取金额 */}
            <div className="bg-white/5 rounded-2xl p-6 border border-amber-500/30">
              <div className="text-gray-400 mb-2">可提取收益</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-amber-400">{mockPendingClaim}</span>
                <span className="text-xl text-gray-400">BOX</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={setMax}
                  className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition"
                >
                  全部提取
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* 提取表单 */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">提取数量</span>
            <span className="text-sm text-gray-500">最低提取: 1 BOX</span>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <input
              type="number"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-2xl focus:outline-none focus:border-amber-500"
            />
            <div className="text-xl font-bold text-gray-400">BOX</div>
          </div>

          <button
            onClick={handleClaim}
            disabled={!claimAmount || parseFloat(claimAmount) <= 0 || isClaiming}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
              claimAmount && parseFloat(claimAmount) > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {isClaiming ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                提取中...
              </>
            ) : (
              <>
                <ArrowUpRight className="w-5 h-5" />
                提取到钱包
              </>
            )}
          </button>

          {/* 成功提示 */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-500/20 rounded-xl border border-green-500/30 flex items-center gap-3"
            >
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-bold text-green-400">提取成功！</div>
                <div className="text-sm text-gray-400">收益已发送到您的钱包</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 提取记录 */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" />
            提取记录
          </h2>
          
          <div className="space-y-3">
            {mockClaimHistory.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">提取到钱包</div>
                      <div className="text-xs text-gray-500">{record.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-400">-{record.amount} BOX</div>
                    <a 
                      href={`https://suiscan.xyz/mainnet/tx/${record.tx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      查看链上 <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-8 bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">注意事项</span>
          </div>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• 最低提取数量为 1 BOX</li>
            <li>• 提取手续费为 0.1%</li>
            <li>• 提取后可在区块链浏览器查看交易记录</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
