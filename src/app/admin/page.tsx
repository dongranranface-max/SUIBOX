'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, ShoppingCart, Package, 
  Coins, Settings, LogOut, AlertTriangle, 
  TrendingUp, DollarSign, Activity, Shield,
  Loader2, Search, Filter, MoreVertical, Bell, Send, Trash2
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  volume24h: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishForm, setPublishForm] = useState({ title: '', message: '', type: 'system' });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/auth', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (!data.admin) {
        router.push('/admin/login');
        return;
      }
      fetchStats();
    } catch {
      router.push('/admin/login');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/manage?type=stats', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: '概览', icon: LayoutDashboard },
    { id: 'notifications', label: '消息通知', icon: Bell },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'transactions', label: '交易管理', icon: ShoppingCart },
    { id: 'nfts', label: 'NFT管理', icon: Package },
    { id: 'finance', label: '财务管理', icon: Coins },
    { id: 'security', label: '安全中心', icon: Shield },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  // 获取通知列表
  const fetchNotifications = async () => {
    setNotificationLoading(true);
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNotificationLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab]);

  // 发布通知
  const handlePublish = async () => {
    if (!publishForm.title || !publishForm.message) return;
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publishForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowPublishModal(false);
        setPublishForm({ title: '', message: '', type: 'system' });
        fetchNotifications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 删除通知
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications?id=${id}`, { method: 'DELETE' });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const statCards = [
    { label: '总用户', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: '活跃用户', value: stats?.activeUsers || 0, icon: Activity, color: 'from-green-500 to-emerald-500' },
    { label: '交易笔数', value: stats?.totalTransactions || 0, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { label: '24h交易额', value: `${(stats?.volume24h || 0).toLocaleString()} SUI`, icon: DollarSign, color: 'from-amber-500 to-orange-500' },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800/50 border-r border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            SUIBOX Admin
          </h1>
          <p className="text-xs text-gray-500 mt-1">管理系统</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-violet-600 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
            <p className="text-gray-500 text-sm mt-1">欢迎回来，管理员</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="搜索..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <button className="p-2 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">最近交易</h3>
              <div className="space-y-4">
                {[
                  { user: 'User One', action: '购买 NFT', amount: '99 SUI', time: '2分钟前' },
                  { user: 'User Two', action: '质押', amount: '500 SUI', time: '15分钟前' },
                  { user: 'User Three', action: '提现', amount: '50 SUI', time: '1小时前' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                    <div>
                      <p className="font-medium">{tx.user}</p>
                      <p className="text-sm text-gray-500">{tx.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{tx.amount}</p>
                      <p className="text-sm text-gray-500">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* 发布通知按钮 */}
            <div className="flex justify-end">
              <button 
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                发布通知
              </button>
            </div>

            {/* 通知列表 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
              {notificationLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-violet-500" />
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 flex items-start gap-4 hover:bg-white/5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notif.type === 'system' ? 'bg-blue-500/20 text-blue-400' :
                        notif.type === 'promotion' ? 'bg-amber-500/20 text-amber-400' :
                        notif.type === 'activity' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{notif.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            notif.type === 'system' ? 'bg-blue-500/20 text-blue-400' :
                            notif.type === 'promotion' ? 'bg-amber-500/20 text-amber-400' :
                            notif.type === 'activity' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {notif.type === 'system' ? '系统' : notif.type === 'promotion' ? '促销' : notif.type === 'activity' ? '活动' : '公告'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{notif.message}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {new Date(notif.createdAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDelete(notif.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  暂无通知
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                  <option>所有状态</option>
                  <option>正常</option>
                  <option>禁用</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm">
                + 添加用户
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">用户</th>
                  <th className="text-left p-4 text-gray-400 font-medium">状态</th>
                  <th className="text-left p-4 text-gray-400 font-medium">注册时间</th>
                  <th className="text-left p-4 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { email: 'user1@email.com', name: 'User One', status: '正常', date: '2026-01-15' },
                  { email: 'user2@email.com', name: 'User Two', status: '正常', date: '2026-02-01' },
                  { email: 'user3@email.com', name: 'User Three', status: '禁用', date: '2026-03-01' },
                ].map((user, i) => (
                  <tr key={i} className="border-t border-gray-700">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === '正常' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{user.date}</td>
                    <td className="p-4">
                      <button className="p-2 hover:bg-white/5 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">安全设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div>
                    <p className="font-medium">两因素认证 (2FA)</p>
                    <p className="text-sm text-gray-500">增强账号安全</p>
                  </div>
                  <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm">
                    启用
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div>
                    <p className="font-medium">登录通知</p>
                    <p className="text-sm text-gray-500">新设备登录时通知</p>
                  </div>
                  <button className="w-12 h-6 bg-violet-600 rounded-full relative">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">操作日志</p>
                    <p className="text-sm text-gray-500">记录所有管理操作</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
                    查看
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 发布通知弹窗 */}
        {showPublishModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">发布通知</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">类型</label>
                  <select 
                    value={publishForm.type}
                    onChange={(e) => setPublishForm({ ...publishForm, type: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="system">系统通知</option>
                    <option value="announcement">公告</option>
                    <option value="promotion">促销活动</option>
                    <option value="activity">活动通知</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">标题</label>
                  <input 
                    type="text"
                    value={publishForm.title}
                    onChange={(e) => setPublishForm({ ...publishForm, title: e.target.value })}
                    placeholder="请输入通知标题"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">内容</label>
                  <textarea 
                    value={publishForm.message}
                    onChange={(e) => setPublishForm({ ...publishForm, message: e.target.value })}
                    placeholder="请输入通知内容"
                    rows={4}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={handlePublish}
                  className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-medium"
                >
                  发布
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
