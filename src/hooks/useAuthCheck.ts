'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ZkLoginUser {
  provider: string;
  oauthId: string;
  email: string;
  name: string;
  picture: string;
  suiAddress: string;
  createdAt: string;
}

// 需要登录的页面路径
const protectedPaths = [
  '/create',
  '/profile',
  '/institution',
  '/mine',
  '/box-stake',
  '/governance',
];

// 公开页面（不需要登录）
const publicPaths = [
  '/',
  '/login',
  '/market',
  '/auction',
  '/box',
  '/craft',
  '/stake',
  '/ranking',
  '/invite',
  '/join',
  '/announcements',
  '/privacy',
  '/terms',
  '/security',
  '/support',
  '/nft',
];

export function useAuthCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ZkLoginUser | null>(null);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      const isLoggedIn = !!data.user;
      const isPublicPage = publicPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      );
      const isProtectedPage = protectedPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      );

      setUser(data.user);

      // 需要登录但未登录
      if (isProtectedPage && !isLoggedIn) {
        // 保存当前页面，登录后跳转回来
        const redirectUrl = encodeURIComponent(pathname);
        router.push(`/login?redirect=${redirectUrl}`);
        return;
      }

      // 已登录但访问登录页
      if (pathname === '/login' && isLoggedIn) {
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        router.push(redirect || '/profile');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, isLoggedIn: !!user };
}

// 登录检查组件
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuthCheck();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return <>{children}</>;
}
