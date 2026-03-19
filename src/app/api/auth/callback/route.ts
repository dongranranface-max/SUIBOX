import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// zkLogin configuration
const ZKLOGIN_CONFIG = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.ZKLOGIN_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    redirectUri: process.env.ZKLOGIN_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userInfoUrl: 'https://discord.com/api/users/@me',
  },
};

// Generate zkLogin address from OAuth provider and ID
function generateZkLoginAddress(provider: string, oauthId: string): string {
  // In production, use proper zkLogin address generation
  // Format: 0x || hash(provider || oauthId || salt)
  const salt = process.env.JWT_SECRET || 'suibox_default_salt';
  const input = `${provider}:${oauthId}:${salt}`;
  
  // Simple hash for demo (in production use proper cryptographic hash)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to hex and pad to 64 characters (32 bytes)
  const hashHex = Math.abs(hash).toString(16).padStart(16, '0').repeat(4).substring(0, 64);
  return `0x${hashHex}`;
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
  const state = searchParams.get('state'); // provider name
  const error = searchParams.get('error');

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
    const tokens = await exchangeCodeForTokens(state, code);
    
    // Get user info
    const userInfo = await getUserInfo(state, tokens.access_token);
    
    // Generate Sui address from OAuth ID
    const oauthId = userInfo.id || userInfo.sub;
    const suiAddress = generateZkLoginAddress(state, oauthId);
    
    // Create session data
    const sessionData = {
      provider: state,
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

    // Redirect to profile or home
    return NextResponse.redirect(new URL('/profile', request.url));
  } catch (err: any) {
    console.error('zkLogin callback error:', err);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
