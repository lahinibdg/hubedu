'use client';

import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // Web3 stack dimatikan untuk MVP Web2; provider kosong agar layout tetap simpel.
  return <>{children}</>;
}
