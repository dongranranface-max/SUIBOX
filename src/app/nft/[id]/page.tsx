'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingCart, DollarSign, MessageCircle, Share2, Flag, ChevronLeft, CheckCircle, Eye, Flame, Clock, TrendingUp, Send, Copy, Twitter, Telegram } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useWallet } from '@suiet/wallet-kit';
import { useAuth } from '@/hooks/useAuth';
import { executeOnchainPurchase, fetchWalletBalance, requestWalletAuthorization, type TradeCoinUnit } from '@/lib/marketTrade';

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

interface Offer {
  id: number;
  buyer: string;
  price: number;
  unit: string;
  status: 'pending' | 'accepted' | 'rejected';
  time: string;
}

export default function NFTDetailPage({ params }: { params: { id: string } }) {
  // 解包params (Next.js 16+)
  const resolvedParams = use(params);
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const wallet = useWallet();
  const { isLoggedIn, login, userAddress } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(123);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'history' | 'offers'>('comments');
  const [isBuying, setIsBuying] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: 'CryptoFan', avatar: '🎮', text: '太帅了！想要！', time: '2小时前', likes: 5 },
    { id: 2, user: 'SUILover', avatar: '🦄', text: '稀有度拉满', time: '5小时前', likes: 3 },
    { id: 3, user: 'NFTHunter', avatar: '🎯', text: '什么时候开售？', time: '1天前', likes: 1 },
  ]);

  const nft = {
    id: resolvedParams.id,
    name: '星辰大海 #88',
    artist: 'CryptoArtist',
    verified: true,
    rarity: 'Epic',
    category: 'collector',
    price: 500,
    priceUnit: 'SUI',
    desc: '稀有的星空主题NFT，拥有无限可能的升值空间。每个都是独特的数字艺术品，存储在SUI区块链上。',
    image: '🌟',
    supply: 100,
    remaining: 45,
    sales: 2500,
    views: 1567,
    likes: 234,
    createdAt: '2026-03-01',
    properties: [
      { trait: '背景', value: '星空', rarity: '20%' },
      { trait: '角色', value: '宇航员', rarity: '15%' },
      { trait: '配件', value: '星光剑', rarity: '5%' },
      { trait: '特效', value: '极光', rarity: '8%' },
    ],
    history: [
      { action: '出售', price: 480, from: '0x3a2f...1b4c', to: '0x7d9e...2f3a', time: '3小时前' },
      { action: '出售', price: 460, from: '0x1b4c...9d2e', to: '0x3a2f...1b4c', time: '1天前' },
      { action: '铸造', price: 0, from: '系统', to: '0x1b4c...9d2e', time: '5天前' },
    ],
    offers: [
      { id: 1, buyer: '0x7d9e...f3a', price: 450, unit: 'SUI', time: '1小时前', status: 'pending' },
      { id: 2, buyer: '0x5c2d...8e1f', price: 420, unit: 'SUI', time: '3小时前', status: 'pending' },
    ],
  };

  const handleLike = () => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); };
  
  const handleComment = () => { 
    if (comment.trim()) { 
      setComments([...comments, { id: Date.now(), user: '你', avatar: '👤', text: comment, time: '刚刚', likes: 0 }]); 
      setComment(''); 
    } 
  };

  const copyAddress = (addr: string) => { navigator.clipboard.writeText(addr); alert('地址已复制!'); };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }

    const address = userAddress || wallet.account?.address || '';
    if (!address) {
      alert('购买NFT前必须先获取钱包地址');
      return;
    }

    const unit = nft.priceUnit as TradeCoinUnit;
    const receiver =
      process.env.NEXT_PUBLIC_MARKET_RECEIVER_ADDRESS ||
      process.env.NEXT_PUBLIC_NFT_MARKET_RECEIVER ||
      '';

    setIsBuying(true);
    try {
      const balance = await fetchWalletBalance(address, unit);
      if (balance < nft.price) {
        alert('余额不足');
        return;
      }

      await requestWalletAuthorization(wallet as unknown as Parameters<typeof requestWalletAuthorization>[0], {
        nftId: nft.id,
        unit,
        total: nft.price,
      });
      const digest = await executeOnchainPurchase(wallet as unknown as Parameters<typeof executeOnchainPurchase>[0], {
        receiver,
        amountSui: nft.price,
        unit,
        nftId: nft.id,
        buyer: address,
      });
      alert(`交易已上链成功\nNFT: ${nft.name}\n支付金额: ${nft.price} ${nft.priceUnit}\nDigest: ${digest || '已提交'}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '交易授权失败';
      alert(msg);
    } finally {
      setIsBuying(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) { 
      case 'epic': return 'from-purple-500 to-pink-500'; 
      case 'rare': return 'from-blue-500 to-cyan-500'; 
      default: return 'from-gray-500 to-gray-600'; 
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link href="/market" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />返回NFT大厅
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left - Image */}
          <div className="space-y-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="aspect-square bg-gray-900 rounded-3xl flex items-center justify-center text-[150px] relative overflow-hidden">
              <span className="transform hover:scale-110 transition-transform duration-500">{nft.image}</span>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${getRarityColor(nft.rarity)}`}>
                  👑 {nft.rarity}
                </span>
                {nft.verified && <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" />认证</span>}
              </div>
            </motion.div>
            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={handleLike} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${liked ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-gray-800 hover:bg-gray-700'}`}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />{likeCount}
              </button>
              <button className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold flex items-center justify-center gap-2"><Share2 className="w-5 h-5" />分享</button>
              <button className="px-4 bg-gray-800 hover:bg-gray-700 rounded-xl"><Flag className="w-5 h-5 text-gray-400" /></button>
            </div>
          </div>

          {/* Right - Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl md:text-4xl font-black">{nft.name}</h1>
                {nft.verified && <CheckCircle className="w-6 h-6 text-blue-400" />}
              </div>
              <p className="text-gray-400">by <span className="text-violet-400 font-bold">{nft.artist}</span></p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-800/50 rounded-xl p-3 text-center"><p className="text-gray-500 text-xs">价格</p><p className="text-xl font-black text-violet-400">{nft.price}</p><p className="text-gray-500 text-xs">{nft.priceUnit}</p></div>
              <div className="bg-gray-800/50 rounded-xl p-3 text-center"><p className="text-gray-500 text-xs">剩余</p><p className="text-xl font-black">{nft.remaining}</p><p className="text-gray-500 text-xs">/ {nft.supply}</p></div>
              <div className="bg-gray-800/50 rounded-xl p-3 text-center"><p className="text-gray-500 text-xs">销量</p><p className="text-xl font-black text-green-400">{nft.sales}</p></div>
              <div className="bg-gray-800/50 rounded-xl p-3 text-center"><p className="text-gray-500 text-xs">热度</p><p className="text-xl font-black text-red-400">❤️ {nft.likes}</p></div>
            </div>

            {/* Description */}
            <div className="bg-gray-800/30 rounded-2xl p-4">
              <h3 className="font-bold mb-2">描述</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{nft.desc}</p>
            </div>

            {/* Properties */}
            <div className="bg-gray-800/30 rounded-2xl p-4">
              <h3 className="font-bold mb-3">属性</h3>
              <div className="grid grid-cols-2 gap-2">
                {nft.properties.map((prop, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-3">
                    <p className="text-gray-500 text-xs">{prop.trait}</p>
                    <p className="font-bold">{prop.value}</p>
                    <p className="text-violet-400 text-xs">{prop.rarity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleBuyNow}
                disabled={isBuying}
                className="flex-1 py-4 bg-gradient-to-r from-violet-600 via-pink-600 to-purple-600 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShoppingCart className="w-5 h-5" />{isBuying ? '授权中...' : '立即购买'}
              </button>
              <button className="flex-1 py-4 bg-green-600 hover:bg-green-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />发起报价
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700">
              <div className="flex gap-1">
                {[
                  { key: 'comments', label: '评论', icon: MessageCircle, count: comments.length }, 
                  { key: 'history', label: '历史', icon: Clock }, 
                  { key: 'offers', label: '报价', icon: DollarSign, count: nft.offers.length }
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key as 'comments' | 'history' | 'offers')} className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === tab.key ? 'border-violet-500 text-violet-400' : 'border-transparent text-gray-500 hover:text-white'}`}>
                    <tab.icon className="w-4 h-4" />{tab.label}
                    {tab.count !== undefined && <span className="text-xs bg-gray-700 px-1.5 rounded-full">{tab.count}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-h-64 overflow-y-auto">
              {activeTab === 'comments' && (
                <div className="space-y-3">
                  {comments.map((c, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-gray-800/30 rounded-xl">
                      <span className="text-2xl">{c.avatar}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><span className="font-bold text-sm">{c.user}</span><span className="text-gray-500 text-xs">{c.time}</span></div>
                        <p className="text-gray-300 text-sm">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="发表评论..." className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white" />
                    <button onClick={handleComment} className="px-4 bg-violet-600 rounded-xl"><Send className="w-5 h-5" /></button>
                  </div>
                </div>
              )}
              {activeTab === 'history' && (
                <div className="space-y-2">
                  {nft.history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${h.action === '铸造' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{h.action}</span>
                        <div><p className="text-sm font-bold">{h.price > 0 ? `${h.price} SUI` : '-'}</p><p className="text-gray-500 text-xs">{h.time}</p></div>
                      </div>
                      <div className="text-right"><p className="text-gray-500 text-xs">from</p><p className="text-xs text-violet-400 cursor-pointer" onClick={() => copyAddress(h.from)}>{h.from}</p></div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'offers' && (
                <div className="space-y-2">
                  {nft.offers.map((o, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                      <div><p className="font-bold text-violet-400">{o.price} {o.unit}</p><p className="text-gray-500 text-xs">{o.time}</p></div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{o.status === 'pending' ? '待确认' : '已确认'}</span>
                        {o.status === 'pending' && <button className="px-3 py-1 bg-green-600 rounded-lg text-xs font-bold">接受</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
