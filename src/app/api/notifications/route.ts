import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库 - 通知数据
const notifications: {
  id: string;
  type: 'offer_received' | 'offer_accepted' | 'offer_rejected' | 'offer_countered' | 'system';
  title: string;
  message: string;
  address: string;
  read: boolean;
  data?: any;
  createdAt: number;
}[] = [
  {
    id: '1',
    type: 'offer_received',
    title: '收到新报价',
    message: '有人对"星辰大海 #88"出价150 SUI',
    address: '0x237c7e81...1f97',
    read: false,
    data: { offerId: '1', nftId: 1 },
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    type: 'offer_received',
    title: '收到新报价',
    message: '有人对"烈焰麒麟 #66"出价45 SUI',
    address: '0x237c7e81...1f97',
    read: false,
    data: { offerId: '2', nftId: 2 },
    createdAt: Date.now() - 7200000,
  },
];

// GET 获取通知列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const unreadOnly = searchParams.get('unread') === 'true';
  
  let filteredNotifications = address 
    ? notifications.filter(n => n.address.toLowerCase() === address.toLowerCase())
    : notifications;
  
  if (unreadOnly) {
    filteredNotifications = filteredNotifications.filter(n => !n.read);
  }
  
  const unreadCount = notifications.filter(n => 
    n.address.toLowerCase() === address?.toLowerCase() && !n.read
  ).length;
  
  return NextResponse.json({
    success: true,
    data: filteredNotifications.sort((a, b) => b.createdAt - a.createdAt),
    unreadCount,
  });
}

// PUT 标记通知为已读
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, markAllRead, address } = body;
    
    if (markAllRead && address) {
      notifications.forEach(n => {
        if (n.address.toLowerCase() === address.toLowerCase()) {
          n.read = true;
        }
      });
    } else if (notificationId) {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '已标记为已读',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '操作失败',
    }, { status: 400 });
  }
}
