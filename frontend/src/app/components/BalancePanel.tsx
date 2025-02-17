"use client";

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

const BalancePanel = () => {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();
  
  const balances = {
    tokenA: '1000.00',
    tokenB: '500.00'
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex items-center space-x-4 px-4 py-2 bg-white rounded-lg shadow-sm opacity-0" />;
  }

  if (!isConnected) return null;

  return (
    <div className="flex items-center space-x-4 px-4 py-2 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">TokenA:</span>
        <span className="text-sm font-medium">{balances.tokenA}</span>
      </div>
      <div className="h-4 w-px bg-gray-300" />
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">TokenB:</span>
        <span className="text-sm font-medium">{balances.tokenB}</span>
      </div>
    </div>
  );
};

export default BalancePanel;