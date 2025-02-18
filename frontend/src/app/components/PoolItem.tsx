import React from 'react';

export interface PoolItemProps {
    tokenPair: string;
    poolNumber: string;
    fee: string;
    volume24h: string;
    liquidity: string;
    apr: string;
    token1Image: string;
    token2Image: string;
}

export default function PoolItem({ 
    tokenPair, 
    poolNumber, 
    fee, 
    volume24h, 
    liquidity, 
    apr,
    token1Image,
    token2Image
}: PoolItemProps) {
    return (
        <div className="bg-white cursor-pointer rounded-xl p-5 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex -space-x-3">
                        <img 
                            src={token1Image} 
                            alt="Token 1" 
                            className="w-10 h-10 rounded-full border-2 border-gray-700 z-10 shadow-md" 
                        />
                        <img 
                            src={token2Image} 
                            alt="Token 2" 
                            className="w-10 h-10 rounded-full border-2 border-gray-700 shadow-md" 
                        />
                    </div>
                    <div>
                        <div className="font-bold text-lg text-black">{tokenPair}</div>
                        <div className="text-sm text-gray-400 flex items-center">
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full mr-2">
                                Pool #{poolNumber}
                            </span>
                            <span className="text-gray-500">{fee}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-8">
                    <div className="text-right">
                        <div className="font-semibold text-gray-800">{volume24h}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Volume (24H)</div>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold text-gray-800">{liquidity}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Liquidity</div>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold text-green-400">{apr}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">APR</div>
                    </div>
                    <button className="p-2 hover:bg-gray-700 rounded-full transition-colors group">
                        <i className="fas fa-ellipsis-v text-gray-400 group-hover:text-white"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}