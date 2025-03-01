import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

export default function DexStats() {
  const [transactions, setTransactions] = useState<SimplifiedTransaction[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://explorer.abc.t.raas.gelato.cloud/api/v2/addresses/0x14a678f6F5f5F897692a9dB3dEe8E2D3c656C483/transactions');
        const data = await response.json();
        console.log('Dati delle transazioni ricevuti:', data);
        
        if (data && data.items && Array.isArray(data.items)) {
          // Semplifica i dati delle transazioni
          // Filtra le transazioni per escludere quelle con metodo sconosciuto
          const simplifiedTxs = data.items
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
          
          // Genera dati del grafico basati sulle transazioni
          const newChartData = generateChartData(simplifiedTxs);
          setChartData(newChartData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Errore durante il recupero delle transazioni:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Funzione per generare dati di grafico dalle transazioni
  const generateChartData = (txs: SimplifiedTransaction[]): ChartDataPoint[] => {
    // Raggruppa le transazioni per giorno
    const groupedByDay = txs.reduce((acc, tx) => {
      const date = new Date(tx.timestamp);
      const day = date.toISOString().split('T')[0];
      
      if (!acc[day]) {
        acc[day] = [];
      }
      
      acc[day].push(tx);
      return acc;
    }, {} as Record<string, SimplifiedTransaction[]>);
    
    // Crea punti dati per ogni giorno
    return Object.keys(groupedByDay)
      .sort()
      .map((day, index) => {
        // Valori di riserva simulati basati sull'indice per scopi dimostrativi
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

  // Formatta gli indirizzi per migliorare la leggibilità
  const shortenAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Formatta il timestamp per mostrare il tempo relativo
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

  // Ottieni lo stile del badge per il tipo di metodo
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

  // Calcola statistiche dalle transazioni
  const calculateStats = () => {
    const latestData = chartData.length > 0 ? chartData[chartData.length - 1] : null;
    const previousData = chartData.length > 1 ? chartData[chartData.length - 2] : null;
    
    const tokenAReserve = latestData?.tokenAReserve || 104000;
    const tokenBReserve = latestData?.tokenBReserve || 520000;
    const priceAinB = latestData?.priceAinB || 5.3;
    const priceBinA = latestData?.priceBinA || 0.189;
    
    // Calcola le variazioni nelle 24 ore
    let tokenAChange = 0;
    let tokenBChange = 0;
    let priceChange = 0;
    
    if (previousData) {
      tokenAChange = tokenAReserve - previousData.tokenAReserve;
      tokenBChange = tokenBReserve - previousData.tokenBReserve;
      priceChange = ((priceAinB / previousData.priceAinB) - 1) * 100;
    }
    
    return {
      tokenAReserve,
      tokenBReserve,
      priceAinB,
      priceBinA,
      tokenAChange,
      tokenBChange,
      priceChange
    };
  };
  
  const stats = calculateStats();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Dex Stats</h2>
        <p className="text-gray-300">Real-time pool and trading metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-300">TokenA Reserve</h3>
          <p className="text-2xl font-bold mt-2">{stats.tokenAReserve.toLocaleString()}</p>
          <span className={`${stats.tokenAChange >= 0 ? 'text-green-500' : 'text-red-500'} text-sm`}>
            {stats.tokenAChange >= 0 ? '+' : ''}{stats.tokenAChange.toLocaleString()} (24h)
          </span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-300">TokenB Reserve</h3>
          <p className="text-2xl font-bold mt-2">{stats.tokenBReserve.toLocaleString()}</p>
          <span className={`${stats.tokenBChange >= 0 ? 'text-green-500' : 'text-red-500'} text-sm`}>
            {stats.tokenBChange >= 0 ? '+' : ''}{stats.tokenBChange.toLocaleString()} (24h)
          </span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-300">Token Prices</h3>
          <div>
            <p className="text-lg font-bold mt-2">1 TokenA = {stats.priceAinB.toFixed(3)} TokenB</p>
            <span className={`${stats.priceChange >= 0 ? 'text-green-500' : 'text-red-500'} text-sm`}>
              {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange.toFixed(2)}% (24h)
            </span>
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold">1 TokenB = {stats.priceBinA.toFixed(3)} TokenA</p>
            <span className={`${stats.priceChange >= 0 ? 'text-red-500' : 'text-green-500'} text-sm`}>
              {stats.priceChange >= 0 ? '-' : '+'}{Math.abs(stats.priceChange).toFixed(2)}% (24h)
            </span>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-300">Pool Ratio</h3>
          <p className="text-2xl font-bold mt-2">1:{(stats.tokenBReserve / stats.tokenAReserve).toFixed(1)}</p>
          <span className="text-gray-300 text-sm">TokenA:TokenB</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Caricamento dati in corso...</div>
      ) : (
        <>
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
                      <td colSpan={5} className="py-4 text-center">Nessuna transazione trovata</td>
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