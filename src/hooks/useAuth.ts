'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';

interface AuthUser {
  address: string;
  name?: string;
  picture?: string;
  provider?: string;
  email?: string;
}

/**
 * 统一认证 Hook
 */
export function useAuth() {
  const { address: walletAddress, connected } = useWallet();
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取 session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        
        if (data.user?.suiAddress) {
          setUser({
            address: data.user.suiAddress,
            name: data.user.name,
            picture: data.user.picture,
            provider: data.user.provider,
            email: data.user.email,
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
    
    // 页面可见时刷新
    const handleVisibility = () => {
      if (!document.hidden) fetchSession();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    
    // 减少轮询频率（10秒）
    const interval = setInterval(fetchSession, 10000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  // 登录状态
  const hasZkLogin = !!user?.address;
  const hasWallet = !!walletAddress && connected;
  const isLoggedIn = hasZkLogin || hasWallet;
  
  // 用户地址
  const userAddress = user?.address || walletAddress || '';
  // 用户名
  const userName = user?.name || (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '');
  // 用户头像
  const userPicture = user?.picture;

  // 登录
  const login = () => {
    window.location.href = '/login';
  };

  // 退出登录
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    window.location.reload();
  };

  return {
    user,
    userAddress,
    userName,
    userPicture,
    isLoggedIn,
    hasZkLogin,
    hasWallet,
    connected,
    loading,
    login,
    logout,
  };
}
