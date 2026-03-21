'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight, Shield, Zap, Lock, Loader2, Sparkles, Play, Mail } from 'lucide-react';
import { useWallet, ConnectModal } from '@suiet/wallet-kit';
import { useI18n } from '@/lib/i18n';

// Login 页面内容组件
function LoginContent() {
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

          {/* 登录进度步骤条 - 详细 */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-5 bg-gray-900/90 border border-white/10 rounded-2xl"
            >
              {/* 当前状态 */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">登录步骤</span>
                <span className="text-xs text-violet-400">
                  {loading === 'connecting' && '步骤 1/3'}
                  {loading === 'verifying' && '步骤 2/3'}
                  {loading === 'redirecting' && '步骤 3/3'}
                </span>
              </div>

              {/* 详细步骤列表 */}
              <div className="space-y-3">
                {/* 步骤1 */}
                <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  loading === 'connecting' ? 'bg-violet-500/20 border border-violet-500/30' :
                  loading === 'verifying' || loading === 'redirecting' ? 'bg-green-500/10' : 'bg-gray-800/50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    loading === 'connecting' ? 'bg-violet-500 text-white animate-pulse' :
                    loading === 'verifying' || loading === 'redirecting' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {loading === 'connecting' ? '1' : '✓'}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      loading === 'connecting' ? 'text-violet-400' :
                      loading === 'verifying' || loading === 'redirecting' ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {loading === 'connecting' ? '正在连接...' : '连接成功'}
                    </div>
                    <div className="text-xs text-gray-500">验证用户身份</div>
                  </div>
                </div>

                {/* 步骤2 */}
                <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  loading === 'verifying' ? 'bg-violet-500/20 border border-violet-500/30' :
                  loading === 'redirecting' ? 'bg-green-500/10' : 'bg-gray-800/50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    loading === 'verifying' ? 'bg-violet-500 text-white animate-pulse' :
                    loading === 'redirecting' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {loading === 'verifying' ? '2' : loading === 'redirecting' ? '✓' : '2'}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      loading === 'verifying' ? 'text-violet-400' :
                      loading === 'redirecting' ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {loading === 'verifying' ? '验证中...' : loading === 'redirecting' ? '验证通过' : '等待验证'}
                    </div>
                    <div className="text-xs text-gray-500">获取账户信息</div>
                  </div>
                </div>

                {/* 步骤3 */}
                <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  loading === 'redirecting' ? 'bg-violet-500/20 border border-violet-500/30' : 'bg-gray-800/50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    loading === 'redirecting' ? 'bg-violet-500 text-white animate-pulse' : 'bg-gray-700 text-gray-400'
                  }`}>
                    3
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      loading === 'redirecting' ? 'text-violet-400' : 'text-gray-500'
                    }`}>
                      {loading === 'redirecting' ? '正在跳转...' : '等待完成'}
                    </div>
                    <div className="text-xs text-gray-500">进入首页</div>
                  </div>
                </div>
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
              {loading && loading !== 'connecting' ? (
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
              {loading && loading !== 'connecting' ? (
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
              disabled={loading !== null}
              className="w-full p-4 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-600/20 to-pink-600/20 hover:from-violet-600/30 hover:to-pink-600/30 transition-all flex items-center gap-4 disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                {loading === 'connecting' ? (
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                ) : (
                  <img src="/sui-logo.png" alt="SUI" className="w-8 h-8" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold">{loading === 'connecting' ? '连接中...' : '连接钱包'}</div>
                <div className="text-gray-400 text-sm">使用 Sui 钱包</div>
              </div>
              {loading === 'connecting' ? (
                <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
              ) : (
                <ArrowRight className="w-5 h-5 text-gray-400" />
              )}
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

// 导出带 Suspense 的登录页面
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
