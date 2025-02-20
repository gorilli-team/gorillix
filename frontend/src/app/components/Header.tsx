import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import BalancePanel from './BalancePanel';

export default function Header() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-gray-800 border-b border-purple-600">  
      <div className="flex-1 flex justify-start">
        {isConnected && <BalancePanel />}
      </div>
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
              <button
                type="button"
                onClick={connected ? openAccountModal : openConnectModal}
                className="px-6 py-2 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
              >
                {connected ? (
                  <span className="flex items-center gap-2">
                    {account.displayName}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        disconnect();
                      }}
                      className="text-sm opacity-70 hover:opacity-100"
                    >
                    </button>
                  </span>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}