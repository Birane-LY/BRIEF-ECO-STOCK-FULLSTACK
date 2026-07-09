import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 

const Navbar = () => {
  // Extract user session info and logout trigger from global state context
  const { user, logout } = useAuth();

  return (
    <div className="flex h-16 w-full items-center justify-end gap-6 px-6 lg:px-8 bg-[#FFFFFFB8] border-b border-[#E1E6E1] select-none">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAEEFF] text-[#2F5DFF] text-xs font-black">
          {user?.avatar || "A"}
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xs font-black text-[#10141A]">{user?.name || "invité"}</span>
          <span className="text-[10px] text-[#96A099] font-medium mt-0.5">
            Rôle : {user?.role || "Visiteur"}
          </span>
        </div>
      </div>

      <button 
        onClick={logout}
        className="flex h-9 items-center justify-center gap-2 px-4 rounded-xl bg-white border border-[#E1E6E1] hover:bg-[#F4F6F4] text-[#5C665F] hover:text-[#10141A] transition-all duration-150 text-xs font-bold">
        <LogOut className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span>Déconnexion</span>
      </button>

    </div>
  );
};

export default Navbar;