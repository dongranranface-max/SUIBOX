import { NextRequest, NextResponse } from 'next/server';

// 用户开盒数据
const userData: Record<string, {
  address: string;
  inviteCode: string;
  invitedBy: string | null;  // 邀请人地址
  inviteCount: number;
  uniqueFriendsToday: number;
  dailyCount: number;
  noneCount: number;
  totalOpens: number;
  fragments: { common: number; rare: number; epic: number };
  lastOpenDate: string;
  todayOpened: boolean;  // 今日是否开过盒
}> = {};

// 邀请人数据
const referrerData: Record<string, {
  totalInvites: number;
  todayOpenedFriends: Set<string>;  // 今日开过盒的好友
  pendingBox: number;
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
      dailyCount: 1,
      noneCount: 0,
      totalOpens: 0,
      fragments: { common: 0, rare: 0, epic: 0 },
      lastOpenDate: today,
      todayOpened: false,
    };
  }
  
  // 新的一天，重置每日数据
  if (userData[address].lastOpenDate !== today) {
    userData[address].dailyCount = 1;
    userData[address].uniqueFriendsToday = 0;
    userData[address].todayOpened = false;
    userData[address].lastOpenDate = today;
  }
  
  return userData[address];
}

// 邀请奖励配置
const INVITE_REWARDS = {
  dailyBox: { 1: 1, 3: 2, 15: 3 },
  airdrop: { 1: { self: 1, ref: 0.5 }, 3: { self: 3, ref: 1.5 }, 15: { self: 10, ref: 5 } },
};

// 计算邀请奖励
function calculateInviteBonus(friendCount: number): number {
  if (friendCount >= 15) return 3;
  if (friendCount >= 3) return 2;
  if (friendCount >= 1) return 1;
  return 0;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const refCode = searchParams.get('ref');  // 邀请码
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }
  
  const user = getUserData(address);
  
  // 绑定邀请关系
  if (refCode && !user.invitedBy) {
    const referrer = Object.values(userData).find(u => u.inviteCode === refCode);
    if (referrer && referrer.address !== address) {
      user.invitedBy = referrer.address;
      referrer.inviteCount++;
    }
  }
  
  // 计算今日邀请奖励
  let friendCount = 0;
  if (user.invitedBy) {
    const referrer = referrerData[user.invitedBy];
    if (referrer) {
      friendCount = referrer.todayOpenedFriends?.size || 0;
    }
  }
  
  const inviteBonus = calculateInviteBonus(friendCount);
  
  return NextResponse.json({
    address: user.address,
    inviteCode: user.inviteCode,
    invitedBy: user.invitedBy,
    inviteCount: user.inviteCount,
    uniqueFriendsToday: user.uniqueFriendsToday,
    dailyFreeCount: user.dailyCount,
    inviteBonus,
    totalDailyCount: user.dailyCount + inviteBonus,
    noneCount: user.noneCount,
    totalOpens: user.totalOpens,
    fragments: user.fragments,
    todayOpened: user.todayOpened,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { address, action, inviteCode } = body;
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }
  
  const user = getUserData(address);
  
  if (action === 'open_box') {
    // 检查次数
    let friendCount = 0;
    if (user.invitedBy) {
      const referrer = referrerData[user.invitedBy];
      if (referrer) {
        friendCount = referrer.todayOpenedFriends?.size || 0;
      }
    }
    
    const inviteBonus = calculateInviteBonus(friendCount);
    const totalCount = user.dailyCount + inviteBonus;
    
    if (totalCount <= 0) {
      return NextResponse.json({ error: 'No daily count available' }, { status: 400 });
    }
    
    // 扣减次数
    user.dailyCount--;
    user.totalOpens++;
    user.todayOpened = true;
    
    // 通知邀请人
    if (user.invitedBy) {
      if (!referrerData[user.invitedBy]) {
        referrerData[user.invitedBy] = {
          totalInvites: 0,
          todayOpenedFriends: new Set(),
          pendingBox: 0,
        };
      }
      referrerData[user.invitedBy].todayOpenedFriends.add(address);
    }
    
    return NextResponse.json({
      success: true,
      dailyCount: user.dailyCount,
      inviteBonus,
      totalDailyCount: user.dailyCount + inviteBonus,
      todayOpened: true,
    });
  }
  
  if (action === 'bind_referrer') {
    // 绑定邀请人
    if (user.invitedBy) {
      return NextResponse.json({ error: 'Already bound' }, { status: 400 });
    }
    
    const referrer = Object.values(userData).find(u => u.inviteCode === inviteCode);
    if (referrer && referrer.address !== address) {
      user.invitedBy = referrer.address;
      referrer.inviteCount++;
      return NextResponse.json({ success: true, referrer: referrer.address });
    }
    
    return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
  }
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
