import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

const WAREHOUSES_OPTIONS = [
  "Entrepôt Dakar-Port",
  "Entrepôt Thiès-Nord",
  "Entrepôt Kaolack-Centre",
  "Entrepôt Saint-Louis",
  "Entrepôt Touba-Est",
  "Entrepôt Ziguinchor",
];

const ProductForm = ({ isOpen, onClose, onAdd, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    weight: "",
    expiration: "",
    warehouse: WAREHOUSES_OPTIONS[0],
    state: "DISPONIBLE",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        quantity: initialData.quantity,
        weight: initialData.weight.replace(" kg", "").replace(",", "."),
        expiration: initialData.expiration,
        warehouse: initialData.warehouse,
        state: initialData.state,
      });
    } else {
      setFormData({
        name: "",
        quantity: "",
        weight: "",
        expiration: "",
        warehouse: WAREHOUSES_OPTIONS[0],
        state: "DISPONIBLE",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (selectedState) => {
    setFormData((prev) => ({ ...prev, state: selectedState }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.weight || !formData.expiration) return;

    const productPayload = {
      name: formData.name,
      warehouse: formData.warehouse,
      quantity: Number(formData.quantity),
      weight: `${formData.weight.replace('.', ',')} kg`,
      expiration: formData.expiration,
      state: formData.state,
    };

    if (initialData) {
      onUpdate({ ...initialData, ...productPayload });
    } else {
      onAdd({
        id: Date.now(),
        sku: `PRO-${Math.floor(1000 + Math.random() * 9000)}`,
        ...productPayload
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
            {initialData ? "Modifier le produit" : "Ajouter un produit"}
          </h2>
          <p className="text-[#5C665F] text-xs font-semibold">Référence un nouveau lot dans l'inventaire d'un entrepôt.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">Nom du produit</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Sacs de mil"
              className="w-full h-11 px-4 bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl text-sm font-semibold text-[#10141A] focus:outline-none focus:border-[#2F5DFF] focus:bg-white transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">Quantité (unités)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Ex: 500"
                className="w-full h-11 px-4 bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl text-sm font-semibold text-[#10141A] focus:outline-none focus:border-[#2F5DFF] focus:bg-white transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">Poids total (kg)</label>
              <input
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Ex: 1200"
                className="w-full h-11 px-4 bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl text-sm font-semibold text-[#10141A] focus:outline-none focus:border-[#2F5DFF] focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">Date de durabilité</label>
              <input
                type="date"
                name="expiration"
                value={formData.expiration}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl text-sm font-semibold text-[#10141A] focus:outline-none focus:border-[#2F5DFF] focus:bg-white transition-all cursor-pointer"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">Entrepôt</label>
              <div className="relative">
                <select
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleChange}
                  className="w-full h-11 pl-4 pr-10 bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl text-sm font-semibold text-[#10141A] focus:outline-none focus:border-[#2F5DFF] focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {WAREHOUSES_OPTIONS.map((wh) => (
                    <option key={wh} value={wh}>{wh}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#96A099] text-xs">▼</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">Statut de réservation</label>
            <div className="grid grid-cols-3 gap-2 bg-[#FAFBFA] border border-[#E1E6E1] p-1 rounded-xl">
              {[
                { key: "DISPONIBLE", label: "Disponible" },
                { key: "RÉSERVÉ", label: "Réservé" },
                { key: "PÉREMPTION", label: "Périmé" }
              ].map((item) => {
                const isSelected = formData.state === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleStateChange(item.key)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-white text-[#2F5DFF] shadow-sm border border-[#2F5DFF]/20"
                        : "text-[#5C665F] hover:text-[#10141A]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-2 pt-4 border-t border-[#F4F6F4]">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 h-11 border border-[#E1E6E1] hover:bg-[#F4F6F4] rounded-xl text-xs font-bold text-[#10141A] transition-all">
              Annuler
            </button>
            <button type="submit" className="w-full sm:w-auto px-6 h-11 bg-[#2F5DFF] hover:bg-[#1B3FD1] rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-[#2F5DFF]/10">
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>{initialData ? "Enregistrer" : "Créer le produit"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
