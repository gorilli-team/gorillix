import { useState } from 'react';

const tradingStrategies = [
  { id: 'arbitrage', name: 'Arbitrage', description: 'Identify and exploit price differences between markets' },
  { id: 'momentum', name: 'Momentum', description: 'Follow market trends and capitalize on price movements' },
  { id: 'liquidity', name: 'Liquidity Provision', description: 'Optimize liquidity provision based on market conditions' }
];

const riskLevels = [
  { id: 'conservative', name: 'Conservative', maxAllocation: 20 },
  { id: 'moderate', name: 'Moderate', maxAllocation: 50 },
  { id: 'aggressive', name: 'Aggressive', maxAllocation: 80 }
];

export default function AiAgentConfiguration() {
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [allocation, setAllocation] = useState('');
  const [isAgentActive, setIsAgentActive] = useState(false);

  const handleActivation = () => {
    if (selectedStrategy && riskLevel && allocation) {
      setIsAgentActive(!isAgentActive);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Trading Strategy</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {tradingStrategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedStrategy === strategy.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <h4 className="font-medium mb-2">{strategy.name}</h4>
                <p className="text-sm text-gray-600">{strategy.description}</p>
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
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  riskLevel === level.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setRiskLevel(level.id)}
              >
                <h4 className="font-medium mb-2">{level.name}</h4>
                <p className="text-sm text-gray-600">Max Allocation: {level.maxAllocation}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Fund Allocation</h3>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
              placeholder="Enter allocation percentage"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              max={riskLevel ? riskLevels.find(l => l.id === riskLevel)?.maxAllocation : 100}
            />
            <span className="text-gray-600">%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold">AI Agent Status</h3>
            <p className="text-sm text-gray-600">
              {isAgentActive ? 'Agent is actively trading' : 'Agent is paused'}
            </p>
          </div>
          <button
            onClick={handleActivation}
            disabled={!selectedStrategy || !riskLevel || !allocation}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isAgentActive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isAgentActive ? 'Pause Agent' : 'Activate Agent'}
          </button>
        </div>
      </div>

      {isAgentActive && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Agent Performance</h2>
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
      )}
    </div>
  );
}