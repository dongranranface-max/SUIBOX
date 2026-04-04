/**
 * /api/invite
 *
 * 邀请系统核心 API（业务文档 §3）：
 *
 * GET  ?address=    → 获取邀请统计（总数/已完成/里程碑/BOX奖励）
 * GET  ?invite_code=→ 检查邀请码有效性
 * POST action=create_invite → 创建邀请码
 * POST action=bind_invite   → 绑定邀请关系
 * POST action=claim_milestone → 领取里程碑奖励
 *
 * 奖励规则（首期激励池 200万 BOX）：
 *   好友首次合成  → 邀请人 1 BOX  / 上级 0.5 BOX
 *   好友累计第10次 → 邀请人 3 BOX / 上级 1.5 BOX
 *   好友累计第50次 → 邀请人 18 BOX / 上级 9 BOX
 *
 * 每日额外开盒次数（凌晨0点清算）：
 *   当日 1位好友开盒 → +1次 / 3位 → +2次 / 15位 → +3次（最多+6次）
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, createUser, getUserByAddress } from '@/lib/database';

// ─── 里程碑定义 ───────────────────────────────────────
const MILESTONES = [
  { count: 1,  inviterReward: 1,  referrerReward: 0.5, label: '好友首次合成' },
  { count: 10, inviterReward: 3,  referrerReward: 1.5, label: '好友累计第10次合成' },
  { count: 50, inviterReward: 18, referrerReward: 9,   label: '好友累计第50次合成' },
];

// 每日开盒加成规则
const DAILY_BOX_BONUS = [
  { minFriends: 15, bonus: 3 },
  { minFriends: 3,  bonus: 2 },
  { minFriends: 1,  bonus: 1 },
];

function generateInviteCode(): string {
  return `SBOX${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

// ─── GET ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address     = searchParams.get('address');
    const invite_code = searchParams.get('invite_code');

    // ── 验证邀请码 ──────────────────────────────────
    if (invite_code) {
      let invite: unknown = null;
      try {
        invite = db.prepare('SELECT * FROM invites WHERE invite_code = ? AND status = ?').get(invite_code, 'pending');
      } catch { /* invites table may not exist yet */ }

      return NextResponse.json({
        success: true,
        data: {
          valid: !!invite || invite_code.startsWith('SBOX'),
          inviter: invite ? (invite as Record<string, unknown>).inviter_address : null,
        },
      });
    }

    // ── 获取邀请统计 ────────────────────────────────
    if (address) {
      // 邀请总数 & 已完成
      let total = 0, accepted = 0;
      try {
        const stats = db.prepare(`
          SELECT COUNT(*) as total,
                 SUM(CASE WHEN status='accepted' THEN 1 ELSE 0 END) as accepted
          FROM invites WHERE inviter_address = ?
        `).get(address) as { total: number; accepted: number } | undefined;
        total    = stats?.total    ?? 0;
        accepted = stats?.accepted ?? 0;
      } catch { /* table may not exist */ }

      // 已授予里程碑
      let milestones: unknown[] = [];
      try {
        milestones = db.prepare(
          'SELECT * FROM invite_milestones WHERE inviter_address = ? ORDER BY milestone ASC'
        ).all(address);
      } catch { /* table may not exist */ }

      // 今日好友开盒人数（用于计算额外开盒次数）
      const today = new Date().toISOString().slice(0, 10);
      let friendsOpenedToday = 0;
      try {
        const invitees = db.prepare(
          'SELECT invitee_address FROM invites WHERE inviter_address = ? AND status = ?'
        ).all(address, 'accepted') as { invitee_address: string }[];

        if (invitees.length > 0) {
          const placeholders = invitees.map(() => '?').join(',');
          const addrs = invitees.map(i => i.invitee_address);
          const result = db.prepare(`
            SELECT COUNT(DISTINCT user_address) as cnt
            FROM daily_box_opens
            WHERE open_date = ? AND user_address IN (${placeholders})
          `).get(today, ...addrs) as { cnt: number };
          friendsOpenedToday = result?.cnt ?? 0;
        }
      } catch { /* table may not exist */ }

      // 计算今日开盒加成
      let dailyBoxBonus = 0;
      for (const rule of DAILY_BOX_BONUS) {
        if (friendsOpenedToday >= rule.minFriends) { dailyBoxBonus = rule.bonus; break; }
      }

      // 获取邀请码
      let invite_code_val = '';
      try {
        const user = db.prepare('SELECT invite_code FROM users WHERE sui_address = ?').get(address) as { invite_code?: string };
        invite_code_val = user?.invite_code ?? '';
      } catch { /* table may not exist */ }

      return NextResponse.json({
        success: true,
        stats: {
          total,
          accepted,
          pending: total - accepted,
          invite_code: invite_code_val,
          milestones,
          friendsOpenedToday,
          dailyBoxBonus,
          milestoneSchedule: MILESTONES,
          dailyBoxBonusRules: DAILY_BOX_BONUS,
        },
      });
    }

    return NextResponse.json({ success: false, error: '缺少参数' }, { status: 400 });
  } catch (err) {
    console.error('[invite GET]', err);
    return NextResponse.json({ success: false, error: '获取失败' }, { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, inviter_address, invitee_address, invite_code } = body as {
      action: string;
      inviter_address?: string;
      invitee_address?: string;
      invite_code?: string;
    };

    // ── 创建邀请码 ──────────────────────────────────
    if (action === 'create_invite') {
      if (!inviter_address) {
        return NextResponse.json({ success: false, error: '缺少邀请人地址' }, { status: 400 });
      }

      // 确保用户存在
      const user = getUserByAddress(inviter_address) as { invite_code?: string } | undefined;
      if (user?.invite_code) {
        return NextResponse.json({ success: true, data: { invite_code: user.invite_code, inviter_address } });
      }

      // 生成并保存邀请码
      const code = generateInviteCode();
      try {
        db.prepare(`UPDATE users SET invite_code = ? WHERE sui_address = ?`).run(code, inviter_address);
      } catch { /* user may not exist */ }

      // 创建邀请表记录
      try {
        db.exec(`
          CREATE TABLE IF NOT EXISTS invites (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            invite_code     TEXT    UNIQUE NOT NULL,
            inviter_address TEXT    NOT NULL,
            invitee_address TEXT,
            status          TEXT    DEFAULT 'pending',
            created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
            accepted_at     DATETIME
          )
        `);
      } catch { /* table may already exist */ }

      try {
        db.prepare(
          'INSERT OR IGNORE INTO invites (invite_code, inviter_address) VALUES (?, ?)'
        ).run(code, inviter_address);
      } catch (e) { console.warn('[invite] insert failed', e); }

      return NextResponse.json({ success: true, data: { invite_code: code, inviter_address } });
    }

    // ── 绑定邀请关系 ────────────────────────────────
    if (action === 'bind_invite' || action === 'bind') {
      if (!invite_code || !invitee_address) {
        return NextResponse.json({ success: false, error: '缺少邀请码或被邀请人地址' }, { status: 400 });
      }

      // 防止自邀
      let invite: Record<string, string> | undefined;
      try {
        invite = db.prepare('SELECT * FROM invites WHERE invite_code = ?').get(invite_code) as Record<string, string>;
      } catch { /* table may not exist */ }

      if (!invite) {
        return NextResponse.json({ success: false, error: '邀请码无效' }, { status: 400 });
      }
      if (invite.inviter_address === invitee_address) {
        return NextResponse.json({ success: false, error: '不能使用自己的邀请码' }, { status: 400 });
      }
      if (invite.status === 'accepted') {
        return NextResponse.json({ success: false, error: '邀请码已被使用' }, { status: 400 });
      }

      // 检查被邀请人是否已有邀请人
      const existingUser = getUserByAddress(invitee_address) as { referrer_address?: string } | undefined;
      if (existingUser?.referrer_address) {
        return NextResponse.json({ success: false, error: '您已经绑定了邀请关系' }, { status: 400 });
      }

      // 更新邀请记录
      try {
        db.prepare(`
          UPDATE invites SET invitee_address = ?, status = 'accepted', accepted_at = CURRENT_TIMESTAMP
          WHERE invite_code = ?
        `).run(invitee_address, invite_code);
      } catch { /* table may not exist */ }

      // 更新用户邀请人
      try {
        db.prepare(
          'UPDATE users SET referrer_address = ? WHERE sui_address = ?'
        ).run(invite.inviter_address, invitee_address);
      } catch { /* user may not exist */ }

      return NextResponse.json({
        success: true,
        message: '邀请关系绑定成功',
        data: { inviter: invite.inviter_address, invitee: invitee_address },
      });
    }

    // ── 领取里程碑奖励 ──────────────────────────────
    if (action === 'claim_milestone') {
      const { address, milestone_id } = body as { address: string; milestone_id: number };

      if (!address || !milestone_id) {
        return NextResponse.json({ success: false, error: '缺少参数' }, { status: 400 });
      }

      let milestoneRow: Record<string, unknown> | undefined;
      try {
        milestoneRow = db.prepare(
          'SELECT * FROM invite_milestones WHERE id = ? AND inviter_address = ? AND status = ?'
        ).get(milestone_id, address, 'granted') as Record<string, unknown>;
      } catch { /* table may not exist */ }

      if (!milestoneRow) {
        return NextResponse.json({ success: false, error: '奖励不存在或已领取' }, { status: 404 });
      }

      try {
        db.prepare(
          'UPDATE invite_milestones SET status = ?, rewarded_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).run('claimed', milestone_id);
      } catch { /* table may not exist */ }

      // TODO: 链上发放 BOX 给 inviter_address
      // await contract.transferBOX(address, milestoneRow.inviter_reward);

      return NextResponse.json({
        success: true,
        data: {
          milestoneId: milestone_id,
          reward: milestoneRow.inviter_reward,
          message: `成功领取 ${milestoneRow.inviter_reward} BOX 里程碑奖励！`,
        },
      });
    }

    return NextResponse.json({ success: false, error: '未知操作' }, { status: 400 });
  } catch (err) {
    console.error('[invite POST]', err);
    return NextResponse.json({ success: false, error: '操作失败' }, { status: 500 });
  }
}
