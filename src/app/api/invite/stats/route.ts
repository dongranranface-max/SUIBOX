import { NextRequest, NextResponse } from 'next/server';

// 模拟邀请数据（内存存储）
const inviteRecords = new Map<string, { invite_code: string; inviter_address: string; invitee_address?: string; status: string; createdAt: string; acceptedAt?: string }>();

// 生成邀请码
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// POST - 创建邀请码 / 绑定邀请关系
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviter_address, invitee_address, action } = body;

    if (action === 'create') {
      // 创建邀请码
      const invite_code = generateInviteCode();
      inviteRecords.set(invite_code, {
        invite_code,
        inviter_address,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        data: { invite_code, inviter_address }
      });
    }

    if (action === 'bind') {
      // 绑定邀请关系
      const { invite_code } = body;
      const record = inviteRecords.get(invite_code);

      if (!record) {
        return NextResponse.json(
          { success: false, error: '邀请码无效' },
          { status: 400 }
        );
      }

      if (record.status === 'accepted') {
        return NextResponse.json(
          { success: false, error: '邀请码已使用' },
          { status: 400 }
        );
      }

      // 更新记录
      record.invitee_address = invitee_address;
      record.status = 'accepted';
      record.acceptedAt = new Date().toISOString();
      inviteRecords.set(invite_code, record);

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
      const record = inviteRecords.get(invite_code);
      
      if (record) {
        return NextResponse.json({
          success: true,
          data: { 
            valid: record.status === 'pending',
            inviter: record.inviter_address 
          }
        });
      }
      
      return NextResponse.json({
        success: true,
        data: { valid: true } // 新邀请码
      });
    }

    if (address) {
      // 获取用户的邀请统计
      let total = 0;
      let accepted = 0;
      
      inviteRecords.forEach((record) => {
        if (record.inviter_address === address) {
          total++;
          if (record.status === 'accepted') accepted++;
        }
      });
      
      return NextResponse.json({
        success: true,
        stats: { total, accepted }
      });
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
