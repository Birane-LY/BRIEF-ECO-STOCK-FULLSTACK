import React, { useState } from "react";
import { X, ArrowLeftRight } from "lucide-react";
import api from "../services/api";

const TransferPanel = ({ selectedProduct, allWarehouses = [], onClose, onTransferSuccess }) => {
  const [targetWarehouseId, setTargetWarehouseId] = useState("");
  const [loading, setLoading] = useState(false);

  if (!selectedProduct) return null;

  const isExpired = selectedProduct.etat === "perime";

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!targetWarehouseId || isExpired) return;

    setLoading(true);
    try {
      const nextWarehouseId = Number(targetWarehouseId);
      await api.patch(`/api/produits/${selectedProduct.id}/`, {
        entrepot: nextWarehouseId,
      });
      
      if (onTransferSuccess) {
        onTransferSuccess(selectedProduct.id, nextWarehouseId);
      }
      onClose();
    } catch (err) {
      console.error("Error transferring product:", err.response?.data || err.message);
      alert("Une erreur technique est survenue lors du transfert.");
    } finally {
      setLoading(false);
      setTargetWarehouseId("");
    }
  };

  // Filtrer l'entrepôt actuel du produit pour éviter les transferts redondants
  const availableWarehouses = allWarehouses.filter(w => w.id !== selectedProduct.entrepot);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-[#F4F6F4] flex items-center justify-between bg-[#FAFBFA]">
        <div className="flex flex-col gap-1.5">
          <span className="w-fit text-[10px] font-mono tracking-wider text-[#5C665F] font-bold px-2 py-0.5 bg-white border border-[#E1E6E1] rounded-md">
            RÉF-{selectedProduct.id}
          </span>
          <h3 className="font-black text-lg text-[#10141A] tracking-tight">
            {selectedProduct.nom}
          </h3>
        </div>
        <button onClick={onClose} className="p-2 text-[#96A099] hover:bg-[#F4F6F4] rounded-xl transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3.5 p-4 bg-[#FAFBFA] border border-[#E1E6E1] rounded-2xl">
          <div className="p-2.5 bg-[#EAEEFF] text-[#2F5DFF] rounded-xl">
            <ArrowLeftRight className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5C665F] uppercase tracking-wide">Stock disponible</p>
            <p className="text-base font-black text-[#10141A] mt-0.5">
              {selectedProduct.quantitee?.toLocaleString() || 0} unités
            </p>
          </div>
        </div>

        {/* Formulaire de transfert */}
        <form onSubmit={handleTransfer} className="mt-2 pt-5 border-t border-[#F4F6F4] flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#5C665F] uppercase tracking-wide">
              Destination du transfert
            </label>
            <div className="relative">
              <select
                value={targetWarehouseId}
                onChange={(e) => setTargetWarehouseId(e.target.value)}
                disabled={isExpired || loading}
                className="w-full h-11 pl-4 pr-10 bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl text-sm font-semibold text-[#10141A] disabled:opacity-40 disabled:bg-[#FAFBFA] disabled:cursor-not-allowed focus:outline-none focus:border-[#2F5DFF] focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Sélectionner un entrepôt cible...</option>
                {availableWarehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nom} ({w.localisation})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#96A099] text-xs">▼</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!targetWarehouseId || isExpired || loading}
            className={`w-full h-11 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              isExpired 
                ? "bg-[#96A099] opacity-50 cursor-not-allowed" 
                : "bg-[#2F5DFF] hover:bg-[#1B3FD1] disabled:bg-[#E1E6E1] disabled:text-[#96A099] disabled:shadow-none"
            }`}
          >
            {isExpired 
              ? "Produit périmé : transfert interdit" 
              : loading 
                ? "Traitement en cours..." 
                : "Confirmer le transfert"
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferPanel;