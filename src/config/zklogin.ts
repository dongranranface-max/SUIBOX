/**
 * SUIBOX zkLogin Configuration
 * 
 * This file contains the zkLogin implementation details
 * for the SUIBOX NFT marketplace
 */

// zkLogin Provider Configuration
export const zkLoginProviders = {
  google: {
    name: 'Google',
    icon: '🔍',
    color: 'from-red-500 to-orange-500',
    scope: 'openid email profile',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  apple: {
    name: 'Apple',
    icon: '🍎',
    color: 'from-gray-800 to-gray-900',
    scope: 'name email',
    authUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
  },
  discord: {
    name: 'Discord',
    icon: '💬',
    color: 'from-indigo-500 to-purple-500',
    scope: 'identify email',
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userInfoUrl: 'https://discord.com/api/users/@me',
  },
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    color: 'from-blue-400 to-blue-600',
    scope: 'tweet.read users.read',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userInfoUrl: 'https://api.twitter.com/2/users/me',
  },
} as const;

export type ZkLoginProvider = keyof typeof zkLoginProviders;

// zkLogin Flow Steps
export const zkLoginSteps = [
  { id: 1, name: '验证 OAuth 凭证', description: '验证第三方账号授权' },
  { id: 2, name: '生成零知识证明', description: '创建 zk-SNARK 证明' },
  { id: 3, name: '创建 Sui 地址', description: '映射 OAuth ID 到链上地址' },
] as const;

// Address Generation (Simplified - In production use @mysten/zklogin)
export function generateZkLoginAddress(
  oauthProvider: string,
  oauthId: string,
  salt: string
): string {
  // In production, this would use proper zkLogin address generation
  // Format: 0x || hash(oauthProvider || oauthId || salt)
  const input = `${oauthProvider}:${oauthId}:${salt}`;
  const hash = btoa(input).replace(/[^a-zA-Z0-9]/g, '').substring(0, 64);
  return `0x${hash}`;
}

// Session Storage Key
export const ZKLOGIN_SESSION_KEY = 'suibox_zklogin_session';

// Environment Check
export function isZkLoginConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID ||
    process.env.APPLE_CLIENT_ID ||
    process.env.DISCORD_CLIENT_ID
  );
}
