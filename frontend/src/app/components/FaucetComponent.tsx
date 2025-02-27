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

// Simplified ABI for ERC20 tokens
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

const ABC_CHAIN_ID = 112;

interface FaucetComponentProps {
  onSuccess?: (tokenABalance: string, tokenBBalance: string) => void;
}

const FaucetComponent: React.FC<FaucetComponentProps> = ({ onSuccess }) => {
  const [tokenABalance, setTokenABalance] = useState('0');
  const [tokenBBalance, setTokenBBalance] = useState('0');
  const [statusMessage, setStatusMessage] = useState('');
  const [faucetAbi, setFaucetAbi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wagmi hook for account management
  const { address, isConnected } = useAccount();
  
  // Get current chain ID
  const chainId = useChainId();
  
  // Wagmi hook for switching chains
  const { switchChain } = useSwitchChain();
  
  const isCorrectNetwork = chainId === ABC_CHAIN_ID;

  // Load Faucet ABI
  useEffect(() => {
    const loadFaucetAbi = async () => {
      try {
        const response = await fetch('/abis/faucet.json');
        const abi = await response.json();
        setFaucetAbi(abi);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading faucet ABI:", error);
        setStatusMessage("Error loading ABI. Please refresh the page.");
        setIsLoading(false);
      }
    };

    loadFaucetAbi();
  }, []);

  // Safely convert address to checksum address
  const safeAddress = address ?? '0x0000000000000000000000000000000000000000';

  // Read TokenA Balance
  const { 
    data: tokenABalanceData, 
    refetch: refetchTokenABalance 
  } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_A,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [safeAddress],
    query: {
      enabled: isConnected && isCorrectNetwork && !isLoading
    }
  });

  // Read TokenB Balance
  const { 
    data: tokenBBalanceData, 
    refetch: refetchTokenBBalance 
  } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_B,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [safeAddress],
    query: {
      enabled: isConnected && isCorrectNetwork && !isLoading
    }
  });

  // Read TokenA Decimals
  const { data: tokenADecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_A,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: isConnected && isCorrectNetwork && !isLoading
    }
  });

  // Read TokenB Decimals
  const { data: tokenBDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_B,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: isConnected && isCorrectNetwork && !isLoading
    }
  });

  // Format balances when data changes
  useEffect(() => {
    if (tokenABalanceData && tokenADecimals) {
      const formattedBalance = formatUnits(tokenABalanceData, tokenADecimals);
      setTokenABalance(formattedBalance);
      
      if (formattedBalance !== '0' && tokenBBalance !== '0' && onSuccess) {
        onSuccess(formattedBalance, tokenBBalance);
      }
    }
  }, [tokenABalanceData, tokenADecimals, tokenBBalance, onSuccess]);

  useEffect(() => {
    if (tokenBBalanceData && tokenBDecimals) {
      const formattedBalance = formatUnits(tokenBBalanceData, tokenBDecimals);
      setTokenBBalance(formattedBalance);
      
      if (tokenABalance !== '0' && formattedBalance !== '0' && onSuccess) {
        onSuccess(tokenABalance, formattedBalance);
      }
    }
  }, [tokenBBalanceData, tokenBDecimals, tokenABalance, onSuccess]);

  // Hook to request tokens from faucet
  const { 
    writeContract: requestFaucet, 
    isPending: isRequestingFaucet, 
    data: faucetTxData 
  } = useWriteContract();

  // Hook to wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess 
  } = useWaitForTransactionReceipt({
    hash: faucetTxData,
    query: {
      enabled: !!faucetTxData
    }
  });

  // Callback for transaction success
  useEffect(() => {
    if (isSuccess) {
      setStatusMessage("Tokens received successfully!");
      refetchTokenABalance();
      refetchTokenBBalance();
    }
  }, [isSuccess, refetchTokenABalance, refetchTokenBBalance]);

  const isRequesting = isRequestingFaucet || isConfirming;

  // Function to switch to ABC Testnet
  const switchToABCTestnet = async () => {
    if (!switchChain) {
      setStatusMessage("Cannot switch network. Please use your wallet's network selector.");
      return;
    }
    
    try {
      switchChain({ chainId: ABC_CHAIN_ID });
      setStatusMessage("Switched to ABC Testnet successfully!");
    } catch (error: any) {
      console.error("Error switching network:", error);
      setStatusMessage(`Network switch error: ${error.message}`);
    }
  };

  // Function to request tokens
  const handleRequestTokens = async () => {
    if (!isConnected) {
      setStatusMessage("Please connect your wallet first");
      return;
    }
    
    if (!isCorrectNetwork) {
      setStatusMessage("Please switch to ABC Testnet");
      await switchToABCTestnet();
      return;
    }
    
    try {
      setStatusMessage("Requesting tokens...");
      requestFaucet({
        address: CONTRACT_ADDRESSES.FAUCET,
        abi: faucetAbi,
        functionName: 'requestFaucet',
        args: []
      });
    } catch (error: any) {
      console.error("Error requesting tokens:", error);
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-gray-700">
        <h2 className="text-xl font-bold mb-4">Gorillix Faucet</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-gray-700 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Faucet</h2>
      </div>
      {!isCorrectNetwork && (
        <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg">
          <p>You need to connect to ABC Testnet (Chain ID: 112) to use this faucet.</p>
          <p className="text-sm mt-1">Current network: {chainId}</p>
          <button 
            onClick={switchToABCTestnet}
            className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
          >
            Switch to ABC Testnet
          </button>
        </div>
      )}
      
      {!isConnected ? (
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-2">
            To request tokens, please connect your wallet first.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Use the "Connect Wallet" button in the header.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300 truncate">Wallet: {address}</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="p-2 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">TokenA</p>
                <p className="font-semibold">{tokenABalance}</p>
              </div>
              <div className="p-2 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">TokenB</p>
                <p className="font-semibold">{tokenBBalance}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleRequestTokens}
            disabled={isRequesting || !isCorrectNetwork}
            className={`w-full px-4 py-2 rounded-lg font-medium ${
              isRequesting || !isCorrectNetwork
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isRequesting ? 'Requesting...' : 'Request Tokens'}
          </button>
        </>
      )}
      
      {statusMessage && (
        <div className={`mt-4 p-3 rounded-lg ${
          statusMessage.includes('Error') 
            ? 'bg-red-900/50 text-red-200' 
            : statusMessage.includes('successfully') 
              ? 'bg-green-900/50 text-green-200'
              : 'bg-gray-800 text-gray-300'
        }`}>
          {statusMessage}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        <p>The faucet allows you to obtain free TokenA and TokenB to test the Gorillix DEX platform.</p>
      </div>
    </div>
  );
};

export default FaucetComponent;