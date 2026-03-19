'use client';

import { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';

// 懒加载非首屏组件
export const MarketGrid = dynamic(() => import('@/components/MarketGrid'), {
  loading: () => <div className="animate-pulse bg-gray-800 h-96 rounded-xl" />
});

export const NFTCard = dynamic(() => import('@/components/NFTCard'), {
  loading: () => <div className="animate-pulse bg-gray-800 h-64 rounded-xl" />
});

export const WalletButton = dynamic(() => import('@/components/WalletButton'), {
  ssr: false
});

export const ConnectModal = dynamic(() => import('@/components/ConnectModal'), {
  ssr: false
});

// Loading 组件
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  return (
    <div className={`${sizeClass[size]} border-2 border-violet-500 border-t-transparent rounded-full animate-spin`} />
  );
}

// Skeleton 组件
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded ${className}`} />;
}

// 错误边界组件
export function ErrorFallback({ 
  message, 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-400 mb-4">⚠️</div>
      <p className="text-gray-400 mb-4">{message || '加载失败'}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
        >
          重试
        </button>
      )}
    </div>
  );
}

// Suspense 包装器
export function withSuspense<T extends React.ComponentType<any>>(
  Component: T,
  fallback?: React.ReactNode
) {
  return function WrappedComponent(props: any) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

export { Suspense, lazy, dynamic };
