import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 模拟数据存储 (生产环境应使用数据库)
const db = {
  users: new Map(),
  nfts: new Map(),
  boxes: new Map(),
  transactions: new Map(),
};

// =================== 用户 API ===================

// 获取当前用户信息
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('zklogin_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

// 更新用户信息
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('zklogin_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const user = JSON.parse(sessionCookie.value);
    const updates = await request.json();

    // 更新用户数据
    const updatedUser = { ...user, ...updates };
    
    // 保存到 session
    cookieStore.set('zklogin_session', JSON.stringify(updatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

// 退出登录
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('zklogin_session');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: '退出失败' }, { status: 500 });
  }
}
