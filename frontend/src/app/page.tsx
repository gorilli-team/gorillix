"use client";
import { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Main from "./components/Main";
import WalletConnectionModal from "./components/WalletConnectionModal";

export default function Page() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="flex h-screen text-white">
        <Sidebar 
          selectedPage={selectedPage} 
          setSelectedPage={setSelectedPage}
        />
        <div className="flex-1 flex flex-col">
          <Header />
          <Main 
            selectedPage={selectedPage}
          />
        </div>
      </div>

      {!isConnected && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <WalletConnectionModal />
        </div>
      )}
    </>
  );
}