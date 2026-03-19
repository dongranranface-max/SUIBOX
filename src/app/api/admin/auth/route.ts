import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// =================== 安全管理 ===================

// 加密配置
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'suibox-admin-secret-key-32chars';
const ALGORITHM = 'aes-256-gcm';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 32).padEnd(32, '0'));
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

// Session 管理
const adminSessions = new Map<string, {
  adminId: string;
  email: string;
  role: string;
  createdAt: number;
  lastActivity: number;
  ip: string;
}>();

// 审计日志
const auditLogs: Array<{
  id: string;
  adminId: string;
  action: string;
  details: string;
  ip: string;
  timestamp: number;
}> = [];

function addAuditLog(adminId: string, action: string, details: string, ip: string) {
  const log = {
    id: crypto.randomUUID(),
    adminId,
    action,
    details,
    ip,
    timestamp: Date.now(),
  };
  auditLogs.unshift(log);
  if (auditLogs.length > 1000) auditLogs.pop();
}

// 速率限制
const rateLimits = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, limit: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimits.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimits.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// 模拟管理员数据
const admins = [
  {
    id: 'admin-001',
    email: 'admin@suibox.io',
    password: 'admin123',
    role: 'super_admin',
    name: '超级管理员',
    createdAt: '2026-01-01',
    status: 'active',
  },
];

// =================== API 路由 ===================

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // 速率限制
    if (!checkRateLimit(`login:${ip}`, 5, 60000)) {
      return NextResponse.json(
        { error: '登录尝试过于频繁，请稍后重试' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: '请输入邮箱和密码' },
        { status: 400 }
      );
    }

    const admin = admins.find(a => a.email === email);
    
    if (!admin || admin.status !== 'active') {
      return NextResponse.json(
        { error: '账号或密码错误' },
        { status: 401 }
      );
    }

    // 验证密码
    if (password !== admin.password) {
      addAuditLog(admin.id, 'LOGIN_FAILED', `密码错误: ${email}`, ip);
      return NextResponse.json(
        { error: '账号或密码错误' },
        { status: 401 }
      );
    }

    // 生成 session token
    const token = crypto.randomUUID();
    const session = {
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ip,
    };
    
    adminSessions.set(token, session);
    
    addAuditLog(admin.id, 'LOGIN_SUCCESS', '登录成功', ip);

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  const session = adminSessions.get(token);
  
  if (!session) {
    return NextResponse.json({ error: '登录已过期' }, { status: 401 });
  }

  const timeout = 30 * 60 * 1000;
  if (Date.now() - session.lastActivity > timeout) {
    adminSessions.delete(token);
    return NextResponse.json({ error: '登录已过期' }, { status: 401 });
  }

  session.lastActivity = Date.now();

  const admin = admins.find(a => a.id === session.adminId);
  
  return NextResponse.json({
    admin: {
      id: admin?.id,
      email: admin?.email,
      name: admin?.name,
      role: admin?.role,
    },
  });
}

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (token) {
    const session = adminSessions.get(token);
    if (session) {
      addAuditLog(session.adminId, 'LOGOUT', '退出登录', session.ip);
      adminSessions.delete(token);
    }
  }

  return NextResponse.json({ success: true });
}
