import React from 'react';
import PoolItem from './PoolItem';
import SwapComponent from './SwapComponent';

export default function SwapInterface() {
  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <div className="flex flex-col md:flex-row justify-between gap-6 max-w-6xl mx-auto h-full">
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">Liquidity Pool</h2>
          <div className="flex-grow flex">
            <PoolItem 
              tokenPair="TKA/TKB"
              fee="0.03%"
              token1Image="/tknA.png"
              token2Image="/tknB.png"
              className="w-full flex flex-col h-full"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4">Token Swap</h2>
          <div className="flex-grow flex">
            <SwapComponent 
              className="w-full h-full"
              onSwapSuccess={() => {
                console.log("Swap completed successfully");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}