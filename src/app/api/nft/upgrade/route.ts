/**
 * POST /api/nft/upgrade
 *
 * NFT 升级系统（业务文档 §5.4）：
 *   - 史诗 NFT：最高三星，每星消耗 50 BOX（100% 销毁）
 *     解锁权益：1★解锁算力×1 / 2★NFT版权税折扣5%+额外+1次/天开盒 / 3★版权税10%+开盒+1
 *   - 传奇 NFT：最高五星，每星消耗 70 BOX（100% 销毁）
 *     解锁权益：1★算力×1 / 2★算力+版权税10%+开盒+1 / 3★+12%+开盒+1
 *               / 4★+15%+开盒+1 / 5★+20%+开盒+1+Real Yield国库SUI分红
 *
 * Body: { address: string; token_id: string }
 * GET ?address=&token_id=  → 查询升级状态
 */

import { NextRequest, NextResponse } from 'next/server';
import { upgradeNFTStar, recordBurn, getDb } from '@/lib/database';
import { InputValidator } from '@/lib/security';

// ─── 升级成本 & 解锁权益 ───────────────────────────────
const UPGRADE_CONFIG = {
  epic: {
    costPerStar: 50,
    maxStars: 3,
    benefits: [
      { star: 1, powerMultiplier: 1, royaltyDiscount: 0,  extraBoxOpens: 0 },
      { star: 2, powerMultiplier: 1, royaltyDiscount: 5,  extraBoxOpens: 1 },
      { star: 3, powerMultiplier: 1, royaltyDiscount: 10, extraBoxOpens: 1 },
    ],
  },
  legendary: {
    costPerStar: 70,
    maxStars: 5,
    benefits: [
      { star: 1, powerMultiplier: 1, royaltyDiscount: 0,  extraBoxOpens: 0, realYield: false },
      { star: 2, powerMultiplier: 1, royaltyDiscount: 10, extraBoxOpens: 1, realYield: false },
      { star: 3, powerMultiplier: 1, royaltyDiscount: 12, extraBoxOpens: 1, realYield: false },
      { star: 4, powerMultiplier: 1, royaltyDiscount: 15, extraBoxOpens: 1, realYield: false },
      { star: 5, powerMultiplier: 1, royaltyDiscount: 20, extraBoxOpens: 1, realYield: true  },
    ],
  },
} as const;

// ─── GET：查询 NFT 升级状态 ───────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address  = searchParams.get('address');
  const token_id = searchParams.get('token_id');

  if (!address || !token_id) {
    return NextResponse.json({ success: false, error: '缺少参数' }, { status: 400 });
  }
  if (!InputValidator.validateAddress(address)) {
    return NextResponse.json({ success: false, error: '无效的钱包地址格式' }, { status: 400 });
  }

  const nft = getDb().prepare(
    'SELECT token_id, name, nft_type, star_level FROM nft_inventory WHERE token_id = ? AND owner_address = ?'
  ).get(token_id, address) as { token_id: string; name: string; nft_type: string; star_level: number } | undefined;

  if (!nft) return NextResponse.json({ success: false, error: 'NFT不存在或不属于该用户' }, { status: 404 });

  const config = UPGRADE_CONFIG[nft.nft_type as 'epic' | 'legendary'];
  if (!config) return NextResponse.json({ success: false, error: '该NFT类型不支持升级' }, { status: 400 });

  const canUpgrade = nft.star_level < config.maxStars;
  const costForNext = canUpgrade ? config.costPerStar : 0;
  const currentBenefits = config.benefits[nft.star_level - 1] ?? null;
  const nextBenefits    = canUpgrade ? config.benefits[nft.star_level] : null;

  return NextResponse.json({
    success: true,
    data: {
      tokenId: nft.token_id,
      name: nft.name,
      nftType: nft.nft_type,
      starLevel: nft.star_level,
      maxStars: config.maxStars,
      canUpgrade,
      costForNextStar: costForNext,
      currentBenefits,
      nextBenefits,
      allBenefits: config.benefits,
    },
  });
}

// ─── POST：执行升级 ───────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, token_id } = body as { address: string; token_id: string };

    if (!address || !token_id) {
      return NextResponse.json({ success: false, error: '缺少参数' }, { status: 400 });
    }
    if (!InputValidator.validateAddress(address)) {
      return NextResponse.json({ success: false, error: '无效的钱包地址格式' }, { status: 400 });
    }

    // 获取 NFT 类型与当前星级
    const nft = getDb().prepare(
      'SELECT nft_type, star_level FROM nft_inventory WHERE token_id = ? AND owner_address = ?'
    ).get(token_id, address) as { nft_type: string; star_level: number } | undefined;

    if (!nft) {
      return NextResponse.json({ success: false, error: 'NFT不存在或不属于该用户' }, { status: 404 });
    }

    const config = UPGRADE_CONFIG[nft.nft_type as 'epic' | 'legendary'];
    if (!config) {
      return NextResponse.json({ success: false, error: `${nft.nft_type} NFT 不支持升级（仅史诗/传奇）` }, { status: 400 });
    }

    if (nft.star_level >= config.maxStars) {
      return NextResponse.json({ success: false, error: `已达最高星级（${config.maxStars}★）` }, { status: 400 });
    }

    const boxCost = config.costPerStar;
    const fromStar = nft.star_level;

    // TODO: 链上验证并扣除 BOX
    // await contract.burnBOX(address, boxCost);

    // 升级 NFT 星级
    const upgradeResult = upgradeNFTStar(token_id, address);
    if (!upgradeResult.ok) {
      return NextResponse.json({ success: false, error: upgradeResult.error }, { status: 400 });
    }

    const newStar = upgradeResult.newStar!;

    // 记录 BOX 销毁
    recordBurn({
      user_address: address,
      amount: boxCost,
      reason: 'upgrade',
      reference_id: token_id,
    });

    // 记录升级历史
    getDb().prepare(`
      INSERT INTO nft_upgrades (token_id, user_address, from_star, to_star, box_burned)
      VALUES (?, ?, ?, ?, ?)
    `).run(token_id, address, fromStar, newStar, boxCost);

    const newBenefits = config.benefits[newStar - 1];

    return NextResponse.json({
      success: true,
      data: {
        tokenId: token_id,
        fromStar,
        toStar: newStar,
        boxBurned: boxCost,
        newBenefits,
        isMaxStar: newStar >= config.maxStars,
        message: buildUpgradeMessage(nft.nft_type, newStar, boxCost, newBenefits),
      },
    });
  } catch (err) {
    console.error('[nft/upgrade]', err);
    return NextResponse.json({ success: false, error: '升级失败，请稍后重试' }, { status: 500 });
  }
}

// ─── 辅助 ─────────────────────────────────────────────
function buildUpgradeMessage(
  nftType: string,
  newStar: number,
  burned: number,
  benefits: { royaltyDiscount: number; extraBoxOpens: number; realYield?: boolean }
): string {
  const typeMap: Record<string, string> = { epic: '史诗', legendary: '传奇' };
  const stars = '★'.repeat(newStar);
  let msg = `🌟 ${typeMap[nftType] ?? nftType} NFT 升级至 ${stars}！消耗销毁 ${burned} BOX。`;
  if (benefits.royaltyDiscount > 0) msg += ` 版权税折扣 ${benefits.royaltyDiscount}%。`;
  if (benefits.extraBoxOpens > 0)   msg += ` 每日额外 +${benefits.extraBoxOpens} 次免费开盒。`;
  if (benefits.realYield)            msg += ` 解锁 Real Yield 国库 SUI 分红！`;
  return msg;
}
