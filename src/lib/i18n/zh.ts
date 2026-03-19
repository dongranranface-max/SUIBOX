// 中文翻译
export const zh = {
  // 通用
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    submit: '提交',
    back: '返回',
    next: '下一步',
    prev: '上一步',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    refresh: '刷新',
    copy: '复制',
    view: '查看',
    more: '更多',
    all: '全部',
    none: '无',
    yes: '是',
    no: '否',
    online: '在线',
    offline: '离线',
  },

  // 导航
  nav: {
    home: '首页',
    market: '市场',
    auction: '拍卖',
    box: '盲盒',
    craft: '合成',
    stake: '质押',
    ranking: '榜单',
    create: '铸造',
    profile: '我的',
    login: '登录',
    logout: '退出',
    settings: '设置',
    language: '语言',
  },

  // 首页
  home: {
    title: 'SUIBOX',
    subtitle: 'NFT + DeFi 一站式平台',
    hotAuctions: '热门拍卖',
    newListings: '最新上架',
    endingSoon: '即将结束',
    viewAll: '查看全部',
    featured: '精选',
    trending: '热门',
    recentlyAdded: '最近添加',
  },

  // 市场
  market: {
    title: 'NFT 市场',
    searchPlaceholder: '搜索 NFT...',
    filter: {
      all: '全部',
      art: '艺术',
      collectible: '收藏',
      game: '游戏',
      domain: '域名',
    },
    sort: {
      newest: '最新',
      priceLow: '价格从低到高',
      priceHigh: '价格从高到低',
      popular: '最热门',
    },
    rarity: {
      common: '普通',
      uncommon: '稀有',
      rare: '稀有',
      epic: '史诗',
      legendary: '传奇',
    },
    price: '价格',
    seller: '卖家',
    buyNow: '立即购买',
    makeOffer: '出价',
  },

  // 盲盒
  box: {
    title: '盲盒',
    open: '开盲盒',
    remaining: '剩余',
    sold: '已售',
    chance: '概率',
    opened: '已开启',
    openAgain: '再次开启',
  },

  // 拍卖
  auction: {
    title: '拍卖',
    bid: '出价',
    currentBid: '当前出价',
    yourBid: '你的出价',
    placeBid: '出价',
    buyNow: '一口价',
    ending: '结束',
    ended: '已结束',
    bids: '出价次数',
    highestBidder: '最高出价者',
  },

  // 质押
  stake: {
    title: '质押',
    pool: '质押池',
    apy: '年化收益',
    staked: '已质押',
    rewards: '奖励',
    stake: '质押',
    unstake: '解除质押',
    claim: '领取',
    lockPeriod: '锁定期',
    minStake: '最低质押',
  },

  // 铸造
  create: {
    title: '铸造 NFT',
    name: '名称',
    description: '描述',
    category: '分类',
    royalty: '版税',
    upload: '上传文件',
    preview: '预览',
    mint: '铸造',
    uploading: '上传中...',
  },

  // 个人中心
  profile: {
    title: '个人中心',
    myNFTs: '我的 NFT',
    myBoxes: '我的盲盒',
    myFragments: '我的碎片',
    myAuctions: '我的拍卖',
    myStakes: '我的质押',
    settings: '账户设置',
    bindWallet: '绑定钱包',
    security: '安全设置',
  },

  // 登录
  login: {
    title: '欢迎登录',
    subtitle: '选择登录方式',
    oauth: '社交账号登录',
    wallet: '钱包登录',
    connectWallet: '连接钱包',
    google: 'Google 登录',
    discord: 'Discord 登录',
    walletSupported: '支持的钱包',
    terms: '登录即表示同意',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
  },

  // 错误信息
  errors: {
    networkError: '网络错误，请检查网络连接',
    serverError: '服务器错误，请稍后重试',
    unauthorized: '请先登录',
    insufficientBalance: '余额不足',
    transactionFailed: '交易失败',
    invalidInput: '输入无效',
    required: '此项为必填',
  },

  // 时间
  time: {
    justNow: '刚刚',
    minutesAgo: '{n} 分钟前',
    hoursAgo: '{n} 小时前',
    daysAgo: '{n} 天前',
  },
};

export type Translations = typeof zh;
