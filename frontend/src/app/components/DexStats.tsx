import React, { useEffect, useState } from 'react';

type ChartDataPoint = {
  time: string;
  tokenAReserve: number;
  tokenBReserve: number;
  priceAinB: number;
  priceBinA: number;
};

type SimplifiedTransaction = {
  hash: string;
  timestamp: string;
  method: string;
  from: string;
  to: string;
  toName?: string;
};

type Token = {
  address: string;
  decimals: string;
  holders: string;
  name: string;
  symbol: string;
  total_supply: string;
  type: string;
  icon_url: string | null;
};

type TokenItem = {
  token: Token;
  value: string;
  token_id: string | null;
  token_instance: any | null;
};

type TokenData = {
  items: TokenItem[];
};

export default function DexStats() {
  const [transactions, setTransactions] = useState<SimplifiedTransaction[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const txResponse = await fetch('https://explorer.abc.t.raas.gelato.cloud/api/v2/addresses/0x80e93b9420746ac25c420c3a7cc29b46bec34d26/transactions');
        const txData = await txResponse.json();
        console.log('Transaction data received:', txData);
        
        // Fetch token data
        const tokenResponse = await fetch('https://explorer.abc.t.raas.gelato.cloud/api/v2/addresses/0x80e93b9420746ac25c420c3a7cc29b46bec34d26/tokens?type=ERC-20');
        const tokenData = await tokenResponse.json();
        console.log('Token data received:', tokenData);
        
        setTokenData(tokenData);
        
        if (txData && txData.items && Array.isArray(txData.items)) {
          const simplifiedTxs = txData.items
            .filter((tx: any) => tx.method && tx.method !== 'Unknown')
            .map((tx: any) => ({
              hash: tx.hash,
              timestamp: tx.timestamp,
              method: tx.method,
              from: tx.from?.hash || '',
              to: tx.to?.hash || '',
              toName: tx.to?.name || undefined
            }));
          
          setTransactions(simplifiedTxs);
          
          // Generate chart data based on transactions
          const newChartData = generateChartData(simplifiedTxs);
          setChartData(newChartData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to generate chart data from transactions
  const generateChartData = (txs: SimplifiedTransaction[]): ChartDataPoint[] => {
    // Group transactions by day
    const groupedByDay = txs.reduce((acc, tx) => {
      const date = new Date(tx.timestamp);
      const day = date.toISOString().split('T')[0];
      
      if (!acc[day]) {
        acc[day] = [];
      }
      
      acc[day].push(tx);
      return acc;
    }, {} as Record<string, SimplifiedTransaction[]>);
    
    // Create data points for each day
    return Object.keys(groupedByDay)
      .sort()
      .map((day, index) => {
        const baseReserveA = 100000;
        const baseReserveB = 500000;
        const reserveAIncrement = 1000 * (index + 1);
        const reserveBIncrement = 5000 * (index + 1);
        
        const tokenAReserve = baseReserveA + reserveAIncrement;
        const tokenBReserve = baseReserveB + reserveBIncrement;
        const priceAinB = tokenBReserve / tokenAReserve;
        const priceBinA = tokenAReserve / tokenBReserve;
        
        return {
          time: day,
          tokenAReserve,
          tokenBReserve,
          priceAinB,
          priceBinA
        };
      });
  };

  // Format addresses for better readability
  const shortenAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format timestamps to show relative time
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const txTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - txTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Get badge style for method type
  const getMethodBadgeStyle = (method: string): string => {
    if (method === 'approve') {
      return 'bg-blue-100 text-blue-800';
    } else if (method.includes('transfer')) {
      return 'bg-green-100 text-green-800';
    } else if (method.includes('swap')) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Format token balance
  const formatTokenBalance = (value: string, decimals: string): string => {
    if (!value) return '0';
    const decimalValue = parseInt(decimals, 10);
    const valueNum = BigInt(value);
    const divisor = BigInt(10) ** BigInt(decimalValue);
    
    // Convert to decimal representation
    const integerPart = valueNum / divisor;
    const fractionalPart = valueNum % divisor;
    
    // Convert to string with proper formatting
    let fractionalString = fractionalPart.toString().padStart(decimalValue, '0');
    // Trim trailing zeros
    fractionalString = fractionalString.replace(/0+$/, '');
    
    return fractionalString ? `${integerPart}.${fractionalString}` : `${integerPart}`;
  };

  const formatTokenSupply = (supply: string, decimals: string): string => {
    if (!supply) return '0';
    const decimalValue = parseInt(decimals, 10);
    const supplyNum = BigInt(supply);
    const divisor = BigInt(10) ** BigInt(decimalValue);
    
    return (Number(supplyNum) / Number(divisor)).toLocaleString();
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Dex Stats</h2>
        <p className="text-gray-300">Real-time pool datas</p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {tokenData && tokenData.items && tokenData.items.map((item, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{item.token.name}</h3>
                  <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">{item.token.symbol}</span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address:</span>
                    <span className="font-mono text-sm">{shortenAddress(item.token.address)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Decimals:</span>
                    <span>{item.token.decimals}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Holders:</span>
                    <span>{item.token.holders}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span>{item.token.type}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Balance:</span>
                    <span className="font-bold">{formatTokenBalance(item.value, item.token.decimals)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Supply:</span>
                    <span>{formatTokenSupply(item.token.total_supply, item.token.decimals)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Method</th>
                    <th className="text-left py-3 px-4">From</th>
                    <th className="text-left py-3 px-4">To</th>
                    <th className="text-left py-3 px-4">Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-3 px-4">{formatTimeAgo(tx.timestamp)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 ${getMethodBadgeStyle(tx.method)} rounded-full text-sm`}>
                            {tx.method}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {shortenAddress(tx.from)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {shortenAddress(tx.to)}
                            </span>
                            {tx.toName && (
                              <div className="mt-1 text-xs text-gray-400 flex items-center">
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                                {tx.toName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">
                          {shortenAddress(tx.hash)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center">No transactions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}