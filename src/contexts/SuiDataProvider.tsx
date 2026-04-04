'use client';

/**
 * SUI Data Provider
 * 整合 GraphQL 数据服务到 React Context
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiGraphQLClient, SUI_GRAPHQL_MAINNET, SUI_GRAPHQL_TESTNET } from '@/lib/sui-graphql';

// ==================== Types ====================

interface SuiDataContextValue {
  graphqlClient: SuiGraphQLClient;
  network: 'mainnet' | 'testnet';
  setNetwork: (network: 'mainnet' | 'testnet') => void;
  isConnected: boolean;
}

// ==================== Context ====================

const SuiDataContext = createContext<SuiDataContextValue | null>(null);

// ==================== Query Client ====================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ==================== Provider ====================

interface SuiDataProviderProps {
  children: React.ReactNode;
  initialNetwork?: 'mainnet' | 'testnet';
}

export function SuiDataProvider({ 
  children, 
  initialNetwork = 'mainnet' 
}: SuiDataProviderProps) {
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>(initialNetwork);
  const [graphqlClient] = useState(() => new SuiGraphQLClient(
    network === 'mainnet' ? SUI_GRAPHQL_MAINNET : SUI_GRAPHQL_TESTNET
  ));
  const [isConnected, setIsConnected] = useState(false);

  // 切换网络时重新创建客户端
  useEffect(() => {
    const endpoint = network === 'mainnet' ? SUI_GRAPHQL_MAINNET : SUI_GRAPHQL_TESTNET;
    // 重新连接...
    setIsConnected(false);
    
    // 测试连接
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    })
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false));
  }, [network]);

  const value: SuiDataContextValue = {
    graphqlClient,
    network,
    setNetwork,
    isConnected,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiDataContext.Provider value={value}>
        {children}
      </SuiDataContext.Provider>
    </QueryClientProvider>
  );
}

// ==================== Hook ====================

export function useSuiData() {
  const context = useContext(SuiDataContext);
  if (!context) {
    throw new Error('useSuiData must be used within SuiDataProvider');
  }
  return context;
}

// ==================== 导出 ====================

export { SUI_GRAPHQL_MAINNET, SUI_GRAPHQL_TESTNET };
