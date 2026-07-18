import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import WarehouseForm from "../forms/WarehouseForm";
import api from "../services/api";
import { Plus, MapPin, Loader2, SquarePen, Trash2 } from "lucide-react";

const Warehouses = () => {
  const [data, setData] = useState({ warehouses: [], products: [], loading: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [modal, setModal] = useState({ open: false, editing: null });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get("/api/warehouses/"), api.get("/api/produits/")])
      .then(([whRes, prodRes]) => setData({ warehouses: whRes.data || [], products: prodRes.data || [], loading: false }))
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (formData) => {
    try {
      if (modal.editing) {
        const res = await api.patch(`/api/warehouses/${modal.editing.id}/`, formData);
        setData(prev => ({ ...prev, warehouses: prev.warehouses.map(w => w.id === modal.editing.id ? res.data : w) }));
      } else {
        const res = await api.post("/api/warehouses/", formData);
        setData(prev => ({ ...prev, warehouses: [res.data, ...prev.warehouses] }));
      }
      setModal({ open: false, editing: null });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet entrepôt ?")) return;
    try {
      await api.delete(`/api/warehouses/${id}/`);
      setData(prev => ({ ...prev, warehouses: prev.warehouses.filter(w => w.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  };

  // --- CALCULS DÉRIVÉS ---
  const filteredAndSorted = data.warehouses
    .map(wh => {
      const used = data.products
        .filter(p => Number(p.entrepot) === Number(wh.id))
        .reduce((acc, p) => acc + (Number(p.quantitee) || 0), 0);
      return { ...wh, used };
    })
    .filter(wh => 
      wh.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wh.localisation?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => sortBy === "capacity-desc" ? Number(b.capacitee) - Number(a.capacitee) : 0);

  return (
    <Layout>
      <div className="p-6 pb-0 flex items-center justify-between w-full">
        <div className="flex flex-col">
          <h1 className="font-black text-2xl text-[#10141A]">Entrepôts</h1>
          <p className="text-[#5C665F] text-xs font-semibold">
            {data.loading ? "Calcul..." : `${data.warehouses.length} site(s) disponible(s)`}
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, editing: null })}
          disabled={data.loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#2F5DFF] disabled:bg-[#96A099] rounded-xl text-white font-bold text-xs h-[40px]"
        >
          <Plus className="w-4 h-4" /> <span>Ajouter un entrepôt</span>
        </button>
      </div>

      <div className="px-6 pt-5 pb-4 flex gap-3 w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={data.loading}
          placeholder="Rechercher un entrepôt..."
          className="flex-1 h-10 px-4 bg-white border border-[#E1E6E1] rounded-xl text-xs font-semibold text-[#10141A] focus:outline-none"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          disabled={data.loading}
          className="h-10 px-4 bg-white border border-[#E1E6E1] rounded-xl text-xs font-bold text-[#5C665F] focus:outline-none"
        >
          <option value="default">Ordre par défaut</option>
          <option value="capacity-desc">Plus grande capacité</option>
        </select>
      </div>

      <div className="p-6 pt-2">
        {data.loading ? (
          <Loader2 className="w-6 h-6 text-[#2F5DFF] animate-spin mx-auto" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map(wh => (
              <WarehouseCard
                key={wh.id}
                wh={wh}
                onNavigate={() => navigate(`/entrepots/${wh.id}`)}
                onEdit={() => setModal({ open: true, editing: wh })}
                onDelete={() => handleDelete(wh.id)}
              />
            ))}
          </div>
        )}
      </div>

      <WarehouseForm
        isOpen={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        onAdd={handleSave}
        onUpdate={handleSave}
        initialData={modal.editing}
      />
    </Layout>
  );
};

// --- COMPOSANT ENFANT LOCALISÉ ---

const WarehouseCard = ({ wh, onNavigate, onEdit, onDelete }) => {
  const maxCapacitee = Number(wh.capacitee) || 0;
  const ratio = maxCapacitee > 0 ? (wh.used / maxCapacitee) * 100 : 0;

  return (
    <div onClick={onNavigate} className="bg-white border border-[#E1E6E1] rounded-3xl p-6 flex flex-col justify-between hover:border-[#2F5DFF] hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative group transition-all duration-200">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-base text-[#10141A] pr-14 group-hover:text-[#2F5DFF] transition-colors">{wh.nom}</h3>
          <div className="absolute top-5 right-5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <button onClick={onEdit} className="p-1 text-[#5C665F] hover:text-[#2F5DFF]"><SquarePen className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-1 text-[#96A099] hover:text-[#EF4438]"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#96A099] mt-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <p className="text-xs font-semibold">{wh.localisation}</p>
        </div>
        <div className="mt-5 flex flex-col">
          <div className="flex items-end justify-between text-xs mb-1.5">
            <span className="text-[#96A099] font-semibold">Capacité utilisée</span>
            <span className="text-[#10141A] font-black">
              {wh.used.toLocaleString()} <span className="text-[#5C665F] font-bold">/ {maxCapacitee.toLocaleString()} m²</span>
            </span>
          </div>
          <div className="w-full bg-[#FAFBFA] border border-[#E1E6E1] rounded-full h-2 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${ratio > 80 ? "bg-[#EF4438]" : "bg-[#0FA968]"}`} style={{ width: `${Math.min(ratio, 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warehouses;