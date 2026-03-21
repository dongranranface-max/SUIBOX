# SUIBOX 开发文档

**项目名称**: SUIBOX / SUI GIFT  
**版本**: v1.0  
**更新日期**: 2026-03-21  
**状态**: 开发中 (模拟数据阶段)

---

## 📋 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [页面结构](#3-页面结构)
4. [功能模块](#4-功能模块)
5. [API接口](#5-api接口)
6. [数据库设计](#6-数据库设计)
7. [设计规范](#7-设计规范)
8. [开发进度](#8-开发进度)
9. [下一步计划](#9-下一步计划)

---

## 1. 项目概述

### 1.1 基本信息

| 项目 | 内容 |
|------|------|
| 项目名称 | SUIBOX / SUI GIFT |
| 项目定位 | SUI链首个NFT盲盒+DeFi平台 |
| 区块链 | SUI Network |
| 代币 | SBOX (10亿总量) |
| 类型 | DApp / NFT / GameFi |
| 项目地址 | https://suibox.io |
| GitHub | https://github.com/dongranranface-max/SUIBOX |

### 1.2 核心业务流程

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户流程                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   注册/登录 ──→ 邀请好友 ──→ 开盲盒 ──→ 碎片 ──→ 合成NFT        │
│       │           │           │          │           │         │
│       ↓           ↓           ↓          ↓           ↓         │
│   [OAuth/钱包] [邀请奖励] [概率产出] [材料]     [NFT成品]       │
│                                                                 │
│                    NFT ──→ 交易 ──→ 质押 ──→ 收益                │
│                     │         │        │         │             │
│                     ↓         ↓        ↓         ↓             │
│                  [市场]   [手续费]  [Staking] [BOX产出]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 经济模型

| 代币 | 用途 | 总量 |
|------|------|------|
| SBOX | 平台治理代币 | 10亿 |
| 碎片 | 合成NFT原材料 | - |
| NFT | 收藏+Staking | 112万 |

**通缩机制**:
- 碎片合成: +BOX (吸引玩家)
- NFT升级: -BOX (净销毁)
- Staking: +BOX (持有收益)
- 交易手续费: -BOX (销毁)

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js | 14+ |
| UI库 | React | 18 |
| 样式 | Tailwind CSS | 3.x |
| 动画 | Framer Motion | 11.x |
| 钱包 | @suiet/wallet-kit | 2.x |
| 区块链 | SUI Network | - |
| 合约语言 | Move | - |
| 数据库 | SQLite (better-sqlite3) | - |
| 图片存储 | Cloudinary | - |
| 部署 | Vercel | - |

### 2.2 项目结构

```
suibox-new/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API 路由
│   │   │   ├── admin/          # 管理后台 API
│   │   │   ├── auth/           # 登录认证
│   │   │   ├── box/            # 盲盒
│   │   │   ├── invite/         # 邀请系统
│   │   │   ├── nft/            # NFT市场
│   │   │   ├── stake/          # 质押
│   │   │   └── ...
│   │   ├── (页面)              # 各功能页面
│   │   └── layout.tsx          # 根布局
│   │
│   ├── components/             # React 组件
│   │   ├── Header.tsx          # 导航栏
│   │   ├── MobileNav.tsx       # 移动端导航
│   │   ├── SuiWallet.tsx       # 钱包组件
│   │   └── ...
│   │
│   ├── hooks/                  # 自定义 Hooks
│   ├── lib/                   # 工具库
│   │   ├── i18n/               # 国际化
│   │   ├── database.ts         # 数据库
│   │   ├── sui.ts              # SUI 链交互
│   │   └── security.ts         # 安全工具
│   │
│   ├── stores/                 # 状态管理
│   ├── contexts/               # React Context
│   └── config/                 # 配置文件
│
├── public/                     # 静态资源
│   ├── *.png                   # 图片
│   └── *.mp4                   # 视频
│
├── data/                      # 数据存储
│   └── suibox.db               # SQLite 数据库
│
└── docs/                      # 项目文档
```

### 2.3 环境配置

```env
# .env.local
NEXT_PUBLIC_SUI_NETWORK=devnet
NEXT_PUBLIC_PACKAGE_ID=0x...
ZKLOGIN_google_CLIENT_ID=...
ZKLOGIN_google_CLIENT_SECRET=...
JWT_SECRET=...
ADMIN_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 3. 页面结构

### 3.1 页面清单

| 路由 | 页面名称 | 完成度 | 功能 |
|------|----------|--------|------|
| `/` | 首页 | 90% | 引导连接钱包、项目介绍 |
| `/login` | 登录页 | 100% | OAuth/钱包登录 |
| `/bind` | 绑定页 | 100% | 绑定钱包地址 |
| `/r/[code]` | 邀请页 | 100% | 邀请码绑定 |
| `/box` | 盲盒页 | 95% | 开盲盒、碎片获取 |
| `/craft` | 合成页 | 90% | 碎片合成NFT |
| `/market` | 市场页 | 95% | NFT交易列表 |
| `/auction` | 拍卖页 | 60% | 拍卖竞拍 |
| `/stake` | 质押页 | 90% | NFT质押 |
| `/mine` | 质押页 | 90% | 质押管理 |
| `/invite` | 邀请页 | 90% | 邀请系统 |
| `/profile` | 个人页 | 85% | 用户资产 |
| `/governance` | 治理页 | 50% | DAO投票 |
| `/nft/[id]` | NFT详情 | 70% | NFT详情 |
| `/create` | 创作页 | 50% | NFT铸造 |
| `/join` | 入驻页 | 50% | 申请入驻 |
| `/institution` | 机构页 | 50% | 机构管理 |
| `/admin` | 管理后台 | 60% | 运营管理 |

### 3.2 响应式设计

| 断点 | 设备 | 布局 |
|------|------|------|
| < 640px | 手机 | 单列、底部导航 |
| 640-1024px | 平板 | 双列、侧边栏 |
| > 1024px | 桌面 | 多列、完整导航 |

### 3.3 导航结构

```
┌─────────────────────────────────────────────────────────────┐
│  Logo  │  BOX  │  合成  │  市场▼  │  DAO▼  │  邀请  │ [钱包] │
├─────────────────────────────────────────────────────────────┤
│                      主内容区域                              │
├─────────────────────────────────────────────────────────────┤
│  [首页] [BOX] [市场] [我的]        (移动端底部导航)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 功能模块

### 4.1 用户系统

#### 登录方式
- **Google OAuth**: 一键登录
- **Discord OAuth**: 社区账号登录
- **SUI钱包**: 钱包直连 (Suiet, Sui Wallet)

#### 邀请绑定
- 邀请链接: `https://suibox.io/r/{inviteCode}`
- 自动绑定上下级关系
- 绑定后不可更改

### 4.2 盲盒系统

#### 每日开盒次数
| 来源 | 次数 |
|------|------|
| 每日免费 | 1次 |
| 邀请奖励 | 最高6次 |
| 每日上限 | 7次/天 |

#### 开盒概率
| 结果 | 概率 | 碎片数量 |
|------|------|----------|
| 普通碎片 | 50% | 1-2个 |
| 稀有碎片 | 15% | 1个 |
| 史诗碎片 | 3% | 1个 |
| 感谢参与 | 32% | 0 |

#### 保底机制
| 连续感谢次数 | 必得奖励 |
|--------------|----------|
| 3次 | 1个普通碎片 |
| 7次 | 1个稀有碎片 |
| 25次 | 1个史诗碎片 |

### 4.3 碎片合成

#### 合成配方
| 消耗碎片 | 产出NFT | 奖励BOX | 预计开盒次数 |
|---------|--------|---------|--------------|
| 6普通碎片 | 1普通NFT | +5 BOX | ~12次 |
| 8稀有碎片 | 1稀有NFT | +8 BOX | ~54次 |
| 10史诗碎片 | 1史诗NFT | +15 BOX | ~334次 |

#### NFT升级
| 消耗 | 产出 | 净消耗BOX |
|------|------|-----------|
| 5普通NFT + 30 BOX | 1稀有NFT | -20 BOX |
| 4稀有NFT + 50 BOX | 1史诗NFT | -30 BOX |

### 4.4 NFT市场

#### 功能
- NFT列表展示 (筛选、排序、分页)
- 购买NFT (SUI/BOX)
- 挂售NFT (定价)
- 取消挂售

#### 手续费
- NFT交易: 2%
- 发行量: 普通100万 / 稀有10万 / 史诗2万

### 4.5 质押系统

#### 质押池
| 池类型 | 最低数量 | 倍率 |
|--------|----------|------|
| 普通池 | 1 NFT | 1x |
| 高级池 | 5 NFT | 1.5x |
| 尊享池 | 20 NFT | 2x |

#### 每日产出
| NFT类型 | 每日BOX |
|---------|---------|
| 普通NFT | 0.1 BOX |
| 稀有NFT | 0.5 BOX |
| 史诗NFT | 2 BOX |

### 4.6 邀请系统

#### 邀请奖励
| 任务 | 被邀请人 | 邀请人 |
|------|----------|--------|
| 1位好友开盒 | +1次 | +0.5 BOX |
| 3位好友开盒 | +2次 | +1.5 BOX |
| 15位好友开盒 | +3次 | +5 BOX |

---

## 5. API接口

### 5.1 认证相关

| 方法 | 路径 | 功能 | 状态 |
|------|------|------|------|
| GET | `/api/auth/session` | 获取会话 | ✅ |
| POST | `/api/auth/callback` | OAuth回调 | ✅ |
| POST | `/api/auth/wallet-login` | 钱包登录 | ✅ |
| POST | `/api/auth/bind-wallet` | 绑定钱包 | ✅ |
| POST | `/api/auth/logout` | 登出 | ✅ |

### 5.2 盲盒相关

| 方法 | 路径 | 功能 | 状态 |
|------|------|------|------|
| GET | `/api/box` | 获取盲盒列表 | ✅ |
| POST | `/api/box` | 开盲盒 | ✅ (模拟) |

### 5.3 邀请相关

| 方法 | 路径 | 功能 | 状态 |
|------|------|------|------|
| GET | `/api/invite` | 获取邀请信息 | ✅ |
| POST | `/api/invite` | 创建/绑定邀请 | ✅ |

### 5.4 NFT相关

| 方法 | 路径 | 功能 | 状态 |
|------|------|------|------|
| GET | `/api/nft` | NFT列表 | ✅ (模拟) |
| POST | `/api/nft` | 购买NFT | 🔲 |

### 5.5 质押相关

| 方法 | 路径 | 功能 | 状态 |
|------|------|------|------|
| GET | `/api/stake` | 质押信息 | ✅ (模拟) |
| POST | `/api/stake` | 质押操作 | 🔲 |

### 5.6 用户相关

| 方法 | 路径 | 功能 | 状态 |
|------|------|------|------|
| GET | `/api/user` | 用户信息 | ✅ |
| GET | `/api/user/wallets` | 钱包列表 | ✅ |

### 5.7 统计相关

| 方法 | 路径 | 功能 | 状态 |
|------|------|------|------|
| GET | `/api/stats` | 全局统计 | ✅ |

---

## 6. 数据库设计

### 6.1 表结构

#### users (用户表)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  sui_address TEXT UNIQUE,
  provider TEXT,
  email TEXT,
  name TEXT,
  avatar TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

#### nfts (NFT表)
```sql
CREATE TABLE nfts (
  id INTEGER PRIMARY KEY,
  token_id TEXT UNIQUE,
  name TEXT,
  description TEXT,
  image_url TEXT,
  owner_address TEXT,
  price REAL,
  status TEXT DEFAULT 'active',
  rarity TEXT DEFAULT 'common',
  category TEXT,
  created_at DATETIME
);
```

#### boxes (盲盒表)
```sql
CREATE TABLE boxes (
  id INTEGER PRIMARY KEY,
  box_id TEXT UNIQUE,
  name TEXT,
  description TEXT,
  image_url TEXT,
  price REAL,
  total_supply INTEGER,
  sold_count INTEGER,
  status TEXT,
  rarity_config TEXT,
  created_at DATETIME
);
```

#### stakes (质押表)
```sql
CREATE TABLE stakes (
  id INTEGER PRIMARY KEY,
  user_address TEXT,
  amount REAL,
  pool_type TEXT,
  start_time DATETIME,
  end_time DATETIME,
  rewards_claimed REAL,
  status TEXT
);
```

#### transactions (交易记录)
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  tx_hash TEXT UNIQUE,
  from_address TEXT,
  to_address TEXT,
  token_id TEXT,
  amount REAL,
  type TEXT,
  status TEXT,
  created_at DATETIME
);
```

---

## 7. 设计规范

### 7.1 色彩系统

```css
/* 主色调 - 紫粉渐变 */
--primary: #8b5cf6;      /* Violet 500 */
--primary-dark: #7c3aed; /* Violet 600 */
--secondary: #ec4899;    /* Pink 500 */
--accent: #f97316;       /* Orange 500 */

/* 背景色 */
--bg-primary: #000000;   /* 纯黑背景 */
--bg-secondary: #111827; /* Gray 900 */
--bg-card: #1f2937;      /* Gray 800 */

/* 稀有度颜色 */
--rarity-common: #6b7280;   /* Gray 500 */
--rarity-rare: #3b82f6;    /* Blue 500 */
--rarity-epic: #a855f7;    /* Purple 500 */
--rarity-legendary: #eab308; /* Yellow 500 */
```

### 7.2 组件规范

#### 按钮
```tsx
// 主要按钮
<button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full">
  主要操作
</button>

// 次要按钮
<button className="px-6 py-3 border border-white/20 rounded-full">
  次要操作
</button>
```

#### 卡片
```tsx
<div className="bg-gray-900/95 rounded-2xl p-6 border border-gray-800">
  内容
</div>
```

### 7.3 动画效果

#### 开盒动画
- 摇晃: `rotate: [0, 15, -15, 0]`
- 缩放: `scale: [1, 1.4, 1]`
- 光晕: `opacity: [0.3, 0.6, 0.3]`
- 粒子爆炸: 30个粒子向外扩散

#### 页面转场
- 淡入: `opacity: 0 → 1`
- 上滑: `y: 20 → 0`
- 弹簧: `type: 'spring', bounce: 0.5`

---

## 8. 开发进度

### ✅ 已完成

| 模块 | 功能 | 完成度 |
|------|------|--------|
| 用户系统 | OAuth登录 | 100% |
| 用户系统 | 钱包连接 | 100% |
| 用户系统 | 邀请绑定 | 100% |
| 盲盒系统 | 开盲盒UI | 95% |
| 盲盒系统 | 概率计算 | 100% |
| 盲盒系统 | 保底机制 | 100% |
| 合成系统 | 碎片合成UI | 90% |
| 合成系统 | NFT升级UI | 90% |
| 市场系统 | NFT列表 | 95% |
| 市场系统 | 筛选排序 | 90% |
| 质押系统 | 质押池UI | 90% |
| 质押系统 | 收益计算UI | 90% |
| 邀请系统 | 邀请链接 | 100% |
| 邀请系统 | 邀请统计 | 90% |
| 个人中心 | 资产展示 | 85% |
| 管理后台 | 基础框架 | 60% |

### 🔄 进行中

| 模块 | 功能 | 进度 |
|------|------|------|
| 合约对接 | SUI链上交互 | 0% |
| 真实数据 | 数据库持久化 | 30% |
| 支付功能 | NFT购买 | 0% |
| 质押功能 | 链上质押 | 0% |

### 🔲 待开发

| 模块 | 功能 |
|------|------|
| 拍卖功能 | 竞拍系统 |
| 治理功能 | DAO投票 |
| 创作功能 | NFT铸造 |
| 通知系统 | 消息推送 |

---

## 9. 下一步计划

### 阶段一：完善模拟数据 (当前)
- [x] 启动开发服务器
- [x] 所有页面可访问
- [x] 模拟数据展示
- [ ] 完善UI细节
- [ ] 添加加载状态
- [ ] 添加空状态处理

### 阶段二：合约开发
- [ ] 部署BoxCore合约
- [ ] 部署Craft合约
- [ ] 部署Staking合约
- [ ] 部署Token合约

### 阶段三：链上对接
- [ ] 连接前端与合约
- [ ] 实现真实开盒
- [ ] 实现真实合成
- [ ] 实现真实质押

### 阶段四：测试上线
- [ ] 合约审计
- [ ] 前端测试
- [ ] 部署到主网
- [ ] 监控运维

---

## 📎 附录

### 相关文档
- `SPEC.md` - 项目规格说明书
- `API_PLAN.md` - API规划文档
- `ECONOMY.md` - 经济模型文档

### 技术资源
- [SUI Docs](https://docs.sui.io)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

### 联系方式
- GitHub: https://github.com/dongranranface-max/SUIBOX
- Discord: (待添加)
- Twitter: (待添加)

---

**文档状态**: 🟡 开发中  
**最后更新**: 2026-03-21
