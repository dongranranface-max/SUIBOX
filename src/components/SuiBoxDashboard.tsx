'use client';

/**
 * SUIBOX Dashboard - 使用 SUI 新数据栈
 * 
 * 展示如何获取并展示用户钱包数据
 */

import React, { useState } from 'react';
import { 
  useSUIBalance, 
  useUserAllNFTs, 
  useUserTxHistory,
  useNetworkStatus,
  useRefreshWallet,
  useFragments,
  useStaking,
} from '@/hooks/useSuiBox';
import { formatSUI } from '@/lib/sui-graphql';

interface SuiBoxDashboardProps {
  address: string;
}

/**
 * 主 Dashboard 组件
 */
export default function SuiBoxDashboard({ address }: SuiBoxDashboardProps) {
  const { data: balance, isLoading: balanceLoading } = useSUIBalance(address);
  const { data: nfts, total: nftCount, isLoading: nftsLoading } = useUserAllNFTs(address);
  const { data: transactions, isLoading: txLoading } = useUserTxHistory(address, 10);
  const { data: networkStatus } = useNetworkStatus();
  const refresh = useRefreshWallet();
  
  // 模拟数据
  const boxBalance = 0; // 合约部署后替换
  const fragments = { common: 3, rare: 1, epic: 0 };
  const staking = { totalStaked: 0, dailyReward: 0 };

  if (!address) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg">
        <p className="text-gray-400">请先连接钱包</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-950 text-white">
      {/* 头部信息 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SUIBOX</h1>
          <p className="text-sm text-gray-400 font-mono truncate max-w-[200px]">
            {address}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            networkStatus?.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-400">
            {networkStatus?.status === 'connected' ? '已连接' : '离线'}
          </span>
          <button 
            onClick={() => refresh(address)}
            className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            刷新
          </button>
        </div>
      </div>

      {/* 余额卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BalanceCard 
          label="SUI 余额"
          value={balanceLoading ? '...' : formatSUI(balance || 0)}
          suffix="SUI"
          color="blue"
        />
        <BalanceCard 
          label="BOX 代币"
          value={boxBalance.toLocaleString()}
          suffix="BOX"
          color="purple"
        />
        <BalanceCard 
          label="NFT 数量"
          value={nftCount.toString()}
          suffix="个"
          color="green"
        />
        <BalanceCard 
          label="质押收益"
          value={staking.dailyReward.toFixed(2)}
          suffix="BOX/天"
          color="orange"
        />
      </div>

      {/* 碎片展示 */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">我的碎片</h2>
        <div className="grid grid-cols-3 gap-4">
          <FragmentCard type="普通" count={fragments.common} color="gray" />
          <FragmentCard type="稀有" count={fragments.rare} color="blue" />
          <FragmentCard type="史诗" count={fragments.epic} color="purple" />
        </div>
      </div>

      {/* NFT 展示 */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">我的 NFT</h2>
        {nftsLoading ? (
          <div className="text-gray-400">加载中...</div>
        ) : nfts?.length === 0 ? (
          <div className="text-gray-400">暂无 NFT，去开盲盒获取！</div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {nfts?.slice(0, 12).map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </div>

      {/* 交易历史 */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">最近交易</h2>
        {txLoading ? (
          <div className="text-gray-400">加载中...</div>
        ) : transactions?.length === 0 ? (
          <div className="text-gray-400">暂无交易记录</div>
        ) : (
          <div className="space-y-2">
            {transactions?.slice(0, 5).map((tx) => (
              <TransactionItem key={tx.digest} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 余额卡片
 */
function BalanceCard({ 
  label, 
  value, 
  suffix, 
  color 
}: { 
  label: string; 
  value: string; 
  suffix: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    purple: 'from-purple-600 to-purple-700',
    green: 'from-green-600 to-green-700',
    orange: 'from-orange-600 to-orange-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-4`}>
      <p className="text-sm text-white/70">{label}</p>
      <p className="text-2xl font-bold mt-1">
        {value}
        <span className="text-sm ml-1">{suffix}</span>
      </p>
    </div>
  );
}

/**
 * 碎片卡片
 */
function FragmentCard({ 
  type, 
  count, 
  color 
}: { 
  type: string; 
  count: number; 
  color: 'gray' | 'blue' | 'purple';
}) {
  const colorClasses = {
    gray: 'bg-gray-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
  };

  const icons = {
    gray: '🔩',
    blue: '💎',
    purple: '🔮',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-3 text-center`}>
      <p className="text-2xl mb-1">{icons[color]}</p>
      <p className="text-sm text-white/70">{type}</p>
      <p className="text-xl font-bold">{count}</p>
    </div>
  );
}

/**
 * NFT 卡片
 */
function NFTCard({ nft }: { nft: any }) {
  return (
    <div className="bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition-colors">
      <div className="aspect-square bg-gray-700 rounded mb-2 flex items-center justify-center text-2xl">
        🎁
      </div>
      <p className="text-xs truncate">
        {nft.display?.data?.name || nft.id.slice(0, 8)}
      </p>
    </div>
  );
}

/**
 * 交易项
 */
function TransactionItem({ transaction }: { transaction: any }) {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
      <div>
        <p className="font-mono text-sm truncate max-w-[150px]">
          {transaction.digest.slice(0, 10)}...
        </p>
        {transaction.timestamp && (
          <p className="text-xs text-gray-500">
            {new Date(transaction.timestamp).toLocaleString()}
          </p>
        )}
      </div>
      <span className={`text-sm ${
        transaction.effects?.status?.status === 'success' 
          ? 'text-green-400' 
          : 'text-red-400'
      }`}>
        {transaction.effects?.status?.status === 'success' ? '成功' : '失败'}
      </span>
    </div>
  );
}
