import { useQuery } from '@tanstack/react-query';
import { SuiClient, mainnetConnection, devnetConnection } from '@mysten/sui';

// 创建SUI客户端
const createSuiClient = (network: 'mainnet' | 'devnet' = 'devnet') => {
  return new SuiClient({
    connection: network === 'mainnet' ? mainnetConnection : devnetConnection,
  });
};

// 获取余额
export function useSuiBalance(address: string, network: 'mainnet' | 'devnet' = 'devnet') {
  const client = createSuiClient(network);
  
  return useQuery({
    queryKey: ['sui-balance', address, network],
    queryFn: async () => {
      if (!address) return null;
      const balance = await client.getBalance({ owner: address });
      return {
        total: balance.totalBalance,
        formatted: (parseInt(balance.totalBalance) / 1e9).toFixed(4), // 转换为SUI
      };
    },
    enabled: !!address,
    staleTime: 30 * 1000, // 30秒内不重复请求
  });
}

// 获取NFT列表
export function useOwnedNFTs(address: string, network: 'mainnet' | 'devnet' = 'devnet') {
  const client = createSuiClient(network);
  
  return useQuery({
    queryKey: ['owned-nfts', address, network],
    queryFn: async () => {
      if (!address) return [];
      const objects = await client.getOwnedObjects({
        owner: address,
        filter: {
          StructType: '0x2::nft::NFT',
        },
        options: {
          showContent: true,
          showType: true,
        },
      });
      return objects.data;
    },
    enabled: !!address,
    staleTime: 60 * 1000,
  });
}

// 获取交易历史
export function useTransactionHistory(address: string, network: 'mainnet' | 'devnet' = 'devnet') {
  const client = createSuiClient(network);
  
  return useQuery({
    queryKey: ['tx-history', address, network],
    queryFn: async () => {
      if (!address) return [];
      const tx = await client.queryTransactionBlocks({
        filter: {
          FromAddress: address,
        },
        options: {
          showInput: true,
          showEffects: true,
        },
        limit: 10,
      });
      return tx.data;
    },
    enabled: !!address,
    staleTime: 30 * 1000,
  });
}

// 获取Gas价格
export function useGasPrice(network: 'mainnet' | 'devnet' = 'devnet') {
  const client = createSuiClient(network);
  
  return useQuery({
    queryKey: ['gas-price', network],
    queryFn: async () => {
      const gas = await client.getGasPrice();
      return {
        gasPrice: gas.gasPrice,
        formatted: (parseInt(gas.gasPrice) / 1e9).toFixed(6), // 转换为SUI
      };
    },
    staleTime: 60 * 1000, // 1分钟更新一次
  });
}

// 获取最新区块
export function useLatestBlock(network: 'mainnet' | 'devnet' = 'devnet') {
  const client = createSuiClient(network);
  
  return useQuery({
    queryKey: ['latest-block', network],
    queryFn: async () => {
      const block = await client.getLatestCheckpointSequenceNumber();
      return block;
    },
    refetchInterval: 10000, // 每10秒更新
  });
}
