import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import KpiCards from "../kpi/KpiCards";
import api from "../services/api";
import { MapPin, NotepadText, Loader2 } from "lucide-react";

const Home = () => {
  const [data, setData] = useState({ warehouses: [], products: [], loading: true });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get("/api/warehouses/"), api.get("/api/produits/")])
      .then(([wh, prod]) => {
        // Extraction intelligente : prend .results si paginé, sinon prend la liste brute
        const warehousesList = Array.isArray(wh.data) ? wh.data : wh.data?.results || [];
        const productsList = Array.isArray(prod.data) ? prod.data : prod.data?.results || [];

        setData({
          warehouses: warehousesList,
          products: productsList,
          loading: false
        });
      })
      .catch((err) => {
        console.error("DRF loading error:", err);
        setData(prev => ({ ...prev, loading: false }));
      });
  }, []);

  const handleAudit = (e, wh) => {
    e.preventDefault();
    e.stopPropagation();
    const count = data.products.filter(p => String(p.entrepot) === String(wh.id) || p.entrepot === wh.nom).length;
    alert(`[Audit] ${wh.nom} contient ${count} lot(s) distincts.`);
  };

  if (data.loading) return <LoadingScreen />;

  return (
    <Layout>
      <div className="p-6 pb-0 flex flex-col gap-1">
        <h1 className="font-black text-2xl text-[#10141A]">Centre de pilotage</h1>
        <p className="text-[#5C665F] text-xs font-semibold">Suivi en temps réel du réseau de dons alimentaires</p>
      </div>

      <KpiCards />

      <div className="p-6 pt-2">
        <h2 className="font-black text-lg text-[#10141A] mb-4">Entrepôts principaux</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(data.warehouses) && data.warehouses.map(wh => (
            <WarehouseCard 
              key={wh.id} 
              wh={wh} 
              products={data.products} 
              onNavigate={() => navigate(`/entrepots/${wh.id}`)} 
              onAudit={(e) => handleAudit(e, wh)} 
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

// --- SOUS-COMPOSANTS LOCALISÉS ---

const LoadingScreen = () => (
  <Layout>
    <div className="flex flex-col items-center justify-center py-32 gap-3 w-full">
      <Loader2 className="w-8 h-8 text-[#2F5DFF] animate-spin" />
      <p className="text-xs font-semibold text-[#5C665F]">Initialisation du tableau de bord...</p>
    </div>
  </Layout>
);

const WarehouseCard = ({ wh, products, onNavigate, onAudit }) => {
  const attachedProducts = products.filter(p => p.entrepot === wh.id || p.entrepot === wh.nom);
  const capacityUsed = attachedProducts.reduce((acc, p) => acc + (Number(p.quantitee) || 0), 0);
  const ratio = wh.capacitee > 0 ? (capacityUsed / wh.capacitee) * 100 : 0;

  return (
    <div onClick={onNavigate} className="bg-white border border-[#E1E6E1] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2F5DFF] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-200 group">
      <div>
        <h3 className="font-bold text-base text-[#10141A] tracking-tight group-hover:text-[#2F5DFF] transition-colors">{wh.nom}</h3>
        <div className="flex items-center gap-1 text-[#96A099] mt-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <p className="text-xs font-semibold">{wh.localisation}</p>
        </div>
        <div className="mt-5 flex flex-col">
          <div className="flex items-end justify-between text-xs mb-1.5">
            <span className="text-[#96A099] font-semibold">Capacité utilisée</span>
            <span className="text-[#10141A] font-black">
              {capacityUsed.toLocaleString()} <span className="text-[#5C665F] font-bold">/ {wh.capacitee?.toLocaleString()} m²</span>
            </span>
          </div>
          <div className="w-full bg-[#FAFBFA] border border-[#E1E6E1] rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${ratio > 80 ? "bg-[#EF4438]" : "bg-[#0FA968]"}`} 
              style={{ width: `${Math.min(ratio, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-[#F4F6F4] flex justify-end">
        <button onClick={onAudit} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E1E6E1] hover:border-[#2F5DFF] hover:bg-[#EAEEFF] rounded-xl text-xs font-bold text-[#5C665F] hover:text-[#2F5DFF] transition-all h-[32px] min-w-[85px] justify-center">
          <NotepadText className="w-3.5 h-3.5" />
          <span>Auditer</span>
        </button>
      </div>
    </div>
  );
};

export default Home;