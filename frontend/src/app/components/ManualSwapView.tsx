"use client";
import { useState } from 'react';

export default function ManualSwapView() {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Manual Swap</h2>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
            </div>
            <div className="bg-gray-50 p-4 rounded">
            </div>
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg">
              Swap
            </button>
          </div>
        </div>
      </div>
    );
  }