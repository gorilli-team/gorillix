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

// Simplified ERC20 ABI for token interactions
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
  }
] as const;

// Escrow ABI for deposit function
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

// Chain ID for ABC Testnet
const ABC_CHAIN_ID = 112;

// Props interface
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

  // Handle approval success
  useEffect(() => {
    if (isApprovalSuccess) {
      setStatusMessage("Approval completed successfully. You can now deposit.");
      setApprovalNeeded(false);
      setApprovalPending(false);
    }
  }, [isApprovalSuccess]);

  // Handle deposit success
  useEffect(() => {
    if (isDepositSuccess) {
      setStatusMessage("Deposit completed successfully!");
      setDepositAmount('');
      
      // Call optional onDepositSuccess callback
      onDepositSuccess?.();
    }
  }, [isDepositSuccess, onDepositSuccess]);

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
      const decimals = selectedToken === 'TokenA' ? tokenADecimals : tokenBDecimals;
      const amount = parseUnits(depositAmount, decimals);

      approveToken({
        address: selectedTokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.ESCROW, amount]
      });
      
      setApprovalPending(true);
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

      depositToEscrow({
        address: CONTRACT_ADDRESSES.ESCROW,
        abi: ESCROW_ABI,
        functionName: 'deposit',
        args: [selectedTokenAddress, amount]
      });
    } catch (error: any) {
      console.error('Deposit error:', error);
      setStatusMessage(`Deposit failed: ${error.message}`);
    }
  };

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
    <div className={`p-4 rounded-xl bg-gray-700 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Deposit to Escrow</h2>

      {/* Token Selection */}
      <div className="mb-4 bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Select Token</span>
          <span className="text-sm text-gray-400">
            Balance: {selectedToken === 'TokenA' ? tokenABalance : tokenBBalance}
          </span>
        </div>
        <div className="flex">
          <select 
            value={selectedToken}
            onChange={(e) => {
              setSelectedToken(e.target.value as 'TokenA' | 'TokenB');
              setApprovalNeeded(false);
            }}
            className="w-full bg-gray-700 rounded-lg p-2 text-white"
          >
            <option value="TokenA">TKA</option>
            <option value="TokenB">TKB</option>
          </select>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-4 bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Amount</span>
          <button 
            onClick={handleSetMaxAmount} 
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Max
          </button>
        </div>
        <div className="flex">
          <input 
            type="number" 
            value={depositAmount}
            onChange={(e) => {
              setDepositAmount(e.target.value);
              setApprovalNeeded(false);
            }}
            placeholder="0"
            className="w-full bg-gray-700 rounded-lg p-2 text-white"
          />
        </div>
      </div>

      {/* Approve Button (conditional) */}
      {(approvalNeeded || approvalPending) && (
        <button 
          onClick={handleApprove}
          disabled={!isValidAmount() || isApproving || isApprovalConfirming}
          className={`w-full px-4 py-2 mb-2 rounded-lg font-medium ${
            !isValidAmount() || isApproving || isApprovalConfirming
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-yellow-600 hover:bg-yellow-700'
          }`}
        >
          {isApproving || isApprovalConfirming 
            ? 'Approving...' 
            : 'Approve'}
        </button>
      )}

      {/* Deposit Button */}
      <button 
        onClick={() => {
          if (!approvalNeeded && !approvalPending) {
            handleDeposit();
          } else {
            setApprovalNeeded(true);
          }
        }}
        disabled={!isValidAmount() || isDepositing || isDepositConfirming || isApproving || isApprovalConfirming}
        className={`w-full px-4 py-2 rounded-lg font-medium ${
          !isValidAmount() || isDepositing || isDepositConfirming || isApproving || isApprovalConfirming
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {isDepositing || isDepositConfirming 
          ? 'Depositing...' 
          : !isValidAmount() 
            ? 'Enter Valid Amount' 
            : approvalNeeded && !approvalPending
            ? 'Approve Token'
            : 'Deposit'}
      </button>

      {/* Status Message */}
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
  );
};

export default DepositEscrow;