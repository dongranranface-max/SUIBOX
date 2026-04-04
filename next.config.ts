import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
  // 忽略TypeScript错误以加快构建
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
