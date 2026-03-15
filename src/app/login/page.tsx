'use client';

import { useState } from 'react';
import { Wallet, Mail, Phone, Chrome, Apple, Twitter, Github, ArrowRight, CheckCircle, Shield, Zap, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'wallet' | 'social'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 登录处理
  const handleLogin = async () => {
    setIsLoading(true);
    // 模拟登录
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('登录成功！');
    setIsLoading(false);
  };

  // 社交登录 (zkLogin)
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    // 模拟 zkLogin - 使用 SUI 的 zkLogin 流程
    alert(`${provider} 登录 - 使用 SUI zkLogin 技术\n\n特点：\n• 无需私钥\n• 社交账号直接登录\n• 钱包自动创建\n• 链上身份验证`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl mb-4">
            🎁
          </div>
          <h1 className="text-3xl font-bold">SUIBOX</h1>
          <p className="text-gray-400 mt-2">开启你的NFT之旅</p>
        </div>

        {/* 登录方式切换 */}
        <div className="flex bg-gray-900 rounded-xl p-1 mb-6">
          {[
            { key: 'social', label: '社交登录', icon: Zap },
            { key: 'email', label: '邮箱登录', icon: Mail },
            { key: 'wallet', label: '钱包', icon: Wallet },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setLoginMethod(tab.key as typeof loginMethod)}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                loginMethod === tab.key 
                  ? 'bg-violet-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 登录表单 */}
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10">
          
          {/* 社交登录 (zkLogin) */}
          {loginMethod === 'social' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm">
                  <Zap className="w-4 h-4" />
                  SUI zkLogin - 无需私钥
                </div>
              </div>

              <p className="text-center text-gray-400 text-sm mb-4">
                使用社交账号一键登录，无需管理私钥
              </p>

              <button
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-white text-gray-900 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
              >
                <Chrome className="w-5 h-5" />
                Google 账号登录
              </button>

              <button
                onClick={() => handleSocialLogin('Apple')}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-black border border-gray-700 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors"
              >
                <Apple className="w-5 h-5" />
                Apple 账号登录
              </button>

              <button
                onClick={() => handleSocialLogin('Twitter')}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#1DA1F2] rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-[#1a91da] transition-colors"
              >
                <Twitter className="w-5 h-5" />
                Twitter 账号登录
              </button>

              <button
                onClick={() => handleSocialLogin('GitHub')}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#333] rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-[#24292e] transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub 账号登录
              </button>

              {/* zkLogin 说明 */}
              <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-200">
                    <p className="font-bold mb-1">zkLogin 是什么？</p>
                    <p>零知识证明登录，只需社交账号即可创建钱包，无需备份助记词，安全又便捷。</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 邮箱登录 */}
          {loginMethod === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">邮箱地址</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:border-violet-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">密码</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码"
                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 focus:border-violet-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-black/30" />
                  记住我
                </label>
                <Link href="/forgot-password" className="text-violet-400 hover:text-violet-300">
                  忘记密码？
                </Link>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-violet-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Zap className="w-5 h-5 animate-spin" />
                    登录中...
                  </>
                ) : (
                  <>
                    登录
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center text-gray-400 text-sm">
                还没有账号？ 
                <Link href="/register" className="text-violet-400 hover:text-violet-300">
                  立即注册
                </Link>
              </div>
            </div>
          )}

          {/* 钱包登录 */}
          {loginMethod === 'wallet' && (
            <div className="space-y-4">
              <p className="text-center text-gray-400 mb-4">
                连接你的钱包进行登录
              </p>

              <button
                onClick={() => alert('连接 Sui Wallet')}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-medium flex items-center justify-center gap-3 hover:from-violet-500 hover:to-pink-500"
              >
                <Wallet className="w-5 h-5" />
                连接 Sui Wallet
              </button>

              <button
                onClick={() => alert('连接 MetaMask')}
                className="w-full py-4 bg-gray-800 border border-gray-700 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-700"
              >
                <Wallet className="w-5 h-5" />
                连接其他钱包
              </button>

              <div className="text-center text-gray-400 text-sm mt-4">
                <Shield className="w-4 h-4 inline mr-1" />
                钱包登录需要支付少量Gas费
              </div>
            </div>
          )}
        </div>

        {/* 底部说明 */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>登录即表示同意</p>
          <div className="flex justify-center gap-2 mt-1">
            <Link href="/terms" className="text-violet-400 hover:text-violet-300">服务条款</Link>
            <span>和</span>
            <Link href="/privacy" className="text-violet-400 hover:text-violet-300">隐私政策</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
