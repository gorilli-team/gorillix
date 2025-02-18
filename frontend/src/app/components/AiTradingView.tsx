"use client";

export default function AITradingView() {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">AI Trading Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Agent Activities & Info</h3>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Performance Trades - Profit & Loss</h3>
          </div>
        </div>
      </div>
    );
  }