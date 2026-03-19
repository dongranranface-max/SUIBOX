import { NextRequest, NextResponse } from 'next/server';

// 模拟盲盒数据
const mockBoxes = [
  {
    id: 'box-001',
    name: 'SUI Punk 盲盒',
    description: '包含稀有的 SUI Punk 系列 NFT',
    price: 29.9,
    priceSymbol: 'SUI',
    totalCount: 1000,
    soldCount: 756,
    image: '/box/punk-box.png',
    nftType: 'punk',
    rarity: {
      legendary: 1,   // 1%
      epic: 5,        // 5%
      rare: 20,       // 20%
      uncommon: 74,  // 74%
    },
    isActive: true,
    endTime: '2026-04-01',
  },
  {
    id: 'box-002',
    name: 'Cosmic Dreams 盲盒',
    description: '探索宇宙奥秘，获得限量版 NFT',
    price: 49.9,
    priceSymbol: 'SUI',
    totalCount: 500,
    soldCount: 234,
    image: '/box/cosmic-box.png',
    nftType: 'cosmic',
    rarity: {
      legendary: 2,
      epic: 8,
      rare: 25,
      uncommon: 65,
    },
    isActive: true,
    endTime: '2026-04-15',
  },
  {
    id: 'box-003',
    name: 'Digital Monster 盲盒',
    description: '收集可爱的数字怪兽',
    price: 19.9,
    priceSymbol: 'SUI',
    totalCount: 2000,
    soldCount: 1890,
    image: '/box/monster-box.png',
    nftType: 'monster',
    rarity: {
      legendary: 0.5,
      epic: 3,
      rare: 15,
      uncommon: 81.5,
    },
    isActive: true,
    endTime: null,
  },
];

// 获取盲盒列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // on_sale, ended, upcoming

    let filteredBoxes = [...mockBoxes];

    if (status === 'on_sale') {
      filteredBoxes = filteredBoxes.filter(box => box.isActive);
    } else if (status === 'ended') {
      filteredBoxes = filteredBoxes.filter(box => !box.isActive);
    }

    return NextResponse.json({
      success: true,
      data: filteredBoxes,
    });
  } catch (error) {
    console.error('Box list error:', error);
    return NextResponse.json(
      { success: false, error: '获取列表失败' },
      { status: 500 }
    );
  }
}

// 购买盲盒
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { boxId, paymentMethod } = body;

    if (!boxId) {
      return NextResponse.json(
        { success: false, error: '缺少盲盒ID' },
        { status: 400 }
      );
    }

    const box = mockBoxes.find(b => b.id === boxId);
    if (!box) {
      return NextResponse.json(
        { success: false, error: '盲盒不存在' },
        { status: 404 }
      );
    }

    if (box.soldCount >= box.totalCount) {
      return NextResponse.json(
        { success: false, error: '盲盒已售罄' },
        { status: 400 }
      );
    }

    // 生成随机 NFT
    const rand = Math.random() * 100;
    let acquiredRarity = 'uncommon';
    let cumulative = 0;
    
    for (const [rarity, chance] of Object.entries(box.rarity)) {
      cumulative += chance;
      if (rand <= cumulative) {
        acquiredRarity = rarity;
        break;
      }
    }

    // 返回开盒结果
    return NextResponse.json({
      success: true,
      data: {
        boxId,
        rarity: acquiredRarity,
        nft: {
          id: `nft-${Date.now()}`,
          name: `${box.nftType} #${Math.floor(Math.random() * 1000)}`,
          rarity: acquiredRarity,
          boxId,
          openedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Buy box error:', error);
    return NextResponse.json(
      { success: false, error: '购买失败' },
      { status: 500 }
    );
  }
}
