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
        <div className="flex p-6 gap-6">
            {/* Deposit Escrow */}
            <div className="w-[40%]">
                <DepositEscrow className="h-full" />
            </div>
            
            {/* Agent Configuration */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-[60%] border border-purple-600/70 relative overflow-hidden">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                
                {/* Trading Strategy Section */}
                <div className="mb-8 relative">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <span className="bg-purple-600 w-2 h-6 rounded mr-2"></span>
                        Trading Strategy
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {tradingStrategies.map((strategy) => (
                            <div
                                key={strategy.id}
                                className={`p-3 px-4 rounded-lg border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${
                                    selectedStrategy === strategy.id
                                        ? 'border-purple-600 bg-purple-900/40 shadow-md'
                                        : 'border-purple-600/40 hover:bg-gray-700'
                                }`}
                                onClick={() => setSelectedStrategy(strategy.id)}
                            >
                                <h4 className="font-medium text-center">{strategy.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Level Section */}
                <div className="mb-8 relative">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <span className="bg-purple-600 w-2 h-6 rounded mr-2"></span>
                        Risk Level
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                        {riskLevels.map((level) => (
                            <button
                                key={level.level}
                                onClick={() => setRiskLevel(level.level)}
                                className={`p-4 rounded-lg text-center transition-all ${
                                    riskLevel === level.level
                                        ? 'ring-2 ring-purple-500 bg-purple-900/60 shadow-md transform -translate-y-1'
                                        : 'bg-gray-700/70 hover:bg-gray-700 hover:-translate-y-0.5 transform'
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
                        <span className="bg-purple-600 w-2 h-6 rounded mr-2"></span>
                        Token Allocation
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={tokenAAllocation}
                                    onChange={(e) => handleAllocationChange(e.target.value, setTokenAAllocation)}
                                    placeholder="Number of Token A"
                                    className="bg-gray-700/70 w-full p-3 px-4 border-2 border-purple-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                    min="0"
                                />
                                <div className="absolute right-3 top-3 text-purple-300 pointer-events-none">TKA</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={tokenBAllocation}
                                    onChange={(e) => handleAllocationChange(e.target.value, setTokenBAllocation)}
                                    placeholder="Number of Token B"
                                    className="bg-gray-700/70 w-full p-3 px-4 border-2 border-purple-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                    min="0"
                                />
                                <div className="absolute right-3 top-3 text-purple-300 pointer-events-none">TKB</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agent Status Section */}
                <div className="flex items-center justify-between p-5 bg-gray-700/50 rounded-lg border border-purple-600/20 shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-900/10"></div>
                    <div className="relative">
                        <h3 className="font-semibold text-white">AI Agent Status</h3>
                        <p className="text-sm text-gray-300 mt-1">
                            {isAgentActive ? 'Agent is actively trading' : 'Agent is paused'}
                        </p>
                    </div>
                    <button
                        onClick={handleActivation}
                        disabled={!selectedStrategy || !riskLevel || !isValidAllocation()}
                        className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 ${
                            isAgentActive
                                ? 'bg-gray-900 text-white hover:bg-red-900/80 border border-red-700/30'
                                : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                        {isAgentActive ? 'Pause Agent' : 'Activate Agent'}
                    </button>
                </div>
            </div>
        </div>
    );
}