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

// Sample data for agent activities
const mockActivities: AgentActivity[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60000),
    type: 'info',
    message: 'Agent initialized with risk level 2',
    details: 'Trading strategy: LIQUIDITY MANAGEMENT'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 4 * 60000),
    type: 'action',
    message: 'Scanning market conditions',
    details: 'Analyzing price trends and liquidity pools'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 3 * 60000),
    type: 'warning',
    message: 'Elevated price volatility detected',
    details: 'Market volatility index: 0.72'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 2 * 60000),
    type: 'success',
    message: 'Liquidity position adjusted',
    details: 'Rebalanced position in TKA/TKB pool'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1 * 60000),
    type: 'action',
    message: 'Monitoring price movements',
    details: 'TKA: +0.3%, TKB: -0.1% (last 5 minutes)'
  }
];

// Sample stats for the agent
const agentStats = {
  uptime: '2h 15m',
  activeLiquidity: '2,450.00 TKA / 1,875.50 TKB',
  riskLevel: 'Conservative (2)',
  strategy: 'LIQUIDITY MANAGEMENT',
  status: 'Active'
};

export default function AITradingView() {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'info' | 'actions' | 'warnings'>('all');

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter activities based on active tab
  const filteredActivities = activities.filter(activity => {
    if (activeTab === 'all') return true;
    if (activeTab === 'info') return activity.type === 'info';
    if (activeTab === 'actions') return activity.type === 'action' || activity.type === 'success';
    if (activeTab === 'warnings') return activity.type === 'warning' || activity.type === 'error';
    return true;
  });

  // Helper function to format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Return appropriate emoji for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <span className="text-blue-400">ℹ️</span>;
      case 'action':
        return <span className="text-purple-400">⚡</span>;
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Trading Performance</h2>
        <div className="bg-gray-700/50 border border-purple-500/20 rounded-lg px-4 py-1.5 text-sm">
          <span className="mr-2 inline-block w-2 h-2 rounded-full bg-green-500"></span>
          Agent Online
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Info */}
        <div className="bg-gray-800 rounded-xl border border-purple-600/30 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-900/30 to-gray-800 p-4 border-b border-purple-600/20">
            <h3 className="font-semibold text-lg flex items-center">
              <span className="bg-purple-600 w-2 h-6 rounded mr-2"></span>
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
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className="font-medium text-white">{agentStats.status}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Uptime</span>
                  <span className="font-medium text-white">{agentStats.uptime}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Strategy</span>
                  <span className="font-medium text-white">{agentStats.strategy}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Risk Level</span>
                  <span className="font-medium text-white">{agentStats.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Liquidity</span>
                  <span className="font-medium text-white">{agentStats.activeLiquidity}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agent Activities */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-purple-600/30 shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-900/30 to-gray-800 border-b border-purple-600/20">
            <div className="flex items-center justify-between p-4">
              <h3 className="font-semibold text-lg flex items-center">
                <span className="bg-purple-600 w-2 h-6 rounded mr-2"></span>
                Agent Activity Log
              </h3>
              <button className="bg-gray-700 hover:bg-gray-600 text-xs rounded-lg px-3 py-1.5 transition-colors">
                Clear Log
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-t border-gray-700">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'all' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'info' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                Info
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'actions' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                Actions
              </button>
              <button
                onClick={() => setActiveTab('warnings')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'warnings' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                Warnings
              </button>
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
            ) : filteredActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5 flex-shrink-0 text-lg">
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
                <div className="text-4xl mb-3 opacity-30">🔍</div>
                <p>No activities found for the selected filter</p>
                <button 
                  onClick={() => setActiveTab('all')}
                  className="mt-3 text-sm text-purple-400 hover:underline"
                >
                  View all activities
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}