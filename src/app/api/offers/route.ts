import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库 - 报价数据
const offers: {
  id: string;
  nftId: number;
  nftName: string;
  nftImage: string;
  offerPrice: number;
  marketPrice: number;
  buyer: string;
  seller: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: number;
  updatedAt: number;
  counterOffer?: number;
}[] = [
  {
    id: '1',
    nftId: 1,
    nftName: '星辰大海 #88',
    nftImage: '/nft-common.png',
    offerPrice: 150,
    marketPrice: 162.2,
    buyer: '0xabcd1234efgh123456789abcdefghijklmnop',
    seller: '0x237c812be257b5c5338f025c9819208d5f1a82b817cdbe0c1138b496433e1f97',
    status: 'pending',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: '2',
    nftId: 2,
    nftName: '烈焰麒麟 #66',
    nftImage: '/fragment-epic.png',
    offerPrice: 45,
    marketPrice: 56.12,
    buyer: '0xdefg5678ijkl901234567abcdefghijklmnop',
    seller: '0x237c812be257b5c5338f025c9819208d5f1a82b817cdbe0c1138b496433e1f97',
    status: 'pending',
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  },
];

// GET 获取报价列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const type = searchParams.get('type'); // 'received' | 'sent' | 'all'
  
  let filteredOffers = [...offers];
  
  if (address) {
    if (type === 'received') {
      filteredOffers = offers.filter(o => o.seller.toLowerCase() === address.toLowerCase());
    } else if (type === 'sent') {
      filteredOffers = offers.filter(o => o.buyer.toLowerCase() === address.toLowerCase());
    }
  }
  
  return NextResponse.json({
    success: true,
    data: filteredOffers.sort((a, b) => b.createdAt - a.createdAt),
  });
}

// POST 创建报价
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nftId, nftName, nftImage, offerPrice, marketPrice, buyer, seller } = body;
    
    const newOffer = {
      id: Date.now().toString(),
      nftId,
      nftName,
      nftImage,
      offerPrice,
      marketPrice,
      buyer,
      seller,
      status: 'pending' as const,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    offers.push(newOffer);
    
    return NextResponse.json({
      success: true,
      data: newOffer,
      message: '报价已发起，等待卖家确认',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '报价失败',
    }, { status: 400 });
  }
}

// PUT 更新报价状态
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { offerId, action, counterOffer } = body; // action: 'accept' | 'reject' | 'counter'
    
    const offerIndex = offers.findIndex(o => o.id === offerId);
    if (offerIndex === -1) {
      return NextResponse.json({
        success: false,
        error: '报价不存在',
      }, { status: 404 });
    }
    
    const offer = offers[offerIndex];
    
    if (action === 'accept') {
      offer.status = 'accepted';
    } else if (action === 'reject') {
      offer.status = 'rejected';
    } else if (action === 'counter' && counterOffer) {
      offer.status = 'countered';
      offer.counterOffer = counterOffer;
    }
    
    offer.updatedAt = Date.now();
    
    return NextResponse.json({
      success: true,
      data: offer,
      message: action === 'accept' ? '已接受报价' : action === 'reject' ? '已拒绝报价' : '已还价',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '操作失败',
    }, { status: 400 });
  }
}
