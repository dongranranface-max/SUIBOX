'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Wallet, Link2, Unlink, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ZkLoginUser {
  provider: string;
  oauthId: string;
  email: string;
  name: string;
  picture: string;
  suiAddress: string;
  boundWallet?: string;
  createdAt: string;
}

interface BindWalletModalProps {
  user: ZkLoginUser;
  onClose: () => void;
  onBindSuccess: (walletAddress: string) => void;
}

export default function BindWalletModal({ user, onClose, onBindSuccess }: BindWalletModalProps) {
  const { address, connected, connect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBind = async () => {
    if (!address) {
      setError('请先连接钱包');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/bind-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zkloginAddress: user.suiAddress,
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onBindSuccess(address);
      } else {
        setError(data.error || '绑定失败');
      }
    } catch (err) {
      setError('绑定失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Link2 className="w-5 h-5 text-violet-500" />
            绑定钱包
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current zkLogin Address */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">当前 zkLogin 地址</label>
            <div className="p-3 bg-white/5 rounded-xl font-mono text-sm">
              {user.suiAddress.slice(0, 10)}...{user.suiAddress.slice(-8)}
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">选择要绑定的钱包</label>
            {connected && address ? (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">已连接钱包</div>
                    <div className="text-sm text-gray-400 font-mono">
                      {address.slice(0, 10)}...{address.slice(-8)}
                    </div>
                  </div>
                </div>
                <Check className="w-5 h-5 text-green-400" />
              </div>
            ) : (
              <button
                onClick={() => connect()}
                className="w-full p-4 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center gap-2 hover:bg-violet-600/30 transition-colors"
              >
                <Wallet className="w-5 h-5" />
                连接钱包
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
            绑定钱包后，您可以使用钱包进行交易，同时保留 zkLogin 登录方式。
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleBind}
            disabled={!connected || loading}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                绑定中...
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                确认绑定
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
