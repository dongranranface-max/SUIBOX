'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NFTDetailPage({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(123);
  const [comment, setComment] = useState('');
  // 模拟已连接的钱包地址
  const [walletAddress] = useState('0x7a9f...3d2e');
  const [comments, setComments] = useState([
    { user: 'CryptoFan', avatar: '🎨', text: '太帅了！想要！', time: '2小时前', likes: 5, address: '0x3b2f...8c1a' },
    { user: 'SUILover', avatar: '🦄', text: '稀有度拉满', time: '5小时前', likes: 3, address: '0x9d4e...2f7b' },
    { user: 'NFTHunter', avatar: '🎯', text: '什么时候开售？', time: '1天前', likes: 1, address: '0x1a5c...9d3e' },
  ]);

  const nft = {
    id: params.id,
    name: '星辰大海 #88',
    artist: 'CryptoArtist',
    rarity: 'Epic',
    price: 500,
    desc: '稀有的星空主题NFT，拥有无限可能的升值空间。每个都是独特的数字艺术品，存储在SUI区块链上。',
    image: '🌟',
    supply: 100,
    remaining: 45,
    sales: 2500,
    properties: [
      { trait: '背景', value: '星空' },
      { trait: '眼睛', value: '激光眼' },
      { trait: '特效', value: '光环' },
    ],
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleComment = () => {
    if (comment.trim()) {
      setComments([{ 
        user: walletAddress, 
        avatar: '👤', 
        text: comment, 
        time: '刚刚', 
        likes: 0,
        address: walletAddress
      }, ...comments]);
      setComment('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left - NFT Image */}
          <div>
            <div className={`h-96 rounded-2xl flex items-center justify-center ${
              nft.rarity === 'Epic' ? 'bg-gradient-to-br from-purple-600 to-pink-600' :
              nft.rarity === 'Rare' ? 'bg-gradient-to-br from-blue-600 to-cyan-600' :
              'bg-gradient-to-br from-gray-600 to-gray-700'
            }`}>
              <span className="text-[200px]">{nft.image}</span>
            </div>
            
            {/* Actions */}
            <div className="flex gap-4 mt-4">
              <button onClick={handleLike} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${liked ? 'bg-pink-500/20 text-pink-500' : 'bg-white/5'}`}>
                <span>{liked ? '❤️' : '🤍'}</span>
                <span>{likeCount}</span>
              </button>
              <button className="flex-1 py-3 bg-white/5 rounded-xl flex items-center justify-center gap-2">
                <span>📤</span>
                <span>分享</span>
              </button>
              <button className="flex-1 py-3 bg-white/5 rounded-xl flex items-center justify-center gap-2">
                <span>🔗</span>
                <span>复制链接</span>
              </button>
            </div>
          </div>

          {/* Right - Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400">{nft.rarity}</span>
              </div>
              <h1 className="text-3xl font-bold">{nft.name}</h1>
              <p className="text-gray-400 mt-1">by <span className="text-violet-400">{nft.artist}</span></p>
            </div>

            {/* Price */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">当前价格</div>
              <div className="text-4xl font-bold text-violet-400">{nft.price} <span className="text-xl">SUI</span></div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-violet-600 rounded-xl font-bold">立即购买</button>
              <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-bold">发起报价</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xl font-bold">{nft.supply}</div>
                <div className="text-xs text-gray-500">总量</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xl font-bold">{nft.remaining}</div>
                <div className="text-xs text-gray-500">剩余</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xl font-bold">{nft.sales}</div>
                <div className="text-xs text-gray-500">销量</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-bold mb-2">描述</h3>
              <p className="text-gray-400 text-sm">{nft.desc}</p>
            </div>

            {/* Properties */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-bold mb-3">属性</h3>
              <div className="grid grid-cols-3 gap-2">
                {nft.properties.map((prop, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">{prop.trait}</div>
                    <div className="font-medium">{prop.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-bold mb-3">💬 评论 ({comments.length})</h3>
              
              {/* Input */}
              <div className="flex gap-2 mb-4">
                <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="添加评论..." className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                <button onClick={handleComment} className="px-4 py-2 bg-violet-600 rounded-lg text-sm">发送</button>
              </div>

              {/* List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-2xl">{c.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-violet-400">{c.address}</span>
                        <span className="text-xs text-gray-500">{c.time}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{c.text}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <span>❤️</span>
                      <span>{c.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
