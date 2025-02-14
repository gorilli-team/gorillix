"use client";
import Header from "./components/Header";


export default function AppLayout() {

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <div className="flex-1 flex flex-col">
        <Header />
      </div>
    </div>
  );
}
