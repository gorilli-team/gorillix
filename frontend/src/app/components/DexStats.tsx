import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { time: '00:00', tokenAReserve: 100000, tokenBReserve: 500000, priceAinB: 5.0, priceBinA: 0.2 },
  { time: '04:00', tokenAReserve: 102000, tokenBReserve: 510000, priceAinB: 5.1, priceBinA: 0.196 },
  { time: '08:00', tokenAReserve: 98000, tokenBReserve: 490000, priceAinB: 4.9, priceBinA: 0.204 },
  { time: '12:00', tokenAReserve: 103000, tokenBReserve: 515000, priceAinB: 5.2, priceBinA: 0.192 },
  { time: '16:00', tokenAReserve: 101000, tokenBReserve: 505000, priceAinB: 5.0, priceBinA: 0.2 },
  { time: '20:00', tokenAReserve: 104000, tokenBReserve: 520000, priceAinB: 5.3, priceBinA: 0.189 }
];

export default function DexStats() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Dex Statistic</h2>
        <p className="text-gray-600">Real-time pool and trading metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">TokenA Reserve</h3>
          <p className="text-2xl font-bold mt-2">104,000</p>
          <span className="text-green-500 text-sm">+4,000 (24h)</span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">TokenB Reserve</h3>
          <p className="text-2xl font-bold mt-2">520,000</p>
          <span className="text-green-500 text-sm">+20,000 (24h)</span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">Token Prices</h3>
          <div>
            <p className="text-lg font-bold mt-2">1 TokenA = 5.3 TokenB</p>
            <span className="text-green-500 text-sm">+2.4% (24h)</span>
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold">1 TokenB = 0.189 TokenA</p>
            <span className="text-red-500 text-sm">-2.4% (24h)</span>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">Pool Ratio</h3>
          <p className="text-2xl font-bold mt-2">1:5</p>
          <span className="text-gray-500 text-sm">TokenA:TokenB</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Pool Reserves History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tokenAReserve" stroke="#8884d8" name="TokenA" />
                <Line type="monotone" dataKey="tokenBReserve" stroke="#82ca9d" name="TokenB" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-4">Price History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="priceAinB" stroke="#8884d8" name="TokenA in TokenB" />
                <Line type="monotone" dataKey="priceBinA" stroke="#82ca9d" name="TokenB in TokenA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Trade History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Amount In</th>
                <th className="text-left py-3 px-4">Amount Out</th>
                <th className="text-right py-3 px-4">Price Impact</th>
                <th className="text-right py-3 px-4">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">12:30:45</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    TokenA → TokenB
                  </span>
                </td>
                <td className="py-3 px-4">1,500 TokenA</td>
                <td className="py-3 px-4">7,425 TokenB</td>
                <td className="py-3 px-4 text-right">0.12%</td>
                <td className="py-3 px-4 text-right">$1,890</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">12:28:15</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    TokenB → TokenA
                  </span>
                </td>
                <td className="py-3 px-4">10,000 TokenB</td>
                <td className="py-3 px-4">2,000 TokenA</td>
                <td className="py-3 px-4 text-right">0.18%</td>
                <td className="py-3 px-4 text-right">$2,520</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}