/**
 * GET /api/treasury
 *
 * Real Yield 金库状态（业务文档 §7）：
 *   - 协议分配：Navi 40% / Scallop 30% / vSUI 15% / haSUI 15%
 *   - 持有5★传奇NFT用户按权重享受 SUI 分红
 *   - 展示：TVL / 年化收益率 / 分红总量 / 各协议份额
 *
 * POST /api/treasury/deposit — 模拟资金注入（后端管理接口）
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTreasuryPositions, addTreasuryDeposit } from '@/lib/database';

// 模拟各协议当前年化收益率（实际应从链上协议读取）
const PROTOCOL_APY: Record<string, number> = {
  navi:   12.4,
  scallop: 10.8,
  vSUI:   8.2,
  haSUI:  9.6,
};

export async function GET() {
  try {
    const positions = getTreasuryPositions() as {
      protocol: string; allocation_pct: number; principal_sui: number; yield_earned: number;
    }[];

    const totalPrincipal = positions.reduce((s, p) => s + p.principal_sui, 0);
    const totalYield     = positions.reduce((s, p) => s + p.yield_earned, 0);

    // 加权平均 APY
    const weightedAPY = positions.reduce((acc, p) => {
      return acc + (PROTOCOL_APY[p.protocol] ?? 0) * (p.allocation_pct / 100);
    }, 0);

    const protocols = positions.map(p => ({
      protocol:     p.protocol,
      allocationPct: p.allocation_pct,
      principalSui:  p.principal_sui,
      yieldEarned:   p.yield_earned,
      apy:           PROTOCOL_APY[p.protocol] ?? 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalPrincipalSui: totalPrincipal,
        totalYieldEarned:  totalYield,
        weightedAPY:       Math.round(weightedAPY * 10) / 10,
        protocols,
        lastUpdated: new Date().toISOString(),
        distributionRule: '五星传奇NFT持有者按持有数量权重分配月度SUI收益',
        nextDistribution: getNextDistributionDate(),
      },
    });
  } catch (err) {
    console.error('[treasury GET]', err);
    return NextResponse.json({ success: false, error: '获取失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sui_amount, action } = body as { sui_amount?: number; action?: string };

    if (action === 'deposit' && sui_amount && sui_amount > 0) {
      addTreasuryDeposit(sui_amount);
      return NextResponse.json({
        success: true,
        message: `已将 ${sui_amount} SUI 按策略分配至各协议`,
        allocation: {
          navi:    sui_amount * 0.4,
          scallop: sui_amount * 0.3,
          vSUI:    sui_amount * 0.15,
          haSUI:   sui_amount * 0.15,
        },
      });
    }

    return NextResponse.json({ success: false, error: '未知操作' }, { status: 400 });
  } catch (err) {
    console.error('[treasury POST]', err);
    return NextResponse.json({ success: false, error: '操作失败' }, { status: 500 });
  }
}

function getNextDistributionDate(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toISOString().slice(0, 10);
}
