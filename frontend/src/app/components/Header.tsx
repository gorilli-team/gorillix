"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="h-16 px-6 flex items-center justify-end border-b border-gray-300 bg-gray-100">      
      <div className="flex items-center space-x-4">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openConnectModal,
            openAccountModal,
            openChainModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <button
                type="button"
                onClick={connected ? openAccountModal : openConnectModal}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  connected 
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {connected ? account.displayName : "Connect Wallet"}
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}