'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Heart, Gavel, ArrowUp, FileText, MessageCircle, History, Wallet, Layers, Box, Copy, Check, Settings, LogOut, UserPlus } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  
  const address = '0x237c812be257b5c5338f025c9819208d5f1a82b817cdbe0c1138b496433e1f97';
  
  const user = {
    name: 'CryptoArtist',
    address: address,
    bio: 'NFT collector | SUI ecosystem',
    followers: 1234,
    following: 567,
    likes: 8901,
    suiBalance: 12580,
    boxBalance: 45600,
    nftValue: 89600,
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { key: 'overview', label: '资产', icon: Wallet },
    { key: 'nfts', label: 'NFT', icon: Package },
    { key: 'fragments', label: '碎片', icon: Layers },
    { key: 'boxes', label: '盲盒', icon: Box },
    { key: 'favorites', label: '收藏', icon: Heart },
    { key: 'activity', label: '历史', icon: History },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-violet-900/30 to-black py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-3 md:px-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xl md:text-3xl flex-shrink-0">
              👤
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold truncate">{user.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-400 text-xs md:text-sm font-mono truncate">{address.slice(0, 8)}...{address.slice(-6)}</p>
                <button onClick={copyAddress} className="p-1 hover:bg-white/10 rounded">
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-500" />}
                </button>
              </div>
            </div>
          </div>
          <p className="text-gray-400 mt-2 text-xs md:text-sm">{user.bio}</p>
          
          {/* Stats */}
          <div className="flex gap-3 md:gap-6 mt-3 md:mt-4">
            <div className="text-center">
              <div className="font-bold text-sm md:text-lg">{user.followers}</div>
              <div className="text-gray-500 text-[10px] md:text-xs">粉丝</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm md:text-lg">{user.following}</div>
              <div className="text-gray-500 text-[10px] md:text-xs">关注</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm md:text-lg">{user.likes}</div>
              <div className="text-gray-500 text-[10px] md:text-xs">获赞</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2.5 md:py-3 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              关注
            </button>
            <button className="px-4 md:px-6 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 rounded-lg">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="px-4 md:px-6 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 rounded-lg">
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 -mt-2 relative z-10">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {[
            { label: 'SUI', value: user.suiBalance, icon: '🔷', color: 'cyan' },
            { label: 'BOX', value: user.boxBalance, icon: '🟣', color: 'violet' },
            { label: 'NFT估值', value: user.nftValue, icon: '💎', color: 'yellow' },
          ].map((item, i) => (
            <div key={i} className={`bg-gray-900/80 rounded-xl p-3 md:p-4 border border-white/5`}>
              <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                <span>{item.icon}</span>
                <span className="text-gray-400 text-xs">{item.label}</span>
              </div>
              <div className="font-bold text-sm md:text-lg truncate">{item.value.toLocaleString()}</div>
            </div>
          ))}
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
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: '我的NFT', value: '12', icon: Package },
              { label: '碎片背包', value: '28', icon: Layers },
              { label: '盲盒', value: '5', icon: Box },
              { label: '收藏', value: '156', icon: Heart },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-white/5">
                <item.icon className="w-5 h-5 md:w-6 md:h-5 text-violet-400 mb-2" />
                <div className="font-bold text-xl md:text-2xl">{item.value}</div>
                <div className="text-gray-500 text-xs md:text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">暂无NFT</p>
            <Link href="/market" className="inline-block mt-4 px-4 py-2 bg-violet-600 rounded-lg text-sm">去市场</Link>
          </div>
        )}

        {activeTab === 'fragments' && (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">暂无碎片</p>
          </div>
        )}

        {activeTab === 'boxes' && (
          <div className="text-center py-12">
            <Box className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">暂无盲盒</p>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">暂无收藏</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-12">
            <History className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">暂无历史记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
