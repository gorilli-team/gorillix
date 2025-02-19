import { useState } from 'react';

const tradingStrategies = [
    { id: 'hodl', name: 'HODL'},
    { id: 'buy', name: 'BUY'},
    { id: 'sell', name: 'SELL'}
  ];

const riskLevels = [
  { id: 'conservative', name: 'Conservative' },
  { id: 'moderate', name: 'Moderate' },
  { id: 'aggressive', name: 'Aggressive' }
];

export default function AiAgentConfiguration() {
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [tokenAAllocation, setTokenAAllocation] = useState('');
  const [tokenBAllocation, setTokenBAllocation] = useState('');
  const [isAgentActive, setIsAgentActive] = useState(false);

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
    
    if (isNaN(tokenA) || isNaN(tokenB) || tokenA < 0 || tokenB < 0) {
      return false;
    }
    
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-purple-600">        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Trading Strategy</h3>
          <div className="grid gap-4 md:grid-cols-3">
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
          <div className="grid gap-4 md:grid-cols-3">
            {riskLevels.map((level) => (
              <div
                key={level.id}
                className={`p-2 px-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  riskLevel === level.id
                    ? 'border-purple-600 bg-gray-600'
                    : 'border-purple-600 hover:bg-gray-600'
                }`}
                onClick={() => setRiskLevel(level.id)}
              >
                <h4 className="font-medium">{level.name}</h4>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Fund Allocation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={tokenAAllocation}
                  onChange={(e) => handleAllocationChange(e.target.value, setTokenAAllocation)}
                  placeholder="Token A allocation"
                  className={`bg-gray-800 border-purple-600 w-full p-2 px-4 border-2 rounded-lg focus:outline-none ${
                    Number(tokenAAllocation) > 0 ? 'bg-gray-600' : ''
                  }`}
                  min="0"
                />
                <span className="text-purple-600">%</span>
              </div>
              <p className="text-sm text-purple-600">Token A Allocation: {Number(tokenAAllocation)}%</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={tokenBAllocation}
                  onChange={(e) => handleAllocationChange(e.target.value, setTokenBAllocation)}
                  placeholder="Token B allocation"
                  className={`bg-gray-800 w-full p-2 px-4 border-purple-600 border-2 rounded-lg focus:outline-none ${
                    Number(tokenBAllocation) > 0 ? 'bg-gray-600' : ''
                  }`}
                  min="0"
                />
                <span className="">%</span>
              </div>
              <p className="text-sm">Token B Allocation: {Number(tokenBAllocation)}%</p>
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
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
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
                <p>Risk Level: {riskLevels.find(l => l.id === riskLevel)?.name}</p>
                <p>Token A Allocation: {Number(tokenAAllocation)}%</p>
                <p>Token B Allocation: {Number(tokenBAllocation)}%</p>
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