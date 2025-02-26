import { useState } from 'react';
import DepositEscrow from './DepositEscrow';

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
            <div>
                <div className='mt-4'><DepositEscrow /></div>
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
                            <input
                                type="number"
                                value={tokenAAllocation}
                                onChange={(e) => handleAllocationChange(e.target.value, setTokenAAllocation)}
                                placeholder="Number of Token A"
                                className="bg-gray-800 border-purple-600 w-full p-2 px-4 border-2 rounded-lg focus:outline-none"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="number"
                                value={tokenBAllocation}
                                onChange={(e) => handleAllocationChange(e.target.value, setTokenBAllocation)}
                                placeholder="Number of Token B"
                                className="bg-gray-800 border-purple-600 w-full p-2 px-4 border-2 rounded-lg focus:outline-none"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                    <div>
                        <h3 className="font-semibold">AI Agent Status</h3>
                        <p className="text-sm text-gray-300">
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
        </div>
    );
}
