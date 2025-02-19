import { useState, ChangeEvent } from 'react';
import { ConnectKitButton } from "connectkit";
import { useAccount } from 'wagmi';
import PoolItem from './PoolItem';

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

  const handleSwap = () => {
    console.log("Swap initiated", { fromToken, toToken, fromAmount, toAmount });
  };

  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setFromAmount(value);
    }
  };

  const handleToAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setToAmount(value);
    }
  };

  const getTokenRateText = () => {
    if (!fromToken || !toToken) return '';
    const fromSymbol = tokens.find(t => t.id === fromToken)?.symbol;
    const toSymbol = tokens.find(t => t.id === toToken)?.symbol;
    if (fromToken === 'tokenA') {
      return `1 ${fromSymbol} ≈ 5 ${toSymbol} ($4.50)`;
    } else {
      return `1 ${fromSymbol} ≈ 0.2 ${toSymbol} ($0.90)`;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
        <div className="w-full pt-4">
          <PoolItem 
            tokenPair="TKNA/TKNB"
            poolNumber="0"
            fee="0.05%"
            volume24h="$1,708,112"
            liquidity="$231,643"
            apr="0.3% - 42.9%"
            token1Image="/usd-coin-usdc-logo.png"
            token2Image="/uniswap-uni-logo.png"
          />
        </div>

        <div className="w-full flex justify-center pt-4">
          <div className="bg-gray-800 rounded-xl p-5 shadow-lg w-full max-w-lg border border-gray-700">
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">From</label>
                <div className="bg-gray-900 rounded-lg p-2 flex items-center">
                  <input
                    type="number"
                    min="0"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    placeholder="0"
                    className="bg-transparent text-white text-xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <select
                    value={fromToken}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFromToken(e.target.value)}
                    className="ml-2 bg-gray-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <option value="bg-purple-600">Select token</option>
                    {tokens.map((token) => (
                      <option key={token.id} value={token.id}>{token.symbol}</option>
                    ))}
                  </select>
                </div>
                <div className="text-gray-500 text-sm mt-1">$0</div>
              </div>

              <div className="flex justify-center">
                <div 
                  onClick={handleSwitchTokens}
                  className="bg-gray-900 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">To</label>
                <div className="bg-gray-900 rounded-lg p-2 flex items-center">
                  <input
                    type="number"
                    min="0"
                    value={toAmount}
                    onChange={handleToAmountChange}
                    placeholder="0"
                    className="bg-transparent text-white text-xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <select
                    value={toToken}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setToToken(e.target.value)}
                    className="ml-2 bg-gray-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <option value="">Select token</option>
                    {tokens.map((token) => (
                      <option key={token.id} value={token.id}>{token.symbol}</option>
                    ))}
                  </select>
                </div>
                <div className="text-gray-500 text-sm mt-1">$0</div>
              </div>

              {fromToken && toToken && (
                <div className="text-gray-400 text-sm flex items-center justify-center">
                  {getTokenRateText()}
                </div>
              )}

              {isConnected ? (
                <button
                  onClick={handleSwap}
                  disabled={!fromToken || !toToken || !fromAmount || !toAmount}
                  className="w-full py-3 rounded-lg font-medium text-sm transition-colors bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Swap
                </button>
              ) : (
                <ConnectKitButton.Custom>
                  {({ show }) => (
                    <button
                      onClick={show}
                      className="w-full py-3 rounded-lg font-medium text-sm transition-colors bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Connect Wallet
                    </button>
                  )}
                </ConnectKitButton.Custom>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}