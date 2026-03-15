'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Heart, Gavel, ArrowUp, FileText, MessageCircle, History, Wallet, Layers, Box } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  
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

  const tabs = [
    { key: 'overview', label: '资产概览', icon: Wallet },
    { key: 'nfts', label: '我的NFT', icon: Package },
    { key: 'fragments', label: '碎片背包', icon: Layers },
    { key: 'boxes', label: '盲盒记录', icon: Box },
    { key: 'favorites', label: '我的收藏', icon: Heart },
    { key: 'activity', label: '历史记录', icon: History },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-violet-900/30 to-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-400 text-sm">{user.address.slice(0, 10)}...{user.address.slice(-8)}</p>
              <p className="text-gray-400 mt-1">{user.bio}</p>
            </div>
          </div>
          <div className="flex gap-6 mt-4">
            <div><span className="font-bold">{user.followers}</span> <span className="text-gray-400">粉丝</span></div>
            <div><span className="font-bold">{user.following}</span> <span className="text-gray-400">关注</span></div>
            <div><span className="font-bold">{user.likes}</span> <span className="text-gray-400">获赞</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 -mt-4">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-500/20 rounded-xl p-5 border border-blue-500/30">
              <div className="text-gray-400 mb-2">SUI 余额</div>
              <div className="text-2xl font-bold text-blue-400">{user.suiBalance.toLocaleString()}</div>
            </div>
            <div className="bg-violet-500/20 rounded-xl p-5 border border-violet-500/30">
              <div className="text-gray-400 mb-2">BOX 持仓</div>
              <div className="text-2xl font-bold text-violet-400">{user.boxBalance.toLocaleString()}</div>
            </div>
            <div className="bg-pink-500/20 rounded-xl p-5 border border-pink-500/30">
              <div className="text-gray-400 mb-2">NFT 估值</div>
              <div className="text-2xl font-bold text-pink-400">{user.nftValue.toLocaleString()}</div>
            </div>
            <div className="bg-amber-500/20 rounded-xl p-5 border border-amber-500/30">
              <div className="text-gray-400 mb-2">总资产</div>
              <div className="text-2xl font-bold text-amber-400">{(user.suiBalance + user.boxBalance + user.nftValue).toLocaleString()}</div>
            </div>
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无NFT资产</p>
          </div>
        )}

        {activeTab === 'fragments' && (
          <div className="text-center py-12 text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无碎片</p>
          </div>
        )}

        {activeTab === 'boxes' && (
          <div className="text-center py-12 text-gray-500">
            <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无盲盒记录</p>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="text-center py-12 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无收藏</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-12 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无历史记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
