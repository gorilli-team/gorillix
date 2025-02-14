"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Main from "./components/Main";

export default function Page() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [selectedVault, setSelectedVault] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar 
        selectedPage={selectedPage} 
        setSelectedPage={setSelectedPage}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <Main 
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      </div>
    </div>
  );
}