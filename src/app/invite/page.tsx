'use client';

import { useState } from 'react';
import { Gift, Users, Wallet, TrendingUp, Copy, Share2, ChevronRight, CheckCircle, Star, Crown, Diamond, Award, Zap, ArrowUp, Lock, Clock } from 'lucide-react';

// 邀请规则配置
const inviteRules = {
  minBOX: 10, // 需要10 BOX才能邀请
  totalAirdrop: 15000000, // 1500万BOX
  daily: {
    1: { friends: 1, reward: 1, referrerReward: 0.5, chance: 1 },
    3: { friends: 3, reward: 3, referrerReward: 1.5, chance: 2 },
    15: { friends: 15, reward: 10, referrerReward: 5, chance: 3 },
  },
};

export default function InvitePage() {
  const [inviteCode] = useState('SUIBOX2026');
  const [copied, setCopied] = useState(false);
  const [inviteLink] = useState('https://suibox.io/register?code=SUIBOX2026');
  
  // 用户状态
  const [myBOX, setMyBOX] = useState(1250);
  const hasEnoughBOX = myBOX >= inviteRules.minBOX;
  
  // 邀请数据（保持原样式）
  const stats = {
    totalInvites: 156,
    totalRewards: 12500,
    pendingRewards: 2300,
    myLevel: 'Gold',
  };

  // 邀请记录（保持原样式）
  const inviteRecords = [
    { id: 1, user: '0x7a9***3f2', time: '2026-03-15 14:30', reward: 100, status: '已完成' },
    { id: 2, user: '0x3b2***8c1', time: '2026-03-14 09:15', reward: 50, status: '待确认' },
    { id: 3, user: '0x9f1***5a4', time: '2026-03-13 18:45', reward: 200, status: '已完成' },
  ];

  // 等级规则（保持原样式）
  const levelRules = [
    { level: 'Bronze', minInvites: 0, reward: 50, color: 'from-amber-700 to-amber-900', icon: Award },
    { level: 'Silver', minInvites: 10, reward: 75, color: 'from-gray-400 to-gray-600', icon: Star },
    { level: 'Gold', minInvites: 50, reward: 100, color: 'from-yellow-500 to-orange-500', icon: Crown },
    { level: 'Diamond', minInvites: 100, reward: 150, color: 'from-cyan-400 to-blue-500', icon: Diamond },
  ];

  // 复制邀请码
  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 分享（保持原样式）
  const shareInvite = (platform: string) => {
    const text = `加入SUIBOX，使用我的邀请码 ${inviteCode}，获得新用户礼包！`;
    const url = inviteLink;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header（保持原样） */}
      <div className="bg-gradient-to-b from-violet-900/30 to-black py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <Gift className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">邀请好友</h1>
              <p className="text-gray-400">邀请好友注册，获得丰厚奖励</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* 新增：邀请条件提示 */}
        {!hasEnoughBOX && (
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-red-400" />
              <div>
                <div className="font-bold text-red-400">需要持有 {inviteRules.minBOX} BOX 才能邀请好友</div>
                <div className="text-sm text-gray-400">当前持有: {myBOX} BOX</div>
              </div>
            </div>
          </div>
        )}

        {/* 邀请统计（保持原样式） */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20">
            <Users className="w-6 h-6 text-violet-400 mb-2" />
            <div className="text-2xl font-bold">{stats.totalInvites}</div>
            <div className="text-sm text-gray-400">已邀请好友</div>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
            <Wallet className="w-6 h-6 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-green-400">{stats.totalRewards}</div>
            <div className="text-sm text-gray-400">总奖励 (BOX)</div>
          </div>
          <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
            <Zap className="w-6 h-6 text-amber-400 mb-2" />
            <div className="text-2xl font-bold text-amber-400">{stats.pendingRewards}</div>
            <div className="text-sm text-gray-400">待发放奖励</div>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
            <Crown className="w-6 h-6 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-blue-400">{stats.myLevel}</div>
            <div className="text-sm text-gray-400">我的等级</div>
          </div>
        </div>

        {/* 邀请码（保持原样式） */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10">
          <h2 className="font-bold mb-4">邀请码</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-black/50 rounded-xl px-4 py-3 font-mono text-xl text-center tracking-wider">
              {inviteCode}
            </div>
            <button onClick={copyCode} className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${copied ? 'bg-green-600' : 'bg-violet-600 hover:bg-violet-500'}`}>
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
        </div>

        {/* 分享（保持原样式） */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10">
          <h2 className="font-bold mb-4">分享到社交平台</h2>
          <div className="flex gap-4">
            <button onClick={() => shareInvite('twitter')} className="flex-1 py-3 bg-[#1DA1F2] rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#1a91da]">
              Twitter
            </button>
            <button onClick={() => shareInvite('telegram')} className="flex-1 py-3 bg-[#0088cc] rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#0077b3]">
              Telegram
            </button>
            <button onClick={() => { navigator.clipboard.writeText(inviteLink); alert('链接已复制!'); }} className="flex-1 py-3 bg-gray-800 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-700">
              更多
            </button>
          </div>
        </div>

        {/* 新增：邀请奖励规则 */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            每日邀请奖励
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>每日1人抽盲盒</span>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-bold">+1次抽奖</div>
                <div className="text-xs text-gray-500">你+1 / 好友+0.5 BOX</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>每日3人抽盲盒</span>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-bold">+2次抽奖</div>
                <div className="text-xs text-gray-500">你+3 / 好友+1.5 BOX</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>每日15人抽盲盒</span>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-bold">+3次抽奖</div>
                <div className="text-xs text-gray-500">你+10 / 好友+5 BOX</div>
              </div>
            </div>
          </div>
        </div>

        {/* 新增：空投池 */}
        <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-xl p-4 border border-violet-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-400" />
              一次性空投池
            </div>
            <div className="text-amber-400 font-bold">{inviteRules.totalAirdrop.toLocaleString()} BOX</div>
          </div>
          <div className="text-sm text-gray-400">
            送完为止，快去邀请吧！
          </div>
        </div>

        {/* 等级系统（保持原样式） */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            邀请等级权益
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {levelRules.map((rule) => (
              <div key={rule.level} className={`p-4 rounded-xl bg-gradient-to-br ${rule.color} ${stats.myLevel === rule.level ? 'ring-2 ring-white' : 'opacity-60'}`}>
                <rule.icon className="w-8 h-8 mx-auto mb-2" />
                <div className="text-center font-bold">{rule.level}</div>
                <div className="text-center text-sm opacity-80">{rule.minInvites}+ 邀请</div>
                <div className="text-center mt-2 font-bold">{rule.reward} BOX</div>
              </div>
            ))}
          </div>
        </div>

        {/* 邀请记录（保持原样式） */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10">
          <h2 className="font-bold mb-4">邀请记录</h2>
          <div className="space-y-3">
            {inviteRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="font-mono text-sm">{record.user}</div>
                    <div className="text-xs text-gray-500">{record.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${record.status === '已完成' ? 'text-green-400' : 'text-amber-400'}`}>
                    +{record.reward} BOX
                  </div>
                  <div className="text-xs text-gray-500">{record.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
