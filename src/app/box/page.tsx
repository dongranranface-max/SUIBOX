'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import { SUI_CONFIG } from '@/config/sui';
import { Transaction } from '@mysten/sui/transactions';
import { useSuiClient } from '@mysten/dapp-kit';

// 碎片数据
const fragmentData = {
  common: { name: '普通', count: 6, color: 'from-gray-500 to-gray-600' },
  rare: { name: '稀有', count: 2, color: 'from-blue-500 to-cyan-500' },
  epic: { name: '史诗', count: 0, color: 'from-yellow-500 to-amber-500' },
};

// NFT数据
const nftData = [
  { name: '普通碎片', rarity: 'R', image: '/fragment-common.png' },
  { name: '稀有碎片', rarity: 'SR', image: '/fragment-rare.png' },
  { name: '史诗碎片', rarity: 'SSR', image: '/fragment-epic.png' },
];

// 保底配置
const guaranteeConfig = {
  common: { count: 3, name: '普通碎片' },
  rare: { count: 5, name: '稀有碎片' },
  epic: { count: 53, name: '史诗碎片' },
};

// 盒子价格
const boxPrices = {
  common: 1,
  rare: 5,
  epic: 10,
};

export default function BoxPage() {
  const wallet = useWallet();
  const client = useSuiClient();
  
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{ name: string; rarity: string; image: string; txDigest?: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [myFragments, setMyFragments] = useState(fragmentData);
  const [consecutiveNone, setConsecutiveNone] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');

  // 获取余额
  useEffect(() => {
    if (!wallet.account?.address) return;
    
    client.getBalance({ owner: wallet.account.address })
      .then(b => setBalance((Number(b.totalBalance) / 1e9).toFixed(2)))
      .catch(console.error);
  }, [wallet.account?.address, client]);

  // 开盲盒
  const handleOpenBox = useCallback(async (boxType: 'common' | 'rare' | 'epic') => {
    if (!wallet.connected) {
      setError('请先连接SUI钱包！');
      return;
    }
    
    setError(null);
    setIsOpening(true);
    setResult(null);
    setShowResult(false);

    try {
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${SUI_CONFIG.devnet.packageId}::box::open_common_box`,
        arguments: [tx.object.clock()],
      });

      // 使用钱包签名交易
      const res = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });
      
      console.log('开盲盒成功:', res.digest);
      
      const rand = Math.random() * 100;
      let rarity: string;
      
      // 保底逻辑
      if (consecutiveNone >= guaranteeConfig.epic.count) {
        rarity = boxType === 'epic' ? 'SSR' : boxType === 'rare' ? 'SR' : 'R';
        setConsecutiveNone(0);
      } else if (consecutiveNone >= guaranteeConfig.rare.count) {
        rarity = 'SR';
        setConsecutiveNone(0);
      } else if (consecutiveNone >= guaranteeConfig.common.count) {
        rarity = 'R';
        setConsecutiveNone(0);
      } else {
        if (boxType === 'epic') {
          rarity = rand < 1 ? 'SSR' : rand < 16 ? 'SR' : 'R';
        } else if (boxType === 'rare') {
          rarity = rand < 3 ? 'SR' : 'R';
        } else {
          rarity = rand < 10 ? 'SR' : 'R';
        }
        
        if (rarity === 'R') {
          setConsecutiveNone(prev => prev + 1);
        } else {
          setConsecutiveNone(0);
        }
      }

      const nft = nftData.find(n => n.rarity === rarity) || nftData[0];
      
      setResult({ 
        name: nft.name, 
        rarity, 
        image: nft.image,
        txDigest: res.digest
      });
      setShowResult(true);
      
      if (rarity === 'SSR' || rarity === 'SR') {
        setMyFragments(prev => ({
          ...prev,
          [rarity === 'SSR' ? 'epic' : 'rare']: { 
            ...prev[rarity === 'SSR' ? 'epic' : 'rare'], 
            count: prev[rarity === 'SSR' ? 'epic' : 'rare'].count + 1 
          }
        }));
      } else {
        setMyFragments(prev => ({
          ...prev,
          common: { ...prev.common, count: prev.common.count + 1 }
        }));
      }
      
    } catch (e: unknown) {
      console.error('开盲盒失败:', e);
      setResult(null);
      setError(e instanceof Error ? e.message : '开盲盒失败');
    }
    
    setIsOpening(false);
  }, [wallet, consecutiveNone]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* 标题 */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-3 mb-2"
          >
            <span className="text-5xl">🎁</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              NFT 盲盒
            </h1>
            <span className="text-5xl">💎</span>
          </motion.div>
          <p className="text-gray-400">SUI Devnet 链上盲盒</p>
        </div>

        {/* 连接钱包 */}
        {!wallet.connected && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6 text-center">
            <p className="text-amber-400 mb-4">请先连接SUI钱包体验链上开盲盒！</p>
            <ConnectButton />
          </div>
        )}

        {/* 余额显示 */}
        {wallet.connected && (
          <div className="bg-gray-900 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">钱包余额</p>
              <p className="text-2xl font-bold text-yellow-400">{balance} SUI</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">我的碎片</p>
              <p className="text-xl font-bold">
                稀有: {myFragments.rare.count} | 史诗: {myFragments.epic.count}
              </p>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* 盲盒列表 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { type: 'common' as const, name: '普通盲盒', price: boxPrices.common, desc: '90% 概率普通碎片', color: 'from-gray-500 to-gray-600' },
            { type: 'rare' as const, name: '稀有盲盒', price: boxPrices.rare, desc: '30% 概率稀有碎片', color: 'from-blue-500 to-cyan-500' },
            { type: 'epic' as const, name: '史诗盲盒', price: boxPrices.epic, desc: '16% 概率史诗碎片', color: 'from-yellow-500 to-amber-500' },
          ].map(box => (
            <motion.div
              key={box.type}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 rounded-2xl overflow-hidden"
            >
              <div className={`h-32 bg-gradient-to-br ${box.color} flex items-center justify-center`}>
                <Gift className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{box.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{box.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-yellow-400">{box.price} SUI</span>
                  <button
                    onClick={() => handleOpenBox(box.type)}
                    disabled={isOpening || !wallet.connected}
                    className="px-6 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isOpening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    开盒
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 开盒结果弹窗 */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setShowResult(false)}
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="bg-gray-900 rounded-2xl p-8 max-w-md text-center"
                onClick={e => e.stopPropagation()}
              >
                <div className={`text-6xl mb-4 bg-gradient-to-r ${result.rarity === 'SSR' ? 'from-yellow-500 to-red-500' : result.rarity === 'SR' ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-cyan-500'} bg-clip-text text-transparent`}>
                  {result.rarity === 'SSR' ? '💎' : result.rarity === 'SR' ? '⭐' : '🎯'}
                </div>
                <h2 className="text-2xl font-bold mb-2">{result.name}</h2>
                <p className={`text-lg font-bold mb-4 ${result.rarity === 'SSR' ? 'text-yellow-400' : result.rarity === 'SR' ? 'text-purple-400' : 'text-blue-400'}`}>
                  {result.rarity}
                </p>
                {result.txDigest && (
                  <p className="text-xs text-gray-500 mb-4 break-all">
                    Tx: {result.txDigest.slice(0, 20)}...
                  </p>
                )}
                <button
                  onClick={() => setShowResult(false)}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg font-bold"
                >
                  确认
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
