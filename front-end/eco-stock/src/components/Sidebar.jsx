import { LayoutGrid, Warehouse, Box, Users, ShoppingCart, Store, MoreHorizontal, LogOut } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";

const SECTIONS = [
  {
    title: "PILOTAGE",
    items: [{ id: "home", path: "/", label: "Vue d'ensemble", shortLabel: "Accueil", Icon: LayoutGrid }]
  },
  {
    title: "LOGISTIQUE",
    items: [
      { id: "warehouses", path: "/entrepots", label: "Entrepôts", shortLabel: "Entrepôts", Icon: Warehouse },
      { id: "products", path: "/produits", label: "Produits", shortLabel: "Produits", Icon: Box }
    ]
  },
  {
    title: "ÉQUIPE & DONS",
    items: [
      { id: "managers", path: "#", label: "Gérants", shortLabel: "Gérants", Icon: Users },
      { id: "orders", path: "#", label: "Commandes", shortLabel: "Dons", Icon: ShoppingCart }
    ]
  }
];

function checkIfActive(path, currentPath) {
  if (path === "/") return currentPath === "/";
  return currentPath.startsWith(path);
}

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="hidden w-[240px] flex-col border-r border-[#E1E6E1] bg-white pt-6 pb-4 md:flex h-full select-none">
      <div className="flex items-center h-[48px] gap-3 px-6 pb-6 border-b border-[#F4F6F4]">
        <div className="text-white bg-[#2F5DFF] p-2 rounded-xl shadow-md shadow-[#2F5DFF]/20 flex items-center justify-center shrink-0">
          <Store className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-black tracking-tight text-[#10141A] leading-none">EcoStock</h1>
          <p className="text-[9px] text-[#96A099] font-black tracking-widest uppercase mt-1">Dons alimentaires</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full px-4 pt-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-1.5">
            <span className="px-3 text-[10px] font-bold tracking-wider text-[#96A099]">{section.title}</span>
            {section.items.map((item) => {
              const isActive = checkIfActive(item.path, currentPath);
              return (
                <Link key={item.id} to={item.path} className={`flex h-10 items-center gap-3 px-3 rounded-xl font-bold text-sm transition-all duration-150 ${
                    isActive ? "bg-[#EAEEFF] text-[#2F5DFF]" : "text-[#5C665F] hover:bg-[#F4F6F4] hover:text-[#10141A]"
                  }`}>
                  <item.Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
