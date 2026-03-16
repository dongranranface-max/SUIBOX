'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useWallet, shortenAddress } from '@/hooks/useWallet';
import { ConnectButton } from '@mysten/dapp-kit';
import { useSuiClient } from '@mysten/dapp-kit';
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';

// 合约配置
const CONTRACT = {
  packageId: '0x08954fe5f4ef82cbe7d1bf8c557b09287f33e1a51f7f5d4f7c59e11f4ac59b34',
  module: 'box',
};

export default function WalletTestPage() {
  const wallet = useWallet();
  const client = useSuiClient();  // 自动使用 WalletProvider 配置的网络
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();
  
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState<string>('');

  // 查询余额
  const fetchBalance = async (address: string) => {
    try {
      const bal = await client.getBalance({
        owner: address,
      });
      // 1 SUI = 1e9 MIST
      const suiBalance = Number(bal.totalBalance) / 1e9;
      setBalance(suiBalance.toFixed(4));
    } catch (e) {
      console.error('查询余额失败:', e);
    }
  };

  // 当钱包连接时获取余额
  useEffect(() => {
    if (wallet.address) {
      fetchBalance(wallet.address);
    }
  }, [wallet.address, client]);

  // 调用合约
  const testCallContract = async () => {
    if (!wallet.address) {
      alert('请先连接钱包！');
      return;
    }

    setLoading(true);
    try {
      // 1. 构建交易
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${CONTRACT.packageId}::${CONTRACT.module}::open_common_box`,
        arguments: [tx.object('0x8')], // Clock 对象
      });

      // 2. 签名并发送（使用官方推荐的 hook）
      const result = await signAndExecute({
        transactionBlock: tx,
      });

      setTxResult(`✅ 成功！\n交易哈希: ${result.digest}`);
      
    } catch (e: unknown) {
      console.error('调用合约失败:', e);
      setTxResult(`❌ 错误: ${e instanceof Error ? e.message : '未知错误'}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          🔗 SUI 钱包连接测试
        </h1>

        {/* 钱包状态 */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">钱包状态</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">连接状态:</span>
              <span className={wallet.connected ? 'text-green-400' : 'text-gray-500'}>
                {wallet.connected ? '✅ 已连接' : '❌ 未连接'}
              </span>
            </div>

            {wallet.address && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">钱包地址:</span>
                  <span className="text-white font-mono">
                    {shortenAddress(wallet.address)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SUI 余额:</span>
                  <span className="text-yellow-400 font-bold">{balance} SUI</span>
                </div>
              </>
            )}
          </div>

          {/* 连接按钮 */}
          <div className="mt-6">
            <ConnectButton />
          </div>
        </div>

        {/* 合约调用测试 */}
        {wallet.connected && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">合约调用测试</h2>
            
            <p className="text-gray-400 mb-4">
              合约: {CONTRACT.packageId.slice(0, 20)}...
            </p>

            <button
              onClick={testCallContract}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-bold hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50"
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
