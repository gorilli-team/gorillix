import React from 'react';
import Dashboard from './Dashboard';
import AiAgentConfiguration from './AiAgentConfiguration';
import DexStats from './DexStats';

interface MainProps {
    selectedPage: string;
}

export default function Main({
    selectedPage
}: MainProps) {
    const renderContent = () => {
        switch (selectedPage) {
            case "AI Agent":
                return <div className="p-4"><AiAgentConfiguration /></div>;
            case "Stats":
                return <div><DexStats/></div>;
            case "Faucet":
                return <div>Faucet</div>
            case "Dashboard":
            default:
                return <Dashboard />;
        }
    };

    return (
        <main className="flex-1 overflow-y-auto main-layout bg-gray-900">
            {renderContent()}
        </main>
    );
}