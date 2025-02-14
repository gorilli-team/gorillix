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
      <div className="flex items-center justify-end space-x-4 flex-1">
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {formatAddress(address)}
            </span>
            <button 
              onClick={() => disconnect()}
              className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}