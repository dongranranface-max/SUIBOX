'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Gift, Zap, Star, Wallet, Copy, Check, Lock, Award, TrendingUp, Link, Share2, Twitter, MessageCircle, QrCode, Download, ExternalLink, ArrowUpRight, Handshake, PartyPopper, Wallet2 } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import { useAutoSwitchNetwork } from '@/hooks/useAutoSwitchNetwork';
import { useI18n } from '@/lib/i18n';

const INVITE_TASKS = [
  { friends: 1, reward: 1, boxReward: 1, refReward: 0.5, label: '1 Friend', tier: 'bronze' },
  { friends: 3, reward: 2, boxReward: 3, refReward: 1.5, label: '3 Friends', tier: 'silver' },
  { friends: 15, reward: 3, boxReward: 10, refReward: 5, label: '15 Friends', tier: 'gold' },
];

const TIER_CONFIG: Record<string, { name: string; color: string; border: string; icon: string; glow: string }> = {
  bronze: { name: 'Bronze', color: 'from-amber-700 to-amber-600', border: 'border-amber-500', icon: '🥉', glow: 'shadow-amber-500/20' },
  silver: { name: 'Silver', color: 'from-gray-400 to-gray-300', border: 'border-gray-300', icon: '🥈', glow: 'shadow-gray-400/20' },
  gold: { name: 'Gold', color: 'from-yellow-500 to-amber-500', border: 'border-yellow-400', icon: '🥇', glow: 'shadow-yellow-500/30' },
};

export default function InvitePage() {
  const wallet = useWallet();
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [copied, setCopied] = useState(false);
  const [hasEnough, setHasEnough] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<{ address: string; name?: string; provider?: string } | null>(null);
  const [userData, setUserData] = useState({
    inviteCode: '',
    totalInvites: 0,
    todayOpened: 0,
    totalBoxEarned: 0,
    pendingBox: 0,
  });

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user?.suiAddress) {
          setUserInfo({ address: data.user.suiAddress, name: data.user.name, provider: data.user.provider });
        }
      })
      .catch(() => {});
  }, []);

  const userAddress = wallet.account?.address || userInfo?.address || '';
  const inviteCode = userAddress ? 'SUIBOX' + userAddress.slice(2, 8).toUpperCase() : '';
  const inviteLink = inviteCode ? `https://suibox.io/r/${inviteCode}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`🎁 Join SUI GIFT Blind Box, get 15M BOX airdrop!\n\nMy invite code: ${inviteCode}\n🔗 ${inviteLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(`🎁 Join SUI GIFT Blind Box, get 15M BOX airdrop!\n\nMy invite code: ${inviteCode}\n🔗 ${inviteLink}`);
    window.open(`https://t.me/share/url?url=${inviteLink}&text=${text}`, '_blank');
  };

  const fetchUserData = useCallback(async () => {
    if (!userAddress) return;
    try {
      const res = await fetch(`/api/invite?address=${userAddress}`);
      const data = await res.json();
      setUserData({
        inviteCode: data.inviteCode || inviteCode,
        totalInvites: data.totalInvites || 0,
        todayOpened: data.todayOpened || 0,
        totalBoxEarned: data.totalBoxEarned || 0,
        pendingBox: data.pendingBox || 0,
      });
      setHasEnough((data.totalBoxEarned || 0) >= 10);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userAddress, inviteCode]);

  useEffect(() => {
    if (wallet.connected || userInfo?.address) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [wallet.connected, userInfo?.address, fetchUserData]);

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 h-[300px] md:h-[350px]">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-purple-900/10 to-[#08080c]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-violet-500/15 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-pink-500/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-20 left-[10%] w-2 h-2 bg-violet-500/40 rounded-full blur-sm" />
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-32 right-[15%] w-3 h-3 bg-pink-500/30 rounded-full blur-sm" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Handshake className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent mb-3">
              Invite Friends
            </h1>
            <p className="text-gray-500 text-sm md:text-base">Invite friends to join & earn BOX rewards together!</p>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center">
            <Users className="w-6 h-6 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{userData.totalInvites}</p>
            <p className="text-xs text-gray-500">Total Invites</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center">
            <PartyPopper className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{userData.todayOpened}</p>
            <p className="text-xs text-gray-500">Today</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center">
            <Gift className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-400">{userData.totalBoxEarned}</p>
            <p className="text-xs text-gray-500">BOX Earned</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center">
            <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-cyan-400">{userData.pendingBox}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </motion.div>
        </div>
      </div>

      {/* Invite Link Section */}
      {(wallet.connected || userInfo?.address) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-4xl mx-auto px-4 md:px-8 mt-6">
          <div className="bg-gradient-to-r from-violet-600/20 via-purple-600/10 to-pink-600/20 border border-violet-500/20 rounded-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Link className="w-5 h-5 text-violet-400" />
                Your Invite Link
              </h2>
              <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-xs rounded-full border border-violet-500/30">Exclusive</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3">
                <p className="text-gray-300 text-sm font-mono truncate">{inviteLink}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyLink}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-violet-500 hover:bg-violet-600 text-white'}`}
              >
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
              </motion.button>
            </div>

            {/* Share Buttons */}
            <div className="flex gap-3 mt-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shareToTwitter} className="flex-1 py-2.5 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all">
                <Twitter className="w-4 h-4" /> Share on Twitter
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shareToTelegram} className="flex-1 py-2.5 bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/30 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all">
                <MessageCircle className="w-4 h-4" /> Share on Telegram
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Not Connected */}
      {(!wallet.connected && !userInfo?.address) && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-4 md:px-8 mt-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet2 className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Connect Wallet to Start</h3>
            <p className="text-gray-500 mb-6">Connect your wallet or login to get your unique invite link</p>
            <ConnectButton className="!bg-violet-500 !text-white !px-8 !py-3 !rounded-xl !font-semibold" />
          </div>
        </motion.div>
      )}

      {/* Reward Tiers */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Reward Tiers
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {INVITE_TASKS.map((task, index) => {
              const tier = TIER_CONFIG[task.tier];
              return (
                <motion.div
                  key={task.tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all ${tier.glow}`}
                >
                  <div className="text-4xl mb-3">{tier.icon}</div>
                  <h3 className={`text-lg font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
                    {tier.name} Tier
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{task.label}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Invite</span>
                      <span className="text-white font-medium">{task.friends} friends</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Box Reward</span>
                      <span className="text-violet-400 font-medium">+{task.boxReward} BOX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Referral</span>
                      <span className="text-pink-400 font-medium">+{task.refReward}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* How It Works */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Link, title: 'Share Link', desc: 'Share your unique invite link with friends', color: 'violet' },
              { icon: Users, title: 'Friend Joins', desc: 'Your friend connects wallet & opens box', color: 'pink' },
              { icon: Gift, title: 'Earn Rewards', desc: 'Both of you earn BOX rewards!', color: 'amber' },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                  step.color === 'violet' ? 'bg-violet-500/20' : step.color === 'pink' ? 'bg-pink-500/20' : 'bg-amber-500/20'
                }`}>
                  <step.icon className={`w-6 h-6 ${
                    step.color === 'violet' ? 'text-violet-400' : step.color === 'pink' ? 'text-pink-400' : 'text-amber-400'
                  }`} />
                </div>
                <h3 className="font-bold text-white mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
