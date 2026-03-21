import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 演示登录 - 用于快速测试
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, address, name, email } = body;

    // 生成模拟用户数据
    const user = {
      id: `user_${Date.now()}`,
      suiAddress: address || `0x${Math.random().toString(16).slice(2, 66).padEnd(64, '0')}`,
      provider: type || 'demo',
      name: name || 'Demo User',
      email: email || 'demo@suibox.io',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      inviteCode: `SUIBOX${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // 设置 session cookie
    const cookieStore = await cookies();
    cookieStore.set('zklogin_session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user,
      message: 'Demo login successful',
    });
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

// 获取当前会话
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('zklogin_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null });
    }

    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
