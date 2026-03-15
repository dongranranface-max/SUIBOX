import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Try testnet first, then mainnet
    let res = await fetch('https://fullnode.testnet.sui.io', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      res = await fetch('https://fullnode.mainnet.sui.io', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // Return a default gas price if API fails
    return NextResponse.json({ result: 1000 });
  }
}
