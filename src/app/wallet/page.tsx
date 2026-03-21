'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Coins, Layers, History, ArrowUpRight, ArrowDownLeft, Copy, Check, ExternalLink, Loader2, TrendingUp, Gift, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Transaction {
  id: string;
  type: 'in' | 'out';
  amount: string;
  symbol: string;
  time: string;
  hash: string;
}

export default function WalletPage() {
  const { userAddress, isLoggedIn, login, loading } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'assets' | 'nft' | 'history'>('assets');
  const [chainLoading, setChainLoading] = useState(true);
  const [chainError, setChainError] = useState(false);
  
  // 模拟数据 - 实际应从 API 获取
  const [balance, setBalance] = useState({
    sui: '0.00',
    box: '0.00',
  });
  const [nfts, setNfts] = useState([
    { id: '1', name: 'SUI Gift #001', rarity: 'SSR', image: '/nft-sample.png' },
    { id: '2', name: 'SUI Gift #002', rarity: 'SR', image: '/nft-sample.png' },
  ]);
  const [fragments, setFragments] = useState({
    common: 12,
    rare: 5,
    epic: 2,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'in', amount: '10', symbol: 'SUI', time: '2小时前', hash: '0x1234...5678' },
    { id: '2', type: 'out', amount: '5', symbol: 'BOX', time: '5小时前', hash: '0xabcd...efgh' },
    { id: '3', type: 'in', amount: '1', symbol: 'NFT', time: '昨天', hash: '0x9876...5432' },
  ]);

  // 从 API 获取链上数据
  useEffect(() => {
    if (!userAddress) return;
    
    const fetchChainData = async () => {
      setChainLoading(true);
      setChainError(false);
      try {
        const res = await fetch(`/api/sui/balance?address=${userAddress}`);
        const data = await res.json();
        if (data.balance) {
          setBalance(prev => ({ ...prev, sui: (data.balance / 1000000000).toFixed(2) }));
        }
      } catch (e) {
        console.error(e);
        setChainError(true);
      } finally {
        setChainLoading(false);
      }
    };
    
    fetchChainData();
  }, [userAddress]);

  const copyAddress = async () => {
    if (userAddress) {
      await navigator.clipboard.writeText(userAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Wallet className="w-20 h-20 mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold mb-2">连接钱包</h2>
          <p className="text-gray-400 mb-6">登录后查看您的钱包资产</p>
          <button onClick={login} className="px-8 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold">
            立即登录
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 头部 */}
      <div className="bg-gradient-to-b from-violet-900/30 to-black pt-8 pb-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">我的钱包</h1>
          
          {/* 地址卡片 */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-4 border border-gray-700 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">钱包地址</p>
                <p className="font-mono text-lg">{shortenAddress(userAddress)}</p>
              </div>
              <button 
                onClick={copyAddress}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            <a 
              href={`https://suiscan.xyz/devnet/address/${userAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-violet-400 text-sm mt-3 hover:text-violet-300"
            >
              在 SuiScan 查看 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* 余额卡片 - 移动端优化 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* SUI 余额 */}
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-4 sm:p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <span className="text-gray-400 text-sm sm:text-base">SUI</span>
              </div>
              {chainLoading ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-gray-500" />
              ) : chainError ? (
                <button 
                  onClick={() => {
                    if (userAddress) {
                      const fetchData = async () => {
                        setChainLoading(true);
                        setChainError(false);
                        try {
                          const res = await fetch(`/api/sui/balance?address=${userAddress}`);
                          const data = await res.json();
                          if (data.balance) {
                            setBalance(prev => ({ ...prev, sui: (data.balance / 1000000000).toFixed(2) }));
                          }
                        } catch (e) {
                          setChainError(true);
                        } finally {
                          setChainLoading(false);
                        }
                      };
                      fetchData();
                    }
                  }}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  点击重试
                </button>
              ) : (
                <p className="text-xl sm:text-2xl font-bold">{balance.sui}</p>
              )}
              <p className="text-gray-500 text-xs sm:text-sm mt-1">≈ ${(parseFloat(balance.sui) * 2).toFixed(2)} USD</p>
            </div>

            {/* BOX 余额 */}
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-4 sm:p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                </div>
                <span className="text-gray-400 text-sm sm:text-base">BOX</span>
              </div>
              {chainLoading ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-gray-500" />
              ) : (
                <p className="text-xl sm:text-2xl font-bold">{balance.box}</p>
              )}
              <p className="text-gray-500 text-xs sm:text-sm mt-1">≈ $0.01 BOX</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab 导航 - 移动端优化 */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 -mt-4">
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-700 p-1 flex overflow-x-auto scrollbar-hide">
          {[
            { key: 'assets', label: '资产', icon: Coins },
            { key: 'nft', label: 'NFT', icon: Layers },
            { key: 'history', label: '记录', icon: History },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'bg-violet-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs sm:text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 资产 Tab */}
        {activeTab === 'assets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* 碎片 */}
            <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-700 mb-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                碎片资产
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/80 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-400">{fragments.common}</p>
                  <p className="text-sm text-gray-500">普通碎片</p>
                </div>
                <div className="bg-gray-800/80 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">{fragments.rare}</p>
                  <p className="text-sm text-gray-500">稀有碎片</p>
                </div>
                <div className="bg-gray-800/80 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{fragments.epic}</p>
                  <p className="text-sm text-gray-500">史诗碎片</p>
                </div>
              </div>
            </div>

            {/* DeFi 质押 */}
            <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-700">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                质押收益
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/60 rounded-xl">
                  <div>
                    <p className="font-medium">BOX 质押池</p>
                    <p className="text-sm text-gray-500">年化 15%</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">+0.00 BOX</p>
                    <p className="text-xs text-gray-500">今日收益</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-3 bg-violet-600/20 text-violet-400 rounded-xl font-medium hover:bg-violet-600/30 transition-all flex items-center justify-center gap-2">
                前往质押 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* NFT Tab */}
        {activeTab === 'nft' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {nfts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {nfts.map((nft) => (
                  <div key={nft.id} className="bg-gray-900/60 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="aspect-square bg-gray-800 relative">
                      <div className="absolute top-2 right-2 px-2 py-1 bg-violet-600 rounded-full text-xs font-bold">
                        {nft.rarity}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm">{nft.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Layers className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">暂无 NFT 资产</p>
                <button className="mt-4 px-6 py-2 bg-violet-600 rounded-lg font-medium">
                  去市场购买
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 记录 Tab */}
        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-gray-900/60 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'in' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.type === 'in' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {tx.type === 'in' ? '收到' : '转出'} {tx.amount} {tx.symbol}
                    </p>
                    <p className="text-sm text-gray-500">{tx.time}</p>
                  </div>
                  <a 
                    href={`https://suiscan.xyz/devnet/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 text-sm hover:text-violet-300"
                  >
                    查看
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
