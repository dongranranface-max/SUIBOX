'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock notifications data
const notifications = [
  { id: 1, address: '0x8A3f...2cD1', action: 'claimed', points: '100', location: 'New York' },
  { id: 2, address: '0x3F9a...7B2e', action: 'joined from', points: '50', location: 'Tokyo' },
  { id: 3, address: '0x7C2d...9A1f', action: 'claimed', points: '150', location: 'London' },
  { id: 4, address: '0x1B5e...4C8d', action: 'referred', points: '80', location: 'Singapore' },
  { id: 5, address: '0x9D4f...2E7c', action: 'claimed', points: '200', location: 'Dubai' },
  { id: 6, address: '0x6A8b...1F3a', action: 'joined from', points: '50', location: 'Seoul' },
  { id: 7, address: '0x2C7e...8B5d', action: 'claimed', points: '120', location: 'Berlin' },
  { id: 8, address: '0x5E3d...0A9b', action: 'referred', points: '75', location: 'Paris' },
];

// Stats
const stats = [
  { label: 'Total Participants', value: '12,847', change: '+328' },
  { label: 'Points Claimed', value: '2.4M+', change: '' },
  { label: '$BOX Allocation', value: '5,000,000', change: '' },
];

export default function GenesisAirdropHero() {
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 });
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Countdown timer - 30 days
  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Notification carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTwitterConnect = () => {
    alert('Connecting to Twitter...\n\nThis would redirect to Twitter OAuth flow.');
  };

  return (
    <section className="relative w-full py-12 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-5xl mx-auto"
      >
        {/* Glow border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-40 animate-pulse" />
        
        {/* Card body */}
        <div className="relative bg-gray-950/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          {/* Top decorative line */}
          <div className="h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
          
          {/* Content area */}
          <div className="p-8 md:p-12 text-center">
            {/* Season Badge */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-full border border-cyan-500/30 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-cyan-400 text-sm font-bold tracking-wider">SEASON 0</span>
              <span className="text-gray-400 text-sm">·</span>
              <span className="text-pink-400 text-sm font-bold">GENESIS AIRDROP</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-4"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SUIBOX Season 0
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-white/90">
                The Genesis Airdrop
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-base md:text-lg mb-8 max-w-2xl mx-auto"
            >
              <span className="text-white">
                Join the first Real Yield Blind Box Protocol on Sui.
              </span>
              <br />
              <span className="text-cyan-400">
                Earn Points. Claim $BOX.
              </span>
            </motion.p>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-gray-500 text-xs md:text-sm mb-4 uppercase tracking-widest">
                Airdrop Ends In
              </p>
              <div className="flex justify-center gap-3 md:gap-5">
                {[
                  { value: timeLeft.days, label: 'DAYS' },
                  { value: timeLeft.hours, label: 'HRS' },
                  { value: timeLeft.minutes, label: 'MIN' },
                  { value: timeLeft.seconds, label: 'SEC' }
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="bg-gray-900/80 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
                      <div className="text-3xl md:text-5xl font-black text-white font-mono">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500 tracking-wider mt-1">
                        {item.label}
                      </div>
                    </div>
                    {index < 3 && (
                      <span className="text-3xl md:text-5xl font-bold text-cyan-500 animate-pulse hidden md:block">:</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Main Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleTwitterConnect}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative mb-6"
            >
              {/* Button glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-lg transition-opacity duration-500 ${isHovered ? 'opacity-75 animate-pulse' : 'opacity-50'}`} />
              
              {/* Button body */}
              <div className="relative bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 rounded-2xl px-10 py-5 transition-all duration-300 shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/50">
                <div className="flex items-center justify-center gap-3">
                  {/* X Logo */}
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-white font-bold text-lg md:text-xl tracking-wide">
                    Connect Twitter to Claim Points
                  </span>
                </div>
              </div>
            </motion.button>

            {/* Reward description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-gray-500 text-sm"
            >
              Connect Twitter → Get <span className="text-cyan-400 font-bold">50 Points</span> → More Actions = More Points!
            </motion.p>

            {/* Notification scroll */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 relative overflow-hidden"
            >
              {/* Gradient masks */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-950/95 to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-950/95 to-transparent z-10" />
              
              {/* Notification content */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentNotification}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400"
                  >
                    <span className="font-mono text-cyan-400">
                      {notifications[currentNotification].address}
                    </span>
                    {' '}{notifications[currentNotification].action}{' '}
                    <span className="text-white">
                      {notifications[currentNotification].location}
                    </span>
                    .{' '}
                    <span className="text-pink-400 font-bold">
                      {notifications[currentNotification].points} Points earned!
                    </span>
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Bottom decorative line */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* Bottom stats bar */}
          <div className="bg-gray-900/50 px-6 py-5">
            <div className="flex items-center justify-center gap-8 md:gap-16 text-xs md:text-sm">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-500">{stat.label}:</span>
                  <span className="text-white font-bold">{stat.value}</span>
                  {stat.change && <span className="text-green-400">{stat.change}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
