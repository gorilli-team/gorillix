/* eslint-disable @typescript-eslint/no-unused-vars */

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="h-16 px-6 flex items-center justify-end bg-gray-800 border-b border-gray-600">  
      <div className="flex items-center">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openConnectModal,
            openAccountModal,
            mounted: buttonMounted,
          }) => {
            const connected = buttonMounted && account && chain;

            return (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={connected ? openAccountModal : openConnectModal}
                  className="px-6 py-2 rounded-lg font-medium transition-colors bg-violet-600 text-white hover:bg-violet-700"
                >
                  {connected ? (
                    <span className="flex items-center gap-2">
                      {account.displayName}
                    </span>
                  ) : (
                    "Connect Wallet"
                  )}
                </button>
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}