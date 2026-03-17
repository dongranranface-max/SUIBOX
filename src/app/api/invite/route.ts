import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库
const users: Record<string, {
  address: string;
  inviteCode: string;
  invitedBy: string | null;  // 邀请人地址
  referrals: string[];     // 被邀请人列表
  totalInvites: number;
  todayOpened: number;
  totalBoxEarned: number;
  pendingBox: number;
  hasReceivedAirdrop: boolean;  // 是否已领取空投
  lastResetDate: string;
}> = {};

const userBoxData: Record<string, {
  address: string;
  dailyCount: number;
  noneCount: number;
  fragments: { common: number; rare: number; epic: number };
}> = {};

// 生成邀请码
function generateInviteCode(): string {
  return 'SUIBOX' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 获取日期字符串
function getDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

// 获取用户数据（创建如果不存在）
function getOrCreateUser(address: string) {
  const today = getDateStr();
  
  if (!users[address]) {
    users[address] = {
      address,
      inviteCode: generateInviteCode(),
      invitedBy: null,
      referrals: [],
      totalInvites: 0,
      todayOpened: 0,
      totalBoxEarned: 0,
      pendingBox: 0,
      hasReceivedAirdrop: false,
      lastResetDate: today,
    };
  }
  
  // 每日重置
  if (users[address].lastResetDate !== today) {
    users[address].todayOpened = 0;
    users[address].lastResetDate = today;
  }
  
  return users[address];
}

// 邀请奖励配置
const INVITE_REWARDS = {
  // 每日次数奖励
  dailyBox: {
    1: 1,   // 1人开盒 +1次
    3: 2,   // 3人开盒 +2次
    15: 3,  // 15人开盒 +3次
  },
  // BOX空投奖励（一次性）
  airdrop: {
    1: { self: 1, referrer: 0.5 },      // 1人
    3: { self: 3, referrer: 1.5 },      // 3人
    15: { self: 10, referrer: 5 },      // 15人
  },
};

// GET: 获取用户邀请信息
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const referralCode = searchParams.get('ref');  // 邀请码
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }
  
  const user = getOrCreateUser(address);
  
  // 处理邀请关系绑定
  if (referralCode && !user.invitedBy) {
    // 查找邀请人
    const referrer = Object.values(users).find(u => u.inviteCode === referralCode);
    if (referrer && referrer.address !== address) {
      user.invitedBy = referrer.address;
      referrer.referrals.push(address);
      referrer.totalInvites++;
    }
  }
  
  // 计算今日开盒好友数（去重）
  const openedToday = new Set<string>();
  for (const refAddress of user.referrals) {
    const refData = userBoxData[refAddress];
    if (refData && refData.noneCount > 0) {
      openedToday.add(refAddress);
    }
  }
  user.todayOpened = openedToday.size;
  
  // 计算邀请奖励
  let inviteBonus = 0;
  if (user.todayOpened >= 15) inviteBonus = 3;
  else if (user.todayOpened >= 3) inviteBonus = 2;
  else if (user.todayOpened >= 1) inviteBonus = 1;
  
  // 计算待领取BOX
  let pendingBox = 0;
  if (user.todayOpened >= 1 && !user.hasReceivedAirdrop) {
    const tier = user.todayOpened >= 15 ? 15 : user.todayOpened >= 3 ? 3 : 1;
    pendingBox = INVITE_REWARDS.airdrop[tier as keyof typeof INVITE_REWARDS.airdrop].self;
  }
  
  return NextResponse.json({
    address: user.address,
    inviteCode: user.inviteCode,
    invitedBy: user.invitedBy,
    totalInvites: user.totalInvites,
    todayOpened: user.todayOpened,
    totalBoxEarned: user.totalBoxEarned,
    pendingBox: pendingBox,
    hasReceivedAirdrop: user.hasReceivedAirdrop,
    dailyBonus: inviteBonus,
  });
}

// POST: 处理开盒事件（通知邀请人）
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { address, action } = body;
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }
  
  // 确保用户存在
  const user = getOrCreateUser(address);
  
  if (action === 'friend_opened') {
    // 好友开盒了，通知邀请人
    if (user.invitedBy) {
      const referrer = users[user.invitedBy];
      if (referrer) {
        // 更新邀请人的今日开盒数
        // 实际应该通过更复杂的逻辑统计
      }
    }
    
    return NextResponse.json({ success: true });
  }
  
  if (action === 'claim_airdrop') {
    // 领取空投
    if (user.pendingBox > 0 && !user.hasReceivedAirdrop) {
      user.totalBoxEarned += user.pendingBox;
      user.hasReceivedAirdrop = true;
      
      // 给邀请人奖励
      if (user.invitedBy) {
        const referrer = users[user.invitedBy];
        if (referrer) {
          const tier = user.todayOpened >= 15 ? 15 : user.todayOpened >= 3 ? 3 : 1;
          const reward = INVITE_REWARDS.airdrop[tier as keyof typeof INVITE_REWARDS.airdrop].referrer;
          referrer.pendingBox += reward;
        }
      }
      
      return NextResponse.json({
        success: true,
        claimed: user.pendingBox,
      });
    }
    
    return NextResponse.json({ error: 'No airdrop to claim' }, { status: 400 });
  }
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
