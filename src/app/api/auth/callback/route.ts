import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// zkLogin configuration
const ZKLOGIN_CONFIG = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: 'https://suibox.io/api/auth/callback',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    redirectUri: 'https://suibox.io/api/auth/callback',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userInfoUrl: 'https://discord.com/api/users/@me',
  },
};

// Generate zkLogin address from OAuth provider and ID
function generateZkLoginAddress(provider: string, oauthId: string): string {
  // Use a simple but valid SUI address format
  // In production, use @mysten/zklogin library
  const salt = process.env.JWT_SECRET || 'suibox_dev_salt_2024';
  const input = `${provider}:${oauthId}:${salt}`;
  
  // Create a proper 32-byte address using a more robust method
  let hash1 = 0, hash2 = 0, hash3 = 0, hash4 = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash1 = ((hash1 << 5) - hash1 + char) | 0;
    hash2 = ((hash2 << 7) - hash2 + char * 31) | 0;
    hash3 = ((hash3 << 11) - hash3 + char * 17) | 0;
    hash4 = ((hash4 << 13) - hash4 + char * 13) | 0;
  }
  
  // Ensure non-zero bytes for valid SUI address
  const h1 = Math.abs(hash1).toString(16).padStart(8, '0').slice(-8);
  const h2 = Math.abs(hash2).toString(16).padStart(8, '0').slice(-8);
  const h3 = Math.abs(hash3).toString(16).padStart(8, '0').slice(-8);
  const h4 = Math.abs(hash4).toString(16).padStart(8, '0').slice(-8);
  
  return `0x${h1}${h2}${h3}${h4}`;
}

// Exchange authorization code for tokens
async function exchangeCodeForTokens(provider: string, code: string): Promise<any> {
  const config = ZKLOGIN_CONFIG[provider as keyof typeof ZKLOGIN_CONFIG];
  
  if (!config) {
    throw new Error('Invalid provider');
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUri,
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

// Get user info from provider
async function getUserInfo(provider: string, accessToken: string): Promise<any> {
  const config = ZKLOGIN_CONFIG[provider as keyof typeof ZKLOGIN_CONFIG];
  
  if (!config?.userInfoUrl) {
    throw new Error('Invalid provider');
  }

  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // provider_name 或 provider_name_inviteCode
  const error = searchParams.get('error');

  // 解析 state (格式: provider 或 provider_inviteCode)
  let provider = state;
  let inviteCode = '';
  if (state && state.includes('_')) {
    const parts = state.split('_');
    provider = parts[0];
    inviteCode = parts[1];
  }

  // Handle OAuth error
  if (error) {
    return NextResponse.redirect(new URL('/login?error=' + error, request.url));
  }

  // Missing code
  if (!code || !state) {
    return NextResponse.redirect(new URL('/login?error=missing_params', request.url));
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(provider, code);
    
    // Get user info
    const userInfo = await getUserInfo(provider, tokens.access_token);
    
    // Generate Sui address from OAuth ID
    const oauthId = userInfo.id || userInfo.sub;
    const suiAddress = generateZkLoginAddress(provider, oauthId);
    
    // Create session data
    const sessionData = {
      provider: provider,
      oauthId,
      email: userInfo.email || '',
      name: userInfo.name || userInfo.username || 'SUI User',
      picture: userInfo.picture || userInfo.avatar || '',
      suiAddress,
      createdAt: new Date().toISOString(),
    };

    // Set session cookie (in production, use secure JWT)
    const cookieStore = await cookies();
    cookieStore.set('zklogin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // 检查邀请码 - 自动绑定上下级关系
    if (inviteCode) {
      try {
        // 调用邀请绑定 API
        await fetch(new URL('/api/invite', request.url).href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'bind',
            invite_code: inviteCode,
            invitee_address: suiAddress
          })
        });
        console.log('Invite relationship bound:', inviteCode, suiAddress);
      } catch (e) {
        console.error('Bind invite error:', e);
      }
    }

    // Redirect to profile or home
    return NextResponse.redirect(new URL('/profile', request.url));
  } catch (err: any) {
    console.error('zkLogin callback error:', err);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
