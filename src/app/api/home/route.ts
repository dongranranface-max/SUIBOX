import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// 公开API - 获取首页内容（轮播图等）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // 动态导入 better-sqlite3
    const Database = (await import('better-sqlite3')).default;
    const dbPath = path.join(process.cwd(), 'data', 'suibox.db');
    const db = new Database(dbPath);

    // 确保表存在
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS home_banners (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          link TEXT,
          bg_color TEXT DEFAULT 'from-violet-600 via-purple-600 to-pink-600',
          bg_image TEXT DEFAULT '',
          emoji TEXT,
          position INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      // 添加 bg_image 列（如果不存在）
      try {
        db.exec(`ALTER TABLE home_banners ADD COLUMN bg_image TEXT DEFAULT ''`);
      } catch (e) {
        // 列可能已存在
      }
    } catch (e) {
      // 表可能已存在
    }

    const result: any = {};

    if (type === 'all' || type === 'banners') {
      // 默认轮播图
      const defaultBanners = [
        { id: 1, title: 'NFT盲盒', description: '打开盲盒，赢取稀有NFT！', link: '/box', bg_color: 'from-violet-600 via-purple-600 to-pink-600', bg_image: '', emoji: '🎁', position: 1 },
        { id: 2, title: '碎片合成', description: '碎片合成NFT，赢取BOX奖励！', link: '/craft', bg_color: 'from-blue-600 via-cyan-600 to-teal-600', bg_image: '', emoji: '⚗️', position: 2 },
        { id: 3, title: 'NFT拍卖', description: '稀有NFT正在拍卖中！', link: '/auction', bg_color: 'from-orange-600 via-red-600 to-pink-600', bg_image: '', emoji: '🔨', position: 3 },
        { id: 4, title: 'DAO治理', description: '参与治理，质押BOX获取收益！', link: '/mine', bg_color: 'from-green-600 via-emerald-600 to-teal-600', bg_image: '', emoji: '🏛️', position: 4 },
      ];

      try {
        const banners = db.prepare('SELECT * FROM home_banners WHERE is_active = 1 ORDER BY position').all();
        result.banners = banners.length > 0 ? banners : defaultBanners;
      } catch (e) {
        result.banners = defaultBanners;
      }
    }

    db.close();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get home content error:', error);
    // 返回默认数据
    return NextResponse.json({
      banners: [
        { id: 1, title: 'NFT盲盒', description: '打开盲盒，赢取稀有NFT！', link: '/box', bg_color: 'from-violet-600 via-purple-600 to-pink-600', emoji: '🎁', position: 1 },
        { id: 2, title: '碎片合成', description: '碎片合成NFT，赢取BOX奖励！', link: '/craft', bg_color: 'from-blue-600 via-cyan-600 to-teal-600', emoji: '⚗️', position: 2 },
        { id: 3, title: 'NFT拍卖', description: '稀有NFT正在拍卖中！', link: '/auction', bg_color: 'from-orange-600 via-red-600 to-pink-600', emoji: '🔨', position: 3 },
        { id: 4, title: 'DAO治理', description: '参与治理，质押BOX获取收益！', link: '/mine', bg_color: 'from-green-600 via-emerald-600 to-teal-600', emoji: '🏛️', position: 4 },
      ]
    });
  }
}
