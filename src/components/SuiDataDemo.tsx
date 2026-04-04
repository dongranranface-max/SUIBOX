'use client';

/**
 * SUI GraphQL 数据服务使用示例
 * 
 * 演示如何在组件中使用新的数据服务
 */

import React from 'react';
import { 
  useSUIBalance, 
  useUserNFTs, 
  useUserTransactions,
  useRefreshWallet 
} from '@/hooks';
import { formatSUI, formatNumber } from '@/lib/sui-graphql';

interface WalletDashboardProps {
  address: string;
}

/**
 * 钱包仪表盘示例
 */
export function WalletDashboard({ address }: WalletDashboardProps) {
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useSUIBalance(address);
  const { data: nfts, isLoading: nftsLoading } = useUserNFTs(address, 10);
  const { data: transactions, isLoading: txLoading } = useUserTransactions(address, 5);
  const refresh = useRefreshWallet();

  if (balanceLoading) return <div>加载中...</div>;
  if (balanceError) return <div>错误: {balanceError.message}</div>;

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      {/* 余额展示 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">SUI 余额</h2>
        <div className="text-3xl font-bold text-green-400">
          {formatSUI(balance || 0)} SUI
        </div>
        <button 
          onClick={() => refresh(address)}
          className="mt-2 px-3 py-1 bg-blue-600 rounded text-sm"
        >
          刷新
        </button>
      </div>

      {/* NFT 列表 */}
      <div className="mb-6">
        <h3 className="text-md font-bold mb-2">我的 NFT ({nfts?.length || 0})</h3>
        {nftsLoading ? (
          <div>加载中...</div>
        ) : nfts?.length === 0 ? (
          <div className="text-gray-500">暂无 NFT</div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {nfts?.slice(0, 6).map((nft) => (
              <div key={nft.id} className="p-2 bg-gray-800 rounded">
                <div className="text-sm font-medium truncate">
                  {nft.display?.data?.name || nft.id.slice(0, 8)}
                </div>
                <div className="text-xs text-gray-500">
                  {nft.display?.data?.description?.slice(0, 20)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 交易历史 */}
      <div>
        <h3 className="text-md font-bold mb-2">最近交易</h3>
        {txLoading ? (
          <div>加载中...</div>
        ) : transactions?.length === 0 ? (
          <div className="text-gray-500">暂无交易记录</div>
        ) : (
          <div className="space-y-2">
            {transactions?.slice(0, 5).map((tx) => (
              <div 
                key={tx.digest} 
                className="p-2 bg-gray-800 rounded text-sm"
              >
                <div className="flex justify-between">
                  <span className="font-mono truncate">
                    {tx.digest.slice(0, 10)}...
                  </span>
                  <span className={
                    tx.effects?.status?.status === 'success' 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }>
                    {tx.effects?.status?.status}
                  </span>
                </div>
                {tx.timestamp && (
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 实时价格展示示例
 */
export function SUIPriceTicker() {
  // 这个需要在组件中实际获取价格数据
  // 可以接入 CoinGecko 或其他价格 API
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400">SUI:</span>
      <span className="font-bold">$1.50</span>
      <span className="text-green-400 text-sm">+2.5%</span>
    </div>
  );
}

/**
 * 网络状态指示器
 */
export function NetworkStatus() {
  // 这个需要接入 Context 获取
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-sm">Mainnet</span>
    </div>
  );
}
