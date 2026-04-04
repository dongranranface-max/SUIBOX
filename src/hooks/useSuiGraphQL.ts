/**
 * SUI GraphQL React Query Hooks
 * 用于在 React 组件中便捷调用 SUI 数据
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSUIBalance,
  getAllBalances,
  getUserNFTs,
  getUserTransactions,
  getTransaction,
  getUserEvents,
  isValidSuiAddress,
  type NFTObject,
  type TransactionBlock,
  type Event,
  type CoinBalance,
} from '@/lib/sui-graphql';

// ==================== Query Keys ====================

export const queryKeys = {
  balance: (address: string) => ['balance', address] as const,
  balances: (address: string) => ['balances', address] as const,
  nfts: (address: string) => ['nfts', address] as const,
  transactions: (address: string) => ['transactions', address] as const,
  transaction: (digest: string) => ['transaction', digest] as const,
  events: (address: string) => ['events', address] as const,
};

// ==================== Hooks ====================

/**
 * 获取 SUI 余额
 */
export function useSUIBalance(address: string | null) {
  return useQuery({
    queryKey: queryKeys.balance(address || ''),
    queryFn: () => getSUIBalance(address!),
    enabled: !!address && isValidSuiAddress(address),
    staleTime: 1000 * 30, // 30秒后重新获取
    refetchInterval: 1000 * 60, // 每分钟自动刷新
  });
}

/**
 * 获取所有代币余额
 */
export function useAllBalances(address: string | null) {
  return useQuery({
    queryKey: queryKeys.balances(address || ''),
    queryFn: () => getAllBalances(address!),
    enabled: !!address && isValidSuiAddress(address),
    staleTime: 1000 * 30,
  });
}

/**
 * 获取用户 NFT 列表
 */
export function useUserNFTs(address: string | null, limit: number = 50) {
  return useQuery({
    queryKey: queryKeys.nfts(address || ''),
    queryFn: () => getUserNFTs(address!, limit),
    enabled: !!address && isValidSuiAddress(address),
    staleTime: 1000 * 60, // 1分钟
  });
}

/**
 * 获取用户交易历史
 */
export function useUserTransactions(address: string | null, limit: number = 20) {
  return useQuery({
    queryKey: queryKeys.transactions(address || ''),
    queryFn: () => getUserTransactions(address!, limit),
    enabled: !!address && isValidSuiAddress(address),
    staleTime: 1000 * 30,
  });
}

/**
 * 获取单个交易详情
 */
export function useTransaction(digest: string | null) {
  return useQuery({
    queryKey: queryKeys.transaction(digest || ''),
    queryFn: () => getTransaction(digest!),
    enabled: !!digest,
    staleTime: 1000 * 60,
  });
}

/**
 * 获取用户事件
 */
export function useUserEvents(address: string | null, limit: number = 20) {
  return useQuery({
    queryKey: queryKeys.events(address || ''),
    queryFn: () => getUserEvents(address!, limit),
    enabled: !!address && isValidSuiAddress(address),
    staleTime: 1000 * 30,
  });
}

// ==================== 工具 Hooks ====================

/**
 * 刷新钱包数据
 */
export function useRefreshWallet() {
  const queryClient = useQueryClient();
  
  return (address: string) => {
    queryClient.invalidateQueries({ queryKey: ['balance', address] });
    queryClient.invalidateQueries({ queryKey: ['balances', address] });
    queryClient.invalidateQueries({ queryKey: ['nfts', address] });
    queryClient.invalidateQueries({ queryKey: ['transactions', address] });
    queryClient.invalidateQueries({ queryKey: ['events', address] });
  };
}

/**
 * 刷新交易数据
 */
export function useRefreshTransaction() {
  const queryClient = useQueryClient();
  
  return (digest: string) => {
    queryClient.invalidateQueries({ queryKey: ['transaction', digest] });
  };
}
