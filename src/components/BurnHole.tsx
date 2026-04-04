'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingDown, Clock, X } from 'lucide-react';

interface BurnRecord {
  id: number;
  type: string;
  address: string;
  amount: string;
  description: string;
  time: string;
  emoji: string;
}

const burnTypes = [
  { type: 'upgrade', emoji: '🔥', desc: 'Upgraded Legendary NFT', color: 'yellow' },
  { type: 'craft', emoji: '⚡', desc: 'Crafted Epic NFT', color: 'orange' },
  { type: 'trade', emoji: '💎', desc: 'Market trading fee', color: 'purple' },
  { type: 'fee', emoji: '💰', desc: 'Fragment swap fee', color: 'cyan' },
];

const addresses = ['0x8A3f...2cD1', '0x3F9a...7B2e', '0x7C2d...9A1f', '0x1B5e...4C8d', '0x9D4f...2E7c'];
const amounts = ['50', '70', '100', '150', '200', '500'];

export default function BurnHole() {
  const [records, setRecords] = useState<BurnRecord[]>([]);
  const [totalBurned, setTotalBurned] = useState(284756);
  const [toast, setToast] = useState<BurnRecord | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateRecord = (): BurnRecord => {
    const selected = burnTypes[Math.floor(Math.random() * burnTypes.length)];
    return {
      id: Date.now(),
      type: selected.type,
      address: addresses[Math.floor(Math.random() * addresses.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      description: selected.desc,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      emoji: selected.emoji,
    };
  };

  useEffect(() => {
    const initialRecords: BurnRecord[] = [];
    for (let i = 0; i < 6; i++) {
      const record = generateRecord();
      record.id = Date.now() - i * 1000;
      initialRecords.push(record);
    }
    setRecords(initialRecords);

    const addRecord = () => {
      const newRecord = generateRecord();
      setRecords(prev => [newRecord, ...prev.slice(0, 9)]);
      setTotalBurned(prev => prev + parseInt(newRecord.amount));
      setToast(newRecord);
      setTimeout(() => setToast(null), 5000);
    };

    const interval = setInterval(addRecord, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm"
          >
            <div className="bg-gray-900 border border-orange-500/50 rounded-2xl p-4 shadow-2xl shadow-orange-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500" />
              <button
                onClick={() => setToast(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <a 
                href={`https://suivision.xyz/txblock/${toast.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:bg-orange-500/10 -m-2 p-2 rounded-xl transition-colors"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl"
                >
                  {toast.emoji}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-orange-400 font-medium truncate">
                    🔥 {toast.address}
                  </p>
                  <p className="text-white text-sm">
                    {toast.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <TrendingDown className="inline w-3 h-3 mr-1 text-orange-400" />
                    <span className="text-orange-400 font-bold">{toast.amount} BOX</span> burned
                    <span className="text-orange-400/60 ml-2">View on chain</span>
                  </p>
                </div>
              </a>
              <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burn Hole Panel */}
      <div className="bg-gray-900/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-5 relative overflow-hidden shadow-2xl shadow-orange-500/10">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-t from-orange-500/15 via-red-500/10 to-transparent blur-xl animate-pulse" />
        </div>

        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Flame className="w-6 h-6 text-orange-500" />
            </motion.div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  The Burn Hole
                </span>
                <motion.span 
                  animate={{ opacity: [1, 0.4, 1] }}
                  className="px-2 py-0.5 bg-red-500/80 text-white text-[10px] font-bold rounded-full"
                >
                  LIVE
                </motion.span>
              </h3>
              <p className="text-[10px] text-gray-500">Real-time BOX Burn · On-chain verifiable</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total</p>
            <p className="text-xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              {totalBurned.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-600">BOX</p>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="relative max-h-36 overflow-y-auto space-y-1.5 pr-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(249,115,22,0.3) transparent' }}
        >
          <AnimatePresence mode="popLayout">
            {records.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-orange-500/10 hover:border-orange-500/30 transition-all"
              >
                <span className="text-base">{record.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 truncate">
                    <span className="text-cyan-400 font-mono">{record.address}</span>
                    {' '}{record.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 rounded-full">
                  <TrendingDown className="w-3 h-3 text-orange-400" />
                  <span className="text-xs font-bold text-orange-400">{record.amount}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="relative mt-3 pt-2 border-t border-orange-500/10">
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>Today: <span className="text-orange-400 font-bold">{Math.floor(totalBurned * 0.08).toLocaleString()}</span></span>
            <span>Updates every 8s</span>
          </div>
        </div>
      </div>
    </>
  );
}
