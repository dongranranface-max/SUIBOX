# SUI生态参与指南

## 📌 目录

1. SUI Foundation Grant 申请
2. SUI Ambassador 申请
3. 空投执行方案

---

# 1️⃣ SUI Foundation Grant 申请

## 申请入口

**官网**: https://sui.io/ecosystem-fund

**申请表单**: https://grants.sui.io

## 申请前准备

| 材料 | 说明 |
|------|------|
| 项目名称 | SUIBOX |
| 项目类型 | DApp / NFT / DeFi |
| 阶段 | MVP / Prototype / Full Product |
| 请求金额 | $5k / $25k / $100k+ |

## 申请流程

```
Step 1: 访问 grants.sui.io
         ↓
Step 2: 创建账号 (GitHub OAuth)
         ↓
Step 3: 填写项目信息
         - 项目简介 (280字)
         - 问题 & 解决方案
         - 目标用户
         - 商业模式
         - 团队介绍
         - 预算用途
         - 时间线
         ↓
Step 4: 提交补充材料
         - GitHub仓库
         - 白皮书/文档
         - 原型截图/视频
         ↓
Step 5: 等待审核 (2-4周)
         ↓
Step 6: 视频面试 (可能)
         ↓
Step 7: 获得 Grant
```

## 审核标准

| 标准 | 权重 |
|------|------|
| 创新性 | 25% |
| 技术可行性 | 25% |
| 团队能力 | 20% |
| 市场潜力 | 15% |
| SUI契合度 | 15% |

## 注意事项

- ✅ 突出SUI链的独特优势
- ✅ 展示已有原型/代码
- ✅ 说明团队技术背景
- ❌ 不要过度承诺
- ❌ 不要低估竞争对手

---

# 2️⃣ SUI Ambassador 申请

## 官方渠道

**Twitter**: @SuiAmbassador
**Discord**: discord.gg/sui ( #ambassadors 频道)
**官网**: sui.io/ambassadors

## 申请条件

| 要求 | 说明 |
|------|------|
| 技术能力 | 理解SUI/Move |
| 社区贡献 | 教程/翻译/活动 |
| 语言能力 | 英语+中文优先 |
| 时间投入 | 每周5小时+ |

## 申请步骤

### Step 1: 准备材料

- [ ] 1000+ Twitter粉丝 (非必须但加分)
- [ ] Discord活跃用户
- [ ] 技术文章/教程 (2篇+)
- [ ] 参与SUI社区的经历

### Step 2: 填写申请

Discord #ambassadors 频道有申请链接

### Step 3: 贡献测试

申请后会被分配任务：
- 翻译文档
- 回答社区问题
- 组织线上活动
- 创建教程

### Step 4: 正式加入

持续贡献3个月后获得认证

## Ambassador 权益

- ✅ 官方认证徽章
- ✅ 早期动态优先知道
- ✅ 生态grant优先权
- ✅ 线下活动邀请
- ✅ 开发者直接对话

---

# 3️⃣ 空投执行方案

## 方案对比

### 方案A：快照空投

| 步骤 | 操作 |
|------|------|
| 1 | 设定快照时间 T |
| 2 | 在T时刻记录所有>阈值的钱包 |
| 3 | 计算空投数量 |
| 4 | 上线后发放 |

**优点**: 简单公平
**缺点**: 容易被脚本刷

### 方案B：任务制空投

| 步骤 | 操作 |
|------|------|
| 1 | 设定任务 (Twitter关注+转发) |
| 2 | 用户完成任务 |
| 3 | 验证+发放 |

**优点**: 防止女巫
**缺点**: 参与率低

### 方案C：混合型 (推荐)

```
1. 快照: 持有SUI的用户获得基础空投
2. 任务: 完成社交任务获得额外奖励
3. 门槛: 需钱包+社交绑定+IP验证
```

## 详细执行

### Step 1: 快照设计

```solidity
// 伪代码
struct Snapshot {
    uint256 timestamp;
    mapping(address => uint256) balances;
}

function takeSnapshot() {
    snapshot = Snapshot(block.timestamp);
    for (address holder : allSuiHolders) {
        uint256 balance = SUI.balanceOf(holder);
        if (balance >= MIN_HOLD) {
            snapshot.balances[holder] = balance;
        }
    }
}
```

### Step 2: 计算公式

```
空投数量 = 持有SUI数量 × (1 / 10000) × 全网总量

例如:
- 持有100 SUI
- 系数 = 1/10000
- 空投 = 100 × 0.0001 × 10,000,000 = 100 SBOX
```

### Step 3: 领取条件

| 条件 | 说明 |
|------|------|
| 钱包 | 需连接钱包 |
| 社交 | 绑定Twitter |
| KYC | 大额需实名 |
| 冷却 | 领取后30天不能交易 |

### Step 4: 防止女巫

```
1. IP限制: 1IP最多领取3个
2. 设备指纹: 1设备最多5个钱包
3. 行为分析: 异常账户标记
4. 社交验证: Twitter关注+30天+
5. 持有时间: 快照前30天持有
```

### Step 5: 发放

```javascript
// 后端伪代码
async function airdrop(recipients) {
    const batchSize = 100;
    for (i = 0; i < recipients.length; i += batchSize) {
        batch = recipients.slice(i, i + batchSize);
        await contract.batchTransfer(batch);
    }
}
```

## 时间线

| 时间 | 动作 |
|------|------|
| T-30天 | 宣布空投计划 |
| T-7天 | 快照拍摄 |
| T-0 | 正式上线 |
| T+7天 | 开放领取 |
| T+37天 | 领取截止 |
| T+45天 | 未领取销毁 |

---

# 📋 检查清单

## Grant 申请

- [ ] 项目代码 GitHub
- [ ] 商业计划书
- [ ] 经济模型文档
- [ ] UI截图/视频
- [ ] 团队介绍

## Ambassador 申请

- [ ] 技术文章 2篇+
- [ ] Discord 活跃
- [ ] Twitter 1000+粉丝
- [ ] 贡献记录

## 空投

- [ ] 快照合约
- [ ] 领取页面
- [ ] 防女巫逻辑
- [ ] 发放脚本

---

更新于 2026-03-18
