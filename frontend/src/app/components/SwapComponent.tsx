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
    "name": "tokenAtoTokenB",
    "stateMutability": "nonpayable",
    "inputs": [{"name": "amountTokenA", "type": "uint256"}],
    "outputs": [{"name": "outputTokenB", "type": "uint256"}]
  },
  {
    "type": "function",
    "name": "tokenBtoTokenA",
    "stateMutability": "nonpayable",
    "inputs": [{"name": "amountTokenB", "type": "uint256"}],
    "outputs": [{"name": "outputTokenA", "type": "uint256"}]
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
    "name": "price",
    "stateMutability": "pure",
    "inputs": [
      {"name": "xInput", "type": "uint256"},
      {"name": "xReserves", "type": "uint256"},
      {"name": "yReserves", "type": "uint256"}
    ],
    "outputs": [{"name": "yOutput", "type": "uint256"}]
  }
] as const;

const ABC_CHAIN_ID = 112;

interface SwapComponentProps {
  className?: string;
  onSwapSuccess?: () => void;
}

const SwapComponent: React.FC<SwapComponentProps> = ({ 
  className = '', 
  onSwapSuccess 
}) => {
  const [fromToken, setFromToken] = useState<'TokenA' | 'TokenB'>('TokenA');
  const [toToken, setToToken] = useState<'TokenA' | 'TokenB'>('TokenB');
  const [fromAmount, setFromAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [priceTokenA, setPriceTokenA] = useState<string>('0');
  const [priceTokenB, setPriceTokenB] = useState<string>('0');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [tokenABalance, setTokenABalance] = useState('0');
  const [tokenBBalance, setTokenBBalance] = useState('0');
  const [tokenADecimals, setTokenADecimals] = useState(18);
  const [tokenBDecimals, setTokenBDecimals] = useState(18);

  const fromTokenAddress = fromToken === 'TokenA' 
    ? CONTRACT_ADDRESSES.TOKEN_A 
    : CONTRACT_ADDRESSES.TOKEN_B;

  const { data: tokenABalanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_A,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected }
  });

  const { data: tokenBBalanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_B,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected }
  });

  const { data: tokenADecimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_A,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: isConnected }
  });

  const { data: tokenBDecimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_B,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: isConnected }
  });

  const { data: totalLiquidityTokenA } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 's_totalLiquidityTokenA',
    query: { enabled: isConnected }
  });

  const { data: totalLiquidityTokenB } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 's_totalLiquidityTokenB',
    query: { enabled: isConnected }
  });

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: fromTokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', CONTRACT_ADDRESSES.GORILLIX],
    query: { enabled: isConnected && !!address && !!fromAmount && parseFloat(fromAmount) > 0 }
  });

  const { data: priceTokenAData } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 'price',
    args: [BigInt(1 * 10**18), totalLiquidityTokenA ?? BigInt(0), totalLiquidityTokenB ?? BigInt(0)],
    query: { 
      enabled: isConnected && !!totalLiquidityTokenA && !!totalLiquidityTokenB 
    }
  });

  const { data: priceTokenBData } = useReadContract({
    address: CONTRACT_ADDRESSES.GORILLIX,
    abi: GORILLIX_ABI,
    functionName: 'price',
    args: [BigInt(1 * 10**18), totalLiquidityTokenB ?? BigInt(0), totalLiquidityTokenA ?? BigInt(0)],
    query: { 
      enabled: isConnected && !!totalLiquidityTokenA && !!totalLiquidityTokenB 
    }
  });

  const { 
    writeContract: approveToken, 
    isPending: isApprovePending, 
    data: approveTxData 
  } = useWriteContract();

  const { 
    writeContract: swapTokens, 
    isPending: isSwapping, 
    data: swapTxData 
  } = useWriteContract();

  const { 
    isLoading: isApproveConfirming, 
    isSuccess: isApproveSuccess 
  } = useWaitForTransactionReceipt({
    hash: approveTxData,
    query: { enabled: !!approveTxData }
  });

  const { 
    isLoading: isSwapConfirming, 
    isSuccess: isSwapSuccess 
  } = useWaitForTransactionReceipt({
    hash: swapTxData,
    query: { enabled: !!swapTxData }
  });

  // Update TokenA balance and decimals
  useEffect(() => {
    if (tokenABalanceData && tokenADecimalsData) {
      const balance = formatUnits(tokenABalanceData, tokenADecimalsData);
      setTokenABalance(balance);
      setTokenADecimals(tokenADecimalsData);
    }
  }, [tokenABalanceData, tokenADecimalsData]);

  // Update TokenB balance and decimals
  useEffect(() => {
    if (tokenBBalanceData && tokenBDecimalsData) {
      const balance = formatUnits(tokenBBalanceData, tokenBDecimalsData);
      setTokenBBalance(balance);
      setTokenBDecimals(tokenBDecimalsData);
    }
  }, [tokenBBalanceData, tokenBDecimalsData]);

  // Update prices
  useEffect(() => {
    if (priceTokenAData && tokenBDecimalsData) {
      const formattedPrice = formatUnits(priceTokenAData, tokenBDecimalsData);
      setPriceTokenA(formattedPrice);
    }
  }, [priceTokenAData, tokenBDecimalsData]);

  useEffect(() => {
    if (priceTokenBData && tokenADecimalsData) {
      const formattedPrice = formatUnits(priceTokenBData, tokenADecimalsData);
      setPriceTokenB(formattedPrice);
    }
  }, [priceTokenBData, tokenADecimalsData]);

  // Check if approval is needed
  useEffect(() => {
    const checkAllowance = async () => {
      if (fromAmount && parseFloat(fromAmount) > 0 && allowanceData !== undefined) {
        const decimals = fromToken === 'TokenA' ? tokenADecimals : tokenBDecimals;
        const amount = parseUnits(fromAmount, decimals);
        
        if (allowanceData < amount) {
          setNeedsApproval(true);
        } else {
          setNeedsApproval(false);
        }
      }
    };
    
    checkAllowance();
  }, [fromAmount, fromToken, allowanceData, tokenADecimals, tokenBDecimals]);

  // Handle approve success
  useEffect(() => {
    if (isApproveSuccess) {
      setStatusMessage("Approval successful. You can now swap.");
      setIsApproving(false);
      setNeedsApproval(false);
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  // Handle swap success
  useEffect(() => {
    if (isSwapSuccess) {
      setStatusMessage("Swap completed successfully!");
      setFromAmount('');
      
      // Call optional onSwapSuccess callback
      onSwapSuccess?.();
    }
  }, [isSwapSuccess, onSwapSuccess]);

  // Refresh allowance when token changes
  useEffect(() => {
    if (isConnected && address) {
      refetchAllowance();
    }
  }, [fromToken, address, isConnected, refetchAllowance]);

  // Set maximum amount based on selected token
  const handleSetMaxAmount = () => {
    if (fromToken === 'TokenA') {
      setFromAmount(tokenABalance);
    } else {
      setFromAmount(tokenBBalance);
    }
  };

  // Approve tokens
  const handleApprove = async () => {
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
      const decimals = fromToken === 'TokenA' ? tokenADecimals : tokenBDecimals;
      const amount = parseUnits(fromAmount, decimals);
      
      approveToken({
        address: fromTokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.GORILLIX, amount]
      });
      
      setIsApproving(true);
      setStatusMessage("Approving tokens...");
    } catch (error: any) {
      console.error('Approval error:', error);
      setStatusMessage(`Approval failed: ${error.message}`);
      setIsApproving(false);
    }
  };

  // Perform swap
  const handleSwap = async () => {
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
      const decimals = fromToken === 'TokenA' ? tokenADecimals : tokenBDecimals;
      const amount = parseUnits(fromAmount, decimals);

      // Perform swap based on token direction
      swapTokens({
        address: CONTRACT_ADDRESSES.GORILLIX,
        abi: GORILLIX_ABI,
        functionName: fromToken === 'TokenA' ? 'tokenAtoTokenB' : 'tokenBtoTokenA',
        args: [amount]
      });
      
      setStatusMessage("Swapping tokens...");
    } catch (error: any) {
      console.error('Swap error:', error);
      setStatusMessage(`Swap failed: ${error.message}`);
    }
  };

  // Token switch function
  const switchTokens = () => {
    setFromToken(fromToken === 'TokenA' ? 'TokenB' : 'TokenA');
    setToToken(toToken === 'TokenA' ? 'TokenB' : 'TokenA');
  };

  // Calculate current swap output
  const getSwapOutput = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return "0";
    
    const currentPrice = fromToken === 'TokenA' ? priceTokenA : priceTokenB;
    if (!currentPrice) return "0";
    
    const amount = parseFloat(fromAmount);
    const output = amount * parseFloat(currentPrice);
    return output.toFixed(6);
  };

  // Check if we can swap
  const canSwap = () => {
    return (
      isConnected &&
      fromAmount &&
      parseFloat(fromAmount) > 0 &&
      !needsApproval &&
      !isSwapping &&
      !isSwapConfirming
    );
  };

  const getTokenLabel = (token: 'TokenA' | 'TokenB') => {
    return token === 'TokenA' ? 'TKA' : 'TKB';
  };

  return (
    <div className={`bg-gray-800/60 rounded-xl p-5 shadow-lg border border-gray-700/50 ${className}`}>
      {/* From Token Input */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">From</span>
          <div className="flex items-center">
            <span className="text-xs text-gray-400 mr-2">
              Balance: {fromToken === 'TokenA' ? tokenABalance : tokenBBalance}
            </span>
            <button 
              onClick={handleSetMaxAmount}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium px-1.5 py-0.5 bg-purple-800/30 rounded hover:bg-purple-800/50 transition-colors"
            >
              MAX
            </button>
          </div>
        </div>
        <div className="flex bg-gray-900/70 rounded-lg p-3 border border-gray-700/50">
          <input 
            type="number" 
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-white outline-none border-none"
          />
          <div className="relative">
            <select 
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value as 'TokenA' | 'TokenB')}
              className="appearance-none bg-purple-800/30 text-white px-4 py-1 rounded-lg border border-purple-600/30 cursor-pointer outline-none"
            >
              <option value="TokenA">TKA</option>
              <option value="TokenB">TKB</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Switch Tokens Button */}
      <div className="flex justify-center my-2">
        <button 
          onClick={switchTokens}
          className="bg-purple-600/30 hover:bg-purple-600/50 rounded-full p-2 w-8 h-8 flex items-center justify-center border border-purple-600/20 transition-colors"
        >
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
          </svg>
        </button>
      </div>

      {/* To Token Selection */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">To</span>
          <span className="text-xs text-gray-400">
            Balance: {toToken === 'TokenA' ? tokenABalance : tokenBBalance}
          </span>
        </div>
        <div className="flex bg-gray-900/70 rounded-lg p-3 border border-gray-700/50">
          <div className="w-full text-white">
            {getSwapOutput()}
          </div>
          <div className="relative">
            <select 
              value={toToken}
              onChange={(e) => setToToken(e.target.value as 'TokenA' | 'TokenB')}
              className="appearance-none bg-purple-800/30 text-white px-4 py-1 rounded-lg border border-purple-600/30 cursor-pointer outline-none"
            >
              <option value="TokenA">TKA</option>
              <option value="TokenB">TKB</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="mb-4 bg-gray-900/30 rounded-lg p-2 border border-gray-700/30">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Price</span>
          <span className="text-xs text-white">
            1 {getTokenLabel(fromToken)} = {parseFloat(fromToken === 'TokenA' ? priceTokenA : priceTokenB).toFixed(6)} {getTokenLabel(toToken)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {needsApproval ? (
        <button 
          onClick={handleApprove}
          disabled={isApprovePending || isApproveConfirming}
          className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-colors ${
            isApprovePending || isApproveConfirming
              ? 'bg-yellow-700/50 cursor-not-allowed' 
              : 'bg-yellow-600 hover:bg-yellow-700'
          }`}
        >
          {isApprovePending || isApproveConfirming 
            ? 'Approving...' 
            : 'Approve Tokens'}
        </button>
      ) : (
        <button 
          onClick={handleSwap}
          disabled={!canSwap()}
          className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-colors ${
            !canSwap()
              ? 'bg-purple-700/50 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isSwapping || isSwapConfirming 
            ? 'Swapping...' 
            : !fromAmount || parseFloat(fromAmount) <= 0
              ? 'Enter Amount' 
              : 'Swap'}
        </button>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          statusMessage.includes('failed') || statusMessage.includes('Failed')
            ? 'bg-red-900/30 text-red-200 border border-red-700/30' 
            : statusMessage.includes('successfully') 
              ? 'bg-green-900/30 text-green-200 border border-green-700/30'
              : 'bg-gray-800/50 text-gray-300 border border-gray-700/30'
        }`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default SwapComponent;