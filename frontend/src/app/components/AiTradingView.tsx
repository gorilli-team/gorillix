"use client";
import { useState, useEffect } from 'react';

// Type for agent activities
type AgentActivity = {
  id: string;
  timestamp: Date;
  type: 'info' | 'action' | 'warning' | 'success' | 'error';
  message: string;
  details?: string;
};

// Type for agent responses from backend
type AgentResponse = {
  _id: string;
  response: string;
  createdAt: string;
};

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

export default function AITradingView() {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [agentStats, setAgentStats] = useState({
    tokenAAllocation: '0',
    tokenBAllocation: '0',
    riskLevel: 'Not set',
    strategy: 'Not set',
    status: 'Inactive'
  });

  // Storage key
  const STORAGE_KEY = 'agent_configuration';

  // Load agent configuration from localStorage
  const loadAgentConfig = () => {
    try {
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
        
        setIsConnected(config.isAgentActive);
        return config.isAgentActive;
      }
      return false;
    } catch (error) {
      console.error('Error loading configuration from localStorage:', error);
      return false;
    }
  };

  // Fetch agent responses from backend
  const fetchAgentResponses = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/agent/responses');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        // Transform backend responses to AgentActivity format
        const transformedActivities = data.data.map((item: AgentResponse) => ({
          id: item._id,
          timestamp: new Date(item.createdAt),
          type: 'info', // Default type as 'info' - could be enhanced with parsing logic if needed
          message: item.response,
          details: '' // No details in the backend response
        }));
        
        // Sort by timestamp (newest first)
        transformedActivities.sort((a: AgentActivity, b: AgentActivity) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setActivities(transformedActivities);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching agent responses:', error);
      setIsLoading(false);
    }
  };

  // Helper function to format time in a relative way (like blockchain explorers)
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };

  // Return appropriate emoji for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <span className="text-blue-400">ℹ️</span>;
      case 'action':
        return <span className="text-violet-400">⚡</span>;
      case 'warning':
        return <span className="text-yellow-400">⚠️</span>;
      case 'success':
        return <span className="text-green-400">✅</span>;
      case 'error':
        return <span className="text-red-400">❌</span>;
      default:
        return <span className="text-gray-400">🔹</span>;
    }
  };

  // Check connection status and load activities
  useEffect(() => {
    // Initial load of agent config
    const isActive = loadAgentConfig();
    setIsConnected(isActive);
    
    // Load activities if agent is active
    if (isActive) {
      fetchAgentResponses();
    } else {
      setIsLoading(false);
    }
    
    // Set up interval to check for agent status changes and update data
    const checkInterval = setInterval(() => {
      const isCurrentlyActive = loadAgentConfig();
      
      // If agent state changed from inactive to active, load activities
      if (isCurrentlyActive && !isConnected) {
        fetchAgentResponses();
      }
      
      // If agent is active, refresh the activities periodically
      if (isCurrentlyActive) {
        fetchAgentResponses();
      }
      
      setIsConnected(isCurrentlyActive);
    }, 5000); // Check and refresh every 5 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(checkInterval);
  }, [isConnected]);

  return (
    <div className="p-6">
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
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${isConnected ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    {isConnected ? 'Agent Connected' : 'Agent Disconnected'}
                  </div>
                </div>
                {isConnected ? (
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
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Agent is currently offline</p>
                    <p className="text-sm mt-1">Configure and activate the agent to start trading</p>
                  </div>
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
            ) : isConnected && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-start">
                      <div className="mr-3 flex-shrink-0 text-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{activity.message}</p>
                        {activity.details && (
                          <p className="text-sm text-gray-400 mt-1">{activity.details}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{formatTime(activity.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                <div className="text-4xl mb-3 opacity-30">🔌</div>
                {isConnected ? (
                  <>
                    <p>No activities found</p>
                    <p className="text-sm mt-1">Activities will appear here when the agent starts working</p>
                  </>
                ) : (
                  <>
                    <p>Agent is not active</p>
                    <p className="text-sm mt-1">Activate the agent to see activities</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}