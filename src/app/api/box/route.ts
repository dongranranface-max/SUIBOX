import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库
const userData: Record<string, {
  address: string;
  inviteCode: string;
  invitedBy: string | null;
  inviteCount: number;
  uniqueFriendsToday: number;
  dailyCount: number;
  noneCount: number;
  totalOpens: number;
  fragments: { common: number; rare: number; epic: number };
  lastOpenDate: string;
}> = {};

// 生成邀请码
function generateInviteCode(): string {
  return 'SUIBOX' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 获取或初始化用户数据
function getUserData(address: string) {
  const today = new Date().toISOString().split('T')[0];
  
  if (!userData[address]) {
    userData[address] = {
      address,
      inviteCode: generateInviteCode(),
      invitedBy: null,
      inviteCount: 0,
      uniqueFriendsToday: 0,
      dailyCount: 1, // 每日免费1次
      noneCount: 0,
      totalOpens: 0,
      fragments: { common: 0, rare: 0, epic: 0 },
      lastOpenDate: today,
    };
  }
  
  // 新的一天，重置每日数据
  if (userData[address].lastOpenDate !== today) {
    userData[address].dailyCount = 1;
    userData[address].uniqueFriendsToday = 0;
    userData[address].lastOpenDate = today;
  }
  
  return userData[address];
}

// 计算邀请奖励
function calculateInviteBonus(uniqueFriends: number): number {
  if (uniqueFriends >= 10) return 3;
  if (uniqueFriends >= 5) return 2;
  if (uniqueFriends >= 1) return 1;
  return 0;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }
  
  const user = getUserData(address);
  const inviteBonus = calculateInviteBonus(user.uniqueFriendsToday);
  const totalDailyCount = user.dailyCount + inviteBonus;
  
  return NextResponse.json({
    address: user.address,
    inviteCode: user.inviteCode,
    inviteCount: user.inviteCount,
    uniqueFriendsToday: user.uniqueFriendsToday,
    dailyFreeCount: user.dailyCount,
    inviteBonus,
    totalDailyCount,
    noneCount: user.noneCount,
    totalOpens: user.totalOpens,
    fragments: user.fragments,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { address, action, inviteCode, referredBy } = body;
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }
  
  const user = getUserData(address);
  
  if (action === 'open_box') {
    // 开盲盒
    const inviteBonus = calculateInviteBonus(user.uniqueFriendsToday);
    const totalDailyCount = user.dailyCount + inviteBonus;
    
    if (totalDailyCount <= 0) {
      return NextResponse.json({ error: 'No daily count available' }, { status: 400 });
    }
    
    // 扣减次数
    user.dailyCount--;
    user.totalOpens++;
    
    return NextResponse.json({
      success: true,
      dailyCount: user.dailyCount,
      inviteBonus,
      totalDailyCount: user.dailyCount + inviteBonus,
    });
  }
  
  if (action === 'use_invite_code') {
    // 使用邀请码
    if (user.invitedBy) {
      return NextResponse.json({ error: 'Already used invite code' }, { status: 400 });
    }
    
    // 查找邀请人
    const referrer = Object.values(userData).find(u => u.inviteCode === inviteCode);
    if (referrer && referrer.address !== address) {
      user.invitedBy = referrer.address;
      referrer.inviteCount++;
      return NextResponse.json({ success: true, inviteCount: referrer.inviteCount });
    }
    
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
  }
  
  if (action === 'friend_opened') {
    // 好友开盒了（需要验证是不同好友）
    user.uniqueFriendsToday++;
    return NextResponse.json({ 
      success: true, 
      uniqueFriendsToday: user.uniqueFriendsToday,
      newBonus: calculateInviteBonus(user.uniqueFriendsToday),
    });
  }
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
