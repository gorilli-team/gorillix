import React, { useState } from 'react';
import Image from 'next/image';
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

    // Split the APR into min and max values if it contains a range
    const renderApr = () => {
        if (apr.includes('-')) {
            const [min, max] = apr.split('-').map(val => val.trim());
            return (
                <div className="font-semibold text-white text-xl">
                    <span className="text-green-400">{min}</span>
                    <span className="text-gray-400"> - </span>
                    <span className="text-green-400">{max}</span>
                </div>
            );
        }
        return <div className="font-semibold text-green-400 text-xl">{apr}</div>;
    };

    return (
        <>
            <div className="bg-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700/50">
                <div className="flex flex-col space-y-6">
                    {/* Top row with token info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex -space-x-2">
                                <div className="relative w-8 h-8 z-10">
                                    <Image 
                                        src={token1Image} 
                                        alt="Token 1" 
                                        width={32}
                                        height={32}
                                        className="rounded-full border border-gray-700 shadow-md object-cover"
                                    />
                                </div>
                                <div className="relative w-8 h-8">
                                    <Image 
                                        src={token2Image} 
                                        alt="Token 2" 
                                        width={32}
                                        height={32}
                                        className="rounded-full border border-gray-700 shadow-md object-cover"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="font-bold text-white text-lg">{tokenPair}</div>
                                <div className="text-xs text-gray-400 flex items-center">
                                    <span className="bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">Pool #{poolNumber}</span>
                                    <span className="ml-2 text-gray-500">{fee}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats section */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="font-semibold text-white text-xl">{volume24h}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">VOLUME (24H)</div>
                        </div>
                        <div>
                            <div className="font-semibold text-white text-xl">{liquidity}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">LIQUIDITY</div>
                        </div>
                        <div>
                            {renderApr()}
                            <div className="text-xs text-gray-400 uppercase tracking-wider">APR</div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setShowWithdrawModal(true)}
                            className="py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors border border-gray-600/50"
                        >
                            Withdraw
                        </button>
                        <button 
                            onClick={() => setShowDepositModal(true)}
                            className="py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Deposit
                        </button>
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