'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Wallet, Lock, RefreshCw, ChevronRight, Info } from 'lucide-react';

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // 保险基金数据
  const fundData = {
    totalPool: 1250000, // 125万USDT
    usedAmount: 35000, // 已赔付3.5万
    remaining: 1215000,
    coverageRate: 95, // 95%赔付比例
    claimCount: 23, // 已赔付23次
    avgClaimTime: '2.3天', // 平均赔付时间
  };

  // 赔付记录
  const claimRecords = [
    { id: 1, user: '0x7a9...3f2', amount: 2500, status: '已完成', date: '2026-03-10', reason: '钱包被盗' },
    { id: 2, user: '0x3b2...8c1', amount: 1800, status: '审核中', date: '2026-03-14', reason: '钓鱼攻击' },
    { id: 3, user: '0x9f1...5a4', amount: 3200, status: '已完成', date: '2026-03-05', reason: '合约漏洞' },
  ];

  // 赔付规则
  const rules = [
    { title: '保障范围', items: ['钱包被盗', '钓鱼攻击', '智能合约漏洞', '平台技术故障'] },
    { title: '赔付条件', items: ['持有NFT超过7天', '通过KYC验证', '及时报案', '提供交易记录'] },
    { title: '赔付流程', items: ['提交申请(24小时内)', '材料审核(1-3天)', '赔付确认(1天)', '资金到账'] },
    { title: '不赔付情况', items: ['用户主动泄露私钥', '参与诈骗', '违规交易', '未通过KYC'] },
  ];

  // 基金来源
  const fundSources = [
    { name: '交易手续费', percent: 60, amount: 750000 },
    { name: '盲盒收入', percent: 25, amount: 312500 },
    { name: '质押收益', percent: 10, amount: 125000 },
    { name: '其他收入', percent: 5, amount: 62500 },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-900/30 to-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">安全保障计划</h1>
              <p className="text-gray-400">您的数字资产，我们来守护</p>
            </div>
          </div>
          
          {/* 核心指标 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="text-gray-400 text-sm">保险基金池</div>
              <div className="text-2xl font-bold text-green-400">${fundData.totalPool.toLocaleString()}</div>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="text-gray-400 text-sm">已赔付金额</div>
              <div className="text-2xl font-bold text-blue-400">${fundData.usedAmount.toLocaleString()}</div>
            </div>
            <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20">
              <div className="text-gray-400 text-sm">赔付比例</div>
              <div className="text-2xl font-bold text-violet-400">{fundData.coverageRate}%</div>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
              <div className="text-gray-400 text-sm">平均赔付时间</div>
              <div className="text-2xl font-bold text-amber-400">{fundData.avgClaimTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 -mt-4">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {[
            { key: 'overview', label: '保障概览', icon: Shield },
            { key: 'rules', label: '赔付规则', icon: FileText },
            { key: 'apply', label: '申请赔付', icon: AlertTriangle },
            { key: 'records', label: '赔付记录', icon: Clock },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 保障概览 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 基金来源 */}
            <div className="bg-gray-900/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-400" />
                基金来源
              </h2>
              <div className="space-y-4">
                {fundSources.map((source, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span>{source.name}</span>
                      <span className="text-gray-400">${source.amount.toLocaleString()} ({source.percent}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{ width: `${source.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 保障优势 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  安全特性
                </h3>
                <ul className="space-y-3">
                  {[
                    '链上透明 - 所有赔付记录可查',
                    '多重签名 - 资金安全有保障',
                    '审计合约 - 已通过安全审计',
                    '风控系统 - 实时监测异常',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900/50 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-400" />
                  快速赔付
                </h3>
                <ul className="space-y-3">
                  {[
                    '平均赔付时间 2.3 天',
                    '已成功赔付 23 次',
                    '最高赔付金额 $10,000',
                    '7×24 小时客服支持',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 提醒 */}
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-400 mt-0.5" />
                <div className="text-sm text-amber-200">
                  <p className="font-bold mb-1">温馨提示</p>
                  <p>请妥善保管您的私钥和助记词，平台工作人员不会索要您的任何密码。如遇可疑情况，请立即联系客服。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 赔付规则 */}
        {activeTab === 'rules' && (
          <div className="grid md:grid-cols-2 gap-4">
            {rules.map((rule, i) => (
              <div key={i} className="bg-gray-900/50 rounded-2xl p-5">
                <h3 className="font-bold mb-3 text-lg">{rule.title}</h3>
                <ul className="space-y-2">
                  {rule.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-300">
                      <span className="text-green-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* 申请赔付 */}
        {activeTab === 'apply' && (
          <div className="bg-gray-900/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">申请赔付</h2>
            <form className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm text-gray-400 mb-2">NFT名称/ID</label>
                <input type="text" placeholder="输入您的NFT名称或ID" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">损失金额 (USDT)</label>
                <input type="number" placeholder="估算损失金额" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">事故类型</label>
                <select className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500 outline-none">
                  <option>钱包被盗</option>
                  <option>钓鱼攻击</option>
                  <option>智能合约漏洞</option>
                  <option>平台技术故障</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">详细说明</label>
                <textarea rows={4} placeholder="请详细描述事故经过..." className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">相关证明材料</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                  <p className="text-gray-400">点击或拖拽上传文件</p>
                  <p className="text-xs text-gray-500 mt-1">支持 JPG, PNG, PDF, 聊天截图等</p>
                </div>
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-bold text-lg">
                提交申请
              </button>
            </form>
          </div>
        )}

        {/* 赔付记录 */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-black/50">
                  <tr>
                    <th className="text-left p-4 text-gray-400">用户</th>
                    <th className="text-left p-4 text-gray-400">金额</th>
                    <th className="text-left p-4 text-gray-400">原因</th>
                    <th className="text-left p-4 text-gray-400">日期</th>
                    <th className="text-left p-4 text-gray-400">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {claimRecords.map((record) => (
                    <tr key={record.id} className="border-t border-white/5">
                      <td className="p-4 font-mono text-sm">{record.user}</td>
                      <td className="p-4 text-green-400 font-bold">${record.amount}</td>
                      <td className="p-4 text-gray-300">{record.reason}</td>
                      <td className="p-4 text-gray-400">{record.date}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          record.status === '已完成' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
