/**
 * POST /api/box/open
 *
 * 盲盒开启核心 API，实现业务文档 §4 全部规则：
 *   - 双通道：free（每日限额）/ paid（15 BOX，100% 稀有或史诗）
 *   - 概率：普通50% / 稀有15% / 史诗3% / 感谢参与32%
 *   - 保底计数器：累计3次→1普通碎片 / 7次→1稀有 / 15次→1史诗（清零）
 *   - 每日免费次数：基础1次（传奇NFT持有者5次+）+ 邀请好友加成（最多+6次）
 *   - Sui Randomness 占位（当前服务端伪随机，链上接入后替换 getSuiRandom()）
 *
 * Body: { address: string; channel: 'free' | 'paid'; has_legendary?: boolean; invite_bonus?: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getTodayOpens, recordBoxOpen,
  getConsolationCount, incrementConsolation, resetConsolation,
  addFragment, recordBurn,
  getDb,
} from '@/lib/database';
import { InputValidator } from '@/lib/security';

// ─── 业务常量 ──────────────────────────────────────────
const PAID_BOX_COST_BOX = 15;           // 付费通道消耗 BOX
const BASE_FREE_OPENS   = 1;            // 普通用户每日基础次数
const LEGENDARY_FREE    = 5;            // 传奇NFT用户每日基础次数

// 保底阶梯（感谢参与次数 → 奖励碎片）
const CONSOLATION_STEPS = [
  { threshold: 15, fragment: 'epic'   as const, reset: true  },
  { threshold: 7,  fragment: 'rare'   as const, reset: false },
  { threshold: 3,  fragment: 'common' as const, reset: false },
];

// 免费通道概率（累计，单位%）
const FREE_PROBS = [
  { result: 'epic'    as const, cumulative: 3  },
  { result: 'rare'    as const, cumulative: 18 },  // 3+15
  { result: 'common'  as const, cumulative: 68 },  // 3+15+50
  { result: 'nothing' as const, cumulative: 100 }, // 3+15+50+32
];

// 付费通道概率（100% 出稀有或史诗各 50%）
const PAID_PROBS = [
  { result: 'epic' as const, cumulative: 50 },
  { result: 'rare' as const, cumulative: 100 },
];

// ─── Sui Randomness 占位 ──────────────────────────────
// TODO: 接入合约后替换为链上随机数
// import { suiGraphQL } from '@/lib/sui-graphql';
// async function getSuiRandom(): Promise<number> {
//   const data = await suiGraphQL.query(`query { randomness { value } }`);
//   return (data.randomness.value % 10000) / 100;  // 0-100
// }
function getSuiRandom(): number {
  return Math.random() * 100;
}

// ─── 免费次数上限计算 ─────────────────────────────────
function calcMaxFreeOpens(hasLegendary: boolean, inviteBonus: number): number {
  const base = hasLegendary ? LEGENDARY_FREE : BASE_FREE_OPENS;
  return Math.min(base + inviteBonus, hasLegendary ? 11 : 7);
}

// ─── 保底碎片检查 ─────────────────────────────────────
function checkConsolation(address: string, currentCount: number): {
  consolationReward: string | null; newCount: number;
} {
  for (const step of CONSOLATION_STEPS) {
    if (currentCount >= step.threshold) {
      addFragment(address, step.fragment, 1);
      if (step.reset) resetConsolation(address);
      return { consolationReward: step.fragment, newCount: step.reset ? 0 : currentCount };
    }
  }
  return { consolationReward: null, newCount: currentCount };
}

// ─── 主处理器 ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      address,
      channel = 'free',
      has_legendary = false,
      invite_bonus = 0,
    } = body as {
      address: string;
      channel: 'free' | 'paid';
      has_legendary?: boolean;
      invite_bonus?: number;
    };

    if (!address) {
      return NextResponse.json({ success: false, error: '缺少钱包地址' }, { status: 400 });
    }
    if (!InputValidator.validateAddress(address)) {
      return NextResponse.json({ success: false, error: '无效的钱包地址格式' }, { status: 400 });
    }

    const todayOpens = getTodayOpens(address);

    // ── 免费通道限额检查 ──────────────────────────────
    if (channel === 'free') {
      const maxFree = calcMaxFreeOpens(has_legendary, invite_bonus);
      if (todayOpens.free_opens >= maxFree) {
        return NextResponse.json({
          success: false,
          error: `今日免费开盒次数已用完（${todayOpens.free_opens}/${maxFree}）`,
          remaining: 0,
          max: maxFree,
        }, { status: 400 });
      }
    }

    // ── 付费通道费用扣除（占位，链上合约接入后替换）────
    if (channel === 'paid') {
      // TODO: 从链上扣除 PAID_BOX_COST_BOX BOX
      // await contract.burnBOX(address, PAID_BOX_COST_BOX);
      recordBurn({
        user_address: address,
        amount: PAID_BOX_COST_BOX,
        reason: 'paid_box',
      });
    }

    // ── 随机抽取 ──────────────────────────────────────
    const roll = getSuiRandom();
    const probs = channel === 'paid' ? PAID_PROBS : FREE_PROBS;
    let openResult: 'common' | 'rare' | 'epic' | 'nothing' = 'nothing';
    for (const p of probs) {
      if (roll <= p.cumulative) { openResult = p.result; break; }
    }

    // ── 处理结果 ──────────────────────────────────────
    let consolationReward: string | null = null;
    let newConsolationCount = 0;

    if (openResult === 'nothing') {
      const cnt = incrementConsolation(address);
      const consolCheck = checkConsolation(address, cnt);
      consolationReward = consolCheck.consolationReward;
      newConsolationCount = consolCheck.newCount;
    } else {
      // 获得碎片：写入库存
      addFragment(address, openResult, 1);
    }

    // ── 记录开盒操作 ──────────────────────────────────
    recordBoxOpen(address, channel);
    getDb().prepare(`
      INSERT INTO box_open_history
        (user_address, channel, result, fragment_type, box_cost, consolation_cnt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      address,
      channel,
      openResult,
      openResult !== 'nothing' ? openResult : null,
      channel === 'paid' ? PAID_BOX_COST_BOX : 0,
      newConsolationCount,
    );

    const freshOpens = getTodayOpens(address);
    const maxFree = calcMaxFreeOpens(has_legendary, invite_bonus);

    return NextResponse.json({
      success: true,
      data: {
        result: openResult,
        fragment: openResult !== 'nothing' ? openResult : null,
        consolationReward,
        consolationCount: newConsolationCount,
        todayFreeOpens: freshOpens.free_opens,
        maxFreeOpens: maxFree,
        channel,
        boxCost: channel === 'paid' ? PAID_BOX_COST_BOX : 0,
        message: buildResultMessage(openResult, consolationReward, channel),
      },
    });
  } catch (err) {
    console.error('[box/open]', err);
    return NextResponse.json({ success: false, error: '开盒失败，请稍后重试' }, { status: 500 });
  }
}

// ─── 状态查询 GET /api/box/open?address=0x… ──────────
export async function GET(request: NextRequest) {
  try {
    const address = new URL(request.url).searchParams.get('address');
    if (!address) return NextResponse.json({ success: false, error: '缺少地址' }, { status: 400 });
    if (!InputValidator.validateAddress(address)) {
      return NextResponse.json({ success: false, error: '无效的钱包地址格式' }, { status: 400 });
    }

    const todayOpens = getTodayOpens(address);
    const consolationCount = getConsolationCount(address);

    return NextResponse.json({
      success: true,
      data: {
        todayFreeOpens: todayOpens.free_opens,
        todayPaidOpens: todayOpens.paid_opens,
        consolationCount,
        nextConsolationAt: consolationCount < 3 ? 3 : consolationCount < 7 ? 7 : consolationCount < 15 ? 15 : null,
        consolationSteps: CONSOLATION_STEPS,
        paidBoxCost: PAID_BOX_COST_BOX,
        freeProbabilities: { common: 50, rare: 15, epic: 3, nothing: 32 },
        paidProbabilities: { rare: 50, epic: 50 },
      },
    });
  } catch (err) {
    console.error('[box/open GET]', err);
    return NextResponse.json({ success: false, error: '查询失败' }, { status: 500 });
  }
}

// ─── 辅助 ─────────────────────────────────────────────
function buildResultMessage(
  result: string, consolation: string | null, channel: string
): string {
  if (result === 'nothing') {
    if (consolation) return `感谢参与！保底触发：获得 1 个${consolation === 'epic' ? '史诗' : consolation === 'rare' ? '稀有' : '普通'}碎片！`;
    return '感谢参与，本次未获得碎片，继续努力！';
  }
  const rarityMap: Record<string, string> = { common: '普通', rare: '稀有', epic: '史诗' };
  const paid = channel === 'paid' ? `（消耗 ${PAID_BOX_COST_BOX} BOX）` : '';
  return `恭喜！获得 1 个${rarityMap[result] ?? result}碎片${paid}！`;
}
