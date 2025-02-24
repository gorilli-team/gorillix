import { useState, ChangeEvent } from 'react';
import { ConnectKitButton } from "connectkit";
import { useAccount } from 'wagmi';
import PoolItem from './PoolItem';

const tokens = [
  { 
    id: 'tokenA', 
    name: 'Token A', 
    symbol: 'TKNA',
    balance: '1000',
    price: '1.2'
  },
  { 
    id: 'tokenB', 
    name: 'Token B', 
    symbol: 'TKNB',
    balance: '500',
    price: '0.8'
  },
];

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const { isConnected } = useAccount();

  const handleFromTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newFromToken = e.target.value;
    setFromToken(newFromToken);
    
    if (newFromToken === toToken) {
      const otherToken = tokens.find(t => t.id !== newFromToken);
      setToToken(otherToken?.id || '');
    }
    
    if (newFromToken && toToken && fromAmount) {
      calculateToAmount(fromAmount);
    }
  };

  const handleToTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newToToken = e.target.value;
    setToToken(newToToken);
    
    if (newToToken === fromToken) {
      const otherToken = tokens.find(t => t.id !== newToToken);
      setFromToken(otherToken?.id || '');
    }
    
    if (fromToken && newToToken && fromAmount) {
      calculateToAmount(fromAmount);
    }
  };

  const getUsdValue = (amount: string, tokenId: string) => {
    if (!amount || !tokenId) return '0';
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return '0';
    return (parseFloat(amount) * parseFloat(token.price)).toFixed(2);
  };

  const getTokenBalance = (tokenId: string) => {
    const token = tokens.find(t => t.id === tokenId);
    return token?.balance || '0';
  };

  const handleFromAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setFromAmount(value);
      calculateToAmount(value);
    }
  };

  const handleToAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setToAmount(value);
      calculateFromAmount(value);
    }
  };

  const calculateToAmount = (fromValue: string) => {
    if (!fromValue || !fromToken || !toToken) {
      setToAmount('');
      return;
    }
    const rate = fromToken === 'tokenA' ? 1.5 : 0.667;
    const calculated = parseFloat(fromValue) * rate;
    setToAmount(calculated.toFixed(6));
  };

  const calculateFromAmount = (toValue: string) => {
    if (!toValue || !fromToken || !toToken) {
      setFromAmount('');
      return;
    }
    const rate = fromToken === 'tokenA' ? 0.667 : 1.5;
    const calculated = parseFloat(toValue) * rate;
    setFromAmount(calculated.toFixed(6));
  };

  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleMax = () => {
    if (!fromToken) return;
    const balance = getTokenBalance(fromToken);
    setFromAmount(balance);
    calculateToAmount(balance);
  };

  const getTokenRateText = () => {
    if (!fromToken || !toToken) return '';
    const fromSymbol = tokens.find(t => t.id === fromToken)?.symbol;
    const toSymbol = tokens.find(t => t.id === toToken)?.symbol;
    if (fromToken === 'tokenA') {
      return `1 ${fromSymbol} ≈ 1.5 ${toSymbol} ($${(1.5 * 0.8).toFixed(2)})`;
    } else {
      return `1 ${fromSymbol} ≈ 0.667 ${toSymbol} ($${(0.667 * 1.2).toFixed(2)})`;
    }
  };

  const hasInsufficientBalance = () => {
    if (!fromToken || !fromAmount) return false;
    const balance = parseFloat(getTokenBalance(fromToken));
    return parseFloat(fromAmount) > balance;
  };

  const handleSwap = () => {
    console.log('Swap executed');
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
        <div className="w-full pt-2">
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

        <div className="w-full flex justify-center pt-2">
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg w-full max-w-lg border border-gray-700">
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">From</label>
                <div className="bg-gray-900 rounded-lg p-4 flex items-center">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      value={fromAmount}
                      onChange={handleFromAmountChange}
                      placeholder="0"
                      className="bg-transparent text-white text-xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="flex items-center mt-1">
                      <span className="text-gray-500 text-sm">
                        ${getUsdValue(fromAmount, fromToken)}
                      </span>
                      {fromToken && (
                        <span className="text-gray-500 text-sm ml-2">
                          Balance: {getTokenBalance(fromToken)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {fromToken && (
                      <button 
                        onClick={handleMax}
                        className="text-purple-500 text-sm hover:text-purple-400 transition-colors"
                      >
                        MAX
                      </button>
                    )}
                    <select
                      value={fromToken}
                      onChange={handleFromTokenChange}
                      className="bg-gray-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer appearance-none hover:bg-gray-600 transition-colors [&>option:checked]:bg-purple-600"
                    >
                      <option value="" disabled>Select token</option>
                      {tokens.map((token) => (
                        <option key={token.id} value={token.id}>{token.symbol}</option>
                      ))}
                    </select>
                  </div>
                </div>
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
                <div className="bg-gray-900 rounded-lg p-4 flex items-center">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      value={toAmount}
                      onChange={handleToAmountChange}
                      placeholder="0"
                      className="bg-transparent text-white text-xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="flex items-center mt-1">
                      <span className="text-gray-500 text-sm">
                        ${getUsdValue(toAmount, toToken)}
                      </span>
                      {toToken && (
                        <span className="text-gray-500 text-sm ml-2">
                          Balance: {getTokenBalance(toToken)}
                        </span>
                      )}
                    </div>
                  </div>
                  <select
                    value={toToken}
                    onChange={handleToTokenChange}
                    className="bg-gray-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer appearance-none hover:bg-gray-600 transition-colors [&>option:checked]:bg-purple-600"
                  >
                    <option value="" disabled>Select token</option>
                    {tokens.filter(token => token.id !== fromToken).map((token) => (
                      <option key={token.id} value={token.id}>{token.symbol}</option>
                    ))}
                  </select>
                </div>
              </div>

              {fromToken && toToken && (
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Rate</span>
                    <span className="text-white">{getTokenRateText()}</span>
                  </div>
                </div>
              )}

              {isConnected ? (
                <button
                  onClick={() => handleSwap()}
                  disabled={!fromToken || !toToken || !fromAmount || !toAmount || hasInsufficientBalance()}
                  className="w-full py-3 rounded-lg font-medium text-sm transition-colors bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hasInsufficientBalance() 
                    ? 'Insufficient balance' 
                    : (!fromAmount || !toAmount) 
                      ? 'Enter an amount' 
                      : 'Swap'
                  }
                </button>
              ) : (
                <ConnectKitButton.Custom>
                  {({ show }) => (
                    <button
                      onClick={show}
                      className="w-full py-3 rounded-lg font-medium text-sm transition-colors bg-purple-600 text-white hover:bg-purple-700"
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