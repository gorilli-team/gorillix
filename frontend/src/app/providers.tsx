'use client';

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiConfig, createConfig } from "wagmi";
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = createConfig(
  getDefaultConfig({
    appName: "Gorillix",
    
    chains: [mainnet, sepolia],
    
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  }),
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="auto" mode="dark">
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}