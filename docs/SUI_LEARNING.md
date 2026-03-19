# SUI区块链开发学习指南

> 更新日期: 2026-03-19

---

## 一、SUI基础概念

### 1.1 什么是SUI？

SUI是一条高性能的Layer 1区块链，采用Move语言开发，具有以下特点：

| 特性 | 说明 |
|------|------|
| **TPS** | 100,000+ |
| **确认时间** | <1秒 |
| **共识机制** | Mysticeti (DAG) |
| **智能合约** | Move语言 |
| **代币** | SUI (治理+Gas) |

### 1.2 核心概念

#### 对象 (Objects)
- SUI上所有数据都是对象
- 每个对象有唯一ID
- 对象可以被转移、删除

#### 交易 (Transactions)
- 交易执行原子操作
- 使用Move语言编写
- 需要支付Gas费

#### 包 (Packages)
- Move代码编译后形成包
- 包包含模块和函数
- 升级需要特殊处理

---

## 二、Move语言基础

### 2.1 数据类型

```move
// 基本类型
address: 钱包地址
u8, u16, u32, u64, u128, u256: 整数
bool: 布尔值
vector<T>: 动态数组
string: 字符串

// 复杂类型
struct: 结构体
enum: 枚举
```

### 2.2 示例合约

```move
module suibox::box {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // 创建一个NFT
    public struct BoxNFT has key, store {
        id: UID,
        name: string::String,
        rarity: u8, // 1=普通, 2=稀有, 3=史诗
    }

    // 创建NFT
    public fun mint(name: vector<u8>, rarity: u8, ctx: &mut TxContext) {
        let nft = BoxNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            rarity,
        };
        transfer::transfer(nft, tx_context::sender(ctx));
    }
}
```

---

## 三、SUI开发环境

### 3.1 安装SUI CLI

```bash
# macOS
brew install sui

# 或从源码编译
cargo install --git https://github.com/MystenLabs/sui.git --branch main --locked
```

### 3.2 常用命令

```bash
# 启动本地网络
sui start

# 查看版本
sui --version

# 创建新项目
sui move new my_project

# 编译合约
sui move build

# 发布到Devnet
sui client publish --gas-budget 100000000

# 查看对象
sui client objects <地址>
```

### 3.3 网络配置

| 网络 | RPC URL |
|------|---------|
| Mainnet | https://fullnode.mainnet.sui.io |
| Testnet | https://fullnode.testnet.sui.io |
| Devnet | https://fullnode.devnet.sui.io |

---

## 四、前端集成

### 4.1 钱包连接

```typescript
// 使用 @suiet/wallet-kit
import { WalletProvider } from '@suiet/wallet-kit';

function App() {
  return (
    <WalletProvider>
      <YourApp />
    </WalletProvider>
  );
}

// 连接钱包
const { wallet, connect } = useWallet();
await connect();
```

### 4.2 发送交易

```typescript
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

const { mutate: signAndExecute } = useSignAndExecuteTransaction();

signAndExecute({
  transaction: {
    kind: 'moveCall',
    function: 'mint',
    arguments: [name, rarity],
  },
});
```

### 4.3 查询数据

```typescript
import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';

const suiClient = useSuiClient();

const { data } = useQuery({
  queryKey: ['objects', address],
  queryFn: () => suiClient.getObjectsOwnedByAddress({ address }),
});
```

---

## 五、SUIBOX项目实战

### 5.1 项目结构

```
suibox-new/
├── src/
│   ├── app/              # Next.js页面
│   │   ├── box/          # 开盲盒页面
│   │   ├── market/       # NFT市场
│   │   ├── auction/      # 拍卖页面
│   │   └── ...
│   ├── components/      # React组件
│   ├── hooks/           # 自定义Hooks
│   └── providers/       # 钱包Provider
├── contracts/            # Move合约 (未来)
└── docs/               # 项目文档
```

### 5.2 核心功能实现

#### 盲盒概率
```typescript
// 保底机制
const GUARANTEE = {
  common: 3,   // 3次必出普通
  rare: 7,     // 7次必出稀有
  epic: 25,    // 25次必出史诗
};

// 随机概率
const RARITY_CHANCE = {
  epic: 0.01,    // 1%
  rare: 0.10,    // 10%
  common: 0.89,  // 89%
};
```

---

## 六、常用SDK

### 6.1 官方SDK

| SDK | 用途 |
|-----|------|
| @mysten/sui | 核心功能 |
| @mysten/dapp-kit | 前端钱包集成 |
| @mysten/graphql | GraphQL查询 |

### 6.2 钱包支持

- **Suiet Wallet** - 最流行
- **MetaMask** - 需要SUI支持
- **TokenPocket** - 移动端
- **Marty** - 浏览器扩展

---

## 七、下一步学习

### 7.1 短期目标

- [ ] 理解当前SUIBOX代码
- [ ] 实现钱包余额显示
- [ ] 添加水龙头功能

### 7.2 中期目标

- [ ] 学习Move语言基础
- [ ] 编写简单智能合约
- [ ] 部署到Devnet

### 7.3 长期目标

- [ ] 实现链上盲盒合约
- [ ] 实现NFT碎片铸造
- [ ] 实现DeFi质押合约

---

## 八、参考资料

| 资源 | 链接 |
|------|------|
| SUI官方文档 | https://docs.sui.io |
| Move语言书 | https://move-book.com |
| SDK文档 | https://sdk.mystenlabs.com |
| Suiet Wallet | https://docs.suiet.app |
| SUI生态 | https://sui.io/ecosystem |

---

## 九，当前项目钱包调用详解

### 9.1 钱包Provider配置

```typescript
// src/providers/WalletProvider.tsx
import { WalletProvider } from '@suiet/wallet-kit';

const SUI_CHAINS = [
  { id: 'sui:devnet', rpcUrl: 'https://fullnode.devnet.sui.io' },
  { id: 'sui:testnet', rpcUrl: 'https://fullnode.testnet.sui.io' },
  { id: 'sui:mainnet', rpcUrl: 'https://fullnode.mainnet.sui.io' },
];

// 使用钱包Provider包裹应用
<WalletProvider chains={SUI_CHAINS} defaultChain="sui:devnet">
  <App />
</WalletProvider>
```

### 9.2 钱包连接组件

```typescript
// src/components/SuiWallet.tsx
import { useWallet, ConnectButton } from '@suiet/wallet-kit';

function WalletButton() {
  const wallet = useWallet();
  
  // 1. 连接中
  if (wallet.connecting) {
    return <span>连接中...</span>;
  }
  
  // 2. 已连接
  if (wallet.connected && wallet.account) {
    return (
      <div>
        <span>地址: {wallet.account.address}</span>
        <button onClick={() => wallet.disconnect()}>断开</button>
      </div>
    );
  }
  
  // 3. 未连接 - 使用内置按钮
  return <ConnectButton />;
}
```

### 9.3 在页面中使用钱包

```typescript
// src/app/box/page.tsx
import { useWallet } from '@suiet/wallet-kit';

function BoxPage() {
  const wallet = useWallet();
  
  // 检查连接状态
  const handleOpenBox = async () => {
    if (!wallet.connected) {
      alert('请先连接钱包');
      return;
    }
    
    const address = wallet.account.address;
    
    // 调用API
    const res = await fetch(`/api/box?address=${address}`);
    const data = await res.json();
    
    console.log('开盒结果:', data);
  };
  
  return (
    <button onClick={handleOpenBox}>
      {wallet.connected ? '开盒' : '连接钱包'}
    </button>
  );
}
```

### 9.4 常用wallet属性

| 属性 | 说明 |
|------|------|
| `wallet.connected` | 是否已连接 |
| `wallet.account.address` | 用户地址 |
| `wallet.account.chains` | 连接的网络 |
| `wallet.connecting` | 是否正在连接 |
| `wallet.disconnect()` | 断开连接 |

### 9.5 完整示例流程

```typescript
// 1. 导入
import { useWallet } from '@suiet/wallet-kit';

// 2. 在组件中使用
const wallet = useWallet();

// 3. 检查连接
if (!wallet.connected) {
  // 引导用户连接
}

// 4. 获取地址
const address = wallet.account?.address;

// 5. 发送交易（需要签名）
// 详见下一步学习
```

---

## 十、下一步

### 10.1 当前项目已实现
- ✅ 钱包连接/断开
- ✅ 获取用户地址
- ✅ 调用API接口

### 10.2 待实现
- ⬜ 发送链上交易
- ⬜ 读取链上数据
- ⬜ 编写Move合约

---

## 十一、Web3.js 入门教程（Ethereum/EVM链）

> 注意：Web3.js 是以太坊/EVM链的库，不是SUI链的。但学习它可以理解Web3开发的核心概念。

### 11.1 安装

```bash
npm install web3
# 或
yarn add web3
```

### 11.2 初始化

```typescript
import { Web3 } from 'web3';

// 连接RPC（使用公共节点或自己的节点）
const web3 = new Web3('https://eth.llamarpc.com');

// 或使用 Infura
// const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_KEY');
```

### 11.3 查询区块链数据

```typescript
// 获取最新区块号
const blockNumber = await web3.eth.getBlockNumber();
console.log(blockNumber); // 18849658

// 获取地址余额
const balance = await web3.eth.getBalance('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
console.log(web3.utils.fromWei(balance, 'ether')); // 转换为ETH

// 获取Gas价格
const gasPrice = await web3.eth.getGasPrice();

// 获取链ID
const chainId = await web3.eth.getChainId();
```

### 11.4 钱包管理

```typescript
// 从私钥创建钱包
const account = web3.eth.accounts.wallet.add('0x你的私钥');

// 创建随机账户（仅用于测试）
web3.eth.accounts.wallet.create(1);
```

### 11.5 发送交易

```typescript
const tx = {
  from: account[0].address,
  to: '0x收款地址',
  value: web3.utils.toWei('1', 'ether'), // 1 ETH
  gas: 21000, // Gas上限
};

const receipt = await web3.eth.sendTransaction(tx);
console.log('Tx hash:', receipt.transactionHash);
```

### 11.6 交互智能合约

```typescript
// 合约ABI
const ABI = [
  {
    name: 'balanceOf',
    inputs: [{ type: 'address', name: 'owner' }],
    outputs: [{ type: 'uint256' }],
    type: 'function',
  },
  {
    name: 'transfer',
    inputs: [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'amount' },
    ],
    outputs: [],
    type: 'function',
  },
];

// 合约地址
const contractAddress = '0x合约地址';

// 创建合约实例
const token = new web3.eth.Contract(ABI, contractAddress);

// 读取数据（不需要签名）
const balance = await token.methods.balanceOf('0x地址').call();

// 发送交易（需要签名）
await token.methods.transfer('0x收款地址', amount).send({
  from: '0x付款地址',
});
```

---

## 十二、Web3.js vs SUI SDK 对比

| 功能 | Web3.js (Ethereum) | @mysten/sui (SUI) |
|------|---------------------|-------------------|
| 连接节点 | `new Web3(rpcUrl)` | `new SuiClient({ rpc: ... })` |
| 查询余额 | `web3.eth.getBalance()` | `client.getBalance()` |
| 发送交易 | `web3.eth.sendTransaction()` | `client.signAndExecute()` |
| 合约交互 | `new web3.eth.Contract(abi)` | `client.getObject()` |
| 钱包 | MetaMask等 | Suiet/Marty等 |

---

## 十三、SUIBOX 商业化技术栈推荐

> 基于模块化架构，兼顾安全、性能、可维护性

### 13.1 技术栈矩阵

| 模块 | 推荐框架/工具 | 核心作用 |
|------|---------------|----------|
| **前端框架** | Next.js 14 (App Router) | Vercel原生优化，Edge Functions/RPC缓存 |
| **状态管理** | Zustand + React Query | 缓存SUI链上数据，减少RPC请求 |
| **钱包交互** | @mysten/wallet-adapter + Web3Modal | 多钱包适配，统一交互体验 |
| **合约开发** | Sui Move CLI + Foundry(SUI版) | 合约编译/测试/部署，安全扫描 |
| **部署流水线** | Vercel CI/CD + GitHub Actions | 自动编译/测试/部署，合约审计前置 |
| **监控告警** | Sentry + Vercel Analytics + Tenderly | 前端错误+链上交易监控，异常告警 |
| **安全加固** | NextAuth + CSP + Cloudflare | 身份验证 + 防XSS+DDoS防护 |

### 13.2 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      前端 (Next.js 14)                       │
├──────────┬──────────┬──────────┬──────────┬──────────────┤
│  Zustand │ React    │ Web3Modal │  Sentry  │ Cloudflare   │
│  状态    │ Query缓存 │ 钱包连接  │  错误监控  │  CDN防护     │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┴──────┬───────┘
     │          │          │          │             │
     ▼          ▼          ▼          ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│                   (全球CDN + 边缘计算)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  SUI主网   │  │  SUI测试网  │  │  SUI Devnet│
    │ (Mainnet) │  │ (Testnet)  │  │ (Devnet)  │
    └────────────┘  └────────────┘  └────────────┘
```

### 13.3 实施路线图

#### Phase 1: 基础架构 ✅
- [x] Next.js 14
- [x] Tailwind CSS
- [x] Suiet Wallet

#### Phase 2: 性能优化 🔄
- [ ] 集成 React Query
- [ ] 添加 Zustand 状态管理
- [ ] 配置 Vercel Edge

#### Phase 3: 安全加固 🔄
- [ ] NextAuth 登录
- [ ] CSP 安全头
- [ ] Cloudflare 防护

#### Phase 4: 监控部署 🔄
- [ ] Sentry 集成
- [ ] Vercel Analytics
- [ ] Tenderly 交易监控

#### Phase 5: 合约上线 🔄
- [ ] Move 合约开发
- [ ] Foundry 测试
- [ ] 审计流程

---

### 13.4 学习资源

| 资源 | 链接 |
|------|------|
| Next.js 14 | https://nextjs.org |
| Zustand | https://zustand-demo.pmnd.rs |
| React Query | https://tanstack.com/query |
| Tenderly | https://tenderly.co |
| Sentry | https://sentry.io |

---

## 十四、框架选择建议

| 项目阶段 | 推荐框架 | 核心优势 |
|----------|----------|----------|
| **MVP/快速验证** | Sui Starter Kit | 零配置，内置SUI生态所有基础功能 |
| **中小规模产品** | Next.js + SUI SDK | Vercel优化，灵活定制，兼顾性能/SEO |
| **企业级商业化** | Next.js 14 + 模块化组合 | 高安全/高可用，可扩展，适配复杂业务逻辑 |
| **合约优先迭代** | Remix + SUI合约 | 前后端一体化，迭代效率高 |

### 14.1 各阶段选择

#### 🚀 MVP阶段 - Sui Starter Kit
- 使用官方模板快速启动
- 内置钱包连接、余额查询、水龙头
- 适合：快速验证想法

#### 📈 成长期 - Next.js + SUI SDK
- 自己掌控架构
- 灵活定制UI/UX
- 适合：产品迭代

#### 🏢 企业级 - 模块化组合
- Zustand 状态管理
- React Query 数据缓存
- Sentry 监控
- 适合：商业化产品

---

### 14.2 SUIBOX当前阶段

当前SUIBOX处于 **MVP → 成长期**：
- ✅ 基础框架：Next.js 14
- ✅ 钱包：Suiet Wallet
- 🔄 待添加：React Query、状态管理
- 🔄 待添加：监控、安全

---

## 十五、我的Web3学习目标

### 15.1 掌握SUI链开发

| 目标 | 优先级 | 状态 |
|------|--------|------|
| 理解SUI核心概念 | 🔴 高 | ✅ |
| 钱包集成开发 | 🔴 高 | ✅ |
| Move语言基础 | 🔴 高 | 🔄 进行中 |
| 编写简单合约 | 🔴 高 | ⬜ |
| 部署到Devnet | 🔴 高 | ⬜ |
| 前端连接合约 | 🔴 高 | ⬜ |

### 15.2 核心技术栈

```typescript
// SUI开发必备
import { SuiClient } from '@mysten/sui';
import { WalletProvider } from '@suiet/wallet-kit';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
```

### 15.3 日常实践

1. **每日学习**: 1小时SUI/Move开发
2. **项目实战**: 在SUIBOX中实践
3. **代码审查**: 确保安全最佳实践
4. **文档更新**: 记录学习心得

---

### 15.4 SUIBOX实现路线

```
Phase 1: 基础功能 (当前)
├── 钱包连接 ✅
├── 盲盒页面 ✅
├── 市场页面 ✅
└── 拍卖页面 ✅

Phase 2: 链上交互 (下一步)
├── 集成React Query
├── 添加余额显示
├── 实现水龙头功能
└── 连接测试网

Phase 3: 智能合约
├── 学习Move语言
├── 编写盲盒合约
├── 编写NFT合约
└── 部署Devnet

Phase 4: 商业化
├── 安全审计
├── 性能优化
├── 监控告警
└── 主网上线
```

---

## 十六、SUI交易详解

### 16.1 交易类型

SUI有两种交易类型：

| 类型 | 说明 |
|------|------|
| **Programmable Transaction Blocks (PTBs)** | 可编程交易块，用于日常操作 |
| **System Transactions** | 系统交易，仅验证器可提交 |

### 16.2 PTB交易组成

```typescript
interface Transaction {
  sender: string;           // 发送者地址
  gasInput: object;          // Gas支付对象
  gasPrice: number;         // Gas价格
  maxGasBudget: number;     // 最大Gas预算
  epoch: number;             // 交易时代
  type: 'call' | 'publish' | 'native';
  authenticator: signature;   // 签名
  expiration?: number;        // 过期时间（可选）
}
```

### 16.3 SUI对象模型

```
例子：转账流程

交易前:
┌─────────────┐    ┌─────────────┐
│ Object A    │    │ Object B    │
│ 5 SUI (Tom) │    │ 2 SUI (John)│
└─────────────┘    └─────────────┘

Tom转1 SUI给Alice:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Object A    │    │ Object C    │    │ Object B    │
│ 4 SUI (Tom) │───▶│ 1 SUI (Alice│    │ 2 SUI (John)│
└─────────────┘    └─────────────┘    └─────────────┘

并行处理：两个不同对象的交易可以并行执行！
```

### 16.4 前端发送交易示例

```typescript
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

function TransferButton() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const transfer = () => {
    signAndExecute({
      transaction: {
        kind: 'moveCall',
        function: 'transfer',
        arguments: [toAddress, amount],
      },
      onSuccess: (result) => {
        console.log('交易成功:', result.digest);
      },
      onError: (error) => {
        console.error('交易失败:', error);
      }
    });
  };
  
  return <button onClick={transfer}>转账</button>;
}
```

### 16.5 Gas机制

- **Gas Price**: 每单位Gas的价格
- **Max Gas**: 最大Gas预算
- **存储费**: 创建对象需要存储费
- **退款**: 未使用的Gas会退还

---

### 17.1 下一步学习

1. ⬜ 安装SUI CLI
2. ⬜ 创建测试钱包
3. ⬜ 编写第一个Move合约
4. ⬜ 部署到Devnet
5. ⬜ 前端连接合约

---

## 十八、SUI官方参考资料

### 18.1 核心参考资料

| 资源 | 链接 |
|------|------|
| Object Display V2 | https://docs.sui.io/references/object-display-syntax |
| SUI SDK | https://sdk.mystenlabs.com |
| **Move语言书** | https://move-language.github.io/move/ |
| SUI源码 | https://github.com/MystenLabs/sui |

### 18.2 Move语言学习

官方Move语言书：https://move-language.github.io/move/

**目录：**
- 模块和脚本 (Modules & Scripts)
- 创建代币 (Creating Coins)
- 高级主题

### 18.3 开发常用链接

- **SUI文档**: https://docs.sui.io
- **SUI博客**: https://blog.sui.io
- **SUI Discord**: https://discord.gg/sui
- **SUI GitHub**: https://github.com/MystenLabs/sui

---

## 十九、Move语言规范详解

### 19.1 Move核心特性

Move是一种安全的智能合约语言，专为区块链资产设计。

**核心理念：**
- **Resource Types** - 资源类型，资产不可复制
- **Linear Types** - 线性语义，资产只能使用一次
- **Formal Verification** - 形式化验证

### 19.2 基本语法

```move
// 模块定义
module suibox::box {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    // 结构体（NFT）
    public struct BoxNFT has key, store {
        id: UID,
        name: string::String,
        rarity: u8,  // 1=普通, 2=稀有, 3=史诗
        owner: address,
    }
    
    // 创建NFT函数
    public fun mint(
        name: vector<u8>,
        rarity: u8,
        ctx: &mut TxContext
    ) {
        let nft = BoxNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            rarity,
            owner: tx_context::sender(ctx),
        };
        transfer::transfer(nft, tx_context::sender(ctx));
    }
    
    // 转移NFT
    public fun transfer(nft: BoxNFT, recipient: address) {
        transfer::transfer(nft, recipient);
    }
}
```

### 19.3 数据类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `address` | 钱包地址 | `0x1234...` |
| `u8/u64/u128` | 整数 | `1`, `100` |
| `bool` | 布尔值 | `true/false` |
| `vector<T>` | 动态数组 | `vector<u8>` |
| `string` | 字符串 | `hello` |
| `struct` | 结构体 | 自定义 |

### 19.4 能力 (Abilities)

```move
// 可复制
public struct Data1 has copy { value: u64 }

// 可删除
public struct Data2 has drop { value: u64 }

// 可存储
public struct Data3 has store { value: u64 }

// 可key（可作为对象）
public struct Data4 has key { id: UID }

// 组合能力
public struct NFT has key, store { ... }
```

### 19.5 常用标准库

```move
use sui::object::{Self, UID, new};
use sui::transfer::{Self, transfer, share_object};
use sui::tx_context::{Self, TxContext, sender};
use sui::coin::{Self, Coin, TreasuryCap};
use sui::url::{Self, Url};
```

---

## 二十、SUI特定功能

### 20.1 SUI对象模型

```move
// SUI NFT标准
public struct SuiNft has key, store {
    id: UID,
    name: string::String,
    description: string::String,
    url: Url,
}
```

### 20.2 交易命令

```move
// 调用函数
Command::MoveCall {
    package: ObjectID,
    module: identifier::MemberName,
    function: identifier::MemberName,
    type_arguments: Vec<Type>,
    arguments: Vec<CommandArgument>,
}

// 转让对象
Command::TransferObjects {
    objects: Vec<CommandArgument>,
    recipient: CommandArgument,
}

// 共享对象
Command::ShareObject {
    object: CommandArgument,
}
```

### 20.3 权限控制

```move
// 只能合约创建者调用
public fun create(ctx: &TxContext) {
    // 检查发送者是否是创建者
    assert!(tx_context::sender(ctx) == CREATOR_ADDRESS, 0);
}
```

---

*目标：掌握Move语言，实现SUIBOX合约开发！*


