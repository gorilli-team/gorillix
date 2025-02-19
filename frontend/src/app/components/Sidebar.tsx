"use client";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

interface SidebarProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({
  selectedPage,
  setSelectedPage,
}: SidebarProps) {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log("connected wallet:", address);
    }
  }, [address, mounted]);

  const handleGorillixClick = () => {
    window.location.reload();
  };

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
  };

  if (!mounted) {
    return (
      <aside className="w-64 bg-gray-800 flex text-white flex-col border border-gray-300">
        <div className="h-16 text-xl font-bold flex items-center ps-4">
          <img className="w-12 h-12 rounded-full" src="/avatar_3.png" alt="logo-gorillix" />
          <span className="ps-2">Gorillix</span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700">
                <i className="fa-regular fa-newspaper pr-2"></i>
                <span>DASHBOARD</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700">
                <i className="fa-solid fa-shield pr-2"></i>
                <span>AI AGENT</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700">
                <i className="fa-solid fa-shield pr-2"></i>
                <span>STATS</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gray-800 border-r border-purple-600 flex text-white flex-col">
      <div
        className="h-16 text-xl font-bold flex items-center ps-4 cursor-pointer"
        onClick={handleGorillixClick}
      >
        <img className="w-12 h-12 rounded-full" src="/avatar_3.png" alt="logo-gorillix" />
        <span className="ps-2">Gorillix</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                selectedPage === "Dashboard" ? "bg-gray-700" : ""
              }`}
              onClick={() => handlePageChange("Dashboard")}
            >
              <i className="fa-regular fa-newspaper pr-2"></i>
              <span>DASHBOARD</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                selectedPage === "AI Agent" ? "bg-gray-700" : ""
              }`}
              onClick={() => handlePageChange("AI Agent")}
            >
              <i className="fa-solid fa-shield pr-2"></i>
              <span>AI AGENT</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                selectedPage === "Stats" ? "bg-gray-700" : ""
              }`}
              onClick={() => handlePageChange("Stats")}
            >
              <i className="fa-solid fa-shield pr-2"></i>
              <span>STATS</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}