import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import BalancePanel from './BalancePanel';

export default function Header() {
  const { isConnected } = useAccount();

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
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={connected ? openAccountModal : openConnectModal}
                  className="px-6 py-2 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
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