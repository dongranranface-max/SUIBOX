'use client';

import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useWallet, shortenAddress } from '@/hooks/useWallet';
import { useCurrentClient, useCurrentAccount } from '@mysten/dapp-kit-react';
import { ConnectButton } from '@mysten/dapp-kit-react/ui';
import { useQuery } from '@tanstack/react-query';

// 合约配置
const CONTRACT = {
  packageId: '0x08954fe5f4ef82cbe7d1bf8c557b09287f33e1a51f7f5d4f7c59e11f4ac59b34',
  module: 'box',
};

export default function WalletTestPage() {
  const wallet = useWallet();
  const client = useCurrentClient();
  const account = useCurrentAccount();
  
  // 查询余额
  const { data: balanceData } = useQuery({
    queryKey: ['balance', account?.address],
    enabled: !!account?.address,
    queryFn: async () => {
      if (!account?.address) return 0;
      const res = await client.getBalance({ owner: account.address });
      return Number(res.totalBalance) / 1e9;
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState<string>('');

  const balance = balanceData?.toFixed(4) || '0';

  // 调用合约 - 暂时跳过
  const testCallContract = async () => {
    if (!account?.address) {
      alert('请先连接钱包！');
      return;
    }

    setLoading(true);
    setTxResult('合约调用功能开发中...');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          🔗 SUI 钱包连接测试
        </h1>

        {/* 钱包检测 */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">钱包检测</h2>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">检测到钱包:</span>
            <span className={wallet.isInstalled ? 'text-green-400' : 'text-red-400'}>
              {wallet.isInstalled ? `✅ ${wallet.wallets.length} 个` : '❌ 未检测到'}
            </span>
          </div>
          
          {wallet.wallets.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              可用钱包: {wallet.wallets.map(w => w.name).join(', ')}
            </div>
          )}
        </div>

        {/* 状态 */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">连接状态</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">状态:</span>
              <span className={wallet.connected ? 'text-green-400' : 'text-gray-500'}>
                {wallet.connected ? '✅ 已连接' : '❌ 未连接'}
              </span>
            </div>

            {account?.address && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">地址:</span>
                  <span className="text-white font-mono">
                    {shortenAddress(account.address)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">余额:</span>
                  <span className="text-yellow-400 font-bold">{balance} SUI</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <ConnectButton />
          </div>
        </div>

        {/* 合约测试 */}
        {wallet.connected && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">合约调用</h2>
            
            <button
              onClick={testCallContract}
              disabled={loading}
              className="w-full py-3 bg-green-600 rounded-lg font-bold hover:bg-green-500 disabled:opacity-50"
            >
              {loading ? '⏳ 处理中...' : '🎁 测试开盲盒'}
            </button>

            {txResult && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg whitespace-pre-wrap">
                {txResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
