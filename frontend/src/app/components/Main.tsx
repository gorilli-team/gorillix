import React from 'react';
import Dashboard from './Dashboard';
import PoolItem from './PoolItem';
import AiAgentConfiguration from './AiAgentConfiguration';
import DexStats from './DexStats';

interface MainProps {
    selectedPage: string;
    setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function Main({
    selectedPage,
    setSelectedPage
}: MainProps) {
    const renderContent = () => {
        switch (selectedPage) {
            case "AI Agent":
                return <div className="p-4"><AiAgentConfiguration /></div>;
            case "Stats":
                return <div className="p-4"><DexStats/></div>;
            case "My Account":
                return <div className="p-4"><h1 className="text-2xl font-bold">My Account Details</h1></div>;
            case "Pools":
                return (
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-8">Your Pools</h1>
                        <div className="mb-8">
                            <PoolItem 
                                tokenPair="UNI/USDC"
                                poolNumber="0"
                                fee="0.05%"
                                volume24h="$1,708,112"
                                liquidity="$231,643"
                                apr="0.3% - 42.9%"
                                token1Image="/usd-coin-usdc-logo.png"
                                token2Image="/uniswap-uni-logo.png"
                            />
                            <PoolItem 
                                tokenPair="LINK/DAI"
                                poolNumber="1"
                                fee="0.01%"
                                volume24h="$1,465,282"
                                liquidity="$1,227,967"
                                apr="< 0.1% - 2.2%"
                                token1Image="/chainlink-link-logo.png"
                                token2Image="/multi-collateral-dai-dai-logo.png"
                            />
                        </div>
                    </div>
                );
            case "Dashboard":
            default:
                return <Dashboard />;
        }
    };

    return (
        <main className="flex-1 overflow-y-auto main-layout bg-gray-100">
            {renderContent()}
        </main>
    );
}