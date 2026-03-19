import { NextRequest, NextResponse } from 'next/server';

// 模拟用户数据
const users = [
  { id: 'u1', email: 'user1@email.com', name: 'User One', createdAt: '2026-01-15', status: 'active' },
  { id: 'u2', email: 'user2@email.com', name: 'User Two', createdAt: '2026-02-01', status: 'active' },
  { id: 'u3', email: 'user3@email.com', name: 'User Three', createdAt: '2026-03-01', status: 'banned' },
];

// 模拟交易数据
const transactions = [
  { id: 't1', userId: 'u1', type: 'buy_nft', amount: 99, symbol: 'SUI', status: 'completed', createdAt: '2026-03-15' },
  { id: 't2', userId: 'u2', type: 'stake', amount: 500, symbol: 'SUI', status: 'completed', createdAt: '2026-03-16' },
  { id: 't3', userId: 'u1', type: 'withdraw', amount: 50, symbol: 'SUI', status: 'pending', createdAt: '2026-03-17' },
];

// 验证管理员 session
function verifyAdmin(request: NextRequest): { adminId: string; role: string } | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  // 简化验证，生产环境应该检查真实 session
  if (token && token.startsWith('admin-')) {
    return { adminId: 'admin-001', role: 'super_admin' };
  }
  return null;
}

// 获取用户列表
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'users') {
    return NextResponse.json({ data: users });
  }
  
  if (type === 'transactions') {
    return NextResponse.json({ data: transactions });
  }

  if (type === 'stats') {
    return NextResponse.json({
      data: {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalTransactions: transactions.length,
        volume24h: 12500,
      }
    });
  }

  return NextResponse.json({ error: '无效请求' }, { status: 400 });
}

// 管理操作
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const body = await request.json();
  const { action, targetId, data } = body;

  switch (action) {
    case 'ban_user':
      const user = users.find(u => u.id === targetId);
      if (user) {
        user.status = user.status === 'active' ? 'banned' : 'active';
        return NextResponse.json({ success: true, user });
      }
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });

    case 'verify_nft':
      return NextResponse.json({ success: true, message: 'NFT 已审核' });

    case 'refund':
      return NextResponse.json({ success: true, message: '退款已处理' });

    default:
      return NextResponse.json({ error: '无效操作' }, { status: 400 });
  }
}
