'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wallet, Chrome, ArrowRight, Shield, Zap, Lock, Loader2, CheckCircle } from 'lucide-react';
import { useWallet, ConnectModal } from '@suiet/wallet-kit';

export default function LoginPage() {
  const router = useRouter();
  const { address, connected } = useWallet();
  const [loading, setLoading] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get redirect URL
  const redirectUrl = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('redirect') || '/profile'
    : '/profile';

  // Check if already logged in
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setIsLoggedIn(true);
          router.replace(redirectUrl);
        }
      })
      .catch(() => {});
  }, []);

  // Handle wallet connection
  useEffect(() => {
    if (connected && address) {
      fetch('/api/auth/wallet-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            router.replace(redirectUrl);
          }
        })
        .catch(err => console.error('Login failed:', err));
    }
  }, [connected, address, redirectUrl, router]);

  // OAuth Login
  const handleOAuthLogin = async (provider: string) => {
    setLoading(provider);
    try {
      const res = await fetch(`/api/zklogin?provider=${provider}`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('OAuth error:', error);
      setLoading(null);
    }
  };

  // Already logged in
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500 mx-auto mb-4" />
          <p className="text-gray-400">正在跳转...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/suibox-logo.png" alt="SUIBOX" className="h-20 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">开启 Web3 之旅</h1>
            <p className="text-gray-400 text-sm mt-2">连接你的数字资产，进入 NFT + DeFi 世界</p>
          </div>

          {/* Login Options */}
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loading !== null}
              className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-4 disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl">
                🔍
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold">Google 登录</div>
                <div className="text-gray-500 text-sm">一键登录</div>
              </div>
              {loading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
              ) : (
                <ArrowRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Discord */}
            <button
              onClick={() => handleOAuthLogin('discord')}
              disabled={loading !== null}
              className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-4 disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                💬
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold">Discord 登录</div>
                <div className="text-gray-500 text-sm">社区账号</div>
              </div>
              {loading === 'discord' ? (
                <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
              ) : (
                <ArrowRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-sm">或</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Wallet */}
            <button
              onClick={() => setShowWalletModal(true)}
              className="w-full p-4 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-600/20 to-pink-600/20 hover:from-violet-600/30 hover:to-pink-600/30 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <img src="/sui-logo.png" alt="SUI" className="w-8 h-8" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold">连接钱包</div>
                <div className="text-gray-400 text-sm">使用 Sui 钱包</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: Shield, text: '安全可靠', color: 'text-green-400' },
              { icon: Zap, text: '快速便捷', color: 'text-yellow-400' },
              { icon: Lock, text: '隐私保护', color: 'text-blue-400' },
            ].map((item, i) => (
              <div key={i} className="text-center p-3 bg-white/5 rounded-lg">
                <item.icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
                <span className="text-xs text-gray-400">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            登录即表示同意 <a href="/terms" className="text-violet-400 hover:underline">服务条款</a> 和 <a href="/privacy" className="text-violet-400 hover:underline">隐私政策</a>
          </p>
        </div>
      </div>

      {/* Wallet Modal */}
      <ConnectModal 
        open={showWalletModal} 
        onOpenChange={setShowWalletModal} 
      />
    </div>
  );
}
