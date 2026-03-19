import { NextRequest, NextResponse } from 'next/server';

// 模拟 NFT 数据
const mockNFTs = [
  {
    id: '1',
    name: 'SUI Punk #001',
    description: 'Unique SUI punk collection',
    image: '/nft/punk-001.png',
    price: 99,
    priceSymbol: 'SUI',
    rarity: 'legendary',
    owner: '0x1234...5678',
    creator: '0xabcd...efgh',
    likes: 256,
    views: 1280,
    onSale: true,
    category: 'art',
    tags: ['punk', 'unique', 'blue'],
    createdAt: '2026-03-01',
  },
  {
    id: '2',
    name: 'Cosmic Dreams #042',
    description: 'Limited edition cosmic art',
    image: '/nft/cosmic-042.png',
    price: 199,
    priceSymbol: 'SUI',
    rarity: 'epic',
    owner: '0x5678...9012',
    creator: '0xefgh...ijkl',
    likes: 189,
    views: 890,
    onSale: true,
    category: 'art',
    tags: ['cosmic', 'space', 'purple'],
    createdAt: '2026-03-05',
  },
  {
    id: '3',
    name: 'Digital Monster #888',
    description: 'Rare digital collectible',
    image: '/nft/monster-888.png',
    price: 299,
    priceSymbol: 'SUI',
    rarity: 'rare',
    owner: '0x9012...3456',
    creator: '0xmnop...qrst',
    likes: 342,
    views: 2100,
    onSale: true,
    category: 'collectible',
    tags: ['monster', 'rare', 'green'],
    createdAt: '2026-03-10',
  },
];

// 稀有度权重
const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 分页参数
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // 筛选参数
    const category = searchParams.get('category');
    const rarity = searchParams.get('rarity');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const search = searchParams.get('search')?.toLowerCase();
    const sort = searchParams.get('sort') || 'newest';
    const onSale = searchParams.get('onSale');

    // 过滤数据
    let filteredNFTs = [...mockNFTs];

    // 分类筛选
    if (category && category !== 'all') {
      filteredNFTs = filteredNFTs.filter(nft => nft.category === category);
    }

    // 稀有度筛选
    if (rarity && rarity !== 'all') {
      filteredNFTs = filteredNFTs.filter(nft => nft.rarity === rarity);
    }

    // 价格筛选
    filteredNFTs = filteredNFTs.filter(
      nft => nft.price >= minPrice && nft.price <= maxPrice
    );

    // 搜索筛选
    if (search) {
      filteredNFTs = filteredNFTs.filter(nft => 
        nft.name.toLowerCase().includes(search) ||
        nft.description.toLowerCase().includes(search) ||
        nft.tags?.some((tag: string) => tag.toLowerCase().includes(search))
      );
    }

    // 上架筛选
    if (onSale === 'true') {
      filteredNFTs = filteredNFTs.filter(nft => nft.onSale);
    }

    // 排序
    switch (sort) {
      case 'price_asc':
        filteredNFTs.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredNFTs.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filteredNFTs.sort((a, b) => b.likes - a.likes);
        break;
      case 'newest':
      default:
        filteredNFTs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // 分页
    const total = filteredNFTs.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedNFTs = filteredNFTs.slice(start, end);

    // 响应
    return NextResponse.json({
      success: true,
      data: paginatedNFTs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: end < total,
      },
    });
  } catch (error) {
    console.error('NFT list error:', error);
    return NextResponse.json(
      { success: false, error: '获取列表失败' },
      { status: 500 }
    );
  }
}
