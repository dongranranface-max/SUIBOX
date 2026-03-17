'use client';

import { useState, useEffect } from 'react';

export default function WalletDebugPage() {
  const [status, setStatus] = useState<string>('检测中...');
  const [address, setAddress] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [error, setError] = useState<string>('');

  const SUI_CHAIN_ID = '0x1'; // SUI mainnet
  const SUI_TESTNET_CHAIN_ID = '0x2';
  const SUI_DEVNET_CHAIN_ID = '0x3';

  useEffect(() => {
    const connectSuiWallet = async () => {
      // @ts-ignore
      const ethereum = window.ethereum;
      
      if (!ethereum) {
        setStatus('❌ 未找到钱包');
        return;
      }

      setStatus('✅ 找到钱包');

      // 尝试获取 SUI 地址
      try {
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
        // 忽略，继续
      }

      // 尝试切换到 SUI 网络
      const trySwitchNetwork = async (chainId: string, name: string) => {
        try {
          // @ts-ignore
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
          });
          setStatus(`🔄 已切换到 ${name}，重新获取地址...`);
          
          // 等待切换完成
          await new Promise(r => setTimeout(r, 1500));
          
          // 重试获取 SUI 地址
          // @ts-ignore
          const suiAddresses = await ethereum.request({ 
            method: 'suix_getAllAddresses' 
          });
          
          if (suiAddresses && suiAddresses.length > 0) {
            setAddress(suiAddresses[0]);
            setChain('SUI ' + name);
            return true;
          }
        } catch (e) {
          // 忽略这个网络，继续尝试下一个
        }
        return false;
      };

      // 尝试切换到不同 SUI 网络
      setStatus('🔄 尝试切换到 SUI 网络...');
      
      if (await trySwitchNetwork(SUI_DEVNET_CHAIN_ID, 'Devnet')) return;
      if (await trySwitchNetwork(SUI_TESTNET_CHAIN_ID, 'Testnet')) return;
      if (await trySwitchNetwork(SUI_CHAIN_ID, 'Mainnet')) return;

      // 如果都不行，获取以太坊地址
      try {
        // @ts-ignore
        const ethAccounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (ethAccounts && ethAccounts.length > 0) {
          setAddress(ethAccounts[0]);
          setChain('Ethereum');
          setStatus('⚠️ 无法切换到 SUI 链，当前连接以太坊');
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : '未知错误');
      }
    };

    setTimeout(connectSuiWallet, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔗 自动获取 SUI 钱包</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl">
        <p className="text-xl mb-4">{status}</p>
        
        {address && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <p className="text-green-400 font-bold mb-2">当前链: {chain}</p>
            <p className="text-gray-400 text-sm mb-2">钱包地址:</p>
            <p className="font-mono text-lg">{address}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900 rounded-lg">
            <p className="text-red-400 font-bold mb-2">错误:</p>
            <p className="font-mono text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-900 rounded-lg">
        <p className="text-blue-400 font-bold">请在钱包中手动切换到 SUI 网络</p>
        <p className="text-sm mt-2">点击 Suiet Wallet 扩展 → 点击网络名称 → 选择 Devnet 或 Testnet</p>
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500"
      >
        刷新重试
      </button>
    </div>
  );
}
