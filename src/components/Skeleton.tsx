// 骨架屏组件 - 用于加载状态
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-700/50 rounded ${className}`} />
  );
}

// NFT卡片骨架屏
export function NFTCardSkeleton() {
  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden">
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// 统计卡片骨架屏
export function StatCardSkeleton() {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-6 w-32" />
    </div>
  );
}

// 列表项骨架屏
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// 轮播图骨架屏
export function BannerSkeleton() {
  return (
    <div className="h-48 md:h-64 rounded-2xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
