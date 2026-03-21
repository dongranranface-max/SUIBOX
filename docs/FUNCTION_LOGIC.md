# SUIBOX 功能逻辑文档

**版本**: v1.0  
**日期**: 2026-03-21  
**状态**: 开发中

---

## 📋 目录

1. [用户系统](#1-用户系统)
2. [邀请系统](#2-邀请系统)
3. [盲盒系统](#3-盲盒系统)
4. [碎片系统](#4-碎片系统)
5. [NFT系统](#5-nft系统)
6. [合成系统](#6-合成系统)
7. [市场系统](#7-市场系统)
8. [质押系统](#8-质押系统)

---

## 1. 用户系统

### 1.1 登录方式

| 方式 | 说明 | 流程 |
|------|------|------|
| Google OAuth | 一键登录 | 点击 → 跳转Google → 授权 → 回调 → 创建用户 |
| Discord OAuth | 社区登录 | 点击 → 跳转Discord → 授权 → 回调 → 创建用户 |
| SUI钱包 | 钱包直连 | 点击 → 钱包授权 → 获取地址 → 绑定/登录 |

### 1.2 用户数据结构

```typescript
interface User {
  id: string;                    // 用户ID
  suiAddress: string;             // SUI钱包地址 (唯一)
  provider: 'google' | 'discord' | 'wallet';  // 登录方式
  oauthId: string;               // OAuth ID
  email?: string;                // 邮箱 (Google)
  name: string;                  // 显示名称
  avatar?: string;               // 头像URL
  inviteCode: string;            // 邀请码
  inviter?: string;              // 邀请人地址
  createdAt: Date;               // 注册时间
  lastLoginAt: Date;             // 最后登录时间
}
```

### 1.3 登录流程图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户登录流程                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ 点击登录  │───→│ 选择方式 │───→│ 授权验证 │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                                           │                 │
│                      ┌───────────────────┘                 │
│                      ▼                                     │
│               ┌──────────────┐                              │
│               │ 检查用户存在 │                              │
│               └──────────────┘                              │
│                    │        │                               │
│              不存在    │    存在                            │
│                │       │       │                            │
│                ▼       │       ▼                           │
│         ┌──────────┐   │  ┌──────────┐                    │
│         │ 创建用户 │   │  │ 更新登录 │                    │
│         └──────────┘   │  └──────────┘                    │
│                │       │       │                            │
│                └───────┴───────┘                            │
│                         │                                   │
│                         ▼                                   │
│                  ┌──────────────┐                          │
│                  │ 返回会话Token │                          │
│                  └──────────────┘                          │
│                         │                                   │
│                         ▼                                   │
│                  ┌──────────────┐                          │
│                  │ 跳转首页/Profile │                       │
│                  └──────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 邀请系统

### 2.1 邀请码生成规则

```typescript
function generateInviteCode(address: string): string {
  // 格式: SUIBOX + 地址第3-8位
  // 例如: 0xABC...123 → SUIBOXABC123
  const part = address.slice(2, 8).toUpperCase();
  return `SUIBOX${part}`;
}
```

### 2.2 邀请关系绑定

```typescript
// 绑定条件
const BIND_RULES = {
  // 1. 邀请码格式正确
  validFormat: (code: string) => code.startsWith('SUIBOX') && code.length === 13,
  
  // 2. 邀请人必须存在
  inviterExists: async (code: string) => {
    const inviterAddress = extractAddressFromCode(code);
    return await db.user.find({ address: inviterAddress });
  },
  
  // 3. 被邀请人首次登录
  firstLogin: async (address: string) => {
    return !(await db.user.find({ address, hasInviter: true }));
  }
};

// 绑定时机
// - 用户首次登录时
// - URL包含 ?invite_code=xxx
// - 登录后自动绑定 (localStorage存储)
```

### 2.3 邀请奖励规则

| 任务 | 被邀请人奖励 | 邀请人奖励 | 条件 |
|------|-------------|-----------|------|
| 1位好友开盒 | +1次开盒 | +0.5 BOX | 好友完成首次开盒 |
| 3位好友开盒 | +2次开盒 | +1.5 BOX | 好友完成首次开盒 |
| 15位好友开盒 | +3次开盒 | +5 BOX | 好友完成首次开盒 |

```typescript
// 奖励计算
interface InviteReward {
  inviteeReward: { freeBox: number };  // 被邀请人: 免费开盒次数
  inviterReward: { box: number };       // 邀请人: BOX代币
}

function calculateInviteReward(friendsCount: number): InviteReward {
  if (friendsCount >= 15) {
    return { inviteeReward: { freeBox: 3 }, inviterReward: { box: 5 } };
  } else if (friendsCount >= 3) {
    return { inviteeReward: { freeBox: 2 }, inviterReward: { box: 1.5 } };
  } else if (friendsCount >= 1) {
    return { inviteeReward: { freeBox: 1 }, inviterReward: { box: 0.5 } };
  }
  return { inviteeReward: { freeBox: 0 }, inviterReward: { box: 0 } };
}
```

### 2.4 邀请奖励发放

```typescript
// 发放时机: 好友完成首次开盒后
async function distributeInviteReward(inviterAddress: string, inviteeAddress: string) {
  // 1. 获取被邀请人累计开盒次数
  const inviteeBoxCount = await getUserBoxCount(inviteeAddress);
  
  // 2. 计算邀请人当前可获得的奖励
  const reward = calculateInviteReward(inviteeBoxCount);
  
  // 3. 发放被邀请人奖励 (增加开盒次数)
  await addUserFreeBox(inviteeAddress, reward.inviteeReward.freeBox);
  
  // 4. 发放邀请人奖励 (发放BOX代币)
  await mintToken(inviterAddress, reward.inviterReward.box);
  
  // 5. 记录邀请关系
  await createInviteRecord({
    inviter: inviterAddress,
    invitee: inviteeAddress,
    reward: reward,
    boxCountAtReward: inviteeBoxCount
  });
}
```

---

## 3. 盲盒系统

### 3.1 每日开盒次数

```typescript
interface DailyBoxLimit {
  free: number;           // 每日免费: 1次
  inviteBonus: number;    // 邀请奖励: 最高6次
  maxPerDay: number;      // 每日上限: 7次
}

const BOX_LIMIT = {
  free: 1,
  maxPerDay: 7,
  // 邀请奖励上限 = 6
};

// 获取用户今日剩余次数
async function getUserDailyBoxCount(userAddress: string): Promise<number> {
  const today = getTodayStart();
  
  // 1. 获取用户免费次数
  const freeUsed = await db.boxRecord.count({
    user: userAddress,
    date: today,
    type: 'free'
  });
  const freeRemaining = BOX_LIMIT.free - freeUsed;
  
  // 2. 获取邀请奖励次数
  const inviteBonus = await getInviteBonus(userAddress);
  
  // 3. 计算今日总剩余
  return Math.min(freeRemaining + inviteBonus, BOX_LIMIT.maxPerDay);
}
```

### 3.2 开盒概率算法

```typescript
// 碎片概率配置
const FRAGMENT_RARITY = {
  common: { probability: 50, minCount: 1, maxCount: 2 },  // 50%
  rare:   { probability: 15, minCount: 1, maxCount: 1 },   // 15%
  epic:   { probability: 3,  minCount: 1, maxCount: 1 },   // 3%
  none:   { probability: 32, minCount: 0, maxCount: 0 }    // 32% (感谢参与)
};

// 开盒算法
function openBox(userAddress: string): OpenBoxResult {
  // 1. 检查开盒次数
  const remaining = getUserDailyBoxCount(userAddress);
  if (remaining <= 0) {
    throw new Error('今日开盒次数已用完');
  }
  
  // 2. 获取用户保底计数
  const noneCount = getUserNoneCount(userAddress);
  
  // 3. 判断是否触发保底
  let rarity: 'common' | 'rare' | 'epic' | 'none';
  let guaranteed = false;
  
  if (noneCount >= 35) {
    // 25次感谢必得史诗
    rarity = 'epic';
    guaranteed = true;
  } else if (noneCount >= 7) {
    // 7次感谢必得稀有
    rarity = 'rare';
    guaranteed = true;
  } else if (noneCount >= 3) {
    // 3次感谢必得普通
    rarity = 'common';
    guaranteed = true;
  } else {
    // 正常概率
    const rand = Math.random() * 100;
    if (rand < FRAGMENT_RARITY.epic.probability) {
      rarity = 'epic';
    } else if (rand < FRAGMENT_RARITY.epic.probability + FRAGMENT_RARITY.rare.probability) {
      rarity = 'rare';
    } else if (rand < FRAGMENT_RARITY.epic.probability + FRAGMENT_RARITY.rare.probability + FRAGMENT_RARITY.common.probability) {
      rarity = 'common';
    } else {
      rarity = 'none';
    }
    guaranteed = false;
  }
  
  // 4. 计算碎片数量
  let fragmentCount = 0;
  if (rarity !== 'none') {
    const config = FRAGMENT_RARITY[rarity];
    fragmentCount = Math.floor(Math.random() * (config.maxCount - config.minCount + 1)) + config.minCount;
  }
  
  // 5. 更新保底计数
  if (rarity === 'none') {
    incrementUserNoneCount(userAddress);
  } else {
    resetUserNoneCount(userAddress);
  }
  
  // 6. 扣除开盒次数
  decrementUserDailyBoxCount(userAddress);
  
  // 7. 发放碎片
  if (fragmentCount > 0) {
    addUserFragments(userAddress, rarity, fragmentCount);
  }
  
  return {
    rarity,
    fragmentCount,
    guaranteed,
    fragments: Array(fragmentCount).fill(rarity)
  };
}
```

### 3.3 保底机制

| 连续感谢次数 | 必得奖励 | 概率 |
|--------------|----------|------|
| 3 | 1个普通碎片 | 100% |
| 7 | 1个稀有碎片 | 100% |
| 25 | 1个史诗碎片 | 100% |

### 3.4 开盒流程图

```
┌─────────────────────────────────────────────────────────────┐
│                       开盲盒流程                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 检查登录状态                                            │
│     └── 未登录 → 跳转登录页                                  │
│                                                             │
│  2. 检查开盒次数                                            │
│     └── 次数=0 → 显示"次数已用完"                            │
│                                                             │
│  3. 开始开盒动画                                            │
│     └── 显示3D动画 + 音效 (2.5秒)                            │
│                                                             │
│  4. 计算结果                                                │
│     ├── 检查保底计数                                        │
│     ├── 判断是否触发保底                                     │
│     └── 随机抽取结果                                         │
│                                                             │
│  5. 更新数据                                                │
│     ├── 扣除开盒次数                                        │
│     ├── 更新保底计数                                        │
│     └── 发放碎片到用户账户                                   │
│                                                             │
│  6. 显示结果                                                │
│     ├── 展示碎片动画                                         │
│     ├── 显示获得内容                                         │
│     └── 更新页面数据                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 碎片系统

### 4.1 碎片类型

| 类型 | 英文 | 颜色 | 图标 | 用途 |
|------|------|------|------|------|
| 普通碎片 | Common | 灰色 | 🔩 | 合成普通NFT |
| 稀有碎片 | Rare | 蓝色 | 💎 | 合成稀有NFT |
| 史诗碎片 | Epic | 紫色 | 🔮 | 合成史诗NFT |

### 4.2 碎片数据结构

```typescript
interface Fragment {
  id: string;
  owner: string;           // 持有者地址
  type: 'common' | 'rare' | 'epic';
  amount: number;         // 数量
  source: 'box' | 'craft' | 'event';  // 来源
  obtainedAt: Date;       // 获取时间
}
```

### 4.3 碎片流水

```typescript
// 碎片变化记录
interface FragmentRecord {
  id: string;
  user: string;
  fragmentType: string;
  amount: number;         // 正数增加，负数减少
  reason: 'open_box' | 'synthesize' | 'upgrade' | 'gift';
  relatedTx: string;      // 相关交易ID
  timestamp: Date;
}

// 记录碎片变化
async function recordFragmentChange(
  user: string,
  type: string,
  amount: number,
  reason: string
) {
  // 1. 更新用户碎片余额
  await db.fragment.update(
    { user, type },
    { $inc: { amount } }
  );
  
  // 2. 记录流水
  await db.fragmentRecord.create({
    user,
    fragmentType: type,
    amount,
    reason,
    relatedTx: generateTxId(),
    timestamp: new Date()
  });
}
```

---

## 5. NFT系统

### 5.1 NFT类型

| 类型 | 英文 | 发行量 | 定位 | 碎片消耗 |
|------|------|--------|------|----------|
| 普通NFT | Common | 100万 | 普及 | 6普通碎片 |
| 稀有NFT | Rare | 10万 | 稀缺 | 8稀有碎片 |
| 史诗NFT | Epic | 2万 | 稀有 | 10史诗碎片 |

### 5.2 NFT数据结构

```typescript
interface NFT {
  id: string;                    // 链上ID
  tokenId: string;              // Token ID
  name: string;                 // 名称 (如: SUI Punk #88)
  description: string;         // 描述
  imageUrl: string;            // 图片URL
  animationUrl?: string;       // 动画URL (可选)
  
  // 属性
  rarity: 'common' | 'rare' | 'epic';
  category: string;            // 分类 (art/game/avatar...)
  
  // 所有者
  owner: string;               // 当前拥有者
  creator: string;             // 创建者
  
  // 交易
  price?: number;             // 挂售价格
  priceUnit: 'SUI' | 'BOX';   // 计价单位
  listingTime?: Date;         // 挂售时间
  
  // 时间
  mintedAt: Date;             // 铸造时间
  transferredAt?: Date;       // 上次转让时间
  
  // 状态
  status: 'active' | 'staked' | 'locked';  // 状态
}
```

### 5.3 NFT升级

| 升级路径 | 消耗 | 产出 | 净消耗BOX |
|----------|------|------|-----------|
| 普通 → 稀有 | 5普通NFT + 30 BOX | 1稀有NFT | -20 BOX |
| 稀有 → 史诗 | 4稀有NFT + 50 BOX | 1史诗NFT | -30 BOX |

```typescript
// NFT升级
async function upgradeNFT(
  user: string,
  sourceNftIds: string[],
  targetRarity: 'rare' | 'epic'
): Promise<NFT> {
  const config = UPGRADE_CONFIG[targetRarity];
  
  // 1. 验证用户NFT数量
  const userNfts = await getUserNFTs(user, getPrevRarity(targetRarity));
  if (userNfts.length < config.nftCount) {
    throw new Error(`需要${config.nftCount}个NFT`);
  }
  
  // 2. 验证BOX余额
  const boxBalance = await getUserTokenBalance(user, 'BOX');
  if (boxBalance < config.boxCost) {
    throw new Error(`BOX不足，需要${config.boxCost} BOX`);
  }
  
  // 3. 扣除NFT
  for (const nftId of sourceNftIds) {
    await burnNFT(nftId);
  }
  
  // 4. 扣除BOX
  await deductToken(user, 'BOX', config.boxCost);
  
  // 5. 铸造新NFT
  const newNft = await mintNFT(
    user,
    `${targetRarity} NFT #${Date.now()}`,
    `升级获得的${targetRarity}NFT`,
    getDefaultImage(targetRarity),
    targetRarity,
    'upgraded'
  );
  
  // 6. 返还奖励BOX
  await addToken(user, 'BOX', config.boxReward);
  
  return newNft;
}
```

---

## 6. 合成系统

### 6.1 合成配方

| 配方ID | 产出 | 消耗碎片 | 奖励BOX | 预计开盒次数 |
|--------|------|----------|---------|--------------|
| 1 | 普通NFT | 6普通碎片 | +5 BOX | ~12次 |
| 2 | 稀有NFT | 8稀有碎片 | +8 BOX | ~54次 |
| 3 | 史诗NFT | 10史诗碎片 | +15 BOX | ~334次 |

### 6.2 合成流程

```typescript
// 碎片合成NFT
async function synthesizeNFT(
  user: string,
  recipeId: number
): Promise<{ nft: NFT; rewardBox: number }> {
  const recipe = SYNTHESIZE_RECIPES.find(r => r.id === recipeId);
  if (!recipe) {
    throw new Error('无效的配方');
  }
  
  // 1. 验证碎片数量
  for (const [type, count] of Object.entries(recipe.cost)) {
    const userFragments = await getUserFragments(user, type);
    if (userFragments < count) {
      throw new Error(`碎片不足: 需要${count}个${type}`);
    }
  }
  
  // 2. 扣除碎片
  for (const [type, count] of Object.entries(recipe.cost)) {
    await deductFragment(user, type, count);
  }
  
  // 3. 铸造NFT
  const nft = await mintNFT(
    user,
    `${recipe.result} NFT #${Date.now()}`,
    `合成获得的${recipe.result}NFT`,
    getDefaultImage(recipe.result),
    recipe.result,
    'synthesized'
  );
  
  // 4. 发放BOX奖励
  await addToken(user, 'BOX', recipe.reward);
  
  // 5. 记录合成记录
  await createSynthesizeRecord(user, recipe, nft);
  
  return { nft, rewardBox: recipe.reward };
}
```

---

## 7. 市场系统

### 7.1 交易功能

| 功能 | 说明 | 手续费 |
|------|------|--------|
| 挂售 | 设定价格出售NFT | 2% |
| 购买 | 使用SUI/BOX购买 | - |
| 取消 | 取消挂售 | 免费 |

### 7.2 挂售流程

```typescript
// 挂售NFT
async function listNFT(
  seller: string,
  nftId: string,
  price: number,
  priceUnit: 'SUI' | 'BOX'
): Promise<Listing> {
  // 1. 验证NFT所有权
  const nft = await getNFT(nftId);
  if (nft.owner !== seller) {
    throw new Error('不是NFT所有者');
  }
  
  // 2. 验证NFT状态
  if (nft.status !== 'active') {
    throw new Error('NFT不可交易');
  }
  
  // 3. 验证价格
  if (price <= 0) {
    throw new Error('价格必须大于0');
  }
  
  // 4. 创建挂售记录
  const listing = await db.listing.create({
    nftId,
    seller,
    price,
    priceUnit,
    listedAt: new Date(),
    status: 'active'
  });
  
  // 5. 更新NFT状态
  await db.nft.update(nftId, { 
    status: 'listing',
    price,
    priceUnit
  });
  
  return listing;
}
```

### 7.3 购买流程

```typescript
// 购买NFT
async function buyNFT(
  buyer: string,
  listingId: string
): Promise<{ nft: NFT; txHash: string }> {
  // 1. 获取挂售信息
  const listing = await getListing(listingId);
  if (!listing || listing.status !== 'active') {
    throw new Error('挂售不存在或已结束');
  }
  
  // 2. 验证买家余额
  const buyerBalance = await getTokenBalance(buyer, listing.priceUnit);
  if (buyerBalance < listing.price) {
    throw new Error(`${listing.priceUnit}余额不足`);
  }
  
  // 3. 计算手续费
  const fee = listing.price * 0.02;  // 2%
  const sellerReceive = listing.price - fee;
  
  // 4. 执行转账 (链上)
  const txHash = await executeTransfer(
    from: buyer,
    to: listing.seller,
    amount: listing.price,
    token: listing.priceUnit
  );
  
  // 5. 更新NFT所有权
  const nft = await db.nft.update(listing.nftId, {
    owner: buyer,
    status: 'active',
    price: null,
    listingTime: null
  });
  
  // 6. 更新挂售状态
  await db.listing.update(listingId, {
    status: 'sold',
    buyer,
    soldAt: new Date()
  });
  
  // 7. 记录交易
  await createTransactionRecord({
    type: 'buy_nft',
    buyer,
    seller: listing.seller,
    nftId: listing.nftId,
    price: listing.price,
    fee,
    txHash
  });
  
  return { nft, txHash };
}
```

---

## 8. 质押系统

### 8.1 质押池

| 池类型 | 最低质押 | 倍率 | 描述 |
|--------|----------|------|------|
| 普通池 | 1 NFT | 1x | 基础收益 |
| 高级池 | 5 NFT | 1.5x | 中级收益 |
| 尊享池 | 20 NFT | 2x | 高级收益 |

### 8.2 每日产出

| NFT类型 | 基础产出 | 尊享池(2x) |
|---------|----------|------------|
| 普通NFT | 0.1 BOX/天 | 0.2 BOX/天 |
| 稀有NFT | 0.5 BOX/天 | 1.0 BOX/天 |
| 史诗NFT | 2 BOX/天 | 4 BOX/天 |

### 8.3 质押流程

```typescript
// 质押NFT
async function stakeNFT(
  user: string,
  nftIds: string[],
  poolType: 'common' | 'premium' | 'vip'
): Promise<Stake> {
  const poolConfig = STAKING_POOLS[poolType];
  
  // 1. 验证NFT数量
  if (nftIds.length < poolConfig.minCount) {
    throw new Error(`需要至少${poolConfig.minCount}个NFT才能加入${poolConfig.name}`);
  }
  
  // 2. 验证NFT所有权
  for (const nftId of nftIds) {
    const nft = await getNFT(nftId);
    if (nft.owner !== user) {
      throw new Error(`不是NFT所有者: ${nftId}`);
    }
    if (nft.status !== 'active') {
      throw new Error(`NFT不可质押: ${nftId}`);
    }
  }
  
  // 3. 计算基础收益率
  let baseRate = 0;
  for (const nftId of nftIds) {
    const nft = await getNFT(nftId);
    baseRate += NFT_DAILY_RATE[nft.rarity];
  }
  
  // 4. 应用池子倍率
  const totalRate = baseRate * poolConfig.multiplier;
  
  // 5. 创建质押记录
  const stake = await db.stake.create({
    user,
    nftIds,
    poolType,
    stakedAt: new Date(),
    dailyRate: totalRate,
    status: 'active'
  });
  
  // 6. 更新NFT状态
  for (const nftId of nftIds) {
    await db.nft.update(nftId, { status: 'staked' });
  }
  
  return stake;
}
```

### 8.4 收益计算

```typescript
// 计算待领取收益
async function calculatePendingReward(stakeId: string): Promise<number> {
  const stake = await getStake(stakeId);
  
  // 1. 计算质押天数
  const now = new Date();
  const stakedAt = new Date(stake.stakedAt);
  const days = Math.floor((now.getTime() - stakedAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // 2. 计算收益
  const pending = stake.dailyRate * days - stake.claimed;
  
  return Math.max(0, pending);
}

// 领取收益
async function claimReward(user: string, stakeId: string): Promise<number> {
  const pending = await calculatePendingReward(stakeId);
  
  if (pending <= 0) {
    throw new Error('没有可领取的收益');
  }
  
  // 1. 发放BOX
  await addToken(user, 'BOX', pending);
  
  // 2. 更新质押记录
  await db.stake.update(stakeId, {
    claimed: stake.claimed + pending,
    lastClaimAt: new Date()
  });
  
  return pending;
}
```

### 8.5 解除质押

```typescript
// 解除质押 (冷却期7天)
async function unstakeNFT(user: string, stakeId: string): Promise<string[]> {
  const stake = await getStake(stakeId);
  
  if (stake.user !== user) {
    throw new Error('不是质押者');
  }
  
  if (stake.status !== 'active') {
    throw new Error('质押状态异常');
  }
  
  // 1. 计算冷却期
  const unstakeAvailableAt = new Date(stake.stakedAt);
  unstakeAvailableAt.setDate(unstakeAvailableAt.getDate() + 7);
  
  const now = new Date();
  
  // 2. 检查是否在冷却期内
  if (now < unstakeAvailableAt) {
    const remainingDays = Math.ceil((unstakeAvailableAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    throw new Error(`冷却期内，还需等待${remainingDays}天`);
  }
  
  // 3. 领取剩余收益
  const pending = await calculatePendingReward(stakeId);
  if (pending > 0) {
    await claimReward(user, stakeId);
  }
  
  // 4. 更新NFT状态
  const nftIds = stake.nftIds;
  for (const nftId of nftIds) {
    await db.nft.update(nftId, { status: 'active' });
  }
  
  // 5. 更新质押状态
  await db.stake.update(stakeId, {
    status: 'unstaked',
    unstakedAt: new Date()
  });
  
  return nftIds;
}
```

---

## 📋 相关文档

| 文档 | 说明 |
|------|------|
| `SPEC.md` | 项目规格说明书 |
| `API_PLAN.md` | API规划文档 |
| `DEVELOPMENT_DOC.md` | 开发文档 |

---

**文档状态**: 🟡 开发中  
**最后更新**: 2026-03-21
