import { Transaction } from '@mysten/sui/transactions';

const MIST_PER_SUI = 1_000_000_000;

export type TradeCoinUnit = 'SUI' | 'BOX';

type BalanceItem = {
  coinType?: string;
  totalBalance?: string;
};

export type WalletTradeLike = {
  connected?: boolean;
  signAndExecuteTransaction?: (input: {
    transaction: Transaction;
    options?: { showEffects?: boolean; showEvents?: boolean };
  }) => Promise<{ digest?: string }>;
  signAndExecuteTransactionBlock?: (input: {
    transactionBlock: Transaction;
    options?: { showEffects?: boolean; showEvents?: boolean };
  }) => Promise<{ digest?: string }>;
  signPersonalMessage?: (input: { message: Uint8Array }) => Promise<unknown>;
};

/**
 * 临时阶段建议：
 * - SUI: 直接链上转账成交
 * - BOX: 走 /api/trade/box 占位通道，待正式合约上线后替换
 */

export async function fetchWalletBalance(address: string, unit: TradeCoinUnit): Promise<number> {
  const res = await fetch(`/api/sui/balance?address=${address}`);
  const data = await res.json();
  const balances: BalanceItem[] = Array.isArray(data?.balances) ? data.balances : [];

  const token = balances.find((item) => {
    const coinType = item.coinType || '';
    if (unit === 'SUI') return coinType.endsWith('::sui::SUI');
    return coinType.endsWith('::BOX') || coinType.includes('::box::BOX');
  });

  return Number(token?.totalBalance || 0) / MIST_PER_SUI;
}

export async function requestWalletAuthorization(
  wallet: WalletTradeLike,
  payload: { nftId: string; unit: TradeCoinUnit; total: number }
): Promise<void> {
  if (!wallet.signPersonalMessage) return;

  const message = new TextEncoder().encode(
    `Authorize NFT purchase\nNFT: ${payload.nftId}\nTotal: ${payload.total} ${payload.unit}\nTimestamp: ${Date.now()}`
  );
  await wallet.signPersonalMessage({ message });
}

export async function executeOnchainPurchase(
  wallet: WalletTradeLike,
  payload: { receiver: string; amountSui: number; unit: TradeCoinUnit; nftId?: string; buyer?: string }
): Promise<string> {
  if (!wallet.connected) {
    throw new Error('请先连接钱包');
  }

  if (payload.unit === 'BOX') {
    const res = await fetch('/api/trade/box', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nftId: payload.nftId || '',
        buyer: payload.buyer || '',
        amount: payload.amountSui,
        unit: payload.unit,
        receiver: payload.receiver,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || 'BOX 临时交易失败');
    }
    return data.digest || '';
  }

  if (!payload.receiver || !payload.receiver.startsWith('0x')) {
    throw new Error('未配置收款钱包地址，请先设置 NEXT_PUBLIC_MARKET_RECEIVER_ADDRESS');
  }

  const tx = new Transaction();
  const mistAmount = BigInt(Math.round(payload.amountSui * MIST_PER_SUI));
  const [coin] = tx.splitCoins(tx.gas, [mistAmount]);
  tx.transferObjects([coin], payload.receiver);

  if (wallet.signAndExecuteTransaction) {
    const result = await wallet.signAndExecuteTransaction({
      transaction: tx,
      options: { showEffects: true, showEvents: true },
    });
    return result.digest || '';
  }

  if (wallet.signAndExecuteTransactionBlock) {
    const result = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: { showEffects: true, showEvents: true },
    });
    return result.digest || '';
  }

  throw new Error('当前钱包不支持上链交易，请更换 Sui 钱包');
}
