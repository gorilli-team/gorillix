"use client";
import { useState } from 'react';
import AiTradingView from './AiTradingView';
import ManualSwapView from './ManualSwapView';

export default function Dashboard() {
   const [isAiEnabled, setIsAiEnabled] = useState(true);
   const [showAlert, setShowAlert] = useState(false);
   const [pendingMode, setPendingMode] = useState<boolean | null>(null);
   
   const handleModeSwitch = () => {
     setPendingMode(!isAiEnabled);
     setShowAlert(true);
   };

   const handleConfirm = () => {
     if (pendingMode !== null) {
       setIsAiEnabled(pendingMode);
     }
     setShowAlert(false);
     setPendingMode(null);
   };

   const handleDismiss = () => {
     setShowAlert(false);
     setPendingMode(null);
   };
 
   return (
     <div className="p-4 relative">
       {showAlert && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-gray-800 rounded-lg p-4 max-w-md w-full">
             <div className="font-medium mb-2">Mode Switch Confirmation</div>
             <div className="mt-2">
               <div className="mb-4 text-sm">
                 {isAiEnabled 
                   ? "Are you sure you want to switch to Manual Mode?"
                   : "Are you sure you want to switch to AI Mode?"
                 }
               </div>
               <div className="flex">
                 <button
                   type="button"
                   onClick={handleConfirm}
                   className="mr-2 inline-flex items-center rounded-lg bg-gray-500 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-gray-600 focus:outline-none"
                 >
                   Yes
                 </button>
                 <button
                   type="button"
                   onClick={handleDismiss}
                   className="rounded-lg border border-gray-500 bg-transparent px-3 py-1.5 text-center text-xs font-medium hover:bg-gray-500 hover:text-white focus:outline-none"
                 >
                   No
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold">Dashboard Overview</h1>
         <div className="flex items-center gap-3">
           <button
             onClick={handleModeSwitch}
             className="px-6 py-2 rounded-full font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white transition-colors focus:outline-none"
           >
             {isAiEnabled ? 'Switch to Manual Mode' : 'Switch to AI Mode'}
           </button>
         </div>
       </div>
 
       {isAiEnabled ? <AiTradingView /> : <ManualSwapView />}
     </div>
   );
}