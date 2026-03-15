import { NextResponse } from 'next/server';

// 内存缓存
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 60000;

const BINANCE_API = 'https://api.binance.com/api/v3';

// 默认数据
const defaultData = {
  sui: { price: 0.9999, change: 0.56, chart: [0.99, 1.0, 1.01, 1.0, 0.998, 1.0, 1.0, 1.01, 1.0, 0.999, 1.0, 0.9999] },
  box: { price: 0.0042, change: 0.28, chart: [0.0041, 0.0042, 0.0043, 0.0042, 0.0041, 0.0042, 0.0042, 0.0043, 0.0042, 0.0041, 0.0042, 0.0042] },
  gasFee: 0.000001,
  platform: {
    tradingVolume: 456000000,
    nftTotal: 125000,
    nftStaked: 45000,
    boxStaked: 28000000,
    suiStaked: 85000000,
    nftHolders: 89000,
    royaltyPaid: 3600000,
  },
};

export async function GET() {
  try {
    // 命中缓存则直接返回
    const now = Date.now();
    if (cache && now - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    // 尝试获取Binance数据
    let suiPrice = defaultData.sui.price;
    let suiChange = defaultData.sui.change;
    
    try {
      const suiRes = await fetch(`${BINANCE_API}/ticker/24hr?symbol=SUIUSDT`, { 
        cache: 'no-store' 
      });
      if (suiRes.ok) {
        const data = await suiRes.json();
        suiPrice = parseFloat(data.lastPrice) || defaultData.sui.price;
        suiChange = parseFloat(data.priceChangePercent) || defaultData.sui.change;
      }
    } catch (e) {
      console.log('Binance API error, using defaults');
    }

    // 生成图表数据
    const basePrice = suiPrice;
    const suiChart = Array.from({ length: 12 }, (_, i) => basePrice * (0.99 + Math.random() * 0.02));
    suiChart.push(suiPrice);
    
    const boxPrice = 0.0042 * suiPrice;
    const boxChange = suiChange * 0.5;
    const boxChart = suiChart.map(p => p * 0.0042);

    const responseData = {
      sui: { price: suiPrice, change: suiChange, chart: suiChart },
      box: { price: boxPrice, change: boxChange, chart: boxChart },
      gasFee: defaultData.gasFee,
      platform: defaultData.platform,
    };

    // 更新缓存
    cache = { data: responseData, timestamp: Date.now() };
    
    return NextResponse.json(responseData);
  } catch (error) {
    // 如果有错误，返回缓存或默认数据
    if (cache) {
      return NextResponse.json(cache.data);
    }
    return NextResponse.json(defaultData);
  }
}
