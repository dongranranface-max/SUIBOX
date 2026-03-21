'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, TrendingUp, Calendar, ExternalLink, X, Pin, AlertTriangle, Gift, Zap, Shield } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// 模拟公告数据
const announcements = [
  {
    id: 1,
    type: 'important',
    typeText: '重要公告',
    icon: '🔴',
    title: '系统升级通知',
    content: 'SUIBOX 将于 2026-03-16 02:00-04:00 UTC 进行系统升级，届时部分功能可能短暂不可用，请提前做好准备。升级完成后将恢复所有服务，感谢理解！',
    time: '2026-03-15 14:00',
    pinned: true,
  },
  {
    id: 2,
    type: 'activity',
    typeText: '活动公告',
    icon: '🟠',
    title: '周末双倍奖励活动',
    content: '本周六、周日所有质押用户享受双倍收益！活动时间：2026-03-21 00:00 - 2026-03-23 23:59 UTC',
    time: '2026-03-14 10:00',
    pinned: true,
  },
  {
    id: 3,
    type: 'update',
    typeText: '更新公告',
    icon: '🟢',
    title: '新功能上线：NFT 质押挖矿',
    content: '全新 NFT 质押挖矿功能正式上线！持有 NFT 参与质押，每日获取 BOX 奖励。稀有 NFT 享受更高算力权重，最高 5 倍收益！',
    time: '2026-03-13 09:00',
    pinned: false,
  },
  {
    id: 4,
    type: 'governance',
    typeText: '治理公告',
    icon: '🔵',
    title: '社区提案通过公告',
    content: '提案 #2 "降低盲盒手续费至5%" 已投票通过，将于 3 月 20 日正式执行。感谢社区参与治理！',
    time: '2026-03-12 18:00',
    pinned: false,
  },
  {
    id: 5,
    type: 'warning',
    typeText: '风险提示',
    icon: '🟡',
    title: '谨防诈骗公告',
    content: '近期发现冒充 SUIBOX 官方的诈骗行为，请注意：官方不会索要您的私钥，也不会通过私信发送链接。请通过官方渠道获取信息，谨防受骗！',
    time: '2026-03-10 12:00',
    pinned: false,
  },
];

const typeConfig: Record<string, { bg: string; text: string; icon: any }> = {
  important: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertTriangle },
  activity: { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: Gift },
  update: { bg: 'bg-green-500/20', text: 'text-green-400', icon: Zap },
  governance: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Shield },
  warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle },
};

export default function AnnouncementsPage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof announcements[0] | null>(null);
  
  const pinnedAnnouncements = announcements.filter(a => a.pinned);
  const normalAnnouncements = announcements.filter(a => !a.pinned);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 头部 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-violet-900/30 to-black py-6 md:py-10">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, violet 0%, transparent 50%)' }} />
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 flex items-center gap-2 md:gap-3">
              <Bell className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
              平台公告
            </h1>
            <p className="text-gray-400 text-sm md:text-base">了解 SUIBOX 最新动态和重要通知</p>
            
            {/* 统计 */}
            <div className="flex gap-2 md:gap-4 mt-4 md:mt-6">
              <div className="bg-white/5 rounded-xl px-3 md:px-4 py-2 border border-white/10 min-h-[44px] flex items-center">
                <span className="text-amber-400 font-bold">{announcements.length}</span>
                <span className="text-gray-400 text-sm ml-1">条公告</span>
              </div>
              <div className="bg-white/5 rounded-xl px-3 md:px-4 py-2 border border-white/10 min-h-[44px] flex items-center">
                <span className="text-red-400 font-bold">{pinnedAnnouncements.length}</span>
                <span className="text-gray-400 text-sm ml-1">条置顶</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-4 md:py-8">
        {/* 置顶公告 */}
        {pinnedAnnouncements.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="w-5 h-5 text-amber-400" />
              <span className="font-bold">置顶公告</span>
            </div>
            <div className="space-y-4">
              {pinnedAnnouncements.map((announcement) => {
                const config = typeConfig[announcement.type];
                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedAnnouncement(announcement)}
                    className={`${config.bg} rounded-xl p-3 md:p-4 border cursor-pointer hover:opacity-80 transition min-h-[44px] md:min-h-auto`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        <span className="text-xl md:text-2xl flex-shrink-0">{announcement.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm md:text-base truncate">{announcement.title}</h3>
                            <span className={`${config.text} text-xs px-2 py-0.5 rounded-full ${config.bg} flex-shrink-0`}>
                              {announcement.typeText}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {announcement.time}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 普通公告 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="font-bold">最新公告</span>
          </div>
          <div className="space-y-3">
            {normalAnnouncements.map((announcement) => {
              const config = typeConfig[announcement.type];
              return (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10 cursor-pointer hover:bg-white/10 transition min-h-[44px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <span className="text-lg md:text-xl flex-shrink-0">{announcement.icon}</span>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm md:text-base truncate">{announcement.title}</h3>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {announcement.time}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 公告详情弹窗 */}
      {selectedAnnouncement && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-gray-900 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto border-t md:border border-gray-700 md:border-white/20"
            onClick={e => e.stopPropagation()}
          >
            {/* 移动端顶部装饰条 */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-12 h-1 bg-gray-600 rounded-full" />
            </div>
            
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedAnnouncement.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-xs ${typeConfig[selectedAnnouncement.type].bg} ${typeConfig[selectedAnnouncement.type].text}`}>
                    {selectedAnnouncement.typeText}
                  </span>
                </div>
                <button onClick={() => setSelectedAnnouncement(null)} className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white bg-white/10 rounded-full md:bg-transparent md:rounded-none min-w-[44px]">
                  ✕
                </button>
              </div>
              
              <h2 className="text-lg md:text-xl font-bold mb-2">{selectedAnnouncement.title}</h2>
              <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {selectedAnnouncement.time}
              </div>
              
              <div className="bg-black/30 rounded-xl p-3 md:p-4 text-gray-300 whitespace-pre-wrap text-sm md:text-base">
                {selectedAnnouncement.content}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
