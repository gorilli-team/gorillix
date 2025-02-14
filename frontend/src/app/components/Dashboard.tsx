"use client";
import { useState } from 'react';
import AiTradingView from './AiTradingView';
import ManualSwapView from './ManualSwapView';

export default function Dashboard() {
    const [isAiEnabled, setIsAiEnabled] = useState(true);
  
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {isAiEnabled ? 'AI Trading Active' : 'Manual Trading'}
            </span>
            <button
              onClick={() => setIsAiEnabled(!isAiEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isAiEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isAiEnabled ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>
  
        {isAiEnabled ? <AiTradingView /> : <ManualSwapView />}
      </div>
    );
}