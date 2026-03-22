# SUIBOX 系统架构说明

## 前台与后台分离

### 用户前台 (前台)
- **访问地址**: http://localhost:3000
- **功能**: NFT盲盒、碎片合成、市场交易、质押、拍卖等用户功能
- **登录方式**: 钱包登录、zkLogin、Google登录

### 管理后台 (后台)
- **访问地址**: http://localhost:3000/admin
- **功能**: 用户管理、消息通知、交易管理、NFT管理、财务管理、安全中心、系统设置
- **登录方式**: 管理员账号密码

## 管理员账号

```
用户名: admin
密码: admin123
```

## 目录结构

```
src/app/
├── page.tsx                    # 前台首页
├── admin/                     # 后台管理
│   ├── page.tsx              # 后台首页/概览
│   ├── login/                 # 后台登录页
│   └── users/                 # 用户管理页面
└── api/admin/                 # 后台API
    ├── auth/                  # 认证API
    ├── users/                 # 用户管理API
    ├── manage/                # 管理API
    └── notifications/         # 消息通知API
```

## 用户管理功能

### 用户信息
- 登录渠道（Google/钱包/zkLogin）
- 注册时间、最后登录、登录次数
- 账户状态（正常/禁用/待审核）
- 邀请码

### 推荐关系
- 推荐人信息（地址+昵称）
- 被邀请的用户列表
- 邀请奖励记录

### 用户资产
- SUI 余额
- BOX 余额
- 剩余开盲盒次数
- NFT 数量
- NFT 分类统计
- 空投代币（已领取/待领取）

## 技术栈

- **前端**: Next.js 16 + React + TypeScript + Tailwind CSS
- **数据库**: SQLite (better-sqlite3)
- **钱包**: SUI Wallet + zkLogin
- **UI组件**: lucide-react, framer-motion

## 环境变量

```env
# 管理后台 (可选)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```
