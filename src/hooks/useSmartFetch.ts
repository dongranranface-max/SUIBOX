'use client';

import { useEffect, useRef, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// 全局缓存
const globalCache = new Map<string, CacheItem<any>>();
const DEFAULT_DURATION = 30000; // 30秒默认缓存

// 获取缓存数据
export function getCachedData<T>(key: string, duration = DEFAULT_DURATION): T | null {
  const item = globalCache.get(key);
  if (item && Date.now() - item.timestamp < duration) {
    return item.data as T;
  }
  return null;
}

// 设置缓存数据
export function setCachedData<T>(key: string, data: T): void {
  globalCache.set(key, { data, timestamp: Date.now() });
}

// 清除指定缓存
export function clearCache(key?: string): void {
  if (key) {
    globalCache.delete(key);
  } else {
    globalCache.clear();
  }
}

// 智能fetch hook - 自动缓存
export function useSmartFetch<T>(
  url: string,
  options?: {
    duration?: number;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  const { duration = DEFAULT_DURATION, enabled = true, onSuccess, onError } = options || {};
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;
    
    // 检查缓存
    if (!force) {
      const cached = getCachedData<T>(url, duration);
      if (cached) {
        onSuccess?.(cached);
        return cached;
      }
    }

    // 取消之前的请求
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    try {
      const res = await fetch(url, { signal: abortRef.current.signal });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      
      // 缓存数据
      setCachedData(url, data);
      
      onSuccess?.(data);
      return data;
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        onError?.(err instanceof Error ? err : new Error('Unknown error'));
      }
      return null;
    }
  }, [url, duration, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [url, enabled]);

  return { refetch: () => fetchData(true) };
}

// 批量获取数据 - 优化多API请求
export async function batchFetch<T extends Record<string, string>>(
  endpoints: T
): Promise<{ [K in keyof T]?: any }> {
  const cacheKeys = Object.keys(endpoints);
  const results: Record<string, any> = {};

  // 先从缓存获取
  cacheKeys.forEach(key => {
    const cached = getCachedData(key);
    if (cached) {
      results[key] = cached;
    }
  });

  // 获取未缓存的keys
  const uncachedKeys = cacheKeys.filter(key => !(key in results));

  if (uncachedKeys.length === 0) {
    return results as { [K in keyof T]?: any };
  }

  // 并行请求未缓存的数据
  const promises = uncachedKeys.map(async (key) => {
    try {
      const res = await fetch(endpoints[key]);
      const data = await res.json();
      setCachedData(key, data);
      return { key, data };
    } catch {
      return { key, data: null };
    }
  });

  const fetched = await Promise.all(promises);
  
  fetched.forEach(({ key, data }) => {
    if (data) {
      results[key] = data;
    }
  });

  return results as { [K in keyof T]?: any };
}
