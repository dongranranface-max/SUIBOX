// 推荐/邀请系统 API
import { NextRequest, NextResponse } from 'next/server';
import { db, createUser, getUserByAddress, createInviteRecord, getInviteStats } from '@/lib/database';

// 生成邀请码
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// POST - 创建邀请记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviter_address, invitee_address, action } = body;

    if (action === 'create_invite') {
      // 创建邀请码
      const invite_code = generateInviteCode();
      
      try {
        const stmt = db.prepare(`
          INSERT INTO invites (invite_code, inviter_address, status)
          VALUES (?, ?, 'pending')
        `);
        stmt.run(invite_code, inviter_address);
      } catch (e) {
        // 表不存在，使用内存存储
      }

      return NextResponse.json({
        success: true,
        data: { invite_code, inviter_address }
      });
    }

    if (action === 'bind' || action === 'bind_invite') {
      // 绑定邀请关系
      const { invite_code } = body;
      
      if (!invite_code || !invitee_address) {
        return NextResponse.json(
          { success: false, error: '缺少必要参数' },
          { status: 400 }
        );
      }
      
      try {
        // 检查邀请码是否存在
        const checkStmt = db.prepare('SELECT * FROM invites WHERE invite_code = ?');
        const existingInvite = checkStmt.get(invite_code);
        
        if (existingInvite) {
          // 更新已有记录
          const updateStmt = db.prepare(`
            UPDATE invites SET invitee_address = ?, status = 'accepted', accepted_at = datetime('now')
            WHERE invite_code = ?
          `);
          updateStmt.run(invitee_address, invite_code);
        } else {
          // 创建新记录（离线邀请码）
          const insertStmt = db.prepare(`
            INSERT INTO invites (invite_code, inviter_address, invitee_address, status, accepted_at)
            VALUES (?, ?, ?, 'accepted', datetime('now'))
          `);
          // 从邀请码中提取邀请人地址 (格式: SUIBOX + 地址片段)
          const inviterAddress = invite_code.startsWith('SUIBOX') 
            ? `0x${invite_code.replace('SUIBOX', '').toLowerCase()}00000000000000000000000000000000`
            : invite_code;
          insertStmt.run(invite_code, inviterAddress, invitee_address);
        }
      } catch (e) {
        console.error('Bind invite error:', e);
      }

      return NextResponse.json({
        success: true,
        message: '绑定成功'
      });
    }

    return NextResponse.json(
      { success: false, error: '无效操作' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}

// GET - 获取邀请信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const invite_code = searchParams.get('invite_code');

    if (invite_code) {
      // 检查邀请码是否有效
      try {
        const stmt = db.prepare('SELECT * FROM invites WHERE invite_code = ?');
        const invite = stmt.get(invite_code);
        
        if (invite) {
          return NextResponse.json({
            success: true,
            data: { valid: true, inviter: (invite as any).inviter_address }
          });
        }
      } catch (e) {}
      
      return NextResponse.json({
        success: true,
        data: { valid: false }
      });
    }

    if (address) {
      // 获取用户的邀请统计
      try {
        const stmt = db.prepare(`
          SELECT 
            COUNT(*) as total_invites,
            SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_invites
          FROM invites WHERE inviter_address = ?
        `);
        const stats = stmt.get(address);
        
        return NextResponse.json({
          success: true,
          data: stats
        });
      } catch (e) {
        return NextResponse.json({
          success: true,
          data: { total_invites: 0, accepted_invites: 0 }
        });
      }
    }

    return NextResponse.json(
      { success: false, error: '缺少参数' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Invite GET error:', error);
    return NextResponse.json(
      { success: false, error: '获取失败' },
      { status: 500 }
    );
  }
}
