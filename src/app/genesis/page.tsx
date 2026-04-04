'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Wallet, Clock, Gift, Crown } from 'lucide-react';

const TOTAL_SUPPLY = 100;

export default function GenesisPage() {
  const [minted, setMinted] = useState(89);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [countdown, setCountdown] = useState({ h: 23, m: 59, s: 59 });

  const soldPercent = (minted / TOTAL_SUPPLY) * 100;
  const remaining = TOTAL_SUPPLY - minted;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMint = () => {
    if (isMinting || mintSuccess || remaining <= 0) return;
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      setMintSuccess(true);
      setMinted(m => m + 1);
    }, 2000);
  };

  const privileges = [
    { icon: <Zap className="w-5 h-5" />, title: 'Lifetime Zero Trading Fees', sub: 'Permanent fee exemption on SUIBOX marketplace', color: 'text-green-400' },
    { icon: <Gift className="w-5 h-5" />, title: 'Daily Guaranteed Epic Airdrop', sub: 'Daily Epic mystery box airdrop guaranteed', color: 'text-purple-400' },
    { icon: <Shield className="w-5 h-5" />, title: 'Top-Tier Real Yield Dividends', sub: 'Priority SUI treasury dividend distribution', color: 'text-yellow-400' },
    { icon: <Crown className="w-5 h-5" />, title: 'Exclusive DAO Voting Weight (x10)', sub: '10x voting power in DAO governance', color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/40 via-black to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-yellow-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,215,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Card */}
            <div className="flex flex-col items-center order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-600/40 via-amber-500/20 to-yellow-600/40 rounded-[3rem] blur-2xl animate-pulse" />
                
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-[340px] h-[480px] md:w-[400px] md:h-[560px]"
                >
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-yellow-500/40 overflow-hidden">
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                    
                    <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                      <motion.div 
                        className="text-7xl md:text-8xl mb-6"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ⚡
                      </motion.div>
                      
                      <div className="text-3xl md:text-4xl font-black tracking-[0.2em] mb-2">
                        <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                          SUIBOX
                        </span>
                      </div>
                      
                      <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent my-6" />
                      
                      <div className="mb-8">
                        <p className="text-[10px] text-yellow-500/50 tracking-[0.4em] mb-2">LIMITED EDITION</p>
                        <div className="text-2xl md:text-3xl font-black text-white mb-1">GENESIS</div>
                        <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                          PASS
                        </div>
                      </div>
                      
                      <div className="px-6 py-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-full">
                        <span className="text-yellow-400 font-bold text-xs tracking-[0.2em]">★ LEGENDARY ★</span>
                      </div>
                      
                      <div className="mt-auto pt-8">
                        <p className="text-[10px] text-yellow-500/30">SERIES #001</p>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                  </div>
                </motion.div>

                <div 
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[320px] h-[60px] bg-gradient-to-b from-yellow-500/20 to-transparent rounded-full blur-xl opacity-40"
                  style={{ transform: 'scaleY(-0.5)' }}
                />
              </div>

              <div className="mt-16 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-full">
                <span className="text-yellow-400">🎯</span>
                <span className="text-yellow-400/80 text-sm font-medium">Global Limited 100 · First Come First Served</span>
              </div>
            </div>

            {/* Right Info */}
            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-full mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-red-400 text-sm font-medium">🔥 Limited Edition</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-3">
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  The Genesis Pass
                </span>
              </h1>
              <p className="text-gray-400 text-lg mb-8">Limited to 100 holders · Premium NFT Access</p>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-6xl md:text-7xl lg:text-8xl font-black text-yellow-400">199</span>
                <span className="text-2xl text-gray-500">SUI</span>
                <span className="text-2xl text-red-500 line-through">499 SUI</span>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Minted</span>
                    <span className="text-white font-bold text-xl">{minted} / {TOTAL_SUPPLY}</span>
                  </div>
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-red-500 font-bold"
                  >
                    Almost Sold Out!
                  </motion.span>
                </div>

                <div className="relative h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${soldPercent}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                  </motion.div>
                </div>

                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">{remaining} remaining</span>
                  <span className="text-yellow-400 font-bold">{soldPercent.toFixed(0)}%</span>
                </div>
              </div>

              {/* Countdown */}
              <div className="mb-8 p-4 bg-gray-900/60 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500 text-sm">Limited sale ends in</span>
                </div>
                <div className="flex gap-3">
                  {[
                    { v: countdown.h, l: 'HRS' },
                    { v: countdown.m, l: 'MIN' },
                    { v: countdown.s, l: 'SEC' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-16 h-14 bg-black rounded-xl border border-yellow-500/20 flex items-center justify-center">
                        <span className="text-2xl font-black text-yellow-400">
                          {String(item.v).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{item.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privileges */}
              <div className="space-y-3 mb-8">
                {privileges.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-900/60 rounded-xl border border-gray-800 hover:border-green-500/30 transition-colors"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center ${p.color}`}>
                      {p.icon}
                    </div>
                    <div>
                      <p className="font-bold text-white">{p.title}</p>
                      <p className="text-sm text-gray-500">{p.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mint Button */}
              <div className="relative">
                <div className={`absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl blur-lg transition-opacity ${isMinting || mintSuccess ? 'opacity-50' : 'opacity-60 animate-pulse'}`} />
                <motion.button
                  onClick={handleMint}
                  disabled={isMinting || mintSuccess || remaining <= 0}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    relative w-full py-5 rounded-2xl font-black text-lg text-black
                    transition-all duration-300 shadow-2xl
                    ${mintSuccess 
                      ? 'bg-green-500' 
                      : remaining <= 0
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400'
                    }
                  `}
                >
                  {isMinting ? (
                    <span className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full"
                      />
                      MINTING...
                    </span>
                  ) : mintSuccess ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-6 h-6" />
                      MINTED SUCCESSFULLY!
                    </span>
                  ) : remaining <= 0 ? (
                    'SOLD OUT'
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Wallet className="w-6 h-6" />
                      MINT NOW (199 SUI)
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  Secure Mint
                </span>
                <span>·</span>
                <span>Blockchain Verified</span>
                <span>·</span>
                <span>Official Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
    </div>
  );
}
