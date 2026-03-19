# SUIBOX 前端功能与 API 对应表

## 📱 前端页面 → 🔌 需要实现的 API

### 1. 用户系统 (User)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 用户登录 | /login | ✅ 已完成 |
| 用户登出 | Header | ✅ 已完成 |
| 用户信息 | /profile | `/api/user/profile` |
| 我的资产 | /profile | `/api/user/assets` |
| 账户设置 | /profile | `/api/user/settings` |

---

### 2. NFT 市场 (Market)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| NFT 列表 | /market | `/api/nft/list` |
| NFT 筛选 | /market | `/api/nft/list?type=filter` |
| NFT 详情 | /nft/[id] | `/api/nft/:id` |
| 购买 NFT | /market | `/api/nft/buy` |
| 挂售 NFT | /nft/[id] | `/api/nft/sell` |
| 转让 NFT | /nft/[id] | `/api/nft/transfer` |

---

### 3. 盲盒 (Box)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 盲盒列表 | /box | `/api/box/list` |
| 盲盒详情 | /box | `/api/box/:id` |
| 购买盲盒 | /box | `/api/box/buy` |
| 开盲盒 | /box | `/api/box/open` |
| 我的盲盒 | /profile | `/api/user/boxes` |

---

### 4. 碎片系统 (Fragments)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 碎片列表 | /profile | `/api/fragment/list` |
| 碎片合成 | /craft | `/api/fragment/compose` |
| 合成规则 | /craft | `/api/fragment/rules` |

---

### 5. 拍卖 (Auction)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 拍卖列表 | /auction | `/api/auction/list` |
| 拍卖详情 | /auction | `/api/auction/:id` |
| 出价 | /auction | `/api/auction/bid` |
| 立即购买 | /auction | `/api/auction/buy-now` |
| 我的拍卖 | /profile | `/api/user/auctions` |

---

### 6. 质押 (Staking)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 质押池列表 | /mine, /stake | `/api/stake/pools` |
| 质押 | /mine | `/api/stake/stake` |
| 取消质押 | /mine | `/api/stake/unstake` |
| 领取奖励 | /mine/claim | `/api/stake/claim` |
| 质押记录 | /profile | `/api/user/stakes` |

---

### 7. 铸造 (Create)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 铸造 NFT | /create | `/api/nft/mint` |
| 上传图片 | /create | `/api/upload/image` |
| NFT 分类 | /create | `/api/nft/categories` |

---

### 8. 合成 (Craft)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 合成 | /craft | `/api/craft/compose` |
| 合成预览 | /craft | `/api/craft/preview` |
| 合成记录 | /profile | `/api/user/crafts` |

---

### 9. 社区 (Collab)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 合作项目 | /collab | `/api/collab/list` |
| 参与项目 | /collab | `/api/collab/join` |

---

### 10. 机构 (Institution)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 机构信息 | /institution | `/api/institution/profile` |
| 作品管理 | /institution | `/api/institution/nfts` |
| 收益统计 | /institution | `/api/institution/stats` |
| AI 助手 | /institution | `/api/ai/chat` (模拟) |
| 客服 | /institution | `/api/support/chat` (模拟) |

---

### 11. 邀请 (Invite)

| 前端功能 | 页面 | 需要 API |
|---------|------|---------|
| 邀请链接 | /invite | `/api/invite/generate` |
| 邀请记录 | /invite | `/api/invite/history` |
| 邀请奖励 | /invite | `/api/invite/rewards` |

---

## 🔗 链上 vs 链下

### 链上交互 (需要 Sui 钱包)

| 功能 | 说明 |
|-----|------|
| NFT 购买 | 链上转账 SUI |
| 开盲盒 | 链上随机数生成 |
| 质押/取消 | 链上合约调用 |
| NFT 转让 | 链上转移 |
| 碎片合成 | 链上合约 |

### 链下 API (后端处理)

| 功能 | 说明 |
|-----|------|
| 用户登录/注册 | Session 管理 |
| 列表筛选/分页 | 数据库查询 |
| 订单记录 | 数据库存储 |
| 消息通知 | 消息队列 |

---

## 📋 实现优先级

### 第一阶段 (MVP)
1. 用户登录/登出 ✅
2. NFT 市场列表/详情
3. 盲盒列表/购买/开盒
4. 用户资产查询

### 第二阶段 (交易)
5. NFT 购买/挂售
6. 拍卖出价
7. 质押池

### 第三阶段 (高级)
8. 碎片合成
9. NFT 铸造
10. 邀请系统

---

*最后更新: 2026-03-20*
