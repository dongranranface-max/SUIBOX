import { NextResponse } from 'next/server';

// 内存缓存
const cache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 30000; // 30秒缓存

// 用户NFT数据
const userNFTs = [
  { id: 1, name: '星辰大海 #88', collection: '星辰大海', rarity: 'SSR', image: '/nft-common.png', price: 500, floorPrice: 450, change: 11.1 },
  { id: 2, name: '烈焰麒麟 #66', collection: '烈焰麒麟', rarity: 'SR', image: '/fragment-epic.png', price: 150, floorPrice: 120, change: 25.0 },
  { id: 3, name: '冰晶之心 #55', collection: '冰晶之心', rarity: 'SR', image: '/fragment-rare.png', price: 120, floorPrice: 100, change: 20.0 },
  { id: 4, name: '机械之心 #77', collection: '机械之心', rarity: 'R', image: '/nft-common.png', price: 80, floorPrice: 75, change: 6.7 },
  { id: 5, name: '暗黑天使 #25', collection: '暗黑天使', rarity: 'R', image: '/fragment-epic.png', price: 60, floorPrice: 55, change: 9.1 },
];

const userFavorites = [
  { id: 11, name: '星辰大海 #99', collection: '星辰大海', rarity: 'SSR', image: '/nft-common.png', price: 600, floorPrice: 450, change: 33.3 },
  { id: 12, name: '烈焰麒麟 #88', collection: '烈焰麒麟', rarity: 'SR', image: '/fragment-epic.png', price: 200, floorPrice: 120, change: 66.7 },
  { id: 13, name: '深海巨兽 #12', collection: '深海巨兽', rarity: 'R', image: '/fragment-epic.png', price: 90, floorPrice: 80, change: 12.5 },
];

const userAuctions = [
  { id: 101, name: '烈焰麒麟 #55', collection: '烈焰麒麟', rarity: '史诗', image: '/fragment-epic.png', currentPrice: 888, myBid: 900, bids: 23, status: 'outbid', endTime: Date.now() + 2*60*60*1000, isWinning: false },
  { id: 102, name: '冰晶之心 #88', collection: '冰晶之心', rarity: '史诗', image: '/fragment-rare.png', currentPrice: 666, myBid: 700, bids: 18, status: 'winning', endTime: Date.now() + 5*60*60*1000, isWinning: true },
  { id: 103, name: '暗黑天使 #33', collection: '暗黑天使', rarity: '稀有', image: '/fragment-epic.png', currentPrice: 520, myBid: 500, bids: 12, status: 'ended', endTime: Date.now() - 24*60*60*1000, isWinning: false },
];

const userBids = [
  { id: 201, auctionId: 101, name: '烈焰麒麟 #55', image: '/fragment-epic.png', myBid: 900, currentPrice: 888, status: 'outbid', time: Date.now() - 2*60*60*1000 },
  { id: 202, auctionId: 102, name: '冰晶之心 #88', image: '/fragment-rare.png', myBid: 700, currentPrice: 666, status: 'winning', time: Date.now() - 1*60*60*1000 },
  { id: 203, auctionId: 104, name: '星辰大海 #77', image: '/nft-common.png', myBid: 2000, currentPrice: 2500, status: 'outbid', time: Date.now() - 24*60*60*1000 },
  { id: 204, auctionId: 105, name: '机械之心 #99', image: '/nft-common.png', myBid: 500, currentPrice: 500, status: 'won', time: Date.now() - 48*60*60*1000 },
];

const sentOffers = [
  { id: 301, nftId: 21, nftName: '星辰大海 #77', nftImage: '/nft-common.png', offerPrice: 400, marketPrice: 450, seller: '0xabcd...1234', status: 'pending', createdAt: Date.now() - 2*60*60*1000 },
  { id: 302, nftId: 22, nftName: '烈焰麒麟 #99', nftImage: '/fragment-epic.png', offerPrice: 180, marketPrice: 200, seller: '0xefgh...5678', status: 'accepted', createdAt: Date.now() - 24*60*60*1000 },
  { id: 303, nftId: 23, nftName: '冰晶之心 #11', nftImage: '/fragment-rare.png', offerPrice: 90, marketPrice: 100, seller: '0xijkl...9012', status: 'rejected', createdAt: Date.now() - 48*60*60*1000 },
];

const userActivities = [
  { type: 'buy', nft: '星辰大海 #88', price: 500, time: Date.now() - 2*60*60*1000 },
  { type: 'sell', nft: '烈焰麒麟 #66', price: 150, time: Date.now() - 5*60*60*1000 },
  { type: 'bid', nft: '冰晶之心 #88', price: 700, time: Date.now() - 1*60*60*1000 },
  { type: 'offer', nft: '星辰大海 #77', price: 400, time: Date.now() - 2*60*60*1000 },
  { type: 'like', nft: '烈焰麒麟 #99', time: Date.now() - 24*60*60*1000 },
  { type: 'win', nft: '机械之心 #99', price: 500, time: Date.now() - 48*60*60*1000 },
];

// 获取缓存数据
function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

// 设置缓存数据
function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'nfts';
  const address = searchParams.get('address') || '';
  
  // 构建缓存key
  const cacheKey = `${type}-${address}`;
  
  // 检查缓存
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  let data;
  switch (type) {
    case 'nfts':
      data = userNFTs;
      break;
    case 'favorites':
      data = userFavorites;
      break;
    case 'auctions':
      data = userAuctions;
      break;
    case 'bids':
      data = userBids;
      break;
    case 'sent-offers':
      data = sentOffers;
      break;
    case 'activities':
      data = userActivities;
      break;
    default:
      data = userNFTs;
  }

  const response = {
    success: true,
    data,
    total: data.length,
  };

  // 设置缓存
  setCachedData(cacheKey, response);

  return NextResponse.json(response);
}
