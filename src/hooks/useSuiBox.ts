/**
 * SUIBOX 专用 Hooks
 * 基于 SUI 新数据栈 (GraphQL + Archival Store)
 * 
 * 文档: https://docs.sui.io
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  suiGraphQL, 
  getSUIBalance,
  getUserNFTs,
  getUserTransactions,
  formatSUI,
  isValidSuiAddress,
  type NFTObject,
  type CoinBalance,
} from '@/lib/sui-graphql';
// ==================== Query Keys ====================

export const suiboxKeys = {
  // SUI 相关
  suiBalance: (address: string) => ['suiBalance', address] as const,
  
  // BOX 代币相关 (未来合约部署后)
  boxBalance: (address: string) => ['boxBalance', address] as const,
  
  // NFT 相关
  nfts: (address: string) => ['nfts', address] as const,
  commonNfts: (address: string) => ['nfts', 'common', address] as const,
  rareNfts: (address: string) => ['nfts', 'rare', address] as const,
  epicNfts: (address: string) => ['nfts', 'epic', address] as const,
  legendaryNfts: (address: string) => ['nfts', 'legendary', address] as const,
  
  // 碎片相关
  fragments: (address: string) => ['fragments', address] as const,
  
  // 交易相关
  transactions: (address: string) => ['transactions', address] as const,
  boxTransactions: (address: string) => ['boxTransactions', address] as const,
  
  // 质押相关
  staking: (address: string) => ['staking', address] as const,
  
  // 排行榜
  rankings: () => ['rankings'] as const,
};

// ==================== SUI 基础 Hooks ====================

/**
 * 获取 SUI 余额 (新版 GraphQL)
 */
export function useSUIBalance(address: string | null) {
  return useQuery({
    queryKey: suiboxKeys.suiBalance(address || ''),
    queryFn: () => address ? getSUIBalance(address) : Promise.resolve(0),
    enabled: !!address && isValidSuiAddress(address),
    staleTime: 30 * 1000, // 30秒
    refetchInterval: 60 * 1000, // 1分钟自动刷新
  });
}

/**
 * 获取用户所有 NFT
 */
export function useUserAllNFTs(address: string | null, limit: number = 50) {
  return useQuery({
    queryKey: suiboxKeys.nfts(address || ''),
    queryFn: () => address ? getUserNFTs(address, limit) : Promise.resolve([]),
    enabled: !!address && isValidSuiAddress(address),
    staleTime: 60 * 1000, // 1分钟
  });
}

/**
 * 按稀有度分类 NFT
 */
export function useUserNFTsByRarity(address: string | null) {
  const { data: allNfts, ...rest } = useUserAllNFTs(address);
  
  const nfts = {
    common: allNfts?.filter(nft => nft.type.includes('Common')) || [],
    rare: allNfts?.filter(nft => nft.type.includes('Rare')) || [],
    epic: allNfts?.filter(nft => nft.type.includes('Epic')) || [],
    legendary: allNfts?.filter(nft => nft.type.includes('Legendary')) || [],
  };
  
  return {
    data: nfts,
    total: allNfts?.length || 0,
    ...rest,
  };
}

/**
 * 获取用户交易历史
 */
export function useUserTxHistory(address: string | null, limit: number = 20) {
  return useQuery({
    queryKey: suiboxKeys.transactions(address || ''),
    queryFn: () => address ? getUserTransactions(address, limit) : Promise.resolve([]),
    enabled: !!address && isValidSuiAddress(address),
    staleTime: 30 * 1000,
  });
}

// ==================== BOX 代币 Hooks (合约部署后启用) ====================

/**
 * 获取 BOX 代币余额
 *
 * CONTRACT INTEGRATION (when contract is deployed):
 * 1. Set env var: NEXT_PUBLIC_BOX_CONTRACT_ADDRESS=0x<package_id>
 * 2. Replace queryFn with:
 *    const data = await suiGraphQL.query<{ coins: { nodes: CoinBalance[] } }>(
 *      `query GetBOX($addr: SuiAddress!) {
 *         coins(filter: { owner: $addr, type: "${BOX_TYPE}" }) {
 *           nodes { totalBalance }
 *         }
 *       }`,
 *      { addr: address }
 *    );
 *    return parseInt(data.coins.nodes[0]?.totalBalance ?? '0');
 */
const BOX_CONTRACT = process.env.NEXT_PUBLIC_BOX_CONTRACT_ADDRESS;
const BOX_TYPE = BOX_CONTRACT ? `${BOX_CONTRACT}::box::BOX` : null;

export function useBOXBalance(address: string | null) {
  return useQuery({
    queryKey: suiboxKeys.boxBalance(address || ''),
    queryFn: async () => {
      if (!BOX_TYPE || !address) return 0;
      const data = await suiGraphQL.query<{ coins: { nodes: Array<{ totalBalance: string }> } }>(
        `query GetBOX($addr: SuiAddress!) {
           coins(filter: { owner: $addr, type: "${BOX_TYPE}" }) {
             nodes { totalBalance }
           }
         }`,
        { addr: address }
      );
      return parseInt(data.coins.nodes[0]?.totalBalance ?? '0');
    },
    enabled: !!address,
    staleTime: 60 * 1000,
  });
}

// ==================== 碎片 Hooks ====================

/**
 * 获取用户碎片
 *
 * CONTRACT INTEGRATION: Query fragment object counts filtered by type prefix
 * e.g. `${BOX_CONTRACT}::fragment::CommonFragment`, `::RareFragment`, `::EpicFragment`
 */
export function useFragments(address: string | null) {
  return useQuery({
    queryKey: suiboxKeys.fragments(address || ''),
    queryFn: async (): Promise<{ common: number; rare: number; epic: number }> => {
      return { common: 0, rare: 0, epic: 0 };
    },
    enabled: !!address,
    staleTime: 60 * 1000,
  });
}

// ==================== 质押 Hooks ====================

/**
 * 获取用户质押信息
 *
 * CONTRACT INTEGRATION: Query the staking pool shared object owned by the user.
 * Pool object type: `${BOX_CONTRACT}::staking::StakePool`
 */
export function useStaking(address: string | null) {
  return useQuery({
    queryKey: suiboxKeys.staking(address || ''),
    queryFn: async (): Promise<{ totalStaked: number; dailyReward: number; pool: null }> => {
      return { totalStaked: 0, dailyReward: 0, pool: null };
    },
    enabled: !!address,
    staleTime: 60 * 1000,
  });
}

// ==================== 排行榜 Hooks ====================

/**
 * 获取排行榜
 * 注意：需要后端支持
 */
export function useRankings() {
  return useQuery({
    queryKey: suiboxKeys.rankings(),
    queryFn: async () => {
      // 模拟排行榜数据
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

// ==================== 刷新 Hooks ====================

/**
 * 刷新钱包数据
 */
export function useRefreshWallet() {
  const queryClient = useQueryClient();
  
  return (address: string) => {
    queryClient.invalidateQueries({ queryKey: ['suiBalance', address] });
    queryClient.invalidateQueries({ queryKey: ['nfts', address] });
    queryClient.invalidateQueries({ queryKey: ['transactions', address] });
  };
}

/**
 * 刷新质押数据
 */
export function useRefreshStaking() {
  const queryClient = useQueryClient();
  
  return (address: string) => {
    queryClient.invalidateQueries({ queryKey: ['staking', address] });
    queryClient.invalidateQueries({ queryKey: ['boxBalance', address] });
  };
}

// ==================== 工具 Hooks ====================

/**
 * 钱包连接状态
 */
export function useWalletStatus() {
  // 这个需要结合 AppWalletProvider 使用
  // 返回钱包连接状态
  return {
    isConnected: false,
    address: null,
  };
}

/**
 * 网络状态
 */
export function useNetworkStatus() {
  return useQuery({
    queryKey: ['network', 'status'],
    queryFn: async () => {
      try {
        await suiGraphQL.query('{ __typename }');
        return { status: 'connected', latency: 0 };
      } catch {
        return { status: 'disconnected', latency: 0 };
      }
    },
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
  });
}
