/**
 * SUI 新数据栈 - GraphQL 数据服务
 * 基于 SUI 官方 GraphQL RPC 和 Archival Store
 * 
 * 文档: https://docs.sui.io/build/pubsub
 * GraphQL 端点: https://sui-mainnet.mynodes.net/graphql
 */

// ==================== 配置 ====================

// SUI GraphQL 端点（主网）
export const SUI_GRAPHQL_MAINNET = 'https://sui-mainnet.mynodes.net/graphql';

// SUI GraphQL 端点（测试网）
export const SUI_GRAPHQL_TESTNET = 'https://sui-testnet.mynodes.net/graphql';

// SUI GraphQL 端点（Devnet）
export const SUI_GRAPHQL_DEVNET = 'https://sui-devnet.mynodes.net/graphql';

// 当前使用的端点
const CURRENT_ENDPOINT = SUI_GRAPHQL_MAINNET;

// ==================== GraphQL Client ====================

class SuiGraphQLClient {
  private endpoint: string;
  
  constructor(endpoint: string = CURRENT_ENDPOINT) {
    this.endpoint = endpoint;
  }
  
  /**
   * 执行 GraphQL 查询
   */
  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
      
      const json = await response.json();
      
      if (json.errors) {
        console.error('GraphQL Errors:', json.errors);
        throw new Error(json.errors[0]?.message || 'GraphQL Error');
      }
      
      return json.data as T;
    } catch (error) {
      console.error('GraphQL Query Failed:', error);
      throw error;
    }
  }
  
  /**
   * 实时订阅 (WebSocket)
   */
  subscribe(query: string, onData: (data: unknown) => void): () => void {
    const ws = new WebSocket(this.endpoint.replace('https://', 'wss://').replace('http://', 'ws://'), 'graphql-ws');
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'connection_init' }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'connection_ack') {
        ws.send(JSON.stringify({ type: 'subscribe', payload: { query } }));
      } else if (data.type === 'next') {
        onData(data.payload.data);
      }
    };
    
    return () => ws.close();
  }
}

// 导出单例
export const suiGraphQL = new SuiGraphQLClient();

// 导出类供其他地方使用
export { SuiGraphQLClient };

// ==================== 类型定义 ====================

export interface SUIAddress {
  address: string;
}

export interface CoinBalance {
  coinType: string;
  coinObjectCount: number;
  totalBalance: string;
}

export interface NFTObject {
  id: string;
  type: string;
  owner: string;
  previousTransaction: string;
  storageRebate: string;
  display?: {
    data: {
      name?: string;
      description?: string;
      imageUrl?: string;
      creator?: string;
    };
  };
}

export interface TransactionBlock {
  digest: string;
  effects?: {
    status: { status: 'success' | 'failure' };
    balanceChanges?: Array<{
      owner: { AddressOwner?: string };
      amount: string;
    }>;
  };
  timestamp?: string;
  gasInput?: {
    gasPrice: string;
    gasBudget: string;
  };
  sender?: string;
}

export interface Event {
  id: string;
  timestamp?: string;
  type: string;
  sendingModule?: string;
  eventFields?: Record<string, unknown>;
}

// ==================== 查询语句 ====================

// 获取钱包余额
const GET_BALANCE = `
  query GetBalance($address: SuiAddress!) {
    coins(
      first: 10
      filter: { owner: $address }
    ) {
      nodes {
        coinType
        coinObjectCount
        totalBalance
      }
    }
  }
`;

// 获取 NFT 列表
const GET_NFTS = `
  query GetNFTs($address: SuiAddress!, $limit: Int) {
    nfts(
      first: $limit
      filter: { owner: $address }
    ) {
      nodes {
        id
        type
        owner
        previousTransaction
        storageRebate
        display {
          data
        }
      }
    }
  }
`;

// 获取交易历史
const GET_TRANSACTIONS = `
  query GetTransactions($address: SuiAddress!, $limit: Int) {
    transactions(
      last: $limit
      filter: { sender: $address }
    ) {
      nodes {
        digest
        effects {
          status
        }
        timestamp
        gasInput {
          gasPrice
          gasBudget
        }
        sender
      }
    }
  }
`;

// 获取单个交易详情
const GET_TRANSACTION = `
  query GetTransaction($digest: String!) {
    transactionBlock(digest: $digest) {
      digest
      effects {
        status
        balanceChanges {
          owner { AddressOwner }
          amount
        }
      }
      timestamp
      gasInput {
        gasPrice
        gasBudget
      }
      sender
      kind {
        ... on ProgrammableTransactionBlock {
          transactions {
            __typename
          }
        }
      }
    }
  }
`;

// 获取事件列表
const GET_EVENTS = `
  query GetEvents($address: SuiAddress!, $limit: Int) {
    events(
      last: $limit
      filter: { sender: $address }
    ) {
      nodes {
        id
        timestamp
        type
        sendingModule {
          name
        }
        contents
      }
    }
  }
`;

// ==================== API 函数 ====================

/**
 * 获取钱包 SUI 余额
 */
export async function getSUIBalance(address: string): Promise<number> {
  const data = await suiGraphQL.query<{
    coins: { nodes: CoinBalance[] };
  }>(GET_BALANCE, { address });
  
  const suiCoin = data.coins.nodes.find(
    (coin) => coin.coinType === '0x2::sui::SUI'
  );
  
  return suiCoin ? parseInt(suiCoin.totalBalance) : 0;
}

/**
 * 获取钱包所有代币余额
 */
export async function getAllBalances(address: string): Promise<CoinBalance[]> {
  const data = await suiGraphQL.query<{
    coins: { nodes: CoinBalance[] };
  }>(GET_BALANCE, { address });
  
  return data.coins.nodes;
}

/**
 * 获取用户 NFT 列表
 */
export async function getUserNFTs(
  address: string,
  limit: number = 50
): Promise<NFTObject[]> {
  const data = await suiGraphQL.query<{
    nfts: { nodes: NFTObject[] };
  }>(GET_NFTS, { address, limit });
  
  return data.nfts.nodes;
}

/**
 * 获取用户交易历史
 */
export async function getUserTransactions(
  address: string,
  limit: number = 20
): Promise<TransactionBlock[]> {
  const data = await suiGraphQL.query<{
    transactions: { nodes: TransactionBlock[] };
  }>(GET_TRANSACTIONS, { address, limit });
  
  return data.transactions.nodes;
}

/**
 * 获取单个交易详情
 */
export async function getTransaction(
  digest: string
): Promise<TransactionBlock | null> {
  const data = await suiGraphQL.query<{
    transactionBlock: TransactionBlock | null;
  }>(GET_TRANSACTION, { digest });
  
  return data.transactionBlock;
}

/**
 * 获取用户事件
 */
export async function getUserEvents(
  address: string,
  limit: number = 20
): Promise<Event[]> {
  const data = await suiGraphQL.query<{
    events: { nodes: Event[] };
  }>(GET_EVENTS, { address, limit });
  
  return data.events.nodes;
}

// ==================== 工具函数 ====================

/**
 * 格式化 SUI 数量 (Mist -> SUI)
 */
export function formatSUI(mist: number | string): string {
  const num = typeof mist === 'string' ? parseInt(mist) : mist;
  return (num / 1e9).toFixed(4);
}

/**
 * 格式化大数字
 */
export function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

/**
 * 验证 SUI 地址
 */
export function isValidSuiAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
}
