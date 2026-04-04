// SUI 区块链交互工具
// 核心逻辑：先支付10 SUI到项目方，确认到账后再铸造NFT

import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { Transaction } from '@mysten/sui.js/transactions';
import { SUI_CLI_ADRESS, SuiClient } from '@mysten/sui.js/client';
import { 
  getSUIBalance as graphqlGetBalance,
  formatSUI as graphqlFormatSUI 
} from './sui-graphql';

// 项目方收款地址 (需要替换为实际地址)
export const PROJECT_ADDRESS = '0x0000000000000000000000000000000000000000';

// 铸造费用 (10 SUI)
export const MINT_FEE = 10 * 1000000000; // 转换为 MIST (1 SUI = 10^9 MIST)

// SUI 主网 RPC
const SUI_RPC_URL = 'https://fullnode.mainnet.sui.io';
const client = new SuiClient({ url: SUI_RPC_URL });

/**
 * 检查钱包余额 (兼容旧版 + 新版 GraphQL)
 */
export async function getBalance(address: string): Promise<number> {
  try {
    // 优先使用 GraphQL
    const balance = await graphqlGetBalance(address);
    if (balance > 0) return balance;
    
    // Fallback 到 RPC
    const balanceRpc = await client.getBalance({
      owner: address,
      coinType: '0x2::sui::SUI',
    });
    return Number(balanceRpc.totalBalance);
  } catch (error) {
    console.error('获取余额失败:', error);
    return 0;
  }
}

/**
 * 检查余额是否足够铸造 (>= 10 SUI)
 */
export async function hasEnoughBalance(address: string): Promise<boolean> {
  const balance = await getBalance(address);
  return balance >= MINT_FEE;
}

/**
 * 创建支付交易 (先转账10 SUI到项目方)
 * 返回交易_bytes，需要用户签名
 */
export async function createPaymentTransaction(
  senderAddress: string,
  amount: number = MINT_FEE
): Promise<{ txBytes: string; digest: string }> {
  const tx = new Transaction();
  
  // 转账 SUI 给项目方
  const [coin] = tx.splitCoins(tx.gas, [amount]);
  tx.transferObjects([coin], PROJECT_ADDRESS);
  
  // 构建交易
  const { bytes, digest } = await client.signAndExecuteTransaction({
    transaction: tx,
    sender: senderAddress,
    options: {
      showEffects: true,
    },
  });
  
  return { txBytes: bytes, digest };
}

/**
 * 等待交易确认
 */
export async function waitForTransaction(digest: string): Promise<boolean> {
  try {
    await client.waitForTransaction({
      digest,
      timeout: 30000,
    });
    return true;
  } catch (error) {
    console.error('交易确认失败:', error);
    return false;
  }
}

/**
 * 完整的铸造流程
 * 1. 检查余额
 * 2. 转账10 SUI到项目方
 * 3. 等待确认
 * 4. 铸造NFT
 */
export async function mintNFTFlow(
  senderAddress: string,
  nftMetadata: {
    name: string;
    description: string;
    imageUrl: string;
  }
): Promise<{
  success: boolean;
  error?: string;
  txDigest?: string;
  nftId?: string;
}> {
  try {
    // 1. 检查余额
    const balance = await getBalance(senderAddress);
    if (balance < MINT_FEE) {
      return {
        success: false,
        error: `余额不足！需要 ${MINT_FEE / 1000000000} SUI，当前余额: ${balance / 1000000000} SUI`,
      };
    }

    // 2. 创建转账交易
    const { txBytes, digest } = await createPaymentTransaction(senderAddress);
    
    // 3. 这里返回给前端，让用户签名
    // 前端签名后再调用确认转账
    return {
      success: true,
      txDigest: digest,
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '铸造失败',
    };
  }
}

/**
 * 确认转账成功
 */
export async function confirmPayment(digest: string): Promise<boolean> {
  return waitForTransaction(digest);
}

/**
 * 格式化 SUI 数量
 */
export function formatSUI(mist: number): string {
  return (mist / 1000000000).toFixed(4);
}

/**
 * 验证地址格式
 */
export function isValidSuiAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
}
