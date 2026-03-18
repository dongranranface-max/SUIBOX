'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';

export function useAutoSwitchNetwork() {
  const wallet = useWallet();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if (!wallet.connected || !wallet.chain) return;
      
      // 检查是否连接到SUI网络
      const isSuiNetwork = wallet.chain.id.startsWith('sui:');
      setIsWrongNetwork(!isSuiNetwork);
      
      // 如果不是SUI网络，尝试自动切换
      if (!isSuiNetwork && wallet.wallet) {
        try {
          setIsSwitching(true);
          // 尝试切换到SUI网络
          if (wallet.wallet.features?.['sui:switchChain']) {
            await wallet.switchChain({ id: 'sui:devnet' });
          }
        } catch (error) {
          console.log('自动切换网络失败:', error);
        } finally {
          setIsSwitching(false);
        }
      }
    };

    checkNetwork();
  }, [wallet.connected, wallet.chain, wallet.wallet]);

  return { isWrongNetwork, isSwitching };
}
