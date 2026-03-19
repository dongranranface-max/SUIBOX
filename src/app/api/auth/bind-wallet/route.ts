import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In-memory store for bound wallets (in production, use database)
const boundWallets = new Map<string, string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zkloginAddress, walletAddress } = body;

    if (!zkloginAddress || !walletAddress) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    // Check if wallet already bound to another account
    for (const [zkAddr, walletAddr] of boundWallets.entries()) {
      if (walletAddr === walletAddress && zkAddr !== zkloginAddress) {
        return NextResponse.json({ 
          success: false, 
          error: '此钱包已绑定到其他账户' 
        }, { status: 400 });
      }
    }

    // Bind wallet to zkLogin address
    boundWallets.set(zkloginAddress, walletAddress);

    // Update session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('zklogin_session');

    if (sessionCookie?.value) {
      const session = JSON.parse(sessionCookie.value);
      session.boundWallet = walletAddress;
      cookieStore.set('zklogin_session', JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return NextResponse.json({
      success: true,
      message: '钱包绑定成功',
      boundWallet: walletAddress,
    });
  } catch (error) {
    console.error('Bind wallet error:', error);
    return NextResponse.json({ 
      success: false, 
      error: '绑定失败' 
    }, { status: 500 });
  }
}

// Get bound wallet
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zkloginAddress = searchParams.get('address');

  if (!zkloginAddress) {
    return NextResponse.json({ 
      success: false, 
      error: 'Address required' 
    }, { status: 400 });
  }

  const boundWallet = boundWallets.get(zkloginAddress);

  return NextResponse.json({
    success: true,
    boundWallet: boundWallet || null,
  });
}

// Unbind wallet
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { zkloginAddress } = body;

    if (!zkloginAddress) {
      return NextResponse.json({ 
        success: false, 
        error: 'Address required' 
      }, { status: 400 });
    }

    boundWallets.delete(zkloginAddress);

    return NextResponse.json({
      success: true,
      message: '钱包已解绑',
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: '解绑失败' 
    }, { status: 500 });
  }
}
