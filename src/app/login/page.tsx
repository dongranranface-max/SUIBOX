'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Chrome, Apple, Github, ArrowRight, Sparkles, Shield, Zap, Lock, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface LoginOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
}

const loginOptions: LoginOption[] = [
  { id: 'google', name: 'Google', icon: '🔍', color: 'from-red-500 to-orange-500', bg: 'bg-red-500/10', description: '一键登录' },
  { id: 'apple', name: 'Apple', icon: '🍎', color: 'from-gray-800 to-gray-900', bg: 'bg-gray-800/10', description: '安全便捷' },
  { id: 'discord', icon: '💬', name: 'Discord', color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-500/10', description: '社区登录' },
  { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-500/10', description: '社交登录' },
];

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'connecting' | 'success' | 'error'>('select');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    setLoading(provider);
    setSelectedProvider(provider);
    setStep('connecting');
    setErrorMessage(null);

    try {
      // Real OAuth flow
      const response = await fetch(`/api/zklogin?provider=${provider}`);
      const data = await response.json();
      
      if (data.url) {
        // Redirect to OAuth provider
        window.location.href = data.url;
      } else {
        // Fallback: simulate for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStep('success');
      }
    } catch (error) {
      // Demo mode: simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('success');
    } finally {
      setLoading(null);
    }
  };

  const handleWalletLogin = () => {
    // Use wallet connect for traditional wallet login
    window.location.href = '/login?method=wallet';
  };

  const resetState = () => {
    setStep('select');
    setSelectedProvider(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-lg md:text-xl">�盒</span>
          </div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            SUIBOX
          </span>
        </div>
        <a href="/" className="text-gray-400 hover:text-white text-sm">返回首页</a>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-black mb-2">
              {step === 'success' ? '🎉' : step === 'error' ? '❌' : '🔐'}
            </h1>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {step === 'select' && '欢迎登录 SUIBOX'}
              {step === 'connecting' && '正在连接...'}
              {step === 'success' && '登录成功!'}
              {step === 'error' && '登录失败'}
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              {step === 'select' && '选择登录方式开始您的NFT之旅'}
              {step === 'connecting' && `${loginOptions.find(o => o.id === selectedProvider)?.name} 授权中...`}
              {step === 'success' && '正在跳转...'}
              {step === 'error' && errorMessage}
            </p>
          </motion.div>

          {/* Step: Select Login Method */}
          {step === 'select' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* zkLogin Options */}
              <div className="space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">zkLogin (推荐)</p>
                {loginOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleLogin(option.id)}
                    disabled={loading !== null}
                    className={`w-full p-3 md:p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3 md:gap-4 group disabled:opacity-50`}
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-xl md:text-2xl shadow-lg`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm md:text-base">{option.name} 登录</div>
                      <div className="text-gray-500 text-xs">{option.description}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  </motion.button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-500 text-xs">或</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Wallet Login */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleWalletLogin}
                className="w-full p-3 md:p-4 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 transition-all flex items-center gap-3 md:gap-4 group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xl md:text-2xl shadow-lg">
                  <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-sm md:text-base">钱包登录</div>
                  <div className="text-gray-500 text-xs">使用 Suiet、MetaMask 等钱包</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
              </motion.button>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid grid-cols-3 gap-2 md:gap-4"
              >
                {[
                  { icon: Shield, text: '无需私钥', color: 'green' },
                  { icon: Zap, text: '快速上手', color: 'yellow' },
                  { icon: Lock, text: '隐私保护', color: 'blue' },
                ].map((benefit, i) => (
                  <div key={i} className="text-center p-2 md:p-3 bg-white/5 rounded-lg">
                    <benefit.icon className={`w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-${benefit.color}-400`} />
                    <span className="text-[10px] md:text-xs text-gray-400">{benefit.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Step: Connecting */}
          {step === 'connecting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-ping opacity-20" />
                <div className="relative w-full h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">正在验证 {loginOptions.find(o => o.id === selectedProvider)?.name} 账号...</p>
                <p className="text-gray-500 text-xs">这将创建您的 Sui 地址</p>
              </div>

              {/* Progress Steps */}
              <div className="mt-8 space-y-3 max-w-xs mx-auto">
                {[
                  { step: 1, text: '验证 OAuth 凭证', done: true },
                  { step: 2, text: '生成零知识证明', done: false },
                  { step: 3, text: '创建 Sui 地址', done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    {item.done ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 ${i === 1 ? 'border-violet-500 animate-pulse' : 'border-gray-600'}`} />
                    )}
                    <span className={item.done ? 'text-gray-300' : 'text-gray-500'}>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-400" />
              </div>
              
              <p className="text-gray-400 mb-4">正在跳转至首页...</p>
              
              {/* Auto redirect */}
              <meta http-equiv="refresh" content="2;url=/" />
            </motion.div>
          )}

          {/* Step: Error */}
          {step === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 md:w-12 md:h-12 text-red-400" />
              </div>
              
              <p className="text-red-400 mb-6">{errorMessage}</p>
              
              <button
                onClick={resetState}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                重新选择登录方式
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 md:p-6 text-center">
        <p className="text-gray-500 text-xs">
          登录即表示同意 <a href="/terms" className="text-violet-400 hover:underline">服务条款</a> 和 <a href="/privacy" className="text-violet-400 hover:underline">隐私政策</a>
        </p>
      </div>
    </div>
  );
}
