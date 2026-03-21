'use client';

import { useState } from 'react';
import { 
  MessageCircle, Phone, Mail, Clock, Send, Search, 
  FileText, Image, Paperclip, CheckCircle, XCircle,
  ChevronDown, Headphones, Bot, Star, ThumbsUp, ThumbsDown,
  ArrowRight, Zap, Shield, Gift
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function CustomerServicePage() {
  const { tt } = useI18n?.() || { tt: (k: string, f?: string) => f || k };
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'faq'>('chat');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'system', content: '欢迎来到SUIBOX客服中心！请问有什么可以帮助您的？', time: '10:00' },
    { id: 2, role: 'user', content: '我想了解一下盲盒保底机制', time: '10:01' },
    { id: 3, role: 'system', content: '您好！SUIBOX的盲盒保底机制如下：\n\n普通盲盒：10次必出R\n稀有盲盒：10次必出SR\n史诗盲盒：10次必出SSR\n\n请问还有其他问题吗？', time: '10:02' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAI, setIsAI] = useState(true); // AI客服开关

  // 工单列表
  const tickets = [
    { id: 'TK001', title: '关于盲盒开不出SSR', status: '处理中', time: '2026-03-15 14:30', reply: 2 },
    { id: 'TK002', title: '钱包连接失败', status: '已解决', time: '2026-03-14 09:15', reply: 5 },
    { id: 'TK003', title: '如何提升等级', status: '已解决', time: '2026-03-13 18:45', reply: 1 },
  ];

  // FAQ
  const faqs = [
    { q: '如何购买盲盒？', a: '在盲盒页面选择类型，点击开启即可使用SUI购买。' },
    { q: '保底机制是什么？', a: '连续开启10次同类型盲盒，必得对应稀有度的NFT。' },
    { q: '如何联系人工客服？', a: '点击右下角"转人工"按钮，或提交工单。' },
    { q: '保险基金如何申请？', a: '前往安全中心页面，提交赔付申请。' },
    { q: '邀请奖励何时发放？', a: '好友完成首次购买后24小时内发放。' },
  ];

  // 发送消息
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setInputMessage('');

    // 模拟AI回复
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'system',
        content: '感谢您的咨询！如果您的问题还未解决，可以点击"转人工"联系专属客服。',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-900/30 to-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Headphones className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">客服中心</h1>
              <p className="text-gray-400">7×24小时为您服务</p>
            </div>
          </div>

          {/* 快捷入口 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 text-center">
              <MessageCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-sm">在线客服</div>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 text-center">
              <Phone className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-sm">热线电话</div>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-center">
              <Mail className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-sm">邮件支持</div>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 text-center">
              <FileText className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-sm">提交工单</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 -mt-4">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {[
            { key: 'chat', label: '在线客服', icon: MessageCircle },
            { key: 'tickets', label: '我的工单', icon: FileText },
            { key: 'faq', label: '常见问题', icon: Search },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 在线客服 */}
        {activeTab === 'chat' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* 聊天窗口 */}
            <div className="md:col-span-2 bg-gray-900/50 rounded-2xl border border-white/10 overflow-hidden">
              {/* 聊天头部 */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    {isAI ? <Bot className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold">{isAI ? 'AI 智能客服' : '人工客服'}</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      在线
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsAI(!isAI)}
                  className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm"
                >
                  {isAI ? '转人工' : '切换AI'}
                </button>
              </div>

              {/* 消息列表 */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {msg.role === 'system' && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Bot className="w-3 h-3 text-blue-400" />
                          </div>
                          <span className="text-xs text-gray-500">SUIBOX客服</span>
                        </div>
                      )}
                      <div className={`inline-block p-3 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-violet-600 text-white' 
                          : 'bg-gray-800 text-gray-200'
                      }`}>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 输入框 */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-800">
                    <Image className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-800">
                    <Paperclip className="w-5 h-5 text-gray-400" />
                  </button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="输入您的问题..."
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-500"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧信息 */}
            <div className="space-y-4">
              {/* 常见问题 */}
              <div className="bg-gray-900/50 rounded-2xl p-5 border border-white/10">
                <h3 className="font-bold mb-3">热门问题</h3>
                <div className="space-y-2">
                  {['如何购买盲盒？', '保底机制是什么？', '如何联系人工客服？', '保险基金如何申请？'].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(q)}
                      className="w-full text-left p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* 服务时间 */}
              <div className="bg-gray-900/50 rounded-2xl p-5 border border-white/10">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  服务时间
                </h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>AI客服</span>
                    <span className="text-green-400">7×24小时</span>
                  </div>
                  <div className="flex justify-between">
                    <span>人工客服</span>
                    <span>9:00-24:00</span>
                  </div>
                </div>
              </div>

              {/* 联系方式 */}
              <div className="bg-gray-900/50 rounded-2xl p-5 border border-white/10">
                <h3 className="font-bold mb-3">联系我们</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>support@suibox.io</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>+86 400-888-8888</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 工单列表 */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">我的工单</h2>
              <button className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2">
                <Zap className="w-4 h-4" />
                新建工单
              </button>
            </div>
            
            <div className="bg-gray-900/50 rounded-2xl overflow-hidden border border-white/10">
              <table className="w-full">
                <thead className="bg-black/50">
                  <tr>
                    <th className="text-left p-4 text-gray-400">工单号</th>
                    <th className="text-left p-4 text-gray-400">问题标题</th>
                    <th className="text-left p-4 text-gray-400">状态</th>
                    <th className="text-left p-4 text-gray-400">回复</th>
                    <th className="text-left p-4 text-gray-400">时间</th>
                    <th className="text-left p-4 text-gray-400">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="border-t border-white/5">
                      <td className="p-4 font-mono text-sm">{ticket.id}</td>
                      <td className="p-4">{ticket.title}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          ticket.status === '已解决' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{ticket.reply} 条</td>
                      <td className="p-4 text-gray-400 text-sm">{ticket.time}</td>
                      <td className="p-4">
                        <button className="text-blue-400 hover:text-blue-300">
                          查看 <ArrowRight className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-6">常见问题</h2>
            
            {/* 搜索 */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索问题..."
                className="w-full bg-gray-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 outline-none"
              />
            </div>

            {/* FAQ列表 */}
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-gray-900/50 rounded-xl border border-white/10">
                  <summary className="p-4 cursor-pointer flex items-center justify-between">
                    <span className="font-medium">{faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4 text-gray-400">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            {/* 没有找到 */}
            <div className="mt-8 text-center p-6 bg-gray-900/50 rounded-xl">
              <p className="text-gray-400 mb-4">没有找到答案？</p>
              <button className="px-6 py-2 bg-blue-600 rounded-lg">
                提交新问题
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
