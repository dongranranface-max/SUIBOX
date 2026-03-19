'use client';

import { useState, useEffect, useCallback } from 'react';

interface ZkLoginUser {
  provider: string;
  oauthId: string;
  email: string;
  name: string;
  picture: string;
  suiAddress: string;
  createdAt: string;
}

interface UseZkLoginReturn {
  user: ZkLoginUser | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export function useZkLogin(): UseZkLoginReturn {
  const [user, setUser] = useState<ZkLoginUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return { user, loading, logout, refreshUser };
}

// Get session server-side (for Server Components)
export async function getServerZkLoginSession(): Promise<ZkLoginUser | null> {
  try {
    const response = await fetch('http://localhost:3000/api/auth/session', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
  } catch (error) {
    console.error('Failed to get session:', error);
  }
  return null;
}
