import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import WarehouseForm from "../forms/WarehouseForm";
import { Plus, MapPin, NotepadText, Loader2, Search, SlidersHorizontal, SquarePen, Trash2 } from "lucide-react";

const INITIAL_WAREHOUSES = [
  { id: 'wh-1', name: 'Entrepôt Dakar-Port', location: 'Dakar, Sénégal', used: 3820, total: 5000 },
  { id: 'wh-2', name: 'Entrepôt Thiès-Nord', location: 'Thiès, Sénégal', used: 1490, total: 3200 },
  { id: 'wh-3', name: 'Entrepôt Kaolack-Centre', location: 'Kaolack, Sénégal', used: 3960, total: 4100 },
  { id: 'wh-4', name: 'Entrepôt Saint-Louis', location: 'Saint-Louis, Sénégal', used: 980, total: 2800 },
  { id: 'wh-5', name: 'Entrepôt Touba-Est', location: 'Touba, Sénégal', used: 210, total: 3600 },
  { id: 'wh-6', name: 'Entrepôt Ziguinchor', location: 'Ziguinchor, Sénégal', used: 1680, total: 2200 },
];

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [loadingAuditId, setLoadingAuditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const navigate = useNavigate();

  const filteredWarehouses = warehouses.filter((wh) => {
    const matchesName = wh.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = wh.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesName || matchesLocation;
  });

  const sortedWarehouses = [...filteredWarehouses].sort((a, b) => {
    if (sortBy === "capacity-desc") return b.total - a.total;
    if (sortBy === "occupation-desc") {
      const ratioA = a.total > 0 ? a.used / a.total : 0;
      const ratioB = b.total > 0 ? b.used / b.total : 0;
      return ratioB - ratioA;
    }
    return 0;
  });

  const handleAuditClick = (e, warehouseId, warehouseName) => {
    e.stopPropagation();
    setLoadingAuditId(warehouseId);
    setTimeout(() => {
      setLoadingAuditId(null);
      alert(`[Simulation] Audit de ${warehouseName} complété.`);
    }, 800);
  };

  const handleAddWarehouse = (newWh) => {
    setWarehouses((prev) => [newWh, ...prev]);
  };

  const handleUpdateWarehouse = (updatedWh) => {
    setWarehouses((prev) => prev.map((w) => w.id === updatedWh.id ? updatedWh : w));
    setEditingWarehouse(null);
  };

  const handleDeleteWarehouse = (e, id) => {
    e.stopPropagation(); 
    if (window.confirm("Voulez-vous vraiment supprimer cet entrepôt du réseau de distribution ?")) {
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const handleStartEdit = (e, wh) => {
    e.stopPropagation();
    setEditingWarehouse(wh);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="p-[24px] pb-0 flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
        <div className="flex flex-col">
          <h1 className="font-black text-2xl text-[#10141A] tracking-tight">Entrepôts</h1>
          <p className="text-[#5C665F] text-xs font-semibold mt-0.5">
            {warehouses.length} site(s) logistique(s) disponibles.
          </p>
        </div>
        <button 
          onClick={() => { setEditingWarehouse(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2F5DFF] hover:bg-[#1B3FD1] rounded-xl text-white font-bold text-xs transition-all h-[40px] shadow-sm shadow-[#2F5DFF]/10"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Ajouter un entrepôt</span>
        </button>
      </div>

      <div className="px-[24px] pt-5 pb-4 flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#96A099] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un entrepôt ou une ville..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-[#E1E6E1] rounded-xl text-xs font-semibold text-[#10141A] placeholder-[#96A099] focus:outline-none focus:border-[#2F5DFF] transition-all"
          />
        </div>

        <div className="relative min-w-[180px]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#5C665F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full h-10 pl-9 pr-8 bg-white border border-[#E1E6E1] rounded-xl text-xs font-bold text-[#5C665F] focus:outline-none focus:border-[#2F5DFF] appearance-none cursor-pointer"
          >
            <option value="default">Ordre par défaut</option>
            <option value="capacity-desc">Plus grande capacité</option>
            <option value="occupation-desc">Taux d'occupation élevé</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#96A099] text-[10px]">▼</div>
        </div>
      </div>

      <div className="p-[24px] pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWarehouses.map((wh) => {
            const ratio = wh.total > 0 ? (wh.used / wh.total) * 100 : 0;
            return (
              <div 
                key={wh.id}
                onClick={() => navigate(`/entrepots/${wh.id}`)}
                className="bg-white border border-[#E1E6E1] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2F5DFF] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] cursor-pointer transition-all duration-200 group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-base text-[#10141A] tracking-tight group-hover:text-[#2F5DFF] transition-colors pr-14">
                      {wh.name}
                    </h3>
                    
                    <div className="absolute top-5 right-5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={(e) => handleStartEdit(e, wh)}
                        className="p-1.5 hover:bg-[#EAEEFF] text-[#5C665F] hover:text-[#2F5DFF] rounded-lg transition-all"
                      >
                        <SquarePen className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteWarehouse(e, wh.id)}
                        className="p-1.5 hover:bg-[#FDEAE8] text-[#96A099] hover:text-[#EF4438] rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                        className={`h-full rounded-full transition-all duration-300 ${ratio > 80 ? 'bg-[#EF4438]' : 'bg-[#0FA968]'}`} 
                        style={{ width: `${ratio}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F4F6F4] flex justify-end">
                  <button 
                    onClick={(e) => handleAuditClick(e, wh.id, wh.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E1E6E1] hover:border-[#2F5DFF] hover:bg-[#EAEEFF] rounded-xl text-xs font-bold text-[#5C665F] hover:text-[#2F5DFF] transition-all h-[32px] min-w-[85px] justify-center"
                  >
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

        {sortedWarehouses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-dashed border-[#E1E6E1] rounded-3xl mt-4">
            <p className="text-sm font-semibold text-[#5C665F]">Aucun entrepôt ne correspond à votre recherche.</p>
          </div>
        )}
      </div>

      <WarehouseForm 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingWarehouse(null); }} 
        onAdd={handleAddWarehouse}
        onUpdate={handleUpdateWarehouse}
        initialData={editingWarehouse}
      />
    </Layout>
  );
};

export default Warehouses;
