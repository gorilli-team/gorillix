'use client';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from 'react';
import { Chain } from 'wagmi/chains';

// Correct definition of ABC Testnet chain
const abcTestnet = {
  id: 112,
  name: 'ABC Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ABC',
    symbol: 'ABC',
  },
  rpcUrls: {
    default: { http: ['https://rpc.abc.t.raas.gelato.cloud'] },
  },
  blockExplorers: {
    default: { name: 'ABC Explorer', url: 'https://raas.gelato.network/rollups/details/public/abc-testnet' },
  },
  testnet: true,
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: "Gorillix",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [abcTestnet],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: '100vh', width: '100vw' }} />
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}