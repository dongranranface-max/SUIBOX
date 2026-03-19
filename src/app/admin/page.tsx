'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, ShoppingCart, Package, 
  Coins, Settings, LogOut, AlertTriangle, 
  TrendingUp, DollarSign, Activity, Shield,
  Loader2, Search, Filter, MoreVertical
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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
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
      const res = await fetch('/api/admin/manage?type=stats');
      const data = await res.json();
      setStats(data.data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: '概览', icon: LayoutDashboard },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'transactions', label: '交易管理', icon: ShoppingCart },
    { id: 'nfts', label: 'NFT管理', icon: Package },
    { id: 'finance', label: '财务管理', icon: Coins },
    { id: 'security', label: '安全中心', icon: Shield },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  const statCards = [
    { label: '总用户', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: '活跃用户', value: stats?.activeUsers || 0, icon: Activity, color: 'from-green-500 to-emerald-500' },
    { label: '交易笔数', value: stats?.totalTransactions || 0, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { label: '24h交易额', value: `${(stats?.volume24h || 0).toLocaleString()} SUI`, icon: DollarSign, color: 'from-amber-500 to-orange-500' },
  ];

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
      </main>
    </div>
  );
}
