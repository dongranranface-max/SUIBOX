import { NextRequest, NextResponse } from 'next/server';

// 模拟钱包绑定数据（内存存储）
const walletBindings = new Map<string, { address: string; provider: string; boundAt: string }[]>();
const primaryWallets = new Map<string, string>();

// GET - 获取用户绑定的钱包列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_address = searchParams.get('address');

    if (!user_address) {
      return NextResponse.json(
        { success: false, error: '缺少用户地址' },
        { status: 400 }
      );
    }

    const wallets = walletBindings.get(user_address) || [];
    
    return NextResponse.json({
      success: true,
      wallets: wallets.map(w => ({
        address: w.address,
        provider: w.provider,
        boundAt: w.boundAt
      }))
    });
  } catch (error) {
    console.error('Get wallets error:', error);
    return NextResponse.json(
      { success: false, error: '获取失败' },
      { status: 500 }
    );
  }
}

// POST - 绑定钱包
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_address, wallet_address, provider } = body;

    if (!user_address || !wallet_address) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取现有钱包列表
    const wallets = walletBindings.get(user_address) || [];
    
    // 检查是否已绑定
    if (wallets.some(w => w.address === wallet_address)) {
      return NextResponse.json(
        { success: false, error: '该钱包已绑定' },
        { status: 400 }
      );
    }

    // 添加新钱包
    wallets.push({
      address: wallet_address,
      provider: provider || 'wallet',
      boundAt: new Date().toISOString()
    });
    
    walletBindings.set(user_address, wallets);

    return NextResponse.json({
      success: true,
      message: '绑定成功'
    });
  } catch (error) {
    console.error('Bind wallet error:', error);
    return NextResponse.json(
      { success: false, error: '绑定失败' },
      { status: 500 }
    );
  }
}

// PATCH - 设置主钱包
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_address, wallet_address } = body;

    if (!user_address || !wallet_address) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const wallets = walletBindings.get(user_address) || [];
    if (!wallets.some(w => w.address === wallet_address)) {
      return NextResponse.json(
        { success: false, error: '钱包不存在' },
        { status: 404 }
      );
    }

    primaryWallets.set(user_address, wallet_address);

    return NextResponse.json({ success: true, message: '主钱包已更新' });
  } catch (error) {
    console.error('Set primary wallet error:', error);
    return NextResponse.json(
      { success: false, error: '设置失败' },
      { status: 500 }
    );
  }
}

// DELETE - 解绑钱包
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_address, address } = body;

    if (!user_address || !address) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const wallets = walletBindings.get(user_address) || [];
    const filtered = wallets.filter(w => w.address !== address);
    
    walletBindings.set(user_address, filtered);

    return NextResponse.json({
      success: true,
      message: '解绑成功'
    });
  } catch (error) {
    console.error('Unbind wallet error:', error);
    return NextResponse.json(
      { success: false, error: '解绑失败' },
      { status: 500 }
    );
  }
}
