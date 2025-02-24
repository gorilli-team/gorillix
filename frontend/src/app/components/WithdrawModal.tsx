import React, { useState, useEffect } from 'react';

interface WithdrawModalProps {
  isVisible: boolean;
  onClose: () => void;
  poolShare?: string;
  lpTokenBalance?: string;
  token1Symbol?: string;
  token2Symbol?: string;
}

export function WithdrawModal({ 
  isVisible, 
  onClose,
  poolShare = "0", 
  lpTokenBalance = "0",
  token1Symbol = "TKNA",
  token2Symbol = "TKNB"
}: WithdrawModalProps) {
  const [lpAmount, setLpAmount] = useState('');
  const [token1Amount, setToken1Amount] = useState('0');
  const [token2Amount, setToken2Amount] = useState('0');
  const [newPoolShare, setNewPoolShare] = useState('0');

  useEffect(() => {
    if (!isVisible) {
      setLpAmount('');
      setToken1Amount('0');
      setToken2Amount('0');
      setNewPoolShare('0');
    }
  }, [isVisible]);

  const handleMaxClick = () => {
    setLpAmount(lpTokenBalance);
  };

  const handleLpAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setLpAmount(value);
      
      calculateTokenAmounts(value);
    }
  };

  const calculateTokenAmounts = (amount: string) => {
    if (amount === '' || parseFloat(amount) === 0) {
      setToken1Amount('0');
      setToken2Amount('0');
      setNewPoolShare('0');
      return;
    }

    const lpAmountNum = parseFloat(amount);
    setToken1Amount(String(lpAmountNum * 2));
    setToken2Amount(String(lpAmountNum * 5));
    
    const currentShare = parseFloat(poolShare);
    const newShare = Math.max(0, currentShare - (lpAmountNum / parseFloat(lpTokenBalance) * currentShare));
    setNewPoolShare(newShare.toFixed(2));
  };

  const handleWithdraw = () => {
    if (!lpAmount || parseFloat(lpAmount) === 0) return;

    console.log('Withdrawing:', {
      lpAmount,
      token1Amount,
      token2Amount,
      newPoolShare
    });

    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Withdraw</h2>
            <p className="text-sm text-gray-400 mt-1">Burn LP tokens to withdraw your liquidity</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Amount</span>
              <span className="text-gray-400 text-sm">
                Balance: {lpTokenBalance} LP
              </span>
            </div>
            <input
              type="number"
              value={lpAmount}
              onChange={handleLpAmountChange}
              placeholder="0"
              min="0"
              max={lpTokenBalance}
              className="bg-transparent text-white text-2xl w-full outline-none mb-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="flex justify-between items-center">
              <button 
                onClick={handleMaxClick}
                className="text-purple-500 text-sm hover:text-purple-400 transition-colors"
              >
                MAX
              </button>
              <span className="text-sm text-gray-400">LP Tokens</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-gray-400">You&apos;ll receive</span>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">{token1Symbol}</span>
              <span className="text-white">{token1Amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{token2Symbol}</span>
              <span className="text-white">{token2Amount}</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Your pool share</span>
              <span className="text-white">{newPoolShare}%</span>
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!lpAmount || parseFloat(lpAmount) === 0}
            className="w-full py-3 rounded-lg font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {parseFloat(lpAmount) > parseFloat(lpTokenBalance) 
              ? 'Insufficient LP token balance'
              : 'Withdraw'
            }
          </button>
        </div>
      </div>
    </div>
  );
}