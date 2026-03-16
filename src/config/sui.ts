// SUI 网络配置

export const SUI_CONFIG = {
  // Devnet (测试网)
  devnet: {
    rpc: 'https://fullnode.devnet.sui.io',
    packageId: '0x08954fe5f4ef82cbe7d1bf8c557b09287f33e1a51f7f5d4f7c59e11f4ac59b34',
  },
  
  // Mainnet (主网) - BlockVision
  mainnet: {
    rpc: 'https://sui-mainnet.blockvision.org',
    ws: 'wss://sui-mainnet.blockvision.org/ws',
  },
  
  // BlockVision API (用于查询余额/NFT/交易)
  blockvision: {
    apiKey: '', // 用户需要填写自己的API Key
    baseUrl: 'https://api.blockvision.org/v1/sui',
  },
};

// 当前使用的网络
export const CURRENT_NETWORK = 'devnet';
