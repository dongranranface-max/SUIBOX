import { NextRequest, NextResponse } from 'next/server';

// Sui RPC endpoints
const SUI_MAINNET = 'https://fullnode.mainnet.sui.io';
const SUI_TESTNET = 'https://fullnode.testnet.sui.io';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const network = searchParams.get('network') || 'testnet';

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 });
  }

  try {
    const rpcUrl = network === 'mainnet' ? SUI_MAINNET : SUI_TESTNET;

    // Get coin balances
    const balanceResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'suix_getAllBalances',
        params: [address],
      }),
    });

    const balanceData = await balanceResponse.json();

    // Get NFTs owned by address
    const nftsResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'suix_getObjectsOwnedByAddress',
        params: [address],
      }),
    });

    const nftsData = await nftsResponse.json();

    return NextResponse.json({
      address,
      network,
      balances: balanceData.result || [],
      nfts: nftsData.result || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sui API error:', error);
    return NextResponse.json({
      address,
      network,
      balances: [],
      nfts: [],
      error: 'Failed to fetch on-chain data',
    });
  }
}
