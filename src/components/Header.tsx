'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Search, Bell, Menu, X } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useSui';
import { WalletButton } from '@/components/WalletButton';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/contexts/I18nContext';

// 全局搜索数据 - 模糊搜索
const searchData = [
  // NFT
  { type: 'NFT', name: '星辰大海 #88', collection: '星辰大海', price: 162.2, link: '/nft/1', keywords: 'ssr 稀有 神话' },
  { type: 'NFT', name: '烈焰麒麟 #66', collection: '烈焰麒麟', price: 56.12, link: '/nft/2', keywords: 'sr 稀有 传说' },
  { type: 'NFT', name: '冰晶之心 #33', collection: '冰晶之心', price: 45.8, link: '/nft/3', keywords: 'sr 稀有 魔法' },
  { type: 'NFT', name: '机械之心 #77', collection: '机械之心', price: 38.5, link: '/nft/4', keywords: 'r 普通 科技' },
  { type: 'NFT', name: '暗黑天使 #25', collection: '暗黑天使', price: 28.9, link: '/nft/5', keywords: 'r 稀有 黑暗' },
  { type: 'NFT', name: '星辰大海 #99', collection: '星辰大海', price: 188.8, link: '/nft/6', keywords: 'ssr 稀有 神话' },
  { type: 'NFT', name: '烈焰麒麟 #88', collection: '烈焰麒麟', price: 66.6, link: '/nft/7', keywords: 'sr 稀有 传说' },
  // 藏品系列
  { type: 'Collection', name: '星辰大海', link: '/market?c=1', keywords: 'ssr 神话 海洋 蓝色' },
  { type: 'Collection', name: '烈焰麒麟', link: '/market?c=2', keywords: 'sr 传说 火焰 红色' },
  { type: 'Collection', name: '冰晶之心', link: '/market?c=3', keywords: 'sr 魔法 冰雪 蓝色' },
  { type: 'Collection', name: '机械之心', link: '/market?c=4', keywords: 'r 科技 机械 银色' },
  { type: 'Collection', name: '暗黑天使', link: '/market?c=5', keywords: 'r 黑暗 天使 紫色' },
  // 页面
  { type: 'Page', name: 'NFT盲盒', link: '/box', keywords: '开盒 抽奖 随机 惊喜' },
  { type: 'Page', name: '碎片合成', link: '/craft', keywords: '合成 铸造 nft 升级' },
  { type: 'Page', name: 'NFT市场', link: '/market', keywords: '购买 交易 买卖 nft' },
  { type: 'Page', name: 'NFT拍卖', link: '/auction', keywords: '竞价 拍卖 出价 竞拍' },
  { type: 'Page', name: '质押挖矿', link: '/mine', keywords: 'staking 收益 box sui 理财' },
  { type: 'Page', name: '社区提案', link: '/governance', keywords: '投票 dao 治理 提案' },
  { type: 'Page', name: '邀请好友', link: '/invite', keywords: '邀请 推荐 奖励 分享' },
  { type: 'Page', name: '入驻申请', link: '/join', keywords: '商家 入驻 铸造 nft' },
  { type: 'Page', name: '平台公告', link: '/announcements', keywords: '新闻 公告 通知 活动' },
  // 用户
  { type: 'User', name: 'FireMaster', link: '/profile/firemaster', keywords: '用户 创作者 艺术家' },
  { type: 'User', name: 'IceArtist', link: '/profile/iceartist', keywords: '用户 创作者 艺术家' },
  { type: 'User', name: 'DarkArtist', link: '/profile/darkartist', keywords: '用户 创作者 艺术家' },
];

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

const navItems: { name: string; href?: string; hasDropdown?: boolean; menu?: string; icon?: string; highlight?: boolean }[] = [
  { name: '首页', href: '/' },
  { name: 'BOX', href: '/box', icon: '🪙', highlight: true },
  { name: '合成', href: '/craft' },
  { name: '交易', hasDropdown: true, menu: 'trade' },
  { name: 'DAO', hasDropdown: true, menu: 'dao', icon: '🏛️', highlight: true },
  { name: '邀请', href: '/invite' },
  { name: '入驻', hasDropdown: true, menu: 'join' },
];

const dropdowns: Record<string, { name: string; href: string }[]> = {
  craft: [
    { name: '碎片合成', href: '/craft?tab=fragment' },
    { name: '终极合成', href: '/craft?tab=ultimate' },
  ],
  trade: [
    { name: 'NFT市场', href: '/market' },
    { name: 'NFT拍卖', href: '/auction' },
  ],
  dao: [
    { name: '社区提案', href: '/governance' },
    { name: 'Staking', href: '/mine' },
  ],
  join: [
    { name: '申请入驻', href: '/join' },
    { name: '机构管理', href: '/institution' },
    { name: '创作', href: '/create' },
    { name: '我的主页', href: '/profile' },
    { name: '客服工单', href: '/support' },
  ],
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { online } = useNetworkStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useI18n();

  // 获取当前语言
  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  const switchLanguage = (langCode: string) => {
    setLanguage(langCode as 'zh' | 'en');
    setLangMenuOpen(false);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    // 模糊搜索 - 匹配名称、关键词、类型
    return searchData.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const keywordsMatch = item.keywords?.toLowerCase().includes(query);
      const typeMatch = item.type.toLowerCase().includes(query);
      const collectionMatch = item.collection?.toLowerCase().includes(query);
      return nameMatch || keywordsMatch || typeMatch || collectionMatch;
    }).slice(0, 8);  // 显示更多结果
  }, [searchQuery]);

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'NFT': return '🖼️';
      case 'Collection': return '📦';
      case 'Page': return '📄';
      case 'User': return '👤';
      default: return '🔍';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-16 h-16">
              <Image 
                src="/suibox-logo.png" 
                alt="SUIBOX" 
                width={64} 
                height={64} 
                className="object-contain animate-spin-slow group-hover:animate-spin"
              />
            </div>
            <span className="font-bold text-2xl text-white tracking-wider">SUIBOX</span>
          </Link>

          {/* 搜索框 - 桌面端显示 */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="全局搜索 NFT/藏品/页面/用户..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-10 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((item, i) => (
                    <Link key={i} href={item.link} className="flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-0" onClick={() => setSearchQuery('')}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getTypeIcon(item.type)}</span>
                        <div>
                          <div className="text-sm text-gray-200">{item.name}</div>
                          {item.keywords && <div className="text-xs text-gray-500">{item.keywords}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-400">{item.type}</span>
                        {item.price && <span className="text-sm text-blue-400">{item.price} SUI</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 p-4 text-center text-gray-500 text-sm">
                  未找到相关结果
                </div>
              )}
            </div>
          </div>
          
          {/* 导航 - 桌面端显示 */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={() => item.hasDropdown && item.menu && setOpenMenu(item.menu)}
                onMouseLeave={() => item.hasDropdown && setOpenMenu(null)}
              >
                {item.hasDropdown ? (
                  <button className={`px-3 py-2 text-sm rounded-lg flex items-center gap-1.5 transition-all duration-300 ${item.highlight ? 'text-amber-400 font-bold hover:scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                    {item.icon && <span className="text-base">{item.icon}</span>}
                    {item.name}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ) : (
                  <Link href={item.href || '/'} className={`px-3 py-2 text-sm rounded-lg flex items-center gap-1.5 transition-all duration-300 ${item.highlight ? 'text-amber-400 font-bold hover:scale-105' : pathname === item.href ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                    {item.icon && <span className="text-base">{item.icon}</span>}
                    {item.name}
                  </Link>
                )}
                {item.hasDropdown && openMenu === item.menu && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[100]"
                  >
                    {dropdowns[item.menu].map((sub) => (
                      <Link 
                        key={sub.name} 
                        href={sub.href} 
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>
          
          {/* 右侧 - 桌面端显示 */}
          <div className="hidden lg:flex items-center gap-3">
            {/* 公告铃铛 */}
            <Link 
              href="/announcements" 
              className="relative p-2 text-gray-400 hover:text-white transition"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Link>
            
            <WalletButton />
            
            {/* 语言切换 */}
            <div className="relative">
              <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-800 rounded-lg text-sm text-gray-400">
                <span>{currentLang.flag}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-28 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => switchLanguage(lang.code)} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 ${currentLang.code === lang.code ? 'text-white bg-gray-700' : 'text-gray-300'}`}>
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* 移动端菜单面板 */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="lg:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="px-4 py-4 space-y-2">
            {/* 移动端搜索 */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="全局搜索 NFT/藏品/页面/用户..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-10 py-2 text-sm text-white placeholder-gray-500"
              />
            </div>
            
            {/* 移动端导航 */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href || '#'}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm ${
                  item.highlight 
                    ? 'text-amber-400 font-bold' 
                    : pathname === item.href 
                      ? 'text-white bg-gray-800' 
                      : 'text-gray-400'
                }`}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.name}
              </Link>
            ))}
            
            {/* 移动端公告和钱包 */}
            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <Link href="/announcements" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-400">
                <Bell className="w-5 h-5" />
                <span>公告</span>
              </Link>
              <div className="flex items-center gap-2 text-gray-400">
                <WalletButton />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
