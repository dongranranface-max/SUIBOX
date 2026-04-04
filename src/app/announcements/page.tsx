'use client';

import { useState, useEffect } from 'react';
import { Bell, Pin, ExternalLink, ArrowLeft, Loader2, Megaphone, Gift, Zap, Info, Clock, Star, Share2, Check, Twitter, Link2, Send } from 'lucide-react';

// 标记通知为已读
function markNotificationsAsRead(notificationIds: string[]) {
  if (typeof window === 'undefined') return;
  const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
  const newReadIds = [...new Set([...readIds, ...notificationIds])];
  localStorage.setItem('readNotifications', JSON.stringify(newReadIds));
}

interface Announcement {
  id: number;
  type?: string;
  typeText?: string;
  title: string;
  content: string;
  time: string;
  isPinned?: boolean;
}

const typeStyles: Record<string, { 
  bg: string; 
  text: string; 
  dot: string; 
  border: string; 
  label: string;
  gradient: string;
  iconBg: string;
  icon: React.ElementType;
  accent: string;
}> = {
  system: { 
    bg: 'bg-blue-500/20', 
    text: 'text-blue-400', 
    dot: 'bg-blue-500', 
    border: 'border-blue-500/30', 
    label: 'System', 
    gradient: 'from-blue-600/20 via-blue-500/10 to-transparent', 
    iconBg: 'bg-blue-500/20', 
    icon: Info,
    accent: '#3b82f6'
  },
  announcement: { 
    bg: 'bg-rose-500/20', 
    text: 'text-rose-400', 
    dot: 'bg-rose-500', 
    border: 'border-rose-500/30', 
    label: 'Announcement', 
    gradient: 'from-rose-600/20 via-rose-500/10 to-transparent', 
    iconBg: 'bg-rose-500/20', 
    icon: Megaphone,
    accent: '#f43f5e'
  },
  promotion: { 
    bg: 'bg-amber-500/20', 
    text: 'text-amber-400', 
    dot: 'bg-amber-500', 
    border: 'border-amber-500/30', 
    label: 'Promotion', 
    gradient: 'from-amber-600/20 via-amber-500/10 to-transparent', 
    iconBg: 'bg-amber-500/20', 
    icon: Gift,
    accent: '#f59e0b'
  },
  activity: { 
    bg: 'bg-emerald-500/20', 
    text: 'text-emerald-400', 
    dot: 'bg-emerald-500', 
    border: 'border-emerald-500/30', 
    label: 'Event', 
    gradient: 'from-emerald-600/20 via-emerald-500/10 to-transparent', 
    iconBg: 'bg-emerald-500/20', 
    icon: Zap,
    accent: '#10b981'
  },
  important: { 
    bg: 'bg-red-500/20', 
    text: 'text-red-400', 
    dot: 'bg-red-500', 
    border: 'border-red-500/30', 
    label: 'Important', 
    gradient: 'from-red-600/20 via-red-500/10 to-transparent', 
    iconBg: 'bg-red-500/20', 
    icon: Megaphone,
    accent: '#ef4444'
  },
  activity_old: { 
    bg: 'bg-orange-500/20', 
    text: 'text-orange-400', 
    dot: 'bg-orange-500', 
    border: 'border-orange-500/30', 
    label: 'Event', 
    gradient: 'from-orange-600/20 via-orange-500/10 to-transparent', 
    iconBg: 'bg-orange-500/20', 
    icon: Zap,
    accent: '#f97316'
  },
};

function AnnouncementDetail({ item, onBack }: { item: Announcement; onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const getTypeStyle = (type?: string) => typeStyles[type || ''] || typeStyles.system;
  const style = getTypeStyle(item.type);
  const IconComponent = style.icon;
  
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/announcements?id=${item.id}` : '';
  
  // 完整的分享内容：标题 + 内容摘要 + 链接
  const shareText = `${item.title}\n\n${item.content.slice(0, 150)}${item.content.length > 150 ? '...' : ''}\n\n`;
  const fullShareContent = shareText + shareUrl;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShareContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const handleShareTwitter = () => {
    const text = shareText;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };
  
  const handleShareTelegram = () => {
    const text = shareText;
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };
  
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2.5 text-[#6b6b6d] hover:text-white text-[14px] mb-8 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to all updates
      </button>

      <div className="mb-8">
        {item.type && (
          <div className="flex items-center gap-3 mb-5">
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold border"
              style={{ 
                backgroundColor: `${style.accent}15`, 
                color: style.accent,
                borderColor: `${style.accent}30`
              }}
            >
              <IconComponent className="w-3.5 h-3.5" />
              {style.label}
            </span>
            {item.isPinned && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <Star className="w-3 h-3 fill-rose-400" />
                Featured
              </span>
            )}
          </div>
        )}

        <h1 className="text-[32px] md:text-[38px] font-bold text-white mb-5 leading-[1.25] tracking-tight">
          {item.title}
        </h1>
        
        <div className="flex items-center gap-4 text-[13px] text-[#6b6b6d]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{item.time}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 border"
        style={{ 
          background: `linear-gradient(135deg, ${style.accent}08 0%, transparent 50%)`,
          borderColor: `${style.accent}20`
        }}
      >
        <div 
          className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${style.accent}40 0%, transparent 70%)`
          }}
        />
        
        <div className="relative">
          <p className="text-[17px] text-[#c0c0c2] leading-[1.8] whitespace-pre-wrap font-normal">
            {item.content}
          </p>
        </div>
      </div>

      {/* Share Section */}
      <div className="mt-8 pt-6 border-t border-[#1f1f24]">
        <p className="text-[13px] text-[#6b6b6d] mb-4">Share this update</p>
        <div className="flex gap-3">
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f12] border border-[#1f1f24] rounded-xl hover:border-[#2a2a32] transition-all duration-200 group"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Link2 className="w-4 h-4 text-[#6b6b6d] group-hover:text-white transition-colors" />
            )}
            <span className="text-[13px] font-medium text-[#c0c0c2] group-hover:text-white transition-colors">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>
          
          <button 
            onClick={handleShareTwitter}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f12] border border-[#1f1f24] rounded-xl hover:border-[#1da1f2]/30 transition-all duration-200 group"
          >
            <Twitter className="w-4 h-4 text-[#6b6b6d] group-hover:text-[#1da1f2] transition-colors" />
            <span className="text-[13px] font-medium text-[#c0c0c2] group-hover:text-white transition-colors">
              Twitter
            </span>
          </button>
          
          <button 
            onClick={handleShareTelegram}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f12] border border-[#1f1f24] rounded-xl hover:border-[#2AABEE]/30 transition-all duration-200 group"
          >
            <Send className="w-4 h-4 text-[#6b6b6d] group-hover:text-[#2AABEE] transition-colors" />
            <span className="text-[13px] font-medium text-[#c0c0c2] group-hover:text-white transition-colors">
              Telegram
            </span>
          </button>

          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: item.title,
                  text: item.content,
                  url: shareUrl,
                });
              } else {
                handleCopyLink();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-500/15 border border-violet-500/30 rounded-xl hover:bg-violet-500/25 transition-all duration-200 group"
          >
            <Share2 className="w-4 h-4 text-violet-400 group-hover:text-violet-300" />
            <span className="text-[13px] font-medium text-violet-300">
              Share
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard({ isPinned = false }: { isPinned?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-[#0f0f12] border border-[#1f1f24] rounded-2xl p-5 ${isPinned ? 'animate-pulse' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1a1a1f]" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-[#1a1a1f] rounded-lg mb-3" />
          <div className="h-5 w-3/4 bg-[#1a1a1f] rounded-lg mb-2" />
          <div className="h-4 w-full bg-[#1a1a1f] rounded-lg mb-2" />
          <div className="h-3 w-32 bg-[#1a1a1f] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function AnnouncementCard({ item, isPinned = false, onClick }: { item: Announcement; isPinned?: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const style = typeStyles[item.type || ''] || typeStyles.system;
  const IconComponent = style.icon;
  
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative overflow-hidden cursor-pointer
        rounded-2xl border transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-black/20
        ${isPinned 
          ? `bg-gradient-to-r ${style.gradient} border-[${style.accent}25] hover:border-[${style.accent}40]` 
          : 'bg-[#0f0f12] border-[#1a1a1f] hover:border-[#2a2a32]'
        }
      `}
      style={{
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Background Accent */}
      <div 
        className="absolute top-0 right-0 w-40 h-40 opacity-30 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at top right, ${style.accent}30 0%, transparent 70%)`,
          opacity: isHovered ? 50 : 30
        }}
      />
      
      <div className="relative p-5 md:p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ 
              backgroundColor: `${style.accent}15`,
              border: `1px solid ${style.accent}25`
            }}
          >
            <IconComponent 
              className="w-5 h-5" 
              style={{ color: style.accent }}
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span 
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
                style={{ 
                  backgroundColor: `${style.accent}12`, 
                  color: style.accent,
                  borderColor: `${style.accent}25`
                }}
              >
                {style.label}
              </span>
              {item.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-rose-500/12 text-rose-400 border border-rose-500/25">
                  <Star className="w-3 h-3 fill-rose-400" />
                  Featured
                </span>
              )}
            </div>

            <h3 className="text-[17px] font-semibold text-white mb-2 leading-tight group-hover:transition-colors">
              {item.title}
            </h3>
            
            <p className="text-[14px] text-[#6b6b6d] leading-[1.6] line-clamp-2 mb-3">
              {item.content}
            </p>
            
            <div className="flex items-center gap-3 text-[12px] text-[#4a4a4c]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <ExternalLink 
            className="w-5 h-5 shrink-0 transition-all duration-300 group-hover:translate-x-1"
            style={{ 
              color: style.accent,
              opacity: isHovered ? 100 : 40
            }}
          />
        </div>
      </div>
    </div>
  );
}

function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured' | 'latest'>('all');

  useEffect(() => {
    fetchAnnouncements();
    // 标记所有通知为已读
    markAllAsRead();
  }, []);

  // 标记所有通知为已读
  const markAllAsRead = () => {
    if (typeof window === 'undefined') return;
    
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        const list = data.data || data.notifications || [];
        const allIds = list.map((n: any) => n.id);
        markNotificationsAsRead(allIds);
        
        // 触发自定义事件通知 Header 更新数量
        window.dispatchEvent(new CustomEvent('notificationsRead'));
      })
      .catch(console.error);
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      
      const list = data.notifications || data.data || [];
      
      if (list.length > 0) {
        const mapped = list.map((item: any, index: number) => {
          let mappedType = item.type || 'system';
          let typeText = item.type;
          
          if (item.type === 'system') {
            typeText = 'System';
          } else if (item.type === 'announcement') {
            typeText = 'Announcement';
          } else if (item.type === 'promotion') {
            typeText = 'Promotion';
          } else if (item.type === 'activity') {
            typeText = 'Activity';
          } else if (item.type === 'important') {
            typeText = 'Important';
          }
          
          return {
            id: item.id || `announcement-${index}`,
            type: mappedType,
            typeText: typeText,
            title: item.title,
            content: item.message || item.content,
            time: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : item.time || '',
            isPinned: item.is_pinned === 1 || item.isPinned || index < 2,
          };
        });
        setAnnouncements(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);
  const latestAnnouncements = announcements.filter(a => !a.isPinned);
  const selectedAnnouncement = announcements.find(a => a.id === selectedId);

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-10">
          <div className="w-48 h-10 bg-[#1a1a1f] rounded-lg mb-3 animate-pulse" />
          <div className="w-72 h-5 bg-[#1a1a1f] rounded-lg animate-pulse" />
        </div>
        <div className="space-y-4">
          <SkeletonCard isPinned />
          <SkeletonCard isPinned />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (selectedAnnouncement) {
    return <AnnouncementDetail item={selectedAnnouncement} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Bell className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-[28px] font-bold text-white tracking-tight">
            What's New
          </h1>
        </div>
        <p className="text-[15px] text-[#6b6b6d]">
          The latest updates, events, and announcements from SUIBOX
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-8">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
            filter === 'all' 
              ? 'bg-violet-500/15 border border-violet-500/30 text-white' 
              : 'bg-[#0f0f12] border border-[#1a1a1f] text-[#6b6b6d] hover:border-[#2a2a32]'
          }`}
        >
          {announcements.length} Updates
        </button>
        <button 
          onClick={() => setFilter('featured')}
          className={`px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
            filter === 'featured' 
              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400' 
              : 'bg-[#0f0f12] border border-[#1a1a1f] text-[#6b6b6d] hover:border-[#2a2a32]'
          }`}
        >
          {pinnedAnnouncements.length} Featured
        </button>
        <button 
          onClick={() => setFilter('latest')}
          className={`px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
            filter === 'latest' 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
              : 'bg-[#0f0f12] border border-[#1a1a1f] text-[#6b6b6d] hover:border-[#2a2a32]'
          }`}
        >
          {latestAnnouncements.length} Latest
        </button>
      </div>

      {/* Pinned Section - Show when filter is 'all' or 'featured' */}
      {(filter === 'all' || filter === 'featured') && pinnedAnnouncements.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[13px] font-semibold text-[#4a4a4c] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Pin className="w-4 h-4 text-rose-400" />
            <span className="text-rose-400/80">Featured</span>
          </h2>
          <div className="space-y-4">
            {pinnedAnnouncements.map((item) => (
              <AnnouncementCard key={item.id} item={item} isPinned onClick={() => setSelectedId(item.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Section - Show when filter is 'all' or 'latest' */}
      {(filter === 'all' || filter === 'latest') && latestAnnouncements.length > 0 && (
        <section>
          <h2 className="text-[13px] font-semibold text-[#4a4a4c] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <span className="text-violet-400/80">Latest</span>
          </h2>
          <div className="space-y-3">
            {latestAnnouncements.map((item) => (
              <AnnouncementCard key={item.id} item={item} onClick={() => setSelectedId(item.id)} />
            ))}
          </div>
        </section>
      )}

      {announcements.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1a1a1f] flex items-center justify-center">
            <Bell className="w-7 h-7 text-[#3a3a3c]" />
          </div>
          <p className="text-[15px] text-[#6b6b6d]">
            {filter === 'featured' ? 'No featured announcements' : filter === 'latest' ? 'No latest announcements' : 'No updates yet'}
          </p>
          <p className="text-[13px] text-[#4a4a4c] mt-1">Check back soon for new announcements</p>
        </div>
      )}
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-[#08080a]">
      <AnnouncementList />
    </div>
  );
}
