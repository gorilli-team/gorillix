import React, { useState } from 'react';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';

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
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    return (
        <>
            <div className="bg-gray-800 rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-3">
                            <img src={token1Image} alt="Token 1" className="w-10 h-10 rounded-full border-2 border-gray-700 z-10 shadow-md" />
                            <img src={token2Image} alt="Token 2" className="w-10 h-10 rounded-full border-2 border-gray-700 shadow-md" />
                        </div>
                        <div>
                            <div className="font-bold text-lg text-white">{tokenPair}</div>
                            <div className="text-sm text-gray-400 flex items-center">
                                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full mr-2">Pool #{poolNumber}</span>
                                <span className="text-gray-500">{fee}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-8">
                        <div className="text-right">
                            <div className="font-semibold text-white">{volume24h}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Volume (24H)</div>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-white">{liquidity}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Liquidity</div>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-green-400">{apr}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">APR</div>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setShowDepositModal(true)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                                Deposit
                            </button>
                            <button 
                                onClick={() => setShowWithdrawModal(true)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DepositModal 
                isVisible={showDepositModal} 
                onClose={() => setShowDepositModal(false)} 
            />
            
            <WithdrawModal 
                isVisible={showWithdrawModal} 
                onClose={() => setShowWithdrawModal(false)} 
            />
        </>
    );
}