/**
 * SUIBOX 安全模块
 * 从前端开始确保项目安全
 */

// ========== 类型定义 ==========
interface SecurityConfig {
  maxAccountsPerIP: number;
  drawCooldown: number;
  stakeCooldown: number;
  maxDailyTransactions: number;
}

interface TransactionPreview {
  type: 'draw' | 'stake' | 'unstake' | 'synthesize' | 'transfer';
  amount: number;
  fee: number;
  description: string;
  warnings: string[];
}

interface AnomalyAlert {
  type: 'high_frequency' | 'large_amount' | 'suspicious_pattern';
  address: string;
  timestamp: number;
  details: string;
}

// ========== 安全配置 ==========
export const securityConfig: SecurityConfig = {
  maxAccountsPerIP: 6,           // 同一IP最多6个账号
  drawCooldown: 1000,            // 抽取冷却1秒
  stakeCooldown: 3000,           // 质押冷却3秒
  maxDailyTransactions: 100,       // 每日最大交易数
};

// ========== 1. 输入验证与过滤 ==========
export const InputValidator = {
  // XSS过滤
  sanitize: (str: string): string => {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>"'&script]/g, '');
  },

  // 地址验证
  validateAddress: (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{64}$/.test(addr);
  },

  // 数量验证
  validateAmount: (amount: number, min: number, max: number): boolean => {
    return typeof amount === 'number' && amount >= min && amount <= max;
  },

  // 用户ID验证
  validateUserId: (id: unknown): boolean => {
    return typeof id === 'string' && id.length > 0 && id.length <= 64;
  },
};

// ========== 2. IP限制管理 ==========
class IPRateLimiter {
  private ipRecords: Map<string, { count: number; firstTime: number; accounts: Set<string> }> = new Map();

  // 检查IP是否可以创建新账号
  canCreateAccount(ip: string): boolean {
    const record = this.ipRecords.get(ip);
    if (!record) return true;
    return record.accounts.size < securityConfig.maxAccountsPerIP;
  }

  // 记录账号创建
  recordAccount(ip: string, accountId: string): boolean {
    if (!this.canCreateAccount(ip)) return false;
    
    if (!this.ipRecords.has(ip)) {
      this.ipRecords.set(ip, { 
        count: 0, 
        firstTime: Date.now(), 
        accounts: new Set() 
      });
    }
    
    const record = this.ipRecords.get(ip)!;
    record.accounts.add(accountId);
    record.count++;
    return true;
  }

  // 获取IP下的账号数
  getAccountCount(ip: string): number {
    return this.ipRecords.get(ip)?.accounts.size || 0;
  }

  // 清理过期记录（24小时）
  cleanup(): void {
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    
    for (const [ip, record] of this.ipRecords) {
      if (now - record.firstTime > DAY) {
        this.ipRecords.delete(ip);
      }
    }
  }
}

export const ipLimiter = new IPRateLimiter();

// ========== 3. 交易预览 ==========
export const TransactionPreview = {
  // 生成交易预览
  generate: (type: TransactionPreview['type'], params: Record<string, unknown>): TransactionPreview => {
    const previews: Record<TransactionPreview['type'], TransactionPreview> = {
      draw: {
        type: 'draw',
        amount: 0,
        fee: 0.001,
        description: '开启盲盒，消耗1次开盒机会',
        warnings: [],
      },
      stake: {
        type: 'stake',
        amount: Number(params.amount) || 0,
        fee: 0.01,
        description: `质押 ${params.amount} 个NFT到合约`,
        warnings: Number(params.amount) > 100 ? ['大额质押建议分批进行'] : [],
      },
      unstake: {
        type: 'unstake',
        amount: Number(params.amount) || 0,
        fee: 0.01,
        description: '解除NFT质押，7天冷却期后到账',
        warnings: ['冷却期内无法获得收益'],
      },
      synthesize: {
        type: 'synthesize',
        amount: Number(params.costBOX) || 0,
        fee: 0.02,
        description: `消耗 ${params.costBOX} BOX 合成 ${params.result}`,
        warnings: ['合成后NFT将销毁', '不可撤销'],
      },
      transfer: {
        type: 'transfer',
        amount: Number(params.amount) || 0,
        fee: 0.001,
        description: `转账 ${params.amount} BOX 到 ${params.to}`,
        warnings: ['转账不可撤销', '请确认地址正确'],
      },
    };
    
    return previews[type];
  },

  // 格式化显示
  format: (preview: TransactionPreview): string => {
    return `
━━━━━━━━━━━━━━━━━━━━
📋 交易类型: ${preview.type}
💰 金额: ${preview.amount} BOX
⛽ 手续费: ${preview.fee} SUI
━━━━━━━━━━━━━━━━━━━━
📝 说明: ${preview.description}
${preview.warnings.length > 0 ? `⚠️ 警告:\n${preview.warnings.map(w => '• ' + w).join('\n')}` : ''}
━━━━━━━━━━━━━━━━━━━━
`.trim();
  },
};

// ========== 4. 恶意地址检测 ==========
export const addressChecker = {
  // 高风险地址特征（示例）
  highRiskPatterns: [
    /^0x0000000000000000000000000000000000000000$/, // 零地址
  ],

  // 检查地址风险
  checkRisk: async (address: string): Promise<{
    isSafe: boolean;
    riskLevel: 'safe' | 'warning' | 'danger';
    reasons: string[];
  }> => {
    const reasons: string[] = [];
    
    // 基础检查
    if (!InputValidator.validateAddress(address)) {
      return { isSafe: false, riskLevel: 'danger', reasons: ['无效地址格式'] };
    }
    
    // 零地址检查
    if (address === '0x0000000000000000000000000000000000000000000') {
      reasons.push('零地址');
    }
    
    // 可扩展：接入安全API（如Chainalysis）
    // const apiResult = await fetch(`/api/safety/check?address=${address}`);
    
    if (reasons.length > 0) {
      return { isSafe: false, riskLevel: 'danger', reasons };
    }
    
    return { isSafe: true, riskLevel: 'safe', reasons: [] };
  },
};

// ========== 5. 异常监控 ==========
class AnomalyMonitor {
  private alerts: AnomalyAlert[] = [];
  private dailyTxCounts: Map<string, number> = new Map();

  // 记录交易
  recordTransaction(address: string): void {
    const today = new Date().toDateString();
    const key = `${today}:${address}`;
    
    const count = this.dailyTxCounts.get(key) || 0;
    this.dailyTxCounts.set(key, count + 1);
    
    // 检测高频交易
    if (count + 1 > securityConfig.maxDailyTransactions) {
      this.addAlert({
        type: 'high_frequency',
        address,
        timestamp: Date.now(),
        details: `24小时内交易超过 ${securityConfig.maxDailyTransactions} 次`,
      });
    }
  }

  // 添加告警
  addAlert(alert: AnomalyAlert): void {
    this.alerts.push(alert);
    console.warn('🚨 安全告警:', alert);
    
    // 可扩展：发送通知
    // await notifyAdmin(alert);
  }

  // 获取告警列表
  getAlerts(): AnomalyAlert[] {
    return this.alerts;
  }

  // 清理旧告警（保留7天）
  cleanup(): void {
    const WEEK = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    this.alerts = this.alerts.filter(a => now - a.timestamp < WEEK);
  }
}

export const anomalyMonitor = new AnomalyMonitor();

// ========== 6. 安全检查工具 ==========
export const SecurityTools = {
  // 综合安全检查
  fullCheck: async (address: string, ip: string) => {
    const results = await Promise.all([
      addressChecker.checkRisk(address),
      Promise.resolve({ 
        canCreate: ipLimiter.canCreateAccount(ip),
        accountCount: ipLimiter.getAccountCount(ip) 
      }),
    ]);
    
    const [addressCheck, ipCheck] = results;
    
    return {
      canProceed: addressCheck.isSafe && ipCheck.canCreate,
      issues: [
        ...addressCheck.reasons,
        !ipCheck.canCreate ? `IP已达上限(${ipCheck.accountCount}/${securityConfig.maxAccountsPerIP})` : '',
      ].filter(Boolean),
    };
  },
};
