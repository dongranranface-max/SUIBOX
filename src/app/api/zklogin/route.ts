import { NextRequest, NextResponse } from 'next/server';

// zkLogin configuration
const ZKLOGIN_CONFIG = {
  // In production, these should be environment variables
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: 'https://suibox.io/api/auth/callback',
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID || '',
    teamId: process.env.APPLE_TEAM_ID || '',
    keyId: process.env.APPLE_KEY_ID || '',
    redirectUri: 'https://suibox.io/api/auth/callback',
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    redirectUri: 'https://suibox.io/api/auth/callback',
  },
};

// Generate OAuth URL for zkLogin
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const provider = searchParams.get('provider');
  const invite_code = searchParams.get('invite_code');
  
  if (!provider || !['google', 'apple', 'discord', 'twitter'].includes(provider)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  }

  const config = ZKLOGIN_CONFIG[provider as keyof typeof ZKLOGIN_CONFIG];
  
  // 邀请码附加到 state 中传递给回调
  const state = invite_code ? `${provider}_${invite_code}` : provider;
  
  // In production, generate proper OAuth URL
  // This is a simplified version for demonstration
  const oauthUrls: Record<string, string> = {
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=openid email profile&state=${state}`,
    apple: `https://appleid.apple.com/auth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_mode=form_post&scope=name email&state=${state}`,
    discord: `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=identify email&state=${state}`,
    twitter: `https://twitter.com/i/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=tweet.read users.read&state=${provider}`,
  };

  return NextResponse.json({
    url: oauthUrls[provider],
    provider,
  });
}

// Handle OAuth callback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, provider, nonce } = body;

    if (!code || !provider) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // In production:
    // 1. Exchange code for access token
    // 2. Get user info from OAuth provider
    // 3. Generate zkLogin proof
    // 4. Create Sui address from OAuth ID + salt
    
    // Simulated response
    const userInfo = {
      provider,
      oauthId: `oauth_${Date.now()}`,
      email: 'user@example.com',
      name: 'SUI User',
    };

    // Generate pseudo Sui address (in production, use proper zkLogin address generation)
    const salt = Math.random().toString(36).substring(2);
    const suiAddress = `0x${Buffer.from(userInfo.oauthId + salt).toString('hex').substring(0, 64)}`;

    return NextResponse.json({
      success: true,
      user: userInfo,
      address: suiAddress,
      message: 'zkLogin successful. In production, this would create a proper zkLogin session.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
