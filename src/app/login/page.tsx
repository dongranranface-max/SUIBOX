'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight, Shield, Zap, Lock, Loader2, Sparkles, Play, Mail } from 'lucide-react';
import { useWallet, ConnectModal } from '@suiet/wallet-kit';
import { useI18n } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address, connected } = useWallet();
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [loading, setLoading] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 邀请码
  const [inviteCode, setInviteCode] = useState('');

  // 处理邀请码
  useEffect(() => {
    const code = searchParams.get('invite');
    if (code) {
      setInviteCode(code);
      localStorage.setItem('invite_code', code);
    }
  }, [searchParams]);

  // 演示登录 - 快速体验
  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'demo',
          name: 'SUI BOX User'
        })
      });
      const data = await res.json();
      
      if (data.success) {
        // 绑定邀请码
        const savedInviteCode = localStorage.getItem('invite_code');
        if (savedInviteCode) {
          await fetch('/api/invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'bind_invite',
              invite_code: savedInviteCode,
              invitee_address: data.user.suiAddress
            })
          });
        }
        // 登录后返回原页面
        const redirect = searchParams.get('redirect');
        if (redirect) {
          router.push(redirect);
        } else {
          router.back();
        }
      } else {
        setError('登录失败，请重试');
      }
    } catch (err) {
      setError('登录失败，请重试');
    } finally {
      setDemoLoading(false);
    }
  };

  // OAuth Login - 带邀请码
  const handleOAuthLogin = async (provider: string) => {
    setLoading('connecting');
    setError('');
    try {
      const savedInviteCode = localStorage.getItem('invite_code');
      const inviteParam = savedInviteCode ? `&invite_code=${savedInviteCode}` : '';
      
      // 步骤1完成，开始步骤2
      setLoading('verifying');
      
      const res = await fetch(`/api/zklogin?provider=${provider}${inviteParam}`);
      const data = await res.json();
      
      if (data.url) {
        // 步骤2完成，开始步骤3
        setLoading('redirecting');
        window.location.href = data.url;
      } else {
        setError('OAuth 配置错误，请使用演示登录或钱包登录');
        setLoading(null);
      }
    } catch (err) {
      setError('登录失败，请重试');
      setLoading(null);
    }
  };

  // 钱包登录
  const handleWalletLogin = () => {
    setLoading('connecting');
    setShowWalletModal(true);
  };

  // 钱包连接成功后的处理
  useEffect(() => {
    if (connected && address) {
      // 钱包连接成功，绑定钱包
      handleWalletBind(address);
    }
  }, [connected, address]);

  const handleWalletBind = async (walletAddress: string) => {
    try {
      const res = await fetch('/api/auth/wallet-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress })
      });
      const data = await res.json();
      
      if (data.success || data.user) {
        // 绑定邀请码
        const savedInviteCode = localStorage.getItem('invite_code');
        if (savedInviteCode) {
          await fetch('/api/invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'bind_invite',
              invite_code: savedInviteCode,
              invitee_address: walletAddress
            })
          });
        }
        // 登录后返回原页面
        const redirect = searchParams.get('redirect');
        if (redirect) {
          router.push(redirect);
        } else {
          router.back();
        }
      }
    } catch (err) {
      console.error('Wallet bind error:', err);
    }
  };

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
          <div className="text-center mb-6">
            <img src="/suibox-logo.png" alt="SUIBOX" className="h-20 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">{tt('home.welcome', '开启 Web3 之旅')}</h1>
            <p className="text-gray-400 text-sm mt-2">{tt('home.subtitle', '连接你的数字资产，进入 NFT + DeFi 世界')}</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* 登录进度步骤条 */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gray-900/80 border border-white/10 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">登录进度</span>
                <span className="text-xs text-gray-500">
                  {loading === 'connecting' ? '连接中...' : 
                   loading === 'verifying' ? '验证中...' : 
                   loading === 'redirecting' ? '跳转中...' : '处理中...'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* 步骤1 - 连接 */}
                <div className={`flex-1 h-1.5 rounded-full ${
                  loading === 'connecting' ? 'bg-violet-500 animate-pulse' : 
                  loading === 'verifying' || loading === 'redirecting' ? 'bg-violet-500' : 'bg-gray-700'
                }`} />
                {/* 步骤2 - 验证 */}
                <div className={`flex-1 h-1.5 rounded-full ${
                  loading === 'verifying' ? 'bg-violet-500 animate-pulse' : 
                  loading === 'redirecting' ? 'bg-violet-500' : 'bg-gray-700'
                }`} />
                {/* 步骤3 - 完成 */}
                <div className={`flex-1 h-1.5 rounded-full ${
                  loading === 'redirecting' ? 'bg-violet-500 animate-pulse' : 'bg-gray-700'
                }`} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>连接</span>
                <span>验证</span>
                <span>完成</span>
              </div>
            </motion.div>
          )}

          {/* Login Options */}
          <div className="space-y-3">
            {/* Divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-sm">或</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

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
              onClick={handleWalletLogin}
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
