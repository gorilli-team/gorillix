import { useState } from 'react';

const tradingStrategies = [
    { id: 'liquidity-management', name: 'LIQUIDITY MANAGEMENT'},
    { id: 'swap', name: 'SWAP'}
];

const riskLevels = [
    { level: 1, label: 'Very Conservative', color: 'bg-blue-100' },
    { level: 2, label: 'Conservative', color: 'bg-blue-200' },
    { level: 3, label: 'Moderate', color: 'bg-blue-300' },
    { level: 4, label: 'Aggressive', color: 'bg-blue-400' },
    { level: 5, label: 'Degen', color: 'bg-blue-500' }
];

export default function AiAgentConfiguration() {
    const [selectedStrategy, setSelectedStrategy] = useState('');
    const [riskLevel, setRiskLevel] = useState(0);
    const [tokenAAllocation, setTokenAAllocation] = useState('');
    const [tokenBAllocation, setTokenBAllocation] = useState('');
    const [isAgentActive, setIsAgentActive] = useState(false);
    const [requestedFaucet, setRequestedFaucet] = useState(false);
    const [fundsDeposited, setFundsDeposited] = useState(false);

    const handleActivation = () => {
        if (selectedStrategy && riskLevel && isValidAllocation()) {
            setIsAgentActive(!isAgentActive);
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
        <div className="flex p-4 gap-4">
            <style>
                {`
                    input[type="number"]::-webkit-inner-spin-button,
                    input[type="number"]::-webkit-outer-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                    input[type="number"] {
                        -moz-appearance: textfield;
                    }
                `}
            </style>
            
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 h-fit w-[45%] border border-purple-600">
                <h2 className="text-xl font-bold mb-4">Agent Funding Setup</h2>
                
                <p className="text-sm text-gray-300 mb-4">
                    Before configuring the trading agent, request tokens from the faucet and deposit them to the escrow contract.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Request Tokens</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Request TokenA and TokenB from the faucet to start trading
                        </p>
                        <button
                            onClick={() => setRequestedFaucet(true)}
                            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors
                                ${requestedFaucet 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-purple-600 hover:bg-purple-700'}`}
                        >
                            {requestedFaucet ? 'Tokens Received' : 'Request Tokens'}
                        </button>
                    </div>

                    <div className="p-4 bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Deposit to Escrow</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Deposit your tokens to the agent's escrow contract
                        </p>
                        <button
                            onClick={() => setFundsDeposited(true)}
                            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors
                                ${fundsDeposited 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-purple-600 hover:bg-purple-700'}`}
                            disabled={!requestedFaucet}
                        >
                            {fundsDeposited ? 'Funds Deposited' : 'Deposit Funds'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-[55%] border border-purple-600">        
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Trading Strategy</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {tradingStrategies.map((strategy) => (
                            <div
                                key={strategy.id}
                                className={`p-2 px-4 rounded-lg border-2 cursor-pointer transition-colors ${
                                    selectedStrategy === strategy.id
                                        ? 'border-purple-600 bg-gray-600'
                                        : 'border-purple-600 hover:bg-gray-600'
                                }`}
                                onClick={() => setSelectedStrategy(strategy.id)}
                            >
                                <h4 className="font-medium">{strategy.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Risk Level</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {riskLevels.map((level) => (
                            <button
                                key={level.level}
                                onClick={() => setRiskLevel(level.level)}
                                className={`p-4 rounded-lg text-center transition-colors ${
                                    riskLevel === level.level
                                        ? 'ring-2 ring-purple-500 bg-purple-600'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                <div className="text-lg font-bold">{level.level}</div>
                                <div className="text-sm">{level.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Token Allocation</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="number"
                                    value={tokenAAllocation}
                                    onChange={(e) => handleAllocationChange(e.target.value, setTokenAAllocation)}
                                    placeholder="Number of Token A"
                                    className={`bg-gray-800 border-purple-600 w-full p-2 px-4 border-2 rounded-lg focus:outline-none ${
                                        Number(tokenAAllocation) > 0 ? 'bg-gray-600' : ''
                                    }`}
                                    min="0"
                                />
                            </div>
                            <p className="text-sm text-purple-600">Token A Amount: {Number(tokenAAllocation)}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="number"
                                    value={tokenBAllocation}
                                    onChange={(e) => handleAllocationChange(e.target.value, setTokenBAllocation)}
                                    placeholder="Number of Token B"
                                    className={`bg-gray-800 w-full p-2 px-4 border-purple-600 border-2 rounded-lg focus:outline-none ${
                                        Number(tokenBAllocation) > 0 ? 'bg-gray-600' : ''
                                    }`}
                                    min="0"
                                />
                            </div>
                            <p className="text-sm text-purple-600">Token B Amount: {Number(tokenBAllocation)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                    <div>
                        <h3 className="font-semibold">AI Agent Status</h3>
                        <p className="text-sm text-gray-800">
                            {isAgentActive ? 'Agent is actively trading' : 'Agent is paused'}
                        </p>
                    </div>
                    <button
                        onClick={handleActivation}
                        disabled={!selectedStrategy || !riskLevel || !isValidAllocation()}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            isAgentActive
                                ? 'bg-gray-800 text-white hover:bg-gray-900'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isAgentActive ? 'Pause Agent' : 'Activate Agent'}
                    </button>
                </div>
            </div>

            {isAgentActive && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Configuration</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>Strategy: {tradingStrategies.find(s => s.id === selectedStrategy)?.name}</p>
                                <p>Risk Level: {riskLevels.find(l => l.level === riskLevel)?.label}</p>
                                <p>Token A Amount: {Number(tokenAAllocation)}</p>
                                <p>Token B Amount: {Number(tokenBAllocation)}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Performance</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm text-gray-600 mb-1">Total Trades</h4>
                                    <p className="text-xl font-semibold">0</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm text-gray-600 mb-1">Success Rate</h4>
                                    <p className="text-xl font-semibold">0%</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm text-gray-600 mb-1">Total Profit</h4>
                                    <p className="text-xl font-semibold">$0.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}