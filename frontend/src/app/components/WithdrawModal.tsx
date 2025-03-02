/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { 
  useAccount, 
  useChainId,
  useSwitchChain,
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '../utils/addresses';

const ERC20_ABI = [
  {
    "type": "function",
    "name": "balanceOf",
    "stateMutability": "view",
    "inputs": [{"name": "owner", "type": "address"}],
    "outputs": [{"type": "uint256"}]
  },
  {
    "type": "function",
    "name": "decimals",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{"type": "uint8"}]
  }
] as const;

const GORILLIX_ABI = [
  {
    "type": "function",
    "name": "removeLiquidity",
    "stateMutability": "nonpayable",
    "inputs": [{"name": "amountLPTokens", "type": "uint256"}],
    "outputs": []
  },
  {
    "type": "function",
    "name": "s_totalLiquidityTokenA",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{"type": "uint256"}]
  },
  {
    "type": "function",
    "name": "s_totalLiquidityTokenB",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{"type": "uint256"}]
  },
  {
    "type": "function",
    "name": "balanceOf",
    "stateMutability": "view",
    "inputs": [{"name": "account", "type": "address"}],
    "outputs": [{"type": "uint256"}]
  },
  {
    "type": "function",
    "name": "decimals",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{"type": "uint8"}]
  },
  {
    "type": "function",
    "name": "getLiquidityTokenAPerUser",
    "stateMutability": "view",
    "inputs": [{"name": "user", "type": "address"}],
    "outputs": [{"type": "uint256"}]
  },
  {
    "type": "function",
    "name": "getLiquidityTokenBPerUser",
    "stateMutability": "view",
    "inputs": [{"name": "user", "type": "address"}],
    "outputs": [{"type": "uint256"}]
  },
  {
    "type": "function",
    "name": "getPoolShare",
    "stateMutability": "view",
    "inputs": [{"name": "amountLPTokens", "type": "uint256"}],
    "outputs": [{"type": "uint256"}]
  }
] as const;

const ABC_CHAIN_ID = 112;

interface WithdrawModalProps {
  isVisible: boolean;
  onClose: () => void;
  onWithdrawSuccess?: () => void;
}

export function WithdrawModal({ 
  isVisible, 
  onClose,
  onWithdrawSuccess
}: WithdrawModalProps) {
  // State management for withdraw functionality
  const [lpAmount, setLpAmount] = useState('');
  const [token1Amount, setToken1Amount] = useState('0');
  const [token2Amount, setToken2Amount] = useState('0');
  const [newPoolShare, setNewPoolShare] = useState('0');
  const [statusMessage, setStatusMessage] = useState('');
  const [lpDecimals, setLpDecimals] = useState(18);

  // Wallet and network connection
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const token1Symbol = "TKA";
  const token2Symbol = "TKB";

  // Read pool data to calculate token amounts and shares
  const { data: totalLiquidityToken1 } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 's_totalLiquidityTokenA',
    query: { enabled: isConnected && isVisible }
  });

  const { data: totalLiquidityToken2 } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 's_totalLiquidityTokenB',
    query: { enabled: isConnected && isVisible }
  });

  // Get user's LP token balance
  const { data: lpBalanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected && isVisible }
  });

  const { data: lpDecimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 'decimals',
    query: { enabled: isConnected && isVisible }
  });

  // Read user's liquidity contribution to calculate token returns
  const { data: userLiquidityToken1 } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 'getLiquidityTokenAPerUser',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected && isVisible }
  });

  const { data: userLiquidityToken2 } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 'getLiquidityTokenBPerUser',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected && isVisible }
  });

  // Get current pool share
  const { data: poolShareData } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 'getPoolShare',
    args: [lpBalanceData ?? BigInt(0)],
    query: { enabled: isConnected && isVisible && !!lpBalanceData }
  });

  // Write operation for removing liquidity
  const { 
    writeContract: withdrawLiquidity, 
    isPending: isWithdrawing, 
    data: withdrawTxData 
  } = useWriteContract();

  // Monitor transaction confirmation
  const { 
    isLoading: isWithdrawConfirming, 
    isSuccess: isWithdrawSuccess 
  } = useWaitForTransactionReceipt({
    hash: withdrawTxData,
    query: { enabled: !!withdrawTxData }
  });

  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [currentPoolShare, setCurrentPoolShare] = useState('0');
  
  // Format LP balance with proper decimals
  useEffect(() => {
    if (lpBalanceData && lpDecimalsData) {
      const balance = formatUnits(lpBalanceData, lpDecimalsData);
      setLpTokenBalance(balance);
      setLpDecimals(lpDecimalsData);
    }
  }, [lpBalanceData, lpDecimalsData]);
  
  // Update current pool share
  useEffect(() => {
    if (poolShareData) {
      setCurrentPoolShare(formatUnits(poolShareData, 2)); // Assuming pool share is in percentage with 2 decimals
    }
  }, [poolShareData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isVisible) {
      setLpAmount('');
      setToken1Amount('0');
      setToken2Amount('0');
      setNewPoolShare('0');
      setStatusMessage('');
    }
  }, [isVisible]);

  // Handle withdraw success
  useEffect(() => {
    if (isWithdrawSuccess) {
      setStatusMessage("Withdraw completed successfully!");
      setLpAmount('');
      setToken1Amount('0');
      setToken2Amount('0');
      
      onWithdrawSuccess?.();
    }
  }, [isWithdrawSuccess, onWithdrawSuccess]);

  // Set maximum LP token amount
  const handleMaxClick = () => {
    setLpAmount(lpTokenBalance);
    calculateTokenAmounts(lpTokenBalance);
  };

  // Update LP amount when user inputs change
  const handleLpAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setLpAmount(value);
      calculateTokenAmounts(value);
    }
  };

  // Calculate tokens to be received and updated pool share
  const calculateTokenAmounts = (amount: string) => {
    if (amount === '' || parseFloat(amount) === 0) {
      setToken1Amount('0');
      setToken2Amount('0');
      setNewPoolShare('0');
      return;
    }

    if (userLiquidityToken1 && userLiquidityToken2 && lpBalanceData && parseFloat(lpTokenBalance) > 0) {
      const lpAmountNum = parseFloat(amount);
      const ratio = lpAmountNum / parseFloat(lpTokenBalance);
      
      // Calculate token amounts based on user's liquidity share
      const token1 = formatUnits(userLiquidityToken1, 18) as string;
      const token2 = formatUnits(userLiquidityToken2, 18) as string;
      
      setToken1Amount((parseFloat(token1) * ratio).toFixed(6));
      setToken2Amount((parseFloat(token2) * ratio).toFixed(6));
      
      // Calculate new pool share
      if (poolShareData) {
        const currentShareNum = parseFloat(currentPoolShare);
        const burnRatio = lpAmountNum / parseFloat(lpTokenBalance);
        const newShare = Math.max(0, currentShareNum * (1 - burnRatio));
        setNewPoolShare(newShare.toFixed(2));
      }
    }
  };

  // Execute the withdraw transaction
  const handleWithdraw = async () => {
    if (!isConnected) {
      setStatusMessage('Please connect your wallet');
      return;
    }

    if (chainId !== ABC_CHAIN_ID) {
      try {
        await switchChain({ chainId: ABC_CHAIN_ID });
      } catch (error) {
        setStatusMessage('Failed to switch network');
        return;
      }
    }

    if (!lpAmount || parseFloat(lpAmount) <= 0) {
      setStatusMessage('Please enter valid amount');
      return;
    }

    try {
      const amount = parseUnits(lpAmount, lpDecimals);
      
      // Call removeLiquidity function on the Gorillix contract
      withdrawLiquidity({
        address: CONTRACT_ADDRESSES.GORILLIX,
        abi: GORILLIX_ABI,
        functionName: 'removeLiquidity',
        args: [amount]
      });
      
      setStatusMessage("Withdrawing liquidity...");
    } catch (error: any) {
      console.error('Withdraw error:', error);
      setStatusMessage(`Withdraw failed: ${error.message}`);
    }
  };

  // Check if user has sufficient LP balance
  const hasInsufficientBalance = parseFloat(lpAmount || '0') > parseFloat(lpTokenBalance);

  // Check if all conditions are met to enable the withdraw button
  const canWithdraw = () => {
    return (
      isConnected &&
      lpAmount &&
      parseFloat(lpAmount) > 0 &&
      !hasInsufficientBalance &&
      !isWithdrawing &&
      !isWithdrawConfirming
    );
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
          {/* LP Token Input */}
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
                className="text-violet-500 text-sm hover:text-violet-400 transition-colors"
              >
                MAX
              </button>
              <span className="text-sm text-gray-400">LP Tokens</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-gray-400">You&apos;ll receive</span>
          </div>

          {/* Tokens To Receive */}
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

          {/* Pool Share Information */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Your pool share</span>
              <span className="text-white">{newPoolShare}%</span>
            </div>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={!canWithdraw()}
            className="w-full py-3 rounded-lg font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWithdrawing || isWithdrawConfirming 
              ? 'Withdrawing...' 
              : hasInsufficientBalance 
                ? 'Insufficient LP token balance'
                : (!lpAmount || parseFloat(lpAmount) <= 0)
                  ? 'Enter an amount'
                  : 'Withdraw'
            }
          </button>

          {/* Status Messages */}
          {statusMessage && (
            <div className={`mt-4 p-3 rounded-lg ${
              statusMessage.includes('failed') || statusMessage.includes('Failed')
                ? 'bg-red-900/50 text-red-200' 
                : statusMessage.includes('successfully') 
                  ? 'bg-green-900/50 text-green-200'
                  : 'bg-gray-800 text-gray-300'
            }`}>
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}