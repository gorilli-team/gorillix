import { useState } from 'react';
import { ConnectKitButton } from "connectkit";
import { useAccount, useDisconnect } from 'wagmi';

const tokens = [
  { id: 'tokenA', name: 'Token A', symbol: 'TKNA' },
  { id: 'tokenB', name: 'Token B', symbol: 'TKNB' },
];

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="p-6 w-full max-w-md mx-auto">
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">From</label>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent text-white text-2xl w-full outline-none"
            />
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="ml-2 bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              <option value="">Select token</option>
              {tokens.map((token) => (
                <option key={token.id} value={token.id}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="text-gray-500 text-sm mt-1">$0</div>
        </div>

        <div className="flex justify-center my-4">
          <div className="bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">To</label>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center">
            <input
              type="number"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent text-white text-2xl w-full outline-none"
            />
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="ml-2 bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              <option value="">Select token</option>
              {tokens.map((token) => (
                <option key={token.id} value={token.id}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="text-gray-500 text-sm mt-1">$0</div>
        </div>

        <ConnectKitButton.Custom>
          {({ show, truncatedAddress }) => (
            <button
              type="button"
              onClick={isConnected ? () => disconnect() : show}
              className={`w-full py-4 rounded-lg font-medium transition-colors ${
                isConnected 
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isConnected ? truncatedAddress : "Connect Wallet"}
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>
    </div>
  );
}