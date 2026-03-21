'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function InviteRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const inviteCode = params.code as string;

  useEffect(() => {
    if (inviteCode) {
      // 保存邀请码到 localStorage
      localStorage.setItem('invite_code', inviteCode);
      
      // 跳转到登录页，携带邀请码
      router.replace(`/login?invite=${inviteCode}`);
    } else {
      router.replace('/login');
    }
  }, [inviteCode, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">正在跳转...</p>
      </div>
    </div>
  );
}
