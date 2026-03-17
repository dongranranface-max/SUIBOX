'use client';

import { ReactNode } from 'react';

export function AppWalletProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
