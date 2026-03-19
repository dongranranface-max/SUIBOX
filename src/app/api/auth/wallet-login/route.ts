import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Create session for wallet login
    const sessionData = {
      provider: 'wallet',
      oauthId: walletAddress,
      email: '',
      name: 'Wallet User',
      picture: '',
      suiAddress: walletAddress,
      createdAt: new Date().toISOString(),
    };

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('zklogin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: sessionData,
    });
  } catch (error) {
    console.error('Wallet login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

// Get session
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
