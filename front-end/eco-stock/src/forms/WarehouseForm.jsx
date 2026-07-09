import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

const WarehouseForm = ({ isOpen, onClose, onAdd, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({ name: "", location: "", total: "" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        location: initialData.location,
        total: initialData.total,
      });
    } else {
      setFormData({ name: "", location: "", total: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.total) return;

    const payload = {
      name: formData.name,
      location: formData.location,
      total: Number(formData.total),
    };

    if (initialData) {
      onUpdate({ ...initialData, ...payload });
    } else {
      onAdd({
        id: `wh-${Date.now()}`,
        used: 0,
        ...payload,
      });
    }
    onClose();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10141A]/20 backdrop-blur-[2px]">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-[540px] rounded-[32px] border border-[#E1E6E1] p-8 shadow-2xl flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-150">
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-[#96A099] hover:bg-[#F4F6F4] rounded-full transition-all">
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col gap-1 pr-8">
          <h2 className="font-black text-xl text-[#10141A] tracking-tight">
            {initialData ? "Modifier l'entrepôt" : "Ajouter un entrepôt"}
          </h2>
          <p className="text-[#5C665F] text-xs font-semibold">Enregistre un nouveau site logistique dans le réseau.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">Nom de l'entrepôt</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Entrepôt Rufisque-Sud"
              className="w-full h-11 px-4 bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl text-sm font-semibold text-[#10141A] focus:outline-none focus:border-[#2F5DFF] focus:bg-white transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">Localisation</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Rufisque, Sénégal"
                className="w-full h-11 px-4 bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl text-sm font-semibold text-[#10141A] focus:outline-none focus:border-[#2F5DFF] focus:bg-white transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">Capacité (m²)</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleChange}
                placeholder="Ex: 3000"
                className="w-full h-11 px-4 bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl text-sm font-semibold text-[#10141A] focus:outline-none focus:border-[#2F5DFF] focus:bg-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-4 pt-4 border-t border-[#F4F6F4]">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 h-11 border border-[#E1E6E1] hover:bg-[#F4F6F4] rounded-xl text-xs font-bold text-[#10141A] transition-all">
              Annuler
            </button>
            <button type="submit" className="w-full sm:w-auto px-6 h-11 bg-[#2F5DFF] hover:bg-[#1B3FD1] rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>{initialData ? "Enregistrer" : "Créer l'entrepôt"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseForm;
