'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [address, setAddress] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const checkWallet = async () => {
    setStatus('检查中...');
    
    // @ts-ignore
    const ethereum = window.ethereum;
    
    if (!ethereum) {
      setStatus('❌ 未找到钱包扩展');
      return;
    }

    try {
      // 尝试 SUI 链
      // @ts-ignore
      const suiAddresses = await ethereum.request({ 
        method: 'suix_getAllAddresses' 
      });
      
      if (suiAddresses && suiAddresses.length > 0) {
        setAddress(suiAddresses[0]);
        setChain('SUI');
        setStatus('✅ 已连接到 SUI 链！');
        return;
      }
    } catch (e) {
      // 忽略
    }

    try {
      // 获取以太坊地址
      // @ts-ignore
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        // 判断链
        // @ts-ignore
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        
        if (chainId === '0x1') {
          setChain('Ethereum Mainnet');
        } else if (chainId === '0x5') {
          setChain('Goerli Testnet');
        } else {
          setChain('Ethereum (chainId: ' + chainId + ')');
        }
        setStatus('⚠️ 当前连接以太坊，请切换到 SUI 网络');
      }
    } catch (e: unknown) {
      setStatus('❌ ' + (e instanceof Error ? e.message : '未知错误'));
    }
  };

  useEffect(() => {
    setTimeout(checkWallet, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 SUI 钱包连接</h1>
      
      {status && (
        <div className="bg-gray-900 p-4 rounded-lg mb-4">
          <p className="text-lg">{status}</p>
        </div>
      )}

      {address && (
        <div className={`p-6 rounded-xl ${chain.includes('SUI') ? 'bg-green-900' : 'bg-yellow-900'}`}>
          <p className="text-gray-400 mb-2">当前链:</p>
          <p className="text-xl font-bold mb-4">{chain}</p>
          
          <p className="text-gray-400 mb-2">钱包地址:</p>
          <p className="font-mono text-lg">{address}</p>
        </div>
      )}

      {!address && (
        <div className="mt-4 p-4 bg-blue-900 rounded-lg">
          <p className="text-blue-400 font-bold mb-2">请在钱包中操作：</p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>点击浏览器右上角的 Suiet Wallet 扩展</li>
            <li>点击网络名称（显示当前的网络）</li>
            <li>选择 <strong>Devnet</strong> 或 <strong>Testnet</strong></li>
            <li>然后刷新这个页面</li>
          </ol>
        </div>
      )}

      <button 
        onClick={checkWallet}
        className="mt-6 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500"
      >
        重新检测
      </button>
    </div>
  );
}
