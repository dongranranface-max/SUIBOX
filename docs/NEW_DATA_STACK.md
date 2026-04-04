# SUI 新数据栈对接文档

## 📋 概述

本文档说明 SUIBOX 如何对接 SUI 官方新数据栈（gRPC + GraphQL + Archival Store）。

**重要变更**: SUI 官方将于 2026年7月31日 停用 JSON-RPC，请尽快迁移。

---

## 🏗️ 数据栈架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SUIBOX 数据架构                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    前端组件层                               │   │
│  │                                                             │   │
│  │  SuiBoxDashboard.tsx (完整展示)                          │   │
│  │  NFTCard.tsx (NFT展示)                                  │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                    │                               │
│                                    ▼                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Hooks 层                                │   │
│  │                                                             │   │
│  │  useSUIBalance()     - 获取 SUI 余额                      │   │
│  │  useUserAllNFTs()    - 获取 NFT 列表                       │   │
│  │  useUserTxHistory()  - 获取交易历史                         │   │
│  │  useNetworkStatus() - 网络状态                             │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                    │                               │
│                                    ▼                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 SuiDataProvider (Context)                  │   │
│  │              网络切换 | 连接状态 | 统一配置                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                    │                               │
│                         ┌───────────┴───────────┐                  │
│                         ▼                       ▼                  │
│  ┌─────────────────────────┐   ┌─────────────────────────┐        │
│  │    GraphQL Client       │   │    gRPC Client (旧)    │        │
│  │    (数据查询)           │   │    (交易广播)          │        │
│  └────────────┬────────────┘   └────────────┬────────────┘        │
│               │                             │                      │
│               ▼                             ▼                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   SUI Network                               │   │
│  │    Mainnet | Testnet | Devnet (自动切换)                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 文件结构

```
src/
├── lib/
│   ├── sui.ts              # 原有 RPC 服务 (保留兼容)
│   └── sui-graphql.ts     # 新 GraphQL 数据服务 ⭐
├── contexts/
│   └── SuiDataProvider.tsx # React Context 提供者 ⭐
├── hooks/
│   ├── index.ts            # 统一导出
│   ├── useSuiGraphQL.ts   # GraphQL Hooks ⭐
│   └── useSuiBox.ts      # SUIBOX 专用 Hooks ⭐
└── components/
    ├── SuiBoxDashboard.tsx # Dashboard 组件 ⭐
    └── SuiDataDemo.tsx    # 使用示例
```

---

## 🚀 快速开始

### 1. 已集成到 Providers

Provider 已自动包含，无需额外配置：

```tsx
// src/components/Providers.tsx
<QueryClientProvider>
  <AppWalletProvider>
    <I18nProvider>
      <SuiDataProvider>  {/* 已集成 */}
        {children}
      </SuiDataProvider>
    </I18nProvider>
  </AppWalletProvider>
</QueryClientProvider>
```

### 2. 直接使用 Hooks

```tsx
'use client';

import { useSUIBalance, useUserAllNFTs } from '@/hooks';

export function WalletPage({ address }: { address: string }) {
  // 获取 SUI 余额
  const { data: balance, isLoading } = useSUIBalance(address);
  
  // 获取 NFT 列表
  const { data: nfts, total } = useUserAllNFTs(address);
  
  if (isLoading) return <div>加载中...</div>;
  
  return (
    <div>
      <p>SUI 余额: {balance} SUI</p>
      <p>NFT 数量: {total}</p>
    </div>
  );
}
```

---

## 📚 API 参考

### 基础 Hooks

| Hook | 用途 | 刷新频率 |
|------|------|---------|
| `useSUIBalance` | 获取 SUI 余额 | 30秒 + 手动 |
| `useAllBalances` | 获取所有代币余额 | 30秒 |
| `useUserNFTs` | 获取 NFT 列表 | 1分钟 |
| `useUserTransactions` | 获取交易历史 | 30秒 |
| `useTransaction` | 获取单笔交易详情 | 1分钟 |
| `useUserEvents` | 获取事件列表 | 30秒 |

### SUIBOX 专用 Hooks

| Hook | 用途 | 刷新频率 |
|------|------|---------|
| `useUserAllNFTs` | 获取所有 NFT | 1分钟 |
| `useUserNFTsByRarity` | 按稀有度分类 NFT | 1分钟 |
| `useUserTxHistory` | 获取交易历史 | 30秒 |
| `useBOXBalance` | 获取 BOX 余额 (待合约) | 1分钟 |
| `useFragments` | 获取碎片数量 (待合约) | 1分钟 |
| `useStaking` | 获取质押信息 (待合约) | 1分钟 |
| `useRankings` | 获取排行榜 | 5分钟 |
| `useNetworkStatus` | 网络连接状态 | 30秒 |
| `useRefreshWallet` | 刷新钱包数据 | - |

### 工具函数

| 函数 | 用途 |
|------|------|
| `formatSUI(mist)` | Mist 转 SUI 字符串 |
| `formatNumber(num)` | 格式化大数字 (K/M/B) |
| `isValidSuiAddress(addr)` | 验证地址格式 |

---

## 🧩 组件使用

### Dashboard 完整展示

```tsx
import SuiBoxDashboard from '@/components/SuiBoxDashboard';

export default function ProfilePage({ address }: { address: string }) {
  return <SuiBoxDashboard address={address} />;
}
```

---

## 🔄 数据流示例

```
用户打开页面
    │
    ▼
React Query 检查缓存
    │
    ├── 有缓存且未过期 → 直接展示
    │
    └── 无缓存或过期
            │
            ▼
        GraphQL 请求
            │
            ├── 成功 → 更新缓存 → 展示数据
            │
            └── 失败 → 重试2次 → 显示错误
```

---

## 🌐 网络切换

```tsx
import { useSuiData } from '@/contexts/SuiDataProvider';

function NetworkSwitcher() {
  const { network, setNetwork, isConnected } = useSuiData();
  
  return (
    <div>
      <span>当前: {network}</span>
      <span>{isConnected ? '✅' : '❌'}</span>
      <button onClick={() => setNetwork('testnet')}>
        切换到 Testnet
      </button>
    </div>
  );
}
```

---

## ⚠️ 注意事项

1. **2026年7月31日** 前必须迁移到新数据栈
2. GraphQL 端点需确保稳定
3. 敏感操作（交易）仍使用 gRPC/RPC
4. BOX 代币查询需合约部署后启用

---

## 📞 技术支持

- SUI 官方文档: https://docs.sui.io
- GraphQL 端点: https://sui-mainnet.mynodes.net/graphql
