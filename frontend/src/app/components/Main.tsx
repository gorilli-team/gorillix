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
       return <div className="p-4"><h1 className="text-2xl font-bold">AI Agent Configuration</h1></div>;
     case "Stats":
       return <div className="p-4"><h1 className="text-2xl font-bold">Trading Statistics</h1></div>;
     case "My Account":
       return <div className="p-4"><h1 className="text-2xl font-bold">My Account Details</h1></div>;
     case "Pools":
       return <div className="p-4"><h1 className="text-2xl font-bold">Pools</h1></div>; 
     case "Dashboard":
     default:
       return <div className="p-4"><h1 className="text-2xl font-bold">Dashboard Overview</h1></div>;
   }
 };

 return (
   <main className="flex-1 overflow-y-auto bg-gray-100">
     {renderContent()}
   </main>
 );
}