"use client";
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";


export default function AppLayout() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <div className="flex-1 flex flex-col">
        <Sidebar 
          selectedPage={selectedPage} 
          setSelectedPage={setSelectedPage}
        />
        <Header />
      </div>
    </div>
  );
}
