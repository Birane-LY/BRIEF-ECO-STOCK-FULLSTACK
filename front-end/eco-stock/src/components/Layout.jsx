import { Sidebar} from "./Sidebar";
import Navbar from "./Navbar";
import { Store } from "lucide-react"; 

function Layout({ children }) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#F4F6F4]">
      <header className="flex items-center h-[56px] gap-3 px-5 border-b border-[#E1E6E1]/60 bg-white md:hidden sticky top-0 left-0 w-full z-40 select-none">
        <div className="text-white bg-[#2F5DFF] p-1.5 rounded-lg shadow-sm flex items-center justify-center">
          <Store className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-black tracking-tight text-[#10141A] leading-tight">
            EcoStock
          </h1>
          <p className="text-[8px] text-[#96A099] font-bold tracking-widest uppercase leading-none mt-0.5">
            Dons alimentaires
          </p>
        </div>
      </header>
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
      
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-[74px] md:pb-6">
          {children}
        </main>
      </div>

    </div>
  );
}

export default Layout;
