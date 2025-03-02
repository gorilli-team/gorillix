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
  },
  {
    "type": "function",
    "name": "approve",
    "stateMutability": "nonpayable",
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": [{"type": "bool"}]
  },
  {
    "type": "function",
    "name": "allowance",
    "stateMutability": "view",
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "outputs": [{"type": "uint256"}]
  }
] as const;

const GORILLIX_ABI = [
  {
    "type": "function",
    "name": "init",
    "stateMutability": "nonpayable",
    "inputs": [
      {"name": "amountTokenA", "type": "uint256"},
      {"name": "amountTokenB", "type": "uint256"}
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "addLiquidityTokenA",
    "stateMutability": "nonpayable",
    "inputs": [{"name": "amountTokenA", "type": "uint256"}],
    "outputs": [{"name": "amountTokenB", "type": "uint256"}]
  },
  {
    "type": "function",
    "name": "addLiquidityTokenB",
    "stateMutability": "nonpayable",
    "inputs": [{"name": "amountTokenB", "type": "uint256"}],
    "outputs": [{"name": "amountTokenA", "type": "uint256"}]
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
    "name": "getLPTokensInit",
    "stateMutability": "pure",
    "inputs": [
      {"name": "amountTokenA", "type": "uint256"},
      {"name": "amountTokenB", "type": "uint256"}
    ],
    "outputs": [{"type": "uint256"}]
  },
  {
    "type": "function",
    "name": "getLPTokensAddLiquidity",
    "stateMutability": "view",
    "inputs": [
      {"name": "amountTokenA", "type": "uint256"},
      {"name": "reservesTokenA", "type": "uint256"}
    ],
    "outputs": [{"type": "uint256"}]
  }
] as const;

const ABC_CHAIN_ID = 112;

interface DepositModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDepositSuccess?: () => void;
}

export function DepositModal({ 
  isVisible, 
  onClose,
  onDepositSuccess
}: DepositModalProps) {
  // State management for token inputs, approvals and transaction status
  const [token1Amount, setToken1Amount] = useState('');
  const [token2Amount, setToken2Amount] = useState('');
  const [estimatedLpTokens, setEstimatedLpTokens] = useState('0');
  const [statusMessage, setStatusMessage] = useState('');
  const isPoolInitialized = true;
  const [needsToken1Approval, setNeedsToken1Approval] = useState(false);
  const [needsToken2Approval, setNeedsToken2Approval] = useState(false);
  const [token1Decimals, setToken1Decimals] = useState(18);
  const [token2Decimals, setToken2Decimals] = useState(18);
  const [isApproving1, setIsApproving1] = useState(false);
  const [isApproving2, setIsApproving2] = useState(false);

  // Wallet and network connection
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const token1Symbol = "TKA";
  const token2Symbol = "TKB";
  
  // Read token balances from blockchain
  const { data: token1BalanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_A,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected && isVisible }
  });

  const { data: token2BalanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_B,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected && isVisible }
  });

  const { data: token1DecimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_A,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: isConnected && isVisible }
  });

  const { data: token2DecimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_B,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: isConnected && isVisible }
  });

  // Read pool data to calculate token ratios
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

  // Check token approvals
  const { data: token1AllowanceData, refetch: refetchToken1Allowance } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_A,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', CONTRACT_ADDRESSES.GORILLIX],
    query: { enabled: isConnected && isVisible && !!address && !!token1Amount && parseFloat(token1Amount) > 0 }
  });

  const { data: token2AllowanceData, refetch: refetchToken2Allowance } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_B,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', CONTRACT_ADDRESSES.GORILLIX],
    query: { enabled: isConnected && isVisible && !!address && !!token2Amount && parseFloat(token2Amount) > 0 }
  });

  // Write operations for approving tokens and adding liquidity
  const { 
    writeContract: approveToken1, 
    isPending: isToken1ApprovePending, 
    data: token1ApproveTxData 
  } = useWriteContract();

  const { 
    writeContract: approveToken2, 
    isPending: isToken2ApprovePending, 
    data: token2ApproveTxData 
  } = useWriteContract();

  const { 
    writeContract: depositLiquidity, 
    isPending: isDepositing, 
    data: depositTxData 
  } = useWriteContract();

  // Transaction receipt monitoring
  const { 
    isLoading: isToken1ApproveConfirming, 
    isSuccess: isToken1ApproveSuccess 
  } = useWaitForTransactionReceipt({
    hash: token1ApproveTxData,
    query: { enabled: !!token1ApproveTxData }
  });

  const { 
    isLoading: isToken2ApproveConfirming, 
    isSuccess: isToken2ApproveSuccess 
  } = useWaitForTransactionReceipt({
    hash: token2ApproveTxData,
    query: { enabled: !!token2ApproveTxData }
  });

  const { 
    isLoading: isDepositConfirming, 
    isSuccess: isDepositSuccess 
  } = useWaitForTransactionReceipt({
    hash: depositTxData,
    query: { enabled: !!depositTxData }
  });

  const [token1Balance, setToken1Balance] = useState('0');
  const [token2Balance, setToken2Balance] = useState('0');

  // Format token balances with proper decimals
  useEffect(() => {
    if (token1BalanceData && token1DecimalsData) {
      const balance = formatUnits(token1BalanceData, token1DecimalsData);
      setToken1Balance(balance);
      setToken1Decimals(token1DecimalsData);
    }
  }, [token1BalanceData, token1DecimalsData]);

  useEffect(() => {
    if (token2BalanceData && token2DecimalsData) {
      const balance = formatUnits(token2BalanceData, token2DecimalsData);
      setToken2Balance(balance);
      setToken2Decimals(token2DecimalsData);
    }
  }, [token2BalanceData, token2DecimalsData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isVisible) {
      setToken1Amount('');
      setToken2Amount('');
      setEstimatedLpTokens('0');
      setStatusMessage('');
    }
  }, [isVisible]);

  // Check if Token A needs approval
  useEffect(() => {
    const checkToken1Allowance = async () => {
      if (token1Amount && parseFloat(token1Amount) > 0 && token1AllowanceData !== undefined) {
        const amount = parseUnits(token1Amount, token1Decimals);
        
        if (token1AllowanceData < amount) {
          setNeedsToken1Approval(true);
        } else {
          setNeedsToken1Approval(false);
        }
      }
    };
    
    checkToken1Allowance();
  }, [token1Amount, token1AllowanceData, token1Decimals]);

  // Check if Token B needs approval
  useEffect(() => {
    const checkToken2Allowance = async () => {
      if (token2Amount && parseFloat(token2Amount) > 0 && token2AllowanceData !== undefined) {
        const amount = parseUnits(token2Amount, token2Decimals);
        
        if (token2AllowanceData < amount) {
          setNeedsToken2Approval(true);
        } else {
          setNeedsToken2Approval(false);
        }
      }
    };
    
    checkToken2Allowance();
  }, [token2Amount, token2AllowanceData, token2Decimals]);

  // Handle token approval success
  useEffect(() => {
    if (isToken1ApproveSuccess) {
      setStatusMessage(`${token1Symbol} approval successful.`);
      setIsApproving1(false);
      refetchToken1Allowance();
    }
  }, [isToken1ApproveSuccess, refetchToken1Allowance, token1Symbol]);

  useEffect(() => {
    if (isToken2ApproveSuccess) {
      setStatusMessage(`${token2Symbol} approval successful.`);
      setIsApproving2(false);
      refetchToken2Allowance();
    }
  }, [isToken2ApproveSuccess, refetchToken2Allowance, token2Symbol]);

  // Handle deposit success
  useEffect(() => {
    if (isDepositSuccess) {
      setStatusMessage("Deposit completed successfully!");
      setToken1Amount('');
      setToken2Amount('');
      
      onDepositSuccess?.();
    }
  }, [isDepositSuccess, onDepositSuccess]);

  // Update amounts when user inputs change
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

  // Calculate token amounts to maintain pool ratio
  const calculateToken2Amount = (token1Value: string) => {
    if (token1Value === '' || parseFloat(token1Value) === 0) {
      setToken2Amount('');
      setEstimatedLpTokens('0');
      return;
    }

    if (totalLiquidityToken1 && totalLiquidityToken2) {
      // Use the ratio of current liquidity to calculate equivalent amount
      const amount = parseFloat(token1Value) * 
        (Number(formatUnits(totalLiquidityToken2, token2Decimals)) / 
         Number(formatUnits(totalLiquidityToken1, token1Decimals)));
      
      setToken2Amount(amount.toFixed(6));
      calculateLpTokens(token1Value, amount.toString());
    }
  };

  const calculateToken1Amount = (token2Value: string) => {
    if (token2Value === '' || parseFloat(token2Value) === 0) {
      setToken1Amount('');
      setEstimatedLpTokens('0');
      return;
    }

    if (totalLiquidityToken1 && totalLiquidityToken2) {
      // Use the ratio of current liquidity to calculate equivalent amount
      const amount = parseFloat(token2Value) * 
        (Number(formatUnits(totalLiquidityToken1, token1Decimals)) / 
         Number(formatUnits(totalLiquidityToken2, token2Decimals)));
      
      setToken1Amount(amount.toFixed(6));
      calculateLpTokens(amount.toString(), token2Value);
    }
  };

  // Estimate LP tokens to be received
  const calculateLpTokens = (amount1: string, amount2: string) => {
    if (!amount1 || !amount2) {
      setEstimatedLpTokens('0');
      return;
    }

    if (totalLiquidityToken1) {
      // For adding to existing liquidity, estimate based on percentage of pool
      const poolShare = parseFloat(amount1) / 
        (parseFloat(amount1) + Number(formatUnits(totalLiquidityToken1, token1Decimals)));
      
      const estimate = poolShare * 100;
      setEstimatedLpTokens(estimate.toFixed(6));
    }
  };

  // Approve Token A for spending by the contract
  const handleApproveToken1 = async () => {
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

    try {
      const amount = parseUnits(token1Amount, token1Decimals);
      
      approveToken1({
        address: CONTRACT_ADDRESSES.TOKEN_A,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.GORILLIX, amount]
      });
      
      setIsApproving1(true);
      setStatusMessage(`Approving ${token1Symbol}...`);
    } catch (error: any) {
      console.error(`${token1Symbol} approval error:`, error);
      setStatusMessage(`${token1Symbol} approval failed: ${error.message}`);
      setIsApproving1(false);
    }
  };

  // Approve Token B for spending by the contract
  const handleApproveToken2 = async () => {
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

    try {
      const amount = parseUnits(token2Amount, token2Decimals);
      
      approveToken2({
        address: CONTRACT_ADDRESSES.TOKEN_B,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.GORILLIX, amount]
      });
      
      setIsApproving2(true);
      setStatusMessage(`Approving ${token2Symbol}...`);
    } catch (error: any) {
      console.error(`${token2Symbol} approval error:`, error);
      setStatusMessage(`${token2Symbol} approval failed: ${error.message}`);
      setIsApproving2(false);
    }
  };

  // Execute the deposit transaction
  const handleDeposit = async () => {
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

    if (!token1Amount || !token2Amount || 
        parseFloat(token1Amount) <= 0 || 
        parseFloat(token2Amount) <= 0) {
      setStatusMessage('Please enter valid amounts');
      return;
    }

    try {
      const amount1 = parseUnits(token1Amount, token1Decimals);
      
      // Always use addLiquidityTokenA since pool is initialized
      depositLiquidity({
        address: CONTRACT_ADDRESSES.GORILLIX,
        abi: GORILLIX_ABI,
        functionName: 'addLiquidityTokenA',
        args: [amount1]
      });
      
      setStatusMessage("Depositing tokens...");
    } catch (error: any) {
      console.error('Deposit error:', error);
      setStatusMessage(`Deposit failed: ${error.message}`);
    }
  };

  // Check if user has sufficient balance for the deposit
  const hasInsufficientBalance = 
    (parseFloat(token1Amount || '0') > parseFloat(token1Balance)) ||
    (parseFloat(token2Amount || '0') > parseFloat(token2Balance));

  // Check if all conditions are met to enable the deposit button
  const canDeposit = () => {
    return (
      isConnected &&
      token1Amount &&
      token2Amount &&
      parseFloat(token1Amount) > 0 &&
      parseFloat(token2Amount) > 0 &&
      !needsToken1Approval &&
      !needsToken2Approval &&
      !hasInsufficientBalance &&
      !isDepositing &&
      !isDepositConfirming
    );
  };

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
          {/* Token A Input */}
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
                <span className="text-gray-500 text-sm">Balance: {token1Balance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600">
                  {token1Symbol}
                </button>
              </div>
            </div>
          </div>

          {/* Token B Input */}
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
                <span className="text-gray-500 text-sm">Balance: {token2Balance}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600">
                  {token2Symbol}
                </button>
              </div>
            </div>
          </div>

          {/* Estimated LP Tokens */}
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

          {/* Approval Buttons */}
          <div className="space-y-2">
            {needsToken1Approval && (
              <button 
                onClick={handleApproveToken1}
                disabled={isToken1ApprovePending || isToken1ApproveConfirming}
                className={`w-full px-4 py-2 rounded-lg font-medium ${
                  isToken1ApprovePending || isToken1ApproveConfirming
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {isToken1ApprovePending || isToken1ApproveConfirming 
                  ? `Approving ${token1Symbol}...` 
                  : `Approve ${token1Symbol}`}
              </button>
            )}

            {needsToken2Approval && (
              <button 
                onClick={handleApproveToken2}
                disabled={isToken2ApprovePending || isToken2ApproveConfirming}
                className={`w-full px-4 py-2 rounded-lg font-medium ${
                  isToken2ApprovePending || isToken2ApproveConfirming
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {isToken2ApprovePending || isToken2ApproveConfirming 
                  ? `Approving ${token2Symbol}...` 
                  : `Approve ${token2Symbol}`}
              </button>
            )}
          </div>

          {/* Deposit Button */}
          <button
            onClick={handleDeposit}
            disabled={!canDeposit()}
            className="w-full py-3 rounded-lg font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDepositing || isDepositConfirming 
              ? 'Depositing...' 
              : hasInsufficientBalance 
                ? 'Insufficient balance' 
                : (needsToken1Approval || needsToken2Approval) 
                  ? 'Approve tokens first' 
                  : (!token1Amount || !token2Amount) 
                    ? 'Enter an amount' 
                    : 'Add Liquidity'
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