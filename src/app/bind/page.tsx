'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, Check, Users, Gift, Wallet, Link2, Unlink, ArrowRight, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function BindWalletPage() {
  const router = useRouter();
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [primaryWallet, setPrimaryWallet] = useState('');
  const [copied, setCopied] = useState(false);
  const [binding, setBinding] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteStats, setInviteStats] = useState({ total: 0, accepted: 0 });
  const [showUnbindConfirm, setShowUnbindConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [sessionRes, walletsRes, statsRes] = await Promise.all([
        fetch('/api/auth/session'),
        fetch('/api/user/wallets'),
        fetch('/api/invite/stats')
      ]);
      
      const sessionData = await sessionRes.json();
      if (!sessionData.user) {
        router.push('/login');
        return;
      }
      
      setUser(sessionData.user);
      
      const walletsData = await walletsRes.json();
      setWallets(walletsData.wallets || []);
      setPrimaryWallet(sessionData.user.wallet_address || '');
      
      const statsData = await statsRes.json();
      setInviteStats(statsData.stats || { total: 0, accepted: 0 });
      
      // 生成本人邀请码
      generateInviteCode(sessionData.user.wallet_address);
    } catch (error) {
      console.error('Fetch user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = async (address: string) => {
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create_invite', 
          inviter_address: address 
        })
      });
      const data = await res.json();
      if (data.success) {
        setInviteCode(data.data.invite_code);
      }
    } catch (error) {
      console.error('Generate invite code error:', error);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/login?invite=${inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setPrimary = async (address: string) => {
    setPrimaryWallet(address);
    // TODO: 调用 API 更新主钱包
  };

  const unbindWallet = async (address: string) => {
    setBinding(true);
    try {
      const res = await fetch('/api/user/wallets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      const data = await res.json();
      if (data.success) {
        setWallets(wallets.filter(w => w.address !== address));
        setShowUnbindConfirm(null);
      }
    } catch (error) {
      console.error('Unbind error:', error);
    } finally {
      setBinding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">账户管理</h1>
          <p className="text-gray-400">管理你的钱包绑定和邀请关系</p>
        </div>

        {/* 邀请好友 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-600/20 to-cyan-600/20 rounded-2xl p-6 mb-6 border border-violet-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-600/30 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="font-bold">邀请好友</h2>
              <p className="text-sm text-gray-400">邀请好友加入，获得奖励</p>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">邀请码</span>
              <span className="text-violet-400 font-mono">{inviteCode || '生成中...'}</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                readOnly
                value={inviteCode ? `${window.location.origin}/login?invite=${inviteCode}` : ''}
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300"
              />
              <button 
                onClick={copyInviteLink}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copied ? '已复制' : '复制'}</span>
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 text-center">
            <div className="flex-1 bg-black/30 rounded-xl p-3">
              <div className="text-2xl font-bold text-violet-400">{inviteStats.total}</div>
              <div className="text-xs text-gray-400">邀请总数</div>
            </div>
            <div className="flex-1 bg-black/30 rounded-xl p-3">
              <div className="text-2xl font-bold text-cyan-400">{inviteStats.accepted}</div>
              <div className="text-xs text-gray-400">已完成</div>
            </div>
            <div className="flex-1 bg-black/30 rounded-xl p-3">
              <div className="text-2xl font-bold text-amber-400">{inviteStats.accepted * 10}</div>
              <div className="text-xs text-gray-400">奖励 SBOX</div>
            </div>
          </div>
        </motion.div>

        {/* 钱包绑定 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold">钱包绑定</h2>
            </div>
            <button 
              onClick={() => router.push('/login?bind=true')}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm flex items-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              绑定新钱包
            </button>
          </div>
          
          {wallets.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无绑定钱包</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div 
                  key={wallet.address}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    primaryWallet === wallet.address 
                      ? 'bg-cyan-600/10 border-cyan-500/30' 
                      : 'bg-black/20 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      primaryWallet === wallet.address ? 'bg-cyan-400' : 'bg-gray-500'
                    }`} />
                    <div>
                      <div className="font-mono text-sm">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {wallet.provider || '钱包'}
                        {primaryWallet === wallet.address && (
                          <span className="text-cyan-400 ml-2">✓ 主钱包</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {primaryWallet !== wallet.address && (
                      <>
                        <button 
                          onClick={() => setPrimary(wallet.address)}
                          className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg"
                        >
                          设为主钱包
                        </button>
                        <button 
                          onClick={() => setShowUnbindConfirm(wallet.address)}
                          className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg"
                        >
                          解绑
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 解绑确认弹窗 */}
        {showUnbindConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-white/10"
            >
              <h3 className="text-xl font-bold mb-4">确认解绑</h3>
              <p className="text-gray-400 mb-6">
                确定要解绑钱包 <span className="font-mono text-red-400">{showUnbindConfirm.slice(0, 6)}...{showUnbindConfirm.slice(-4)}</span> 吗？
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowUnbindConfirm(null)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl"
                >
                  取消
                </button>
                <button 
                  onClick={() => unbindWallet(showUnbindConfirm)}
                  disabled={binding}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl flex items-center justify-center gap-2"
                >
                  {binding ? <Loader2 className="w-4 h-4 animate-spin" /> : '确认解绑'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
