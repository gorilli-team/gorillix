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

const ESCROW_ABI = [
  {
    "type": "function",
    "name": "deposit",
    "stateMutability": "nonpayable",
    "inputs": [
      {"name": "_token", "type": "address"},
      {"name": "_amount", "type": "uint256"}
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "i_tokenA",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{"type": "address"}]
  },
  {
    "type": "function",
    "name": "i_tokenB",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{"type": "address"}]
  }
] as const;

const ABC_CHAIN_ID = 112;

const MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

interface DepositEscrowProps {
  className?: string;
  onDepositSuccess?: () => void;
}

const DepositEscrow: React.FC<DepositEscrowProps> = ({ 
  className = '', 
  onDepositSuccess 
}) => {
  // State for deposit
  const [selectedToken, setSelectedToken] = useState<'TokenA' | 'TokenB'>('TokenA');
  const [depositAmount, setDepositAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [approvalNeeded, setApprovalNeeded] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);

  // Wallet and network state
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Token balances and decimals
  const [tokenABalance, setTokenABalance] = useState('0');
  const [tokenBBalance, setTokenBBalance] = useState('0');
  const [tokenADecimals, setTokenADecimals] = useState(18);
  const [tokenBDecimals, setTokenBDecimals] = useState(18);

  // Get token addresses from escrow contract
  const { data: tokenAAddress } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'i_tokenA',
    query: { enabled: isConnected }
  });

  const { data: tokenBAddress } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'i_tokenB',
    query: { enabled: isConnected }
  });

  // Selected token address
  const selectedTokenAddress = selectedToken === 'TokenA' 
    ? tokenAAddress ?? CONTRACT_ADDRESSES.TOKEN_A
    : tokenBAddress ?? CONTRACT_ADDRESSES.TOKEN_B;

  // Read Token A balance
  const { data: tokenABalanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_A,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected }
  });

  // Read Token B balance
  const { data: tokenBBalanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_B,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: isConnected }
  });

  // Read Token A decimals
  const { data: tokenADecimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_A,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: isConnected }
  });

  // Read Token B decimals
  const { data: tokenBDecimalsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_B,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: isConnected }
  });

  // Read current token allowance for escrow contract
  const { data: tokenAllowance, refetch: refetchAllowance } = useReadContract({
    address: selectedTokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address ?? '0x0000000000000000000000000000000000000000', CONTRACT_ADDRESSES.ESCROW],
    query: { enabled: isConnected && !!address }
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

  // Check if approval is needed when amount or token changes
  useEffect(() => {
    const checkApprovalNeeded = async () => {
      if (isConnected && depositAmount && parseFloat(depositAmount) > 0 && tokenAllowance !== undefined) {
        const decimals = selectedToken === 'TokenA' ? tokenADecimals : tokenBDecimals;
        try {
          const amount = parseUnits(depositAmount, decimals);
          
          // Check if current allowance is less than the deposit amount
          if (tokenAllowance < amount) {
            setApprovalNeeded(true);
          } else {
            setApprovalNeeded(false);
          }
        } catch (error) {
          console.error("Error parsing amount:", error);
        }
      }
    };
    
    checkApprovalNeeded();
  }, [depositAmount, selectedToken, tokenAllowance, isConnected, tokenADecimals, tokenBDecimals]);

  // Approve token spending for escrow
  const { 
    writeContract: approveToken, 
    isPending: isApproving,
    data: approvalTxData
  } = useWriteContract();

  // Wait for approval transaction
  const { 
    isLoading: isApprovalConfirming, 
    isSuccess: isApprovalSuccess 
  } = useWaitForTransactionReceipt({
    hash: approvalTxData,
    query: { enabled: !!approvalTxData }
  });

  // Deposit tokens to escrow
  const { 
    writeContract: depositToEscrow, 
    isPending: isDepositing, 
    data: depositTxData 
  } = useWriteContract();

  // Wait for deposit transaction
  const { 
    isLoading: isDepositConfirming, 
    isSuccess: isDepositSuccess 
  } = useWaitForTransactionReceipt({
    hash: depositTxData,
    query: { enabled: !!depositTxData }
  });

  // Handle approve token
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
      // Approve maximum amount to avoid repeated approvals
      approveToken({
        address: selectedTokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.ESCROW, MAX_UINT256],
        gas: BigInt("500000")
      });
      
      setApprovalPending(true);
      setStatusMessage('Approval transaction initiated. Please confirm in your wallet...');
    } catch (error: any) {
      console.error('Approval error:', error);
      setStatusMessage(`Approval failed: ${error.message}`);
    }
  };

  // Handle deposit
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

    try {
      const decimals = selectedToken === 'TokenA' ? tokenADecimals : tokenBDecimals;
      const amount = parseUnits(depositAmount, decimals);
      
      // Check if allowance is sufficient
      if (tokenAllowance && tokenAllowance < amount) {
        setStatusMessage("Token approval required before deposit");
        setApprovalNeeded(true);
        return;
      }
      
      depositToEscrow({
        address: CONTRACT_ADDRESSES.ESCROW,
        abi: ESCROW_ABI,
        functionName: 'deposit',
        args: [selectedTokenAddress, amount],
        gas: BigInt(700000),
      });
      
      setStatusMessage('Deposit transaction initiated. Please confirm in your wallet...');
    } catch (error: any) {
      console.error('Deposit error:', error);
      setStatusMessage(`Deposit failed: ${error.message}`);
    }
  };

  // Handle approval success
  useEffect(() => {
    if (isApprovalSuccess) {
      setStatusMessage("Approval completed successfully. You can now deposit.");
      setApprovalNeeded(false);
      setApprovalPending(false);
      // Update allowance after approval
      refetchAllowance();
    }
  }, [isApprovalSuccess, refetchAllowance]);

  // Handle deposit success
  useEffect(() => {
    if (isDepositSuccess) {
      setStatusMessage("Deposit completed successfully!");
      setDepositAmount('');
      
      // Call optional onDepositSuccess callback
      onDepositSuccess?.();
    }
  }, [isDepositSuccess, onDepositSuccess]);

  // Check if amount is valid
  const isValidAmount = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return false;
    
    const balance = selectedToken === 'TokenA' ? parseFloat(tokenABalance) : parseFloat(tokenBBalance);
    return parseFloat(depositAmount) <= balance;
  };

  // Set max amount
  const handleSetMaxAmount = () => {
    if (selectedToken === 'TokenA') {
      setDepositAmount(tokenABalance);
    } else {
      setDepositAmount(tokenBBalance);
    }
  };

  return (
    <div className={`p-6 rounded-xl bg-gray-800 border border-violet-600/40 shadow-lg ${className}`}>
      <h2 className="text-xl font-bold mb-6 text-white flex items-center">
        <span className="bg-violet-600 w-2 h-6 rounded mr-2"></span>
        Deposit to Escrow
      </h2>

      {/* Token Selection */}
      <div className="mb-4 bg-gray-700/50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-violet-300 font-medium">Select Token</span>
          <span className="text-sm text-gray-300">
            Balance: <span className="text-white font-medium">{selectedToken === 'TokenA' ? tokenABalance : tokenBBalance}</span>
          </span>
        </div>
        <div className="relative">
          <select 
            value={selectedToken}
            onChange={(e) => {
              setSelectedToken(e.target.value as 'TokenA' | 'TokenB');
              setApprovalNeeded(false);
              setTimeout(() => refetchAllowance(), 500);
            }}
            className="w-full bg-gray-800 rounded-lg p-3 text-white border border-violet-500/30 appearance-none focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
          >
            <option value="TokenA">TKA</option>
            <option value="TokenB">TKB</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6 bg-gray-700/50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-violet-300 font-medium">Amount</span>
          <button 
            onClick={handleSetMaxAmount} 
            className="text-sm text-violet-400 hover:text-violet-300 font-medium px-2 py-1 bg-violet-800/30 rounded transition-colors"
          >
            Max
          </button>
        </div>
        <div className="relative">
          <input 
            type="number" 
            value={depositAmount}
            onChange={(e) => {
              setDepositAmount(e.target.value);
            }}
            placeholder="0"
            className="w-full bg-gray-800 rounded-lg p-3 text-white border border-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Approve Button */}
      {approvalNeeded && (
        <button 
          onClick={handleApprove}
          disabled={!isValidAmount() || isApproving || isApprovalConfirming}
          className={`w-full px-4 py-3 mb-3 rounded-lg font-medium transition-all transform ${
            !isValidAmount() || isApproving || isApprovalConfirming
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-yellow-600 hover:bg-yellow-700 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {isApproving || isApprovalConfirming 
            ? 'Approving...' 
            : 'Approve Token'}
        </button>
      )}

      {/* Deposit Button */}
      <button 
        onClick={() => {
          if (approvalNeeded && !approvalPending && !isApproving && !isApprovalConfirming) {
            setStatusMessage("You need to approve the token first");
          } else if (!approvalNeeded && !approvalPending) {
            handleDeposit();
          }
        }}
        disabled={!isValidAmount() || isDepositing || isDepositConfirming || isApproving || isApprovalConfirming || (approvalNeeded && !isApprovalSuccess)}
        className={`w-full px-4 py-3 rounded-lg font-medium transition-all transform ${
          !isValidAmount() || isDepositing || isDepositConfirming || isApproving || isApprovalConfirming || (approvalNeeded && !isApprovalSuccess)
            ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
            : 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-lg hover:-translate-y-0.5'
        }`}
      >
        {isDepositing || isDepositConfirming 
          ? 'Depositing...' 
          : !isValidAmount() 
            ? 'Enter Valid Amount' 
            : (approvalNeeded && !isApprovalSuccess)
              ? 'Approve Before Deposit'
              : 'Deposit'}
      </button>

      {/* Status Message */}
      {statusMessage && (
        <div className={`mt-4 p-3 rounded-lg ${
          statusMessage.includes('failed') || statusMessage.includes('Failed')
            ? 'bg-red-900/50 text-red-200 border border-red-700/30' 
            : statusMessage.includes('successfully') 
              ? 'bg-green-900/50 text-green-200 border border-green-700/30'
              : 'bg-gray-800 text-gray-300 border border-gray-700'
        }`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default DepositEscrow;