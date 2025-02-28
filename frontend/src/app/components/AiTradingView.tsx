"use client";
import { useState, useEffect } from 'react';

// Type for agent configuration from localStorage
type AgentConfiguration = {
  selectedStrategy: string;
  riskLevel: number;
  tokenAAllocation: string;
  tokenBAllocation: string;
  isAgentActive: boolean;
};

// Risk level mapping
const riskLevels = [
  { level: 1, label: 'Very Conservative' },
  { level: 2, label: 'Conservative' },
  { level: 3, label: 'Moderate' },
  { level: 4, label: 'Aggressive' },
  { level: 5, label: 'Degen' }
];

// Trading strategy mapping
const tradingStrategies = {
  'liquidity-management': 'LIQUIDITY MANAGEMENT',
  'swap': 'SWAP'
};

// Mock activities for testing panel scrolling and layout
const testActivities = [
  {
    id: '1',
    message: 'Agent initialized with SWAP strategy',
    timestamp: '10:15:20',
    icon: 'ℹ️',
    iconColor: 'text-blue-400',
    details: 'Initialization complete with risk level 3 (Moderate)'
  },
  {
    id: '2',
    message: 'Connected to price feed',
    timestamp: '10:15:25',
    icon: '✅',
    iconColor: 'text-green-400'
  },
  {
    id: '3',
    message: 'Analyzing market conditions',
    timestamp: '10:15:30',
    icon: '⚡',
    iconColor: 'text-violet-400',
    details: 'Scanning liquidity pools and price trends'
  },
  {
    id: '4',
    message: 'Market volatility detected',
    timestamp: '10:15:45',
    icon: '⚠️',
    iconColor: 'text-yellow-400',
    details: 'Current volatility index: 0.72'
  },
  {
    id: '5',
    message: 'Swap transaction prepared',
    timestamp: '10:16:00',
    icon: '⚡',
    iconColor: 'text-violet-400',
    details: 'Preparing to swap 5 TKA for TKB'
  },
  {
    id: '6',
    message: 'Slippage calculation completed',
    timestamp: '10:16:05',
    icon: '✅',
    iconColor: 'text-green-400',
    details: 'Expected slippage: 0.15%'
  },
  {
    id: '7',
    message: 'Swap transaction submitted',
    timestamp: '10:16:10',
    icon: '⚡',
    iconColor: 'text-violet-400',
    details: 'Transaction hash: 0x8a7fe85c...3d2b'
  },
  {
    id: '8',
    message: 'Transaction pending',
    timestamp: '10:16:15',
    icon: '⚡',
    iconColor: 'text-violet-400'
  },
  {
    id: '9',
    message: 'Transaction completed',
    timestamp: '10:16:30',
    icon: '✅',
    iconColor: 'text-green-400',
    details: 'Received 25.032 TKB for 5 TKA'
  },
  {
    id: '10',
    message: 'Updated portfolio balance',
    timestamp: '10:16:35',
    icon: 'ℹ️',
    iconColor: 'text-blue-400',
    details: 'New balances: 15 TKA, 55.032 TKB'
  },
  {
    id: '11',
    message: 'Monitoring price movements',
    timestamp: '10:17:00',
    icon: '⚡',
    iconColor: 'text-violet-400',
    details: 'TKA: +0.3%, TKB: -0.1% (last 5 minutes)'
  },
  {
    id: '12',
    message: 'Price alert triggered',
    timestamp: '10:20:15',
    icon: '⚠️',
    iconColor: 'text-yellow-400',
    details: 'TKB price dropped by 1.2% in the last 3 minutes'
  },
  {
    id: '13',
    message: 'Swap opportunity identified',
    timestamp: '10:21:00',
    icon: '✅',
    iconColor: 'text-green-400',
    details: 'Favorable conditions to swap TKB back to TKA'
  },
  {
    id: '14',
    message: 'Preparing reverse swap',
    timestamp: '10:21:10',
    icon: '⚡',
    iconColor: 'text-violet-400',
    details: 'Planning to swap 20 TKB for TKA'
  },
  {
    id: '15',
    message: 'Swap transaction submitted',
    timestamp: '10:21:20',
    icon: '⚡',
    iconColor: 'text-violet-400',
    details: 'Transaction hash: 0x7b6fe92d...4e3c'
  },
  {
    id: '16',
    message: 'Transaction failed',
    timestamp: '10:21:30',
    icon: '❌',
    iconColor: 'text-red-400',
    details: 'Error: Insufficient gas provided'
  },
  {
    id: '17',
    message: 'Retrying with higher gas',
    timestamp: '10:21:40',
    icon: '⚡',
    iconColor: 'text-violet-400',
    details: 'Increasing gas limit by 20%'
  },
  {
    id: '18',
    message: 'Transaction submitted',
    timestamp: '10:21:45',
    icon: '⚡',
    iconColor: 'text-violet-400',
    details: 'Transaction hash: 0x9c5de23f...8a7b'
  },
  {
    id: '19',
    message: 'Transaction completed',
    timestamp: '10:22:00',
    icon: '✅',
    iconColor: 'text-green-400',
    details: 'Received 4.05 TKA for 20 TKB'
  },
  {
    id: '20',
    message: 'Updated portfolio balance',
    timestamp: '10:22:05',
    icon: 'ℹ️',
    iconColor: 'text-blue-400',
    details: 'New balances: 19.05 TKA, 35.032 TKB'
  }
];

export default function AITradingView() {
  const [activities, setActivities] = useState(testActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [agentStats, setAgentStats] = useState({
    tokenAAllocation: '19.05',
    tokenBAllocation: '35.032',
    riskLevel: 'Moderate (3)',
    strategy: 'SWAP',
    status: 'Active'
  });

  // Load agent configuration from localStorage
  useEffect(() => {
    const loadAgentConfig = () => {
      try {
        const STORAGE_KEY = 'agent_configuration';
        const savedConfig = localStorage.getItem(STORAGE_KEY);
        
        if (savedConfig) {
          const config: AgentConfiguration = JSON.parse(savedConfig);
          
          // Get the risk level label
          let riskLevelLabel = 'Not set';
          const riskLevelInfo = riskLevels.find(r => r.level === config.riskLevel);
          if (riskLevelInfo) {
            riskLevelLabel = `${riskLevelInfo.label} (${config.riskLevel})`;
          }
          
          // Get the strategy name
          const strategyName = config.selectedStrategy ? 
            (tradingStrategies[config.selectedStrategy as keyof typeof tradingStrategies] || 'Unknown') : 
            'Not set';
          
          // Format the token allocations
          const tokenAAllocation = config.tokenAAllocation ? 
            parseFloat(config.tokenAAllocation).toLocaleString('en-US', { maximumFractionDigits: 2 }) : 
            '0';
          
          const tokenBAllocation = config.tokenBAllocation ? 
            parseFloat(config.tokenBAllocation).toLocaleString('en-US', { maximumFractionDigits: 2 }) : 
            '0';
          
          // Get status from isAgentActive
          const status = config.isAgentActive ? 'Active' : 'Inactive';
          
          setAgentStats({
            tokenAAllocation,
            tokenBAllocation,
            riskLevel: riskLevelLabel,
            strategy: strategyName,
            status
          });
        }
      } catch (error) {
        console.error('Error loading configuration from localStorage:', error);
      }
    };

    // Usiamo i dati di test invece di caricare dalla localStorage
    // loadAgentConfig();
    setIsLoading(false);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Trading Performance</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Info */}
        <div className="bg-gray-800 rounded-xl border border-violet-600/30 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-violet-900/30 to-gray-800 p-4 border-b border-violet-600/20">
            <h3 className="font-semibold text-lg flex items-center">
              <span className="bg-violet-600 w-2 h-6 rounded mr-2"></span>
              Agent Overview
            </h3>
          </div>
          
          <div className="p-5">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Status</span>
                  <div className={`bg-gray-700/50 border border-violet-500/20 rounded-lg px-3 py-1 text-sm ${agentStats.status === 'Active' ? '' : 'border-red-500/20'}`}>
                    <span className={`mr-2 inline-block w-2 h-2 rounded-full ${agentStats.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {agentStats.status === 'Active' ? 'Agent Online' : 'Agent Offline'}
                  </div>
                </div>
                {agentStats.status === 'Active' && (
                  <>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Strategy</span>
                      <span className="font-medium text-white">{agentStats.strategy}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Risk Level</span>
                      <span className="font-medium text-white">{agentStats.riskLevel}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Token A Allocation</span>
                      <span className="font-medium text-white">{agentStats.tokenAAllocation} TKA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token B Allocation</span>
                      <span className="font-medium text-white">{agentStats.tokenBAllocation} TKB</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Agent Activities */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-violet-600/30 shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-violet-900/30 to-gray-800 border-b border-violet-600/20">
            <div className="p-4">
              <h3 className="font-semibold text-lg flex items-center">
                <span className="bg-violet-600 w-2 h-6 rounded mr-2"></span>
                Agent Activity Log
              </h3>
            </div>
          </div>
          
          <div className="p-4 flex-grow overflow-auto max-h-[450px]">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="border-b border-gray-700 pb-4">
                    <div className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-gray-700 mr-3 mt-1"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded w-4/5 mb-3"></div>
                        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                      </div>
                      <div className="h-3 bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-start">
                      <div className={`mr-3 mt-0.5 flex-shrink-0 text-lg ${activity.iconColor}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{activity.message}</p>
                        {activity.details && (
                          <p className="text-sm text-gray-400 mt-1">{activity.details}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{activity.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                <div className="text-4xl mb-3 opacity-30">🔍</div>
                <p>No activities found</p>
                <p className="text-sm mt-1">Activities will appear here when the agent starts working</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}