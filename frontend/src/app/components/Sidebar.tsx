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
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGorillixClick = () => {
    window.location.reload();
  };

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
  };

  if (!mounted) {
    return (
      <aside className="w-64 text-gray-800 flex flex-col border border-gray-300">
        <div className="h-16 text-xl font-bold flex items-center ps-4">
          <img className="w-12 h-12 rounded-full" src="/avatar_3.png" alt="logo-gorillix" />
          <span className="ps-2">Gorillix</span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200">
                <i className="fa-regular fa-newspaper pr-2"></i>
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200">
                <i className="fa-solid fa-shield pr-2"></i>
                <span>AI Agent</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200">
                <i className="fa-solid fa-shield pr-2"></i>
                <span>Stats</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-64 text-gray-800 flex flex-col border border-gray-300">
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
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                selectedPage === "Dashboard" ? "bg-gray-200" : ""
              }`}
              onClick={() => handlePageChange("Dashboard")}
            >
              <i className="fa-regular fa-newspaper pr-2"></i>
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                selectedPage === "AI Agent" ? "bg-gray-200" : ""
              }`}
              onClick={() => handlePageChange("AI Agent")}
            >
              <i className="fa-solid fa-shield pr-2"></i>
              <span>AI Agent</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                selectedPage === "Stats" ? "bg-gray-200" : ""
              }`}
              onClick={() => handlePageChange("Stats")}
            >
              <i className="fa-solid fa-shield pr-2"></i>
              <span>Stats</span>
            </button>
          </li>
          {address && (
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                  selectedPage === "My Account" ? "bg-gray-200" : ""
                }`}
                onClick={() => handlePageChange("My Account")}
              >
                <i className="fa-solid fa-circle-user pr-2"></i>
                <span>My account</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}