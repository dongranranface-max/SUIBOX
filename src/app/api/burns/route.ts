/**
 * GET /api/burns
 *
 * BOX 销毁记录 API，支持地狱之火（Burn Hole）面板实时展示。
 *
 * Query params:
 *   limit (default 20) – 最近N条记录
 *   summary=true       – 仅返回汇总数据（不返回明细列表）
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecentBurns, getTotalBurned } from '@/lib/database';

const REASON_LABELS: Record<string, string> = {
  upgrade:   'NFT升级',
  synthesis: '合成销毁',
  paid_box:  '付费开盒',
  tx_fee:    '交易手续费',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit   = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const summary = searchParams.get('summary') === 'true';

    const totalBurned = getTotalBurned();

    if (summary) {
      return NextResponse.json({
        success: true,
        data: {
          totalBurned,
          lastUpdated: new Date().toISOString(),
        },
      });
    }

    const recentBurns = getRecentBurns(limit) as {
      user_address: string; amount: number; reason: string;
      reference_id?: string; burned_at: string;
    }[];

    const formatted = recentBurns.map(b => ({
      address:    maskAddress(b.user_address),
      amount:     b.amount,
      reason:     REASON_LABELS[b.reason] ?? b.reason,
      referenceId: b.reference_id ?? null,
      burnedAt:   b.burned_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalBurned,
        recentBurns: formatted,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[burns GET]', err);
    return NextResponse.json({ success: false, error: '获取销毁记录失败' }, { status: 500 });
  }
}

function maskAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
