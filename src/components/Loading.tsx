'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 加载动画组件
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-2 border-violet-500/30 border-t-violet-500 rounded-full`}
      />
    </div>
  );
}

// 骨架屏组件
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded ${className}`} />
  );
}

// 全屏加载组件
export function FullPageLoader({ message = '加载中...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  );
}

// 错误提示组件
export function ErrorMessage({ 
  message, 
  onRetry, 
  className = '' 
}: { 
  message: string; 
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-red-500/10 border border-red-500/30 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-red-400 text-xl">⚠️</span>
        <div className="flex-1">
          <p className="text-red-300">{message}</p>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg text-sm"
          >
            重试
          </button>
        )}
      </div>
    </motion.div>
  );
}

// 空状态组件
export function EmptyState({ 
  icon = '📭', 
  title = '暂无数据', 
  description = '',
  action,
}: { 
  icon?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-xl font-bold text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action}
    </div>
  );
}

// 成功提示组件
export function SuccessToast({ message, onClose }: { message: string; onClose?: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500/20 border border-green-500/40 rounded-xl px-6 py-3 flex items-center gap-3 z-50"
    >
      <span className="text-green-400">✅</span>
      <span className="text-green-300">{message}</span>
    </motion.div>
  );
}

// 确认弹窗组件
export function ConfirmModal({
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  danger = false,
}: {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9 }} 
        animate={{ scale: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-bold ${
              danger 
                ? 'bg-red-600 hover:bg-red-500' 
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 带加载状态的按钮
export function LoadingButton({
  loading,
  children,
  onClick,
  disabled,
  className = '',
  ...props
}: {
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <LoadingSpinner size="sm" />
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}

// 数据获取Hook
export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
}
