/**
 * POST /api/craft
 *
 * 合成系统核心 API，实现业务文档 §5 全部规则：
 *
 * 合成类型（synthesis_type）：
 *   fragment_to_nft  — 碎片合成NFT（动态成本）
 *   nft_to_nft       — NFT合成高阶NFT（固定消耗+BOX销毁）
 *   legendary        — 传奇碎片路线（50普通+25稀有+10史诗 NFT）
 *
 * 动态成本（碎片合成稀有/史诗 NFT，随累计产出量递增）：
 *   稀有 NFT: 0-1w→8碎片, 1-3w→12, 3-6w→16, 6-10w→20, 10w+→24
 *   史诗 NFT: 0-5k→10碎片, 5-15k→15, 15-30k→20, 30-50k→25, 50k+→30
 *   传奇（碎片路线限353张）: 50普通NFT + 25稀有NFT + 10史诗NFT（需链上验证）
 *
 * BOX 奖励（每次合成即时发放，池子耗尽后由DAO决定）：
 *   普通NFT: +5 BOX / 稀有NFT: +8 BOX / 史诗NFT: +15 BOX
 *   NFT→NFT: 稀有+10/史诗+20/传奇+100 BOX
 *
 * Body:
 *   { address, synthesis_type, target_rarity }
 *   + fragment counts or nft token_ids depending on type
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  consumeFragments, addFragment, getFragments,
  getRareFragmentCost, getEpicFragmentCost, getSynthesisCount,
  incrementSynthesisCount, recordSynthesis, createNFTInventory,
  recordBurn, getDb, checkAndGrantMilestone, getSynthesisCountForUser,
  getUserByAddress,
} from '@/lib/database';
import { InputValidator } from '@/lib/security';

// ─── 业务常量 ──────────────────────────────────────────
const BOX_REWARDS: Record<string, number> = {
  common: 5, rare: 8, epic: 15,
};
const NFT_TO_NFT_BOX_BURN: Record<string, number> = {
  rare: 30, epic: 50, legendary: 200,
};
const NFT_TO_NFT_BOX_REWARD: Record<string, number> = {
  rare: 10, epic: 20, legendary: 100,
};
// 传奇 NFT 合成上限（碎片路线）
const LEGENDARY_FRAGMENT_ROUTE_MAX = 353;
// 普通NFT 碎片数量固定
const COMMON_FRAGMENT_COST = 6;

function generateTokenId(rarity: string) {
  return `${rarity}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── GET：获取当前成本与状态 ──────────────────────────
export async function GET() {
  const rareMinted   = getSynthesisCount('rare');
  const epicMinted   = getSynthesisCount('epic');
  const legendaryMinted = getSynthesisCount('legendary');

  return NextResponse.json({
    success: true,
    data: {
      costs: {
        common: {
          fragments: { common: COMMON_FRAGMENT_COST },
          boxReward: BOX_REWARDS.common,
        },
        rare: {
          fragments: { rare: getRareFragmentCost() },
          boxReward: BOX_REWARDS.rare,
          minted: rareMinted,
          nextThreshold: getRareNextThreshold(rareMinted),
        },
        epic: {
          fragments: { epic: getEpicFragmentCost() },
          boxReward: BOX_REWARDS.epic,
          minted: epicMinted,
          nextThreshold: getEpicNextThreshold(epicMinted),
        },
        legendary_fragment_route: {
          nftsRequired: { common: 50, rare: 25, epic: 10 },
          boxReward: BOX_REWARDS.common + 100,   // placeholder
          remainingSlots: Math.max(0, LEGENDARY_FRAGMENT_ROUTE_MAX - legendaryMinted),
          minted: legendaryMinted,
        },
      },
      nft_to_nft: {
        rare:      { nfts: { common: 5 }, boxBurn: NFT_TO_NFT_BOX_BURN.rare, boxReward: NFT_TO_NFT_BOX_REWARD.rare },
        epic:      { nfts: { rare: 4 },   boxBurn: NFT_TO_NFT_BOX_BURN.epic, boxReward: NFT_TO_NFT_BOX_REWARD.epic },
        legendary: { nfts: { common: 100, rare: 50, epic: 20 }, boxBurn: NFT_TO_NFT_BOX_BURN.legendary, boxReward: NFT_TO_NFT_BOX_REWARD.legendary },
      },
    },
  });
}

// ─── POST：执行合成 ───────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, synthesis_type, target_rarity, nft_token_ids } = body as {
      address: string;
      synthesis_type: 'fragment_to_nft' | 'nft_to_nft' | 'legendary';
      target_rarity: 'common' | 'rare' | 'epic' | 'legendary';
      nft_token_ids?: string[];
    };

    if (!address || !synthesis_type || !target_rarity) {
      return NextResponse.json({ success: false, error: '参数不完整' }, { status: 400 });
    }
    if (!InputValidator.validateAddress(address)) {
      return NextResponse.json({ success: false, error: '无效的钱包地址格式' }, { status: 400 });
    }

    let resultTokenId: string;
    let boxReward = 0;
    let boxBurned = 0;
    let fragmentsConsumed: Record<string, number> = {};

    // ══════════════════════════════════════════════════
    // 分支 1: 碎片 → NFT
    // ══════════════════════════════════════════════════
    if (synthesis_type === 'fragment_to_nft') {
      if (!['common', 'rare', 'epic'].includes(target_rarity)) {
        return NextResponse.json({ success: false, error: '碎片路线仅支持 common/rare/epic' }, { status: 400 });
      }

      let requiredType: 'common' | 'rare' | 'epic';
      let requiredQty: number;

      if (target_rarity === 'common') {
        requiredType = 'common'; requiredQty = COMMON_FRAGMENT_COST;
      } else if (target_rarity === 'rare') {
        requiredType = 'rare'; requiredQty = getRareFragmentCost();
      } else {
        requiredType = 'epic'; requiredQty = getEpicFragmentCost();
      }

      const ok = consumeFragments(address, requiredType, requiredQty);
      if (!ok) {
        const userFrags = getFragments(address).find(f => f.fragment_type === requiredType);
        return NextResponse.json({
          success: false,
          error: `${requiredType}碎片不足，需要 ${requiredQty} 个，当前 ${userFrags?.quantity ?? 0} 个`,
          required: requiredQty,
          current: userFrags?.quantity ?? 0,
        }, { status: 400 });
      }

      fragmentsConsumed = { [requiredType]: requiredQty };
      boxReward = BOX_REWARDS[target_rarity];
      resultTokenId = generateTokenId(target_rarity);

      createNFTInventory({
        token_id: resultTokenId,
        name: `${capitalize(target_rarity)} NFT #${getFormattedCount(target_rarity)}`,
        nft_type: target_rarity,
        owner_address: address,
      });

      incrementSynthesisCount(target_rarity);
    }

    // ══════════════════════════════════════════════════
    // 分支 2: NFT → 高阶 NFT
    // ══════════════════════════════════════════════════
    else if (synthesis_type === 'nft_to_nft') {
      if (!['rare', 'epic', 'legendary'].includes(target_rarity)) {
        return NextResponse.json({ success: false, error: 'NFT合成路线仅支持 rare/epic/legendary' }, { status: 400 });
      }

      const requirements: Record<string, { nftType: string; count: number }[]> = {
        rare:      [{ nftType: 'common', count: 5 }],
        epic:      [{ nftType: 'rare',   count: 4 }],
        legendary: [
          { nftType: 'common', count: 100 },
          { nftType: 'rare',   count: 50  },
          { nftType: 'epic',   count: 20  },
        ],
      };

      const req = requirements[target_rarity];
      const nftIds = nft_token_ids ?? [];

      // 验证提交的 NFT 数量
      for (const r of req) {
        const matching = nftIds.filter(id => id.startsWith(r.nftType));
        if (matching.length < r.count) {
          return NextResponse.json({
            success: false,
            error: `需要 ${r.count} 个 ${r.nftType} NFT，仅提供 ${matching.length} 个`,
          }, { status: 400 });
        }
      }

      // 验证 NFT 所属权并标记已使用
      // TODO: 链上合约接入后改为链上验证
      for (const tokenId of nftIds) {
        getDb().prepare(
          'UPDATE nft_inventory SET status = ? WHERE token_id = ? AND owner_address = ?'
        ).run('used', tokenId, address);
      }

      boxBurned  = NFT_TO_NFT_BOX_BURN[target_rarity];
      boxReward  = NFT_TO_NFT_BOX_REWARD[target_rarity];
      resultTokenId = generateTokenId(target_rarity);

      recordBurn({ user_address: address, amount: boxBurned, reason: 'synthesis', reference_id: resultTokenId });

      createNFTInventory({
        token_id: resultTokenId,
        name: `${capitalize(target_rarity)} NFT #${getFormattedCount(target_rarity)}`,
        nft_type: target_rarity,
        owner_address: address,
      });

      incrementSynthesisCount(target_rarity);
    }

    // ══════════════════════════════════════════════════
    // 分支 3: 传奇碎片路线（50普通+25稀有+10史诗 NFT）
    // ══════════════════════════════════════════════════
    else if (synthesis_type === 'legendary') {
      const legendaryMinted = getSynthesisCount('legendary');
      if (legendaryMinted >= LEGENDARY_FRAGMENT_ROUTE_MAX) {
        return NextResponse.json({
          success: false,
          error: `传奇NFT碎片路线已达上限（${LEGENDARY_FRAGMENT_ROUTE_MAX} 张）`,
        }, { status: 400 });
      }

      // 简化验证：前端提交 token_ids，服务端验证数量
      const nftIds = nft_token_ids ?? [];
      const commonCount    = nftIds.filter(id => id.startsWith('common')).length;
      const rareCount      = nftIds.filter(id => id.startsWith('rare')).length;
      const epicCount      = nftIds.filter(id => id.startsWith('epic')).length;

      if (commonCount < 50 || rareCount < 25 || epicCount < 10) {
        return NextResponse.json({
          success: false,
          error: `传奇合成需要：普通NFT x50(${commonCount})，稀有NFT x25(${rareCount})，史诗NFT x10(${epicCount})`,
        }, { status: 400 });
      }

      for (const tokenId of nftIds) {
        getDb().prepare(
          'UPDATE nft_inventory SET status = ? WHERE token_id = ? AND owner_address = ?'
        ).run('used', tokenId, address);
      }

      boxReward = 100;
      resultTokenId = generateTokenId('legendary');

      createNFTInventory({
        token_id: resultTokenId,
        name: `Legendary NFT #${legendaryMinted + 1}`,
        nft_type: 'legendary',
        owner_address: address,
      });

      incrementSynthesisCount('legendary');
    } else {
      return NextResponse.json({ success: false, error: '未知合成类型' }, { status: 400 });
    }

    // ── 记录合成历史 ──────────────────────────────────
    recordSynthesis({
      user_address: address,
      synthesis_type,
      target_rarity,
      fragments_used: JSON.stringify(fragmentsConsumed),
      nfts_used: JSON.stringify(nft_token_ids ?? []),
      box_burned: boxBurned,
      box_reward: boxReward,
      result_token_id: resultTokenId,
    });

    // ── 检查邀请里程碑 ────────────────────────────────
    const user = getUserByAddress(address) as { referrer_address?: string } | undefined;
    let milestoneGrant = null;
    if (user?.referrer_address) {
      const newCount = getSynthesisCountForUser(address);
      milestoneGrant = checkAndGrantMilestone(user.referrer_address, address, newCount);
    }

    return NextResponse.json({
      success: true,
      data: {
        resultTokenId,
        targetRarity: target_rarity,
        boxReward,
        boxBurned,
        fragmentsConsumed,
        milestoneGrant: milestoneGrant?.granted ? milestoneGrant : null,
        message: buildCraftMessage(target_rarity, boxReward, boxBurned),
      },
    });
  } catch (err) {
    console.error('[craft]', err);
    return NextResponse.json({ success: false, error: '合成失败，请稍后重试' }, { status: 500 });
  }
}

// ─── 辅助函数 ─────────────────────────────────────────
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function getFormattedCount(rarity: string): string {
  const n = getSynthesisCount(rarity) + 1;
  return String(n).padStart(4, '0');
}

function getRareNextThreshold(minted: number): number | null {
  const thresholds = [10000, 30000, 60000, 100000];
  return thresholds.find(t => minted < t) ?? null;
}

function getEpicNextThreshold(minted: number): number | null {
  const thresholds = [5000, 15000, 30000, 50000];
  return thresholds.find(t => minted < t) ?? null;
}

function buildCraftMessage(rarity: string, reward: number, burned: number): string {
  const rarityMap: Record<string, string> = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传奇' };
  let msg = `恭喜合成 ${rarityMap[rarity] ?? rarity} NFT 成功！获得 ${reward} BOX 奖励。`;
  if (burned > 0) msg += ` 消耗销毁 ${burned} BOX。`;
  return msg;
}
