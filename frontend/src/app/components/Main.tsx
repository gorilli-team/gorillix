import React from 'react';
import Dashboard from './Dashboard';
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
                return <div className="p-4"><h2 className="text-2xl font-bold mb-6">AI Agent Configuration</h2><AiAgentConfiguration /></div>;
            case "Stats":
                return <div><DexStats/></div>;
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