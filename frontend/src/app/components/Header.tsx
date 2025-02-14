"use client";
import { ConnectKitButton } from "connectkit";
import { useAccount, useDisconnect } from 'wagmi';

export default function Header() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-gray-300 bg-gray-100">
      <div className="flex items-center gap-4">
        <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
          Gorillix
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <ConnectKitButton.Custom>
          {({ show, truncatedAddress }) => (
            <button
              type="button"
              onClick={isConnected ? () => disconnect() : show}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                isConnected 
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isConnected ? truncatedAddress : "Connect Wallet"}
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>
    </header>
  );
}