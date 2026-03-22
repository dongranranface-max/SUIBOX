import { NextRequest, NextResponse } from 'next/server';

// 模拟公告数据
const defaultNotifications = [
  {
    id: '1',
    type: 'important',
    title: '系统升级通知',
    message: 'SUIBOX 将于 2026-03-16 02:00-04:00 UTC 进行系统升级，届时部分功能可能短暂不可用，请提前做好准备。升级完成后将恢复所有服务，感谢理解！',
    created_at: '2026-03-15T14:00:00.000Z',
    is_pinned: true,
  },
  {
    id: '2',
    type: 'activity',
    title: '周末双倍奖励活动',
    message: '本周六、周日所有质押用户享受双倍收益！活动时间：2026-03-21 00:00 - 2026-03-23 23:59 UTC',
    created_at: '2026-03-14T10:00:00.000Z',
    is_pinned: true,
  },
  {
    id: '3',
    type: 'update',
    title: '新功能上线：NFT 质押挖矿',
    message: '全新 NFT 质押挖矿功能正式上线！持有 NFT 参与质押，每日获取 BOX 奖励。稀有 NFT 享受更高算力权重，最高 5 倍收益！',
    created_at: '2026-03-13T09:00:00.000Z',
    is_pinned: false,
  },
  {
    id: '4',
    type: 'governance',
    title: '社区提案通过公告',
    message: '提案 #2 "降低盲盒手续费至5%" 已投票通过，将于 3 月 20 日正式执行。感谢社区参与治理！',
    created_at: '2026-03-12T18:00:00.000Z',
    is_pinned: false,
  },
  {
    id: '5',
    type: 'security',
    title: '谨防诈骗公告',
    message: '近期发现冒充 SUIBOX 官方客服的钓鱼网站，请勿点击任何非官方链接。官方网址：suibox.com',
    created_at: '2026-03-12T15:00:00.000Z',
    is_pinned: false,
  },
];

// GET 获取通知列表 (公开接口)
export async function GET(request: NextRequest) {
  try {
    let db: any;
    try {
      const path = await import('path');
      const Database = (await import('better-sqlite3')).default;
      const dbPath = path.join(process.cwd(), '..', 'suibox-new', 'data', 'suibox.db');
      db = new Database(dbPath);
      
      // 确保表存在，添加缺失的字段
      db.exec(`
        CREATE TABLE IF NOT EXISTS admin_notifications (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT DEFAULT 'system',
          is_active INTEGER DEFAULT 1,
          is_pinned INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 查询所有通知，按时间倒序
      const notifications = db.prepare(`
        SELECT * FROM admin_notifications ORDER BY created_at DESC LIMIT 50
      `).all();
      
      if (notifications && notifications.length > 0) {
        // 转换 is_pinned 字段
        const mapped = notifications.map((n: any, idx: number) => ({
          ...n,
          is_pinned: n.is_pinned === 1 || idx < 2 // 前2条默认为置顶
        }));
        
        return NextResponse.json({
          success: true,
          data: mapped,
          total: mapped.length
        });
      }
      
      db.close();
    } catch (dbError) {
      console.log('Database not available, using default notifications', dbError);
    }
    
    // 返回默认数据
    return NextResponse.json({
      success: true,
      data: defaultNotifications,
      total: defaultNotifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ 
      success: true, 
      data: defaultNotifications,
      total: defaultNotifications.length
    });
  }
}
