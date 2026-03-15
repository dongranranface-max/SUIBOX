import { NextResponse } from 'next/server';

// 空投配置
const AIRDROP_CONFIG = {
  totalBudget: 15000000,       // 1500万BOX（1000万用户 + 500万推荐人）
  userBudget: 10000000,       // 用户奖励1000万
  referrerBudget: 5000000,    // 推荐人奖励500万
  perUserCap: 100,            // 单用户最高100 BOX
  perReferrerCap: 50,         // 推荐人最高50 BOX
  minInvites: 1,             // 最少1个有效邀请
};

// 模拟空投数据（实际应为链上数据）
const airdropStats = {
  userBudget: 10000000,        // 用户奖励1000万
  referrerBudget: 5000000,    // 推荐人奖励500万
  userDistributed: 4280000,   // 已分发用户428万
  referrerDistributed: 2140000, // 已分发推荐人214万
  totalRecipients: 125600,      // 12.56万用户
  remainingUser: 5720000,     // 用户剩余572万
  remainingReferrer: 2860000,  // 推荐人剩余286万
  dailyLimit: 50000,           // 每日5万BOX
  dailyDistributed: 42300,     // 今日已分发4.23万BOX
};

// 用户领取记录（模拟）
const userClaims = [
  { address: '0x7a23...8f91', amount: 10, time: Date.now() - 3600000, txHash: '0xabc123...', status: 'completed' },
  { address: '0x8b34...9c02', amount: 5, time: Date.now() - 7200000, txHash: '0xdef456...', status: 'completed' },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    config: AIRDROP_CONFIG,
    stats: airdropStats,
    lastUpdate: Date.now(),
  });
}

// 领取空投
export async function POST(request: Request) {
  const { address, invites } = await request.json();

  // 验证
  if (!address) {
    return NextResponse.json({ success: false, error: 'Invalid address' }, { status: 400 });
  }

  // 检查邀请人数是否满足要求
  if (invites < AIRDROP_CONFIG.minInvites) {
    return NextResponse.json({ 
      success: false, 
      error: `需要至少 ${AIRDROP_CONFIG.minInvites} 个有效邀请才能领取空投` 
    }, { status: 400 });
  }

  const remainingTotal = airdropStats.remainingUser + airdropStats.remainingReferrer;
  if (remainingTotal <= 0) {
    return NextResponse.json({ 
      success: false, 
      error: '空投已全部发放完毕' 
    }, { status: 400 });
  }

  // 计算可领取数量（按邀请人数，用户部分从 remainingUser 扣）
  const claimable = Math.min(
    invites * 1,          // 每人1 BOX
    AIRDROP_CONFIG.perUserCap,
    airdropStats.remainingUser
  );

  // 生成交易哈希（模拟）
  const txHash = `0x${Math.random().toString(16).slice(2)}${address.slice(2, 10)}`;

  // 模拟发放（实际调用智能合约）
  // 实际实现：await contract.airdrop(address, claimable);

  return NextResponse.json({
    success: true,
    data: {
      address,
      amount: claimable,
      txHash,
      status: 'completed',
      explorerUrl: `https://suiscan.xyz/mainnet/tx/${txHash}`,
    },
  });
}
