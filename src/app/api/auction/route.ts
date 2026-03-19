import { NextRequest, NextResponse } from 'next/server';

// 模拟拍卖数据
const auctions = [
  {
    id: 'auction-001',
    nft: {
      id: 'nft-001',
      name: 'SUI Punk #888',
      image: '/nft/punk-888.png',
      rarity: 'legendary',
    },
    startingPrice: 50,
    currentPrice: 156,
    priceSymbol: 'SUI',
    highestBidder: '0xabcd...1234',
    bids: 23,
    startTime: '2026-03-15T00:00:00Z',
    endTime: '2026-03-25T00:00:00Z',
    status: 'active', // upcoming, active, ended
    isBuyNow: true,
    buyNowPrice: 500,
  },
  {
    id: 'auction-002',
    nft: {
      id: 'nft-002',
      name: 'Cosmic Dreams #042',
      image: '/nft/cosmic-042.png',
      rarity: 'epic',
    },
    startingPrice: 30,
    currentPrice: 89,
    priceSymbol: 'SUI',
    highestBidder: '0xefgh...5678',
    bids: 15,
    startTime: '2026-03-10T00:00:00Z',
    endTime: '2026-03-20T00:00:00Z',
    status: 'active',
    isBuyNow: true,
    buyNowPrice: 300,
  },
  {
    id: 'auction-003',
    nft: {
      id: 'nft-003',
      name: 'Digital Monster #999',
      image: '/nft/monster-999.png',
      rarity: 'rare',
    },
    startingPrice: 20,
    currentPrice: 45,
    priceSymbol: 'SUI',
    highestBidder: null,
    bids: 8,
    startTime: '2026-03-18T00:00:00Z',
    endTime: '2026-03-22T00:00:00Z',
    status: 'ending', // 即将结束
    isBuyNow: true,
    buyNowPrice: 150,
  },
];

// 获取拍卖列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // upcoming, active, ending, ended
    const sort = searchParams.get('sort'); // ending, newest, price

    let filteredAuctions = [...auctions];

    // 状态筛选
    if (status && status !== 'all') {
      filteredAuctions = filteredAuctions.filter(a => a.status === status);
    }

    // 排序
    switch (sort) {
      case 'ending':
        filteredAuctions.sort((a, b) => 
          new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
        );
        break;
      case 'newest':
        filteredAuctions.sort((a, b) => 
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        break;
      case 'price':
        filteredAuctions.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
    }

    return NextResponse.json({
      success: true,
      data: filteredAuctions,
    });
  } catch (error) {
    console.error('Auction list error:', error);
    return NextResponse.json(
      { success: false, error: '获取列表失败' },
      { status: 500 }
    );
  }
}

// 出价/购买
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auctionId, action, bidAmount, address } = body;

    // 验证用户
    if (!address) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) {
      return NextResponse.json(
        { success: false, error: '拍卖不存在' },
        { status: 404 }
      );
    }

    if (auction.status === 'ended') {
      return NextResponse.json(
        { success: false, error: '拍卖已结束' },
        { status: 400 }
      );
    }

    if (action === 'bid') {
      // 出价
      if (!bidAmount || bidAmount <= auction.currentPrice) {
        return NextResponse.json(
          { success: false, error: `出价需高于当前价格 ${auction.currentPrice} SUI` },
          { status: 400 }
        );
      }

      auction.currentPrice = bidAmount;
      auction.highestBidder = address;
      auction.bids += 1;

      return NextResponse.json({
        success: true,
        data: {
          action: 'bid',
          bidAmount,
          currentPrice: auction.currentPrice,
        },
      });
    }

    if (action === 'buy-now') {
      // 一口价购买
      if (!auction.isBuyNow) {
        return NextResponse.json(
          { success: false, error: '不支持一口价购买' },
          { status: 400 }
        );
      }

      auction.status = 'ended';

      return NextResponse.json({
        success: true,
        data: {
          action: 'buy-now',
          price: auction.buyNowPrice,
          winner: address,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: '无效操作' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Auction action error:', error);
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}
