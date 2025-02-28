import React, { useState, useEffect, useCallback } from 'react';
import { 
  useAccount, 
  useChainId,
  useSwitchChain,
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { parseUnits, formatUnits, encodeFunctionData } from 'viem';
import { CONTRACT_ADDRESSES } from '../utils/addresses';
import { GelatoRelay, CallWithERC2771Request, TaskState } from '@gelatonetwork/relay-sdk';

// Gelato API key from environment variables
const GELATO_API_KEY = process.env.NEXT_PUBLIC_GELATO_API_KEY || '';

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
  
  // Gelato relay states
  const [isRelaying, setIsRelaying] = useState(false);
  const [relayTaskId, setRelayTaskId] = useState<string | null>(null);
  const [relayTaskStatus, setRelayTaskStatus] = useState<string | null>(null);

  // Wagmi hook for account management
  const { address, isConnected } = useAccount();
  
  // Get current chain ID
  const chainId = useChainId();
  
  // Wagmi hook for switching chains
  const { switchChain } = useSwitchChain();
  
  const isCorrectNetwork = chainId === ABC_CHAIN_ID;
  
  // Log isConnected state
  useEffect(() => {
    console.log('Wallet connection status:', isConnected);
  }, [isConnected]);

  // Log initial connection status when component mounts
  useEffect(() => {
    console.log('Initial wallet connection status:', isConnected);
  }, []);

  // Log address details when connection changes
  useEffect(() => {
    if (isConnected) {
      console.log('Connected wallet address:', address);
    } else {
      console.log('Wallet not connected');
    }
  }, [isConnected, address]);

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

  const isRequesting = isRequestingFaucet || isConfirming || isRelaying;

  // Function to switch to ABC Testnet
  const switchToABCTestnet = useCallback(async () => {
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
  }, [switchChain, setStatusMessage]);

  // Standard function to request tokens (with gas fees)
  const handleRequestTokens = useCallback(async () => {
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
  }, [isConnected, isCorrectNetwork, switchToABCTestnet, faucetAbi, requestFaucet, setStatusMessage]);

  // Check Gelato task status
  const startPollingForTaskStatus = useCallback(async (taskId: string) => {
    const relay = new GelatoRelay();
    
    const checkStatus = async () => {
      try {
        const status = await relay.getTaskStatus(taskId);
        
        if (status && status.taskState) {
          setRelayTaskStatus(status.taskState);
          
          if (status.taskState === TaskState.ExecSuccess) {
            // Transaction completed successfully
            setStatusMessage("Tokens received successfully via Gelato!");
            setIsRelaying(false);
            setRelayTaskId(null);
            setRelayTaskStatus(null);
            
            // Refresh balances
            refetchTokenABalance();
            refetchTokenBBalance();
            return;
          } else if (status.taskState === TaskState.ExecReverted || status.taskState === TaskState.Cancelled) {
            // Transaction failed
            setStatusMessage(`Transaction failed with status: ${status.taskState}`);
            setIsRelaying(false);
            return;
          }
          
          // Continue checking if transaction is still in progress
          setTimeout(checkStatus, 3000);
        } else {
          setStatusMessage('Error getting task status: Status response is empty');
          setIsRelaying(false);
        }
      } catch (error) {
        console.error('Error checking task status:', error);
        setStatusMessage('Error checking transaction status');
        setIsRelaying(false);
      }
    };
    
    // Start polling
    checkStatus();
  }, [setRelayTaskStatus, setStatusMessage, setIsRelaying, setRelayTaskId, refetchTokenABalance, refetchTokenBBalance]);

  // Gasless function to request tokens using Gelato Relay
  const handleGaslessRequestTokens = useCallback(async () => {
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
      setIsRelaying(true);
      setStatusMessage("Requesting tokens via Gelato Relay...");
      
      // Initialize Gelato Relay
      const relay = new GelatoRelay();
      
      // Encode the faucet function call data
      const data = encodeFunctionData({
        abi: faucetAbi,
        functionName: 'requestFaucet',
        args: []
      });

      // Prepare sponsored request
      const sponsoredCallRequest: CallWithERC2771Request = {
        chainId: BigInt(ABC_CHAIN_ID),
        target: CONTRACT_ADDRESSES.FAUCET,
        data: data,
        user: address!,
      };
      
      // Send request to Gelato
      const relayResponse = await relay.sponsoredCall(sponsoredCallRequest, GELATO_API_KEY);
      setRelayTaskId(relayResponse.taskId);
      
      // Poll for transaction status
      startPollingForTaskStatus(relayResponse.taskId);
    } catch (error: any) {
      console.error("Error requesting tokens via Gelato:", error);
      setStatusMessage(`Error: ${error.message}`);
      setIsRelaying(false);
    }
  }, [
    isConnected, 
    isCorrectNetwork, 
    switchToABCTestnet, 
    faucetAbi, 
    address, 
    startPollingForTaskStatus, 
    setIsRelaying, 
    setStatusMessage, 
    setRelayTaskId
  ]);

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
            className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-medium"
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
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleRequestTokens}
              disabled={isRequesting || !isCorrectNetwork}
              className={`px-4 py-2 rounded-lg font-medium ${
                isRequesting || !isCorrectNetwork
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              {isRequestingFaucet || isConfirming ? 'Requesting...' : 'Request Tokens'}
            </button>
            
            <button 
              onClick={handleGaslessRequestTokens}
              disabled={isRequesting || !isCorrectNetwork}
              className={`px-4 py-2 rounded-lg font-medium ${
                isRequesting || !isCorrectNetwork
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              {isRelaying ? 'Requesting...' : 'Gasless Request'}
            </button>
          </div>
        </>
      )}
      
      {/* Task Status for Gelato */}
      {relayTaskId && (
        <div className="mt-4 p-3 rounded-lg text-sm bg-gray-800/50 text-gray-300 border border-gray-700/30">
          <p>Gelato Task ID: {relayTaskId}</p>
          <p>Status: {relayTaskStatus || 'Pending'}</p>
        </div>
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
        <p className="mt-2">
          <span className="text-violet-400">Standard request:</span> Requires gas fees for the transaction.
        </p>
        <p>
          <span className="text-yellow-400">Gasless request:</span> No gas fees required (sponsored by Gelato Relay).
        </p>
      </div>
    </div>
  );
};

export default FaucetComponent;