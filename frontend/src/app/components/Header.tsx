"use client";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      await connectAsync({ connector: injected() });
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const formatAddress = (addr: `0x${string}` | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-300 bg-gray-100">
      <div className="flex items-center gap-4">
        <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
          ABC Testnet
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        {isConnected && address ? (
          <div className="flex items-center gap-3">
            <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
              {formatAddress(address)}
            </span>
            <button 
              onClick={() => disconnect()}
              className="px-4 py-2 text-sm font-medium rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            className="px-6 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}