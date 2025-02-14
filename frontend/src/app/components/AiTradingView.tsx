"use client";
import { useState } from 'react';

export default function AITradingView() {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">AI Trading Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Current Strategy</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Performance</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Recent Trades</h3>
          </div>
        </div>
      </div>
    );
  }