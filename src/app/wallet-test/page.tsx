'use client';

import { useState, useEffect } from 'react';
import { 
  SuiClient, 
  getFullnodeUrl 
} from '@mysten/sui.js/client';
import { 
  TransactionBlock 
} from '@mysten/sui.js/transactions';
import { 
  useWallet 
} from '@mysten/dapp-kit';

// 初始化 SUI 客户端
const client = new SuiClient({
  url: getFullnodeUrl('devnet'),
});

// 合约配置
const CONTRACT = {
  packageId: '0x08954fe5f4ef82cbe7d1bf8c557b09287f33e1a51f7f5d4f7c59e11f4ac59b34',
  module: 'box',
};

export default function WalletTestPage() {
  const wallet = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState<string>('');

  // 查询余额
  const fetchBalance = async (address: string) => {
    try {
      const bal = await client.getBalance({
        owner: address,
      });
      // SUI 最小单位是 9 位小数
      const suiBalance = Number(bal.totalBalance) / 1e9;
      setBalance(suiBalance.toFixed(4));
    } catch (e) {
      console.error('查询余额失败:', e);
    }
  };

  // 当钱包连接时获取余额
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      fetchBalance(wallet.address);
    }
  }, [wallet.connected, wallet.address]);

  // 测试调用合约（模拟开盲盒）
  const testCallContract = async () => {
    if (!wallet.connected || !wallet.address) {
      alert('请先连接钱包！');
      return;
    }

    setLoading(true);
    try {
      // 构建交易
      const tx = new TransactionBlock();
      
      // 调用合约的 open_common_box 函数
      tx.moveCall({
        target: `${CONTRACT.packageId}::${CONTRACT.module}::open_common_box`,
        arguments: [
          tx.pure('0x8'), // clock 对象
        ],
      });

      // 注意：这里需要用户签名，暂时只展示交易构建
      setTxResult('交易已构建，待签名发送');
      
      // 完整签名发送需要：
      // const result = await wallet.signAndExecuteTransactionBlock({
      //   transactionBlock: tx,
      // });
      // setTxResult(`交易哈希: ${result.digest}`);
      
    } catch (e: unknown) {
      console.error('调用合约失败:', e);
      setTxResult(`错误: ${e instanceof Error ? e.message : '未知错误'}`);
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
            <div className="flex justify-between">
              <span className="text-gray-400">连接状态:</span>
              <span className={wallet.connected ? 'text-green-400' : 'text-gray-500'}>
                {wallet.connected ? '✅ 已连接' : '❌ 未连接'}
              </span>
            </div>

            {wallet.connected && wallet.address && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">钱包地址:</span>
                  <span className="text-white font-mono">
                    {wallet.address.slice(0, 10)}...{wallet.address.slice(-4)}
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
          {!wallet.connected ? (
            <button
              onClick={() => wallet.connect()}
              className="w-full mt-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg font-bold hover:from-violet-500 hover:to-pink-500 transition-all"
            >
              🔗 连接钱包
            </button>
          ) : (
            <button
              onClick={() => wallet.disconnect()}
              className="w-full mt-6 py-3 bg-gray-700 rounded-lg font-bold hover:bg-gray-600 transition-all"
            >
              🚪 断开连接
            </button>
          )}
        </div>

        {/* 合约调用测试 */}
        {wallet.connected && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">合约调用测试</h2>
            
            <p className="text-gray-400 mb-4">
              合约地址: {CONTRACT.packageId.slice(0, 20)}...
            </p>

            <button
              onClick={testCallContract}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-bold hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50"
            >
              {loading ? '⏳ 处理中...' : '🎁 测试开盲盒'}
            </button>

            {txResult && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">结果: </span>
                <span className="text-white">{txResult}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
