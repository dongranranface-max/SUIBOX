import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 静态资源优化
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '..'),
  // 忽略TypeScript错误用于构建
  typescript: {
    ignoreBuildErrors: true,
  },
  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'] as const,
  },
  // 生产优化
  compress: true,
  poweredByHeader: false,
  // 静态资源优化
  experimental: {
    optimizePackageImports: ['lucide-react', '@mysten/dapp-kit'],
  },
};

export default nextConfig;
