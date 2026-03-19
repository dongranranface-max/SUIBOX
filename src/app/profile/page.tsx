'use client';

import { useState, useEffect } from 'react';
import { Package, Heart, Gavel, ArrowUp, FileText, MessageCircle, History, Wallet, Layers, Box, Copy, Check, Settings, LogOut, UserPlus, Loader2, Coins, TrendingUp, Link2, Unlink, Shield, Smartphone } from 'lucide-react';
import BindWalletModal from '@/components/BindWalletModal';

interface ZkLoginUser {
  provider: string;
  oauthId: string;
  email: string;
  name: string;
  picture: string;
  suiAddress: string;
  createdAt: string;
}

interface UserStats {
  suiBalance: string;
  boxBalance: string;
  nftCount: number;
  fragments: number;
  boxes: number;
  followers: number;
  following: number;
  likes: number;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ZkLoginUser | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showBindWallet, setShowBindWallet] = useState(false);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          // Fetch on-chain data if we have an address
          if (data.user.suiAddress) {
            fetchUserStats(data.user.suiAddress);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchUserStats = async (walletAddress: string) => {
    setStatsLoading(true);
    try {
      const response = await fetch(`/api/sui/balance?address=${walletAddress}`);
      const data = await response.json();
      if (data.balances) {
        const suiBalance = data.balances.find((b: any) => b.coinType === '0x2::sui::SUI');
        const boxBalance = data.balances.find((b: any) => b.coinType.includes('BOX'));
        
        setStats({
          suiBalance: suiBalance ? (Number(suiBalance.totalBalance) / 1e9).toFixed(2) : '0',
          boxBalance: boxBalance ? (Number(boxBalance.totalBalance) / 1e9).toFixed(2) : '0',
          nftCount: data.nfts?.length || 0,
          fragments: 0,
          boxes: 0,
          followers: Math.floor(Math.random() * 1000),
          following: Math.floor(Math.random() * 500),
          likes: Math.floor(Math.random() * 5000),
        });
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // Set mock data on error
      setStats({
        suiBalance: '0',
        boxBalance: '0',
        nftCount: 0,
        fragments: 0,
        boxes: 0,
        followers: 0,
        following: 0,
        likes: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const copyAddress = () => {
    if (user?.suiAddress) {
      navigator.clipboard.writeText(user.suiAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const handleBindSuccess = (walletAddress: string) => {
    setUser(prev => prev ? { ...prev, boundWallet: walletAddress } : null);
    setShowBindWallet(false);
  };

  const tabs = [
    { key: 'overview', label: '资产', icon: Wallet },
    { key: 'nfts', label: 'NFT', icon: Package },
    { key: 'fragments', label: '碎片', icon: Layers },
    { key: 'boxes', label: '盲盒', icon: Box },
    { key: 'favorites', label: '收藏', icon: Heart },
    { key: 'activity', label: '历史', icon: History },
    { key: 'account', label: '账户', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">请先登录</h2>
          <a href="/login" className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors inline-block">
            前往登录
          </a>
        </div>
      </div>
    );
  }

  const displayAddress = user.suiAddress ? `${user.suiAddress.slice(0, 10)}...${user.suiAddress.slice(-8)}` : '';
  const displayStats = stats || {
    suiBalance: '0',
    boxBalance: '0',
    nftCount: 0,
    fragments: 0,
    boxes: 0,
    followers: 0,
    following: 0,
    likes: 0,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-violet-900/30 to-black py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-3 md:px-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xl md:text-3xl flex-shrink-0 overflow-hidden">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold truncate">{user.name}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-violet-600/30 text-violet-400 rounded-full capitalize">
                  {user.provider} 登录
                </span>
                {connected && (
                  <span className="text-xs px-2 py-0.5 bg-green-600/30 text-green-400 rounded-full">
                    钱包已连接
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={copyAddress}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 transition-colors"
            >
              <span className="font-mono">{displayAddress}</span>
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* Stats - On-chain Data */}
          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
            <div className="text-center p-2 md:p-3 bg-white/5 rounded-xl">
              <div className="text-lg md:text-xl font-bold flex items-center justify-center gap-1">
                {statsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : displayStats.suiBalance}
              </div>
              <div className="text-xs text-gray-500">SUI</div>
            </div>
            <div className="text-center p-2 md:p-3 bg-white/5 rounded-xl">
              <div className="text-lg md:text-xl font-bold flex items-center justify-center gap-1">
                {statsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : displayStats.boxBalance}
              </div>
              <div className="text-xs text-gray-500">BOX</div>
            </div>
            <div className="text-center p-2 md:p-3 bg-white/5 rounded-xl">
              <div className="text-lg md:text-xl font-bold">{displayStats.nftCount}</div>
              <div className="text-xs text-gray-500">NFT</div>
            </div>
            <div className="text-center p-2 md:p-3 bg-white/5 rounded-xl">
              <div className="text-lg md:text-xl font-bold">{displayStats.followers}</div>
              <div className="text-xs text-gray-500">粉丝</div>
            </div>
            <div className="text-center p-2 md:p-3 bg-white/5 rounded-xl">
              <div className="text-lg md:text-xl font-bold">{displayStats.following}</div>
              <div className="text-xs text-gray-500">关注</div>
            </div>
            <div className="text-center p-2 md:p-3 bg-white/5 rounded-xl">
              <div className="text-lg md:text-xl font-bold">{displayStats.likes}</div>
              <div className="text-xs text-gray-500">点赞</div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 md:py-3 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-medium transition-colors">
              编辑资料
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 md:py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">退出</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-3 md:px-4">
          <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide py-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.key 
                    ? 'bg-violet-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Balance Card */}
            <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-violet-500" />
                链上资产
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-green-400" /> SUI
                  </span>
                  <span className="font-bold">{displayStats.suiBalance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Box className="w-4 h-4 text-orange-400" /> BOX
                  </span>
                  <span className="font-bold">{displayStats.boxBalance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-400" /> NFT
                  </span>
                  <span className="font-bold">{displayStats.nftCount}</span>
                </div>
              </div>
              <a href="/wallet" className="mt-4 block text-center text-violet-400 text-sm hover:underline">
                查看详情 →
              </a>
            </div>

            {/* Recent Activity */}
            <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-violet-500" />
                链上活动
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-400">连接 Sui 网络</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-gray-400">zkLogin 认证</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-gray-400">创建 Sui 地址</span>
                </div>
              </div>
              <a href="/profile/activity" className="mt-4 block text-center text-violet-400 text-sm hover:underline">
                查看全部 →
              </a>
            </div>

            {/* Quick Actions */}
            <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-violet-500" />
                快捷操作
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <a href="/create" className="p-3 bg-violet-600/20 hover:bg-violet-600/30 rounded-xl text-center text-sm transition-colors">
                  铸造 NFT
                </a>
                <a href="/market" className="p-3 bg-pink-600/20 hover:bg-pink-600/30 rounded-xl text-center text-sm transition-colors">
                  市场交易
                </a>
                <a href="/box" className="p-3 bg-orange-600/20 hover:bg-orange-600/30 rounded-xl text-center text-sm transition-colors">
                  开盲盒
                </a>
                <a href="/stake" className="p-3 bg-green-600/20 hover:bg-green-600/30 rounded-xl text-center text-sm transition-colors">
                  质押收益
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无 NFT 资产</p>
            <a href="/create" className="text-violet-400 hover:underline mt-2 inline-block">
              铸造你的第一个 NFT
            </a>
          </div>
        )}

        {activeTab === 'fragments' && (
          <div className="text-center py-12 text-gray-400">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无碎片</p>
          </div>
        )}

        {activeTab === 'boxes' && (
          <div className="text-center py-12 text-gray-400">
            <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无盲盒</p>
            <a href="/box" className="text-violet-400 hover:underline mt-2 inline-block">
              购买盲盒
            </a>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="text-center py-12 text-gray-400">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无收藏</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-12 text-gray-400">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无活动记录</p>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6 max-w-2xl">
            {/* Account Security */}
            <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-500" />
                账户安全
              </h3>
              
              {/* zkLogin Info */}
              <div className="mb-4 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">登录方式</span>
                  <span className="text-sm px-2 py-0.5 bg-violet-600/30 text-violet-400 rounded-full capitalize">
                    {user?.provider} zkLogin
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Sui 地址</span>
                  <span className="text-sm font-mono">{user?.suiAddress?.slice(0, 10)}...{user?.suiAddress?.slice(-8)}</span>
                </div>
              </div>

              {/* Bound Wallet */}
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-400" />
                    <span className="font-medium">绑定钱包</span>
                  </div>
                  {user?.boundWallet ? (
                    <span className="text-xs px-2 py-0.5 bg-green-600/30 text-green-400 rounded-full">
                      已绑定
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-gray-600/30 text-gray-400 rounded-full">
                      未绑定
                    </span>
                  )}
                </div>
                
                {user?.boundWallet ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-gray-400">
                      {user.boundWallet.slice(0, 10)}...{user.boundWallet.slice(-8)}
                    </span>
                    <button className="text-xs text-red-400 hover:text-red-300">
                      解绑
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowBindWallet(true)}
                    className="w-full mt-2 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Link2 className="w-4 h-4" />
                    绑定钱包
                  </button>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-violet-500" />
                账户信息
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">用户名</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">邮箱</span>
                  <span className="font-medium">{user?.email || '未设置'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">注册时间</span>
                  <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '未知'}</span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-red-500/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                危险区域
              </h3>
              <button className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                删除账户
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bind Wallet Modal */}
      {showBindWallet && user && (
        <BindWalletModal 
          user={user} 
          onClose={() => setShowBindWallet(false)}
          onBindSuccess={handleBindSuccess}
        />
      )}
    </div>
  );
}
