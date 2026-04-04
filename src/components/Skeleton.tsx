'use client';

import { motion } from 'framer-motion';

export function NFTCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="flex justify-between pt-3 border-t border-gray-800">
          <div className="h-4 bg-gray-800 rounded w-16" />
          <div className="h-4 bg-gray-800 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export function AuctionCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="h-8 bg-gray-800 rounded w-full mt-4" />
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return <div className="h-64 md:h-80 bg-gray-800 rounded-2xl animate-pulse" />;
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-20 mb-2" />
      <div className="h-8 bg-gray-700 rounded w-32" />
    </div>
  );
}

export function NFTCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <NFTCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function FullPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-white text-lg font-medium">Loading...</p>
      </div>
    </motion.div>
  );
}
