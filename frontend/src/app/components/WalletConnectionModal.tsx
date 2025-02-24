import { ConnectButton } from '@rainbow-me/rainbowkit';

const WalletConnectionModal = () => {
  return (
    <div className="max-w-md w-full bg-gray-800 rounded-xl border border-purple-600 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-8">
          Please connect your wallet to access the trading platform
        </p>
        
        <ConnectButton.Custom>
          {({
            openConnectModal,
            mounted,
          }) => {
            if (!mounted) return null;
            
            return (
              <button
                onClick={openConnectModal}
                className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
              >
                Connect Wallet
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default WalletConnectionModal;