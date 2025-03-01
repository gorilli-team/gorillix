import React, { useState } from 'react';
import Image from 'next/image';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';

export interface PoolItemProps {
    tokenPair: string;
    fee: string;
    token1Image: string;
    token2Image: string;
    className?: string;
}

export default function PoolItem({ 
    tokenPair,
    fee,
    token1Image,
    token2Image,
    className = ''
}: PoolItemProps) {
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    
    return (
        <>
            <div className={`bg-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700/50 ${className}`}>
                <div className="flex flex-col space-y-6 h-full">
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
                                    <span className="ml-2 text-gray-500">{fee}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Spacer per fare in modo che i pulsanti stiano in fondo */}
                    <div className="flex-grow"></div>

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