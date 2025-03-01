import { useState, useEffect } from 'react';
import DepositEscrow from './DepositEscrow';
import axios from 'axios';
import { useAccount } from "wagmi";

const tradingStrategies = [
    { id: 'liquidity-management', name: 'LIQUIDITY MANAGEMENT'},
    { id: 'swap', name: 'SWAP'}
];

const riskLevels = [
    { level: 1, label: 'Very Conservative', id: 'very-conservative', color: 'bg-blue-100' },
    { level: 2, label: 'Conservative', id: 'conservative', color: 'bg-blue-200' },
    { level: 3, label: 'Moderate', id: 'moderate', color: 'bg-blue-300' },
    { level: 4, label: 'Aggressive', id: 'aggressive', color: 'bg-blue-400' },
    { level: 5, label: 'Degen', id: 'degen', color: 'bg-blue-500' }
];
const STORAGE_KEY = 'agent_configuration';

export default function AiAgentConfiguration() {
    const { address } = useAccount();
    
    const [selectedStrategy, setSelectedStrategy] = useState('');
    const [riskLevel, setRiskLevel] = useState(0);
    const [tokenAAllocation, setTokenAAllocation] = useState('');
    const [tokenBAllocation, setTokenBAllocation] = useState('');
    const [isAgentActive, setIsAgentActive] = useState(false);
    const [fundsDeposited, setFundsDeposited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        loadSavedConfiguration();
    }, []);

    useEffect(() => {
        if (address) {
            console.log("Connected wallet:", address);
        }
    }, [address]);
    useEffect(() => {
        saveConfiguration();
    }, [selectedStrategy, riskLevel, tokenAAllocation, tokenBAllocation, isAgentActive]);


    const loadSavedConfiguration = () => {
        try {
            const savedConfig = localStorage.getItem(STORAGE_KEY);
            
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                
                // Apply saved configuration to state
                setSelectedStrategy(config.selectedStrategy || '');
                setRiskLevel(config.riskLevel || 0);
                setTokenAAllocation(config.tokenAAllocation || '');
                setTokenBAllocation(config.tokenBAllocation || '');
                setIsAgentActive(config.isAgentActive || false);
                
                console.log('Configuration loaded from localStorage:', config);
            }
        } catch (error) {
            console.error('Error loading configuration from localStorage:', error);
        }
    };


    const saveConfiguration = () => {
        try {
            // Only save if at least one setting has been selected
            if (selectedStrategy || riskLevel > 0 || tokenAAllocation || tokenBAllocation) {
                const configToSave = {
                    selectedStrategy,
                    riskLevel,
                    tokenAAllocation,
                    tokenBAllocation,
                    isAgentActive
                };
                
                localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
                console.log('Configuration saved to localStorage:', configToSave);
            }
        } catch (error) {
            console.error('Error saving configuration to localStorage:', error);
        }
    };

    // Function to get risk level info based on numeric level
    const getRiskLevelInfo = (level: number) => {
        return riskLevels.find(r => r.level === level) || { id: '', label: '', level: 0, color: '' };
    };

    const handleActivation = async () => {
        if (selectedStrategy && riskLevel && isValidAllocation()) {
            try {
                setIsLoading(true);
                
                // Get complete information of the current risk level
                const riskInfo = getRiskLevelInfo(riskLevel);

                const agentConfigData = {
                    tradingStrategy: selectedStrategy,
                    riskLevel: riskInfo.id,
                    tkaAllocation: Number(tokenAAllocation),
                    tkbAllocation: Number(tokenBAllocation),
                    isActive: !isAgentActive,
                    walletAddress: address
                };
                
                console.log('Sending agent configuration to backend:', agentConfigData);
                
                // Make API call to create/update agent configuration
                const response = await axios.post('http://localhost:5001/api/agent/config', agentConfigData);
                
                if (response.data.success) {
                    // Update state only if the call was successful
                    setIsAgentActive(!isAgentActive);
                    console.log('Agent configuration saved successfully:', response.data);
                    
                    // You could add a notification here (toast/alert) to inform the user
                    // Example: toast.success('Agent configuration saved successfully');
                } else {
                    console.error('Failed to save agent configuration:', response.data.message);
                    // Example: toast.error('Failed to save agent configuration');
                }
            } catch (error) {
                console.error('Error saving agent configuration:', error);
                
                // Handle specific error cases
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        // Handle unauthorized error
                        console.error('User not authenticated. Please login again.');
                        // Example: toast.error('Session expired. Please login again.');
                    } else if (error.response?.status === 400) {
                        // Handle validation errors
                        console.error('Invalid configuration data:', error.response.data);
                        // Example: toast.error('Please check your configuration data.');
                    } else {
                        // Handle other API errors
                        console.error('Server error. Please try again later.');
                        // Example: toast.error('Server error. Please try again later.');
                    }
                } else {
                    // Handle network or other non-API errors
                    console.error('Network error. Please check your connection.');
                    // Example: toast.error('Network error. Please check your connection.');
                }
            } finally {
                setIsLoading(false);
            }
        }
    };


    const handleAllocationChange = (value: string, setter: (value: string) => void) => {
        const numValue = Math.max(0, Number(value));
        setter(numValue.toString());
    };


    const isValidAllocation = () => {
        const tokenA = Number(tokenAAllocation);
        const tokenB = Number(tokenBAllocation);
        
        if (isNaN(tokenA) || isNaN(tokenB) || tokenA <= 0 || tokenB <= 0) {
            return false;
        }
        
        return true;
    };

    return (
        <div className="flex p-6 gap-6">
            {/* Deposit Escrow */}
            <div className="w-[40%]">
                <DepositEscrow className="h-full" />
            </div>
            
            {/* Agent Configuration */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-[60%] border border-violet-600/70 relative overflow-hidden">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-64 h-64 violet-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                
                {/* Trading Strategy Section */}
                <div className="mb-8 relative">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <span className="bg-violet-600 w-2 h-6 rounded mr-2"></span>
                        Trading Strategy
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {tradingStrategies.map((strategy) => (
                            <div
                                key={strategy.id}
                                className={`p-3 px-4 rounded-lg border-2 transition-all transform ${
                                    selectedStrategy === strategy.id
                                        ? 'border-violet-600 bg-violet-900/40 shadow-md'
                                        : 'border-violet-600/40 hover:bg-gray-700'
                                } ${
                                    isAgentActive 
                                        ? 'opacity-70 cursor-not-allowed' 
                                        : 'cursor-pointer hover:-translate-y-0.5'
                                }`}
                                onClick={() => {
                                    if (!isAgentActive) {
                                        setSelectedStrategy(strategy.id);
                                    }
                                }}
                            >
                                <h4 className="font-medium text-center">{strategy.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Level Section */}
                <div className="mb-8 relative">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <span className="bg-violet-600 w-2 h-6 rounded mr-2"></span>
                        Risk Level
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                        {riskLevels.map((level) => (
                            <button
                                key={level.level}
                                onClick={() => {
                                    if (!isAgentActive) {
                                        setRiskLevel(level.level);
                                    }
                                }}
                                disabled={isAgentActive}
                                className={`p-4 rounded-lg text-center transition-all ${
                                    riskLevel === level.level
                                        ? 'ring-2 ring-violet-500 bg-violet-900/60 shadow-md transform -translate-y-1'
                                        : 'bg-gray-700/70 hover:bg-gray-700 hover:-translate-y-0.5 transform'
                                } ${
                                    isAgentActive
                                        ? 'opacity-70 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                <div className="text-lg font-bold mb-1">{level.level}</div>
                                <div className="text-sm opacity-90">{level.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Token Allocation Section */}
                <div className="mb-8 relative">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <span className="bg-violet-600 w-2 h-6 rounded mr-2"></span>
                        Token Allocation
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={tokenAAllocation}
                                    onChange={(e) => {
                                        if (!isAgentActive) {
                                            handleAllocationChange(e.target.value, setTokenAAllocation);
                                        }
                                    }}
                                    placeholder="Number of Token A"
                                    className={`bg-gray-700/70 w-full p-3 px-4 border-2 border-violet-600/40 rounded-lg transition-all ${
                                        isAgentActive 
                                            ? 'opacity-70 cursor-not-allowed'
                                            : 'focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent'
                                    }`}
                                    min="0"
                                    disabled={isAgentActive}
                                />
                                <div className="absolute right-3 top-3 text-violet-300 pointer-events-none">TKA</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={tokenBAllocation}
                                    onChange={(e) => {
                                        if (!isAgentActive) {
                                            handleAllocationChange(e.target.value, setTokenBAllocation);
                                        }
                                    }}
                                    placeholder="Number of Token B"
                                    className={`bg-gray-700/70 w-full p-3 px-4 border-2 border-violet-600/40 rounded-lg transition-all ${
                                        isAgentActive 
                                            ? 'opacity-70 cursor-not-allowed'
                                            : 'focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent'
                                    }`}
                                    min="0"
                                    disabled={isAgentActive}
                                />
                                <div className="absolute right-3 top-3 text-violet-300 pointer-events-none">TKB</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agent Status Section */}
                <div className="flex items-center justify-between p-5 bg-gray-700/50 rounded-lg border border-violet-600/20 shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-violet-900/10"></div>
                    <div className="relative">
                        <h3 className="font-semibold text-white">AI Agent Status</h3>
                        <p className="text-sm text-gray-300 mt-1">
                            {isAgentActive ? 'Agent is actively trading' : 'Agent is paused'}
                        </p>
                        {isAgentActive && (
                            <p className="text-xs text-amber-300 mt-1">
                                To modify settings, pause the agent first
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleActivation}
                        disabled={!selectedStrategy || !riskLevel || !isValidAllocation() || isLoading}
                        className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 ${
                            isAgentActive
                                ? 'bg-gray-900 text-white hover:bg-red-900/80 border border-red-700/30'
                                : 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isAgentActive ? 'Pausing...' : 'Activating...'}
                            </span>
                        ) : (
                            isAgentActive ? 'Pause Agent' : 'Activate Agent'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}