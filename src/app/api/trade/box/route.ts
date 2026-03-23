import { NextRequest, NextResponse } from 'next/server';

/**
 * 临时 BOX 购买通道（占位实现）
 * TODO: 正式上线后替换为链上 BOX 合约调用。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nftId, buyer, amount, unit, receiver } = body || {};

    if (!buyer) {
      return NextResponse.json({ success: false, error: '缺少买家地址' }, { status: 400 });
    }
    if (!nftId) {
      return NextResponse.json({ success: false, error: '缺少 NFT 标识' }, { status: 400 });
    }
    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: '交易金额无效' }, { status: 400 });
    }
    if (unit !== 'BOX') {
      return NextResponse.json({ success: false, error: '仅支持 BOX 临时通道' }, { status: 400 });
    }

    const digest = `temp-box-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

    return NextResponse.json({
      success: true,
      mode: 'temporary-box-route',
      digest,
      data: {
        nftId,
        buyer,
        receiver: receiver || null,
        amount: Number(amount),
        unit,
        timestamp: new Date().toISOString(),
      },
      note: '临时 BOX 通道已成交（占位），正式上线后请替换为真实合约交易',
    });
  } catch {
    return NextResponse.json({ success: false, error: 'BOX 临时交易请求失败' }, { status: 500 });
  }
}
