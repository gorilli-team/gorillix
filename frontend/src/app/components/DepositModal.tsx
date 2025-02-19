import React, { useState, useEffect } from 'react';

interface DepositModalProps {
  isVisible: boolean;
  onClose: () => void;
  token1Symbol?: string;
  token2Symbol?: string;
  token1Balance?: string;
  token2Balance?: string;
  token1Price?: string;
  token2Price?: string;
}

export function DepositModal({ 
  isVisible, 
  onClose,
  token1Symbol = "TKNA",
  token2Symbol = "TKNB",
  token1Balance = "0",
  token2Balance = "0",
  token1Price = "0",
  token2Price = "0"
}: DepositModalProps) {
  const [token1Amount, setToken1Amount] = useState('');
  const [token2Amount, setToken2Amount] = useState('');
  const [estimatedLpTokens, setEstimatedLpTokens] = useState('0');

  useEffect(() => {
    if (!isVisible) {
      setToken1Amount('');
      setToken2Amount('');
      setEstimatedLpTokens('0');
    }
  }, [isVisible]);

  const handleToken1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setToken1Amount(value);

      calculateToken2Amount(value);
    }
  };

  const handleToken2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setToken2Amount(value);
      calculateToken1Amount(value);
    }
  };

  const calculateToken2Amount = (token1Value: string) => {
    if (token1Value === '' || parseFloat(token1Value) === 0) {
      setToken2Amount('');
      setEstimatedLpTokens('0');
      return;
    }

    const amount = parseFloat(token1Value) * (parseFloat(token2Price) / parseFloat(token1Price));
    setToken2Amount(amount.toFixed(6));
    calculateLpTokens(token1Value, amount.toString());
  };

  const calculateToken1Amount = (token2Value: string) => {
    if (token2Value === '' || parseFloat(token2Value) === 0) {
      setToken1Amount('');
      setEstimatedLpTokens('0');
      return;
    }

    const amount = parseFloat(token2Value) * (parseFloat(token1Price) / parseFloat(token2Price));
    setToken1Amount(amount.toFixed(6));
    calculateLpTokens(amount.toString(), token2Value);
  };

  const calculateLpTokens = (amount1: string, amount2: string) => {
    if (!amount1 || !amount2) {
      setEstimatedLpTokens('0');
      return;
    }

    const estimate = Math.sqrt(parseFloat(amount1) * parseFloat(amount2));
    setEstimatedLpTokens(estimate.toFixed(6));
  };

  const handleToken1Max = () => {
    setToken1Amount(token1Balance);
    calculateToken2Amount(token1Balance);
  };

  const handleToken2Max = () => {
    setToken2Amount(token2Balance);
    calculateToken1Amount(token2Balance);
  };

  const handleDeposit = () => {
    if (!token1Amount || !token2Amount || 
        parseFloat(token1Amount) === 0 || 
        parseFloat(token2Amount) === 0) return;

    console.log('Depositing:', {
      token1Amount,
      token2Amount,
      estimatedLpTokens
    });

    onClose();
  };

  const hasInsufficientBalance = 
    (parseFloat(token1Amount || '0') > parseFloat(token1Balance)) ||
    (parseFloat(token2Amount || '0') > parseFloat(token2Balance));

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Deposit</h2>
            <p className="text-sm text-gray-400 mt-1">Deposit your tokens to receive LP tokens</p>
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
            <input
              type="number"
              value={token1Amount}
              onChange={handleToken1Change}
              placeholder="0"
              min="0"
              className="bg-transparent text-white text-2xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="flex justify-between mt-2">
              <div>
                <span className="text-gray-500">${parseFloat(token1Amount || '0') * parseFloat(token1Price)} USD</span>
                <span className="text-gray-500 text-sm ml-2">Balance: {token1Balance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleToken1Max}
                  className="text-purple-500 text-sm hover:text-purple-400 transition-colors"
                >
                  MAX
                </button>
                <button className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600">
                  {token1Symbol}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="text-gray-400">+</span>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <input
              type="number"
              value={token2Amount}
              onChange={handleToken2Change}
              placeholder="0"
              min="0"
              className="bg-transparent text-white text-2xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="flex justify-between mt-2">
              <div>
                <span className="text-gray-500">${parseFloat(token2Amount || '0') * parseFloat(token2Price)} USD</span>
                <span className="text-gray-500 text-sm ml-2">Balance: {token2Balance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleToken2Max}
                  className="text-purple-500 text-sm hover:text-purple-400 transition-colors"
                >
                  MAX
                </button>
                <button className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600">
                  {token2Symbol}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Initial deposit fee</span>
              <span className="text-white">0.3%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">LP tokens you&apos;ll receive</span>
              <span className="text-white">{estimatedLpTokens}</span>
            </div>
          </div>

          <button
            onClick={handleDeposit}
            disabled={!token1Amount || !token2Amount || hasInsufficientBalance}
            className="w-full py-3 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasInsufficientBalance 
              ? 'Insufficient balance' 
              : (!token1Amount || !token2Amount) 
                ? 'Enter an amount' 
                : 'Deposit'
            }
          </button>
        </div>
      </div>
    </div>
  );
}