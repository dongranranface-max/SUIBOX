import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库 - 通知数据
let notifications: {
  id: string;
  type: 'system' | 'announcement' | 'promotion' | 'activity';
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}[] = [
  {
    id: '1',
    type: 'system',
    title: '系统维护通知',
    message: 'SUI网络将于今晚23:00-24:00进行维护，请提前做好准备。',
    read: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    type: 'promotion',
    title: '新用户专享',
    message: '新用户首日开盒双倍掉落碎片！',
    read: false,
    createdAt: Date.now() - 7200000,
  },
];

// GET 获取所有通知
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  
  let filtered = notifications;
  if (type && type !== 'all') {
    filtered = notifications.filter(n => n.type === type);
  }
  
  return NextResponse.json({
    success: true,
    data: filtered.sort((a, b) => b.createdAt - a.createdAt),
    total: notifications.length,
  });
}

// POST 发布新通知
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type = 'system' } = body;
    
    if (!title || !message) {
      return NextResponse.json({
        success: false,
        error: '标题和内容不能为空',
      }, { status: 400 });
    }
    
    const newNotification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      read: false,
      createdAt: Date.now(),
    };
    
    notifications.unshift(newNotification);
    
    return NextResponse.json({
      success: true,
      data: newNotification,
      message: '通知发布成功',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '发布失败',
    }, { status: 400 });
  }
}

// DELETE 删除通知
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: '通知ID不能为空',
      }, { status: 400 });
    }
    
    notifications = notifications.filter(n => n.id !== id);
    
    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '删除失败',
    }, { status: 400 });
  }
}
