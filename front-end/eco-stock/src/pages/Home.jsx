import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import KpiCards from "../kpi/KpiCards";
import { MapPin, NotepadText, Loader2 } from "lucide-react";

const WAREHOUSES_DATA = [
  { id: 'wh-1', name: 'Entrepôt Dakar-Port', location: 'Dakar, Sénégal', used: 3820, total: 5000 },
  { id: 'wh-2', name: 'Entrepôt Thiès-Nord', location: 'Thiès, Sénégal', used: 1490, total: 3200 },
  { id: 'wh-3', name: 'Entrepôt Kaolack-Centre', location: 'Kaolack, Sénégal', used: 3960, total: 4100 }
];

const Home = () => {
  const navigate = useNavigate();
  // State for the simulation of the loading audit warehouse
  const [loadingAuditId, setLoadingAuditId] = useState(null);

  const handleAuditClick = (e, warehouseId, warehouseName) => {
    e.stopPropagation(); 
    setLoadingAuditId(warehouseId);

    // Simulation for the network response waiting to display UI
    setTimeout(() => {
      setLoadingAuditId(null);
      const mockProductCount = warehouseId === 'wh-1' ? 12 : warehouseId === 'wh-2' ? 4 : 2;
      alert(`[Simulation Intégration] ${warehouseName} contient ${mockProductCount} produits uniques.`);
    }, 800);
  };

  return (
    <Layout>
      <div className="p-[24px] pb-0 flex flex-col gap-1">
        <h1 className="font-black text-2xl text-[#10141A]">Centre de pilotage</h1>
        <p className="text-[#5C665F] text-xs font-semibold">Suivi en temps réel du réseau de dons alimentaires</p>
      </div>
      
      <KpiCards />

      <div className="p-[24px] pt-2">
        <h2 className="font-black text-lg text-[#10141A] mb-4">Entrepôts principaux</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WAREHOUSES_DATA.map((wh) => {
            const ratio = (wh.used / wh.total) * 100;
            return (
              <div 
                key={wh.id}
                onClick={() => navigate(`/entrepots/${wh.id}`)}
                className="bg-white border border-[#E1E6E1] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2F5DFF] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-[#10141A] tracking-tight group-hover:text-[#2F5DFF] transition-colors">
                      {wh.name}
                    </h3>
                    
                  </div>

                  <div className="flex items-center gap-1 text-[#96A099] mt-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <p className="text-xs font-semibold">{wh.location}</p>
                  </div>

                  <div className="mt-5 flex flex-col">
                    <div className="flex items-end justify-between text-xs mb-1.5">
                      <span className="text-[#96A099] font-semibold">Capacité utilisée</span>
                      <span className="text-[#10141A] font-black">
                        {wh.used.toLocaleString()} <span className="text-[#5C665F] font-bold">/ {wh.total.toLocaleString()} m²</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#FAFBFA] border border-[#E1E6E1] rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${ratio > 80 ? 'bg-[#EF4438]' : 'bg-[#0FA968]'}`} 
                        style={{ width: `${ratio}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F4F6F4] flex justify-end">
                  <button 
                    onClick={(e) => handleAuditClick(e, wh.id, wh.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E1E6E1] hover:border-[#2F5DFF] hover:bg-[#EAEEFF] rounded-xl text-xs font-bold text-[#5C665F] hover:text-[#2F5DFF] transition-all h-[32px] min-w-[85px] justify-center">
                    {loadingAuditId === wh.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <NotepadText className="w-3.5 h-3.5" />
                        <span>Auditer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Home;