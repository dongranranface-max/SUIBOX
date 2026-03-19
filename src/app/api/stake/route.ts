import { NextRequest, NextResponse } from 'next/server';

// 模拟质押池数据
const stakePools = [
  {
    id: 'pool-001',
    name: 'SUI 基础质押',
    description: '低风险，稳定收益',
    token: 'SUI',
    apy: 8.5,
    minStake: 10,
    lockPeriod: 0, // 天数，0 表示无锁定期
    totalStaked: 1250000,
    rewardPool: 45000,
    isActive: true,
  },
  {
    id: 'pool-002',
    name: 'SUI 进阶质押',
    description: '中等风险，收益更高',
    token: 'SUI',
    apy: 15.2,
    minStake: 100,
    lockPeriod: 14,
    totalStaked: 580000,
    rewardPool: 32000,
    isActive: true,
  },
  {
    id: 'pool-003',
    name: 'BOX 质押池',
    description: 'BOX 代币质押',
    token: 'BOX',
    apy: 22.8,
    minStake: 50,
    lockPeriod: 30,
    totalStaked: 250000,
    rewardPool: 18000,
    isActive: true,
  },
];

// 模拟用户质押数据
const userStakes = new Map();

// 获取质押池列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const showInactive = searchParams.get('showInactive') === 'true';

    let pools = [...stakePools];

    if (token) {
      pools = pools.filter(p => p.token === token);
    }

    if (!showInactive) {
      pools = pools.filter(p => p.isActive);
    }

    return NextResponse.json({
      success: true,
      data: pools,
    });
  } catch (error) {
    console.error('Stake pools error:', error);
    return NextResponse.json(
      { success: false, error: '获取质押池失败' },
      { status: 500 }
    );
  }
}

// 质押操作
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, poolId, amount, address } = body;

    // 验证用户
    if (!address) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const pool = stakePools.find(p => p.id === poolId);
    if (!pool) {
      return NextResponse.json(
        { success: false, error: '质押池不存在' },
        { status: 404 }
      );
    }

    if (amount < pool.minStake) {
      return NextResponse.json(
        { success: false, error: `最低质押数量: ${pool.minStake}` },
        { status: 400 }
      );
    }

    // 获取或创建用户质押记录
    if (!userStakes.has(address)) {
      userStakes.set(address, []);
    }
    const stakes = userStakes.get(address);

    if (action === 'stake') {
      // 质押
      const newStake = {
        poolId,
        amount,
        startTime: new Date().toISOString(),
        lockPeriod: pool.lockPeriod,
        claimed: 0,
      };
      stakes.push(newStake);

      // 更新池数据
      pool.totalStaked += amount;

      return NextResponse.json({
        success: true,
        data: {
          action: 'stake',
          amount,
          poolName: pool.name,
          lockPeriod: pool.lockPeriod,
          nextClaimTime: pool.lockPeriod > 0 
            ? new Date(Date.now() + pool.lockPeriod * 24 * 60 * 60 * 1000).toISOString()
            : null,
        },
      });
    } 
    
    if (action === 'unstake') {
      // 解除质押
      const stakeIndex = stakes.findIndex(s => s.poolId === poolId);
      if (stakeIndex === -1) {
        return NextResponse.json(
          { success: false, error: '没有该池的质押记录' },
          { status: 400 }
        );
      }

      const stake = stakes[stakeIndex];
      
      // 检查是否在锁定期
      if (stake.lockPeriod > 0) {
        const lockEndTime = new Date(stake.startTime).getTime() + stake.lockPeriod * 24 * 60 * 60 * 1000;
        if (Date.now() < lockEndTime) {
          return NextResponse.json(
            { success: false, error: '质押锁定中，无法解除' },
            { status: 400 }
          );
        }
      }

      const unstakedAmount = stake.amount;
      stakes.splice(stakeIndex, 1);
      pool.totalStaked -= unstakedAmount;

      return NextResponse.json({
        success: true,
        data: {
          action: 'unstake',
          amount: unstakedAmount,
        },
      });
    }

    if (action === 'claim') {
      // 领取奖励
      const stakeIndex = stakes.findIndex(s => s.poolId === poolId);
      if (stakeIndex === -1) {
        return NextResponse.json(
          { success: false, error: '没有该池的质押记录' },
          { status: 400 }
        );
      }

      const stake = stakes[stakeIndex];
      const stakeDays = Math.floor(
        (Date.now() - new Date(stake.startTime).getTime()) / (24 * 60 * 60 * 1000)
      );
      
      // 计算奖励
      const reward = (stake.amount * (pool.apy / 100) * stakeDays / 365);
      const claimableReward = reward - stake.claimed;
      
      if (claimableReward <= 0) {
        return NextResponse.json(
          { success: false, error: '暂无可领取奖励' },
          { status: 400 }
        );
      }

      stake.claimed = reward;

      return NextResponse.json({
        success: true,
        data: {
          action: 'claim',
          amount: claimableReward,
          symbol: pool.token,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: '无效操作' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Stake error:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}
