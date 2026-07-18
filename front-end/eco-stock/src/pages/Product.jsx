import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ProductTable from "../table/ProductTable";
import ProductForm from "../forms/ProductForm";
import api from "../services/api";
import { Plus, Loader2 } from "lucide-react";

const Product = () => {
  const [data, setData] = useState({ products: [], warehouses: [], loading: true });
  const [selectedWhId, setSelectedWhId] = useState("");
  const [modal, setModal] = useState({ open: false, editing: null });

  useEffect(() => {
    Promise.all([api.get("/api/produits/"), api.get("/api/warehouses/")])
      .then(([prodRes, whRes]) => setData({ products: prodRes.data || [], warehouses: whRes.data || [], loading: false }))
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (payload) => {
    try {
      if (modal.editing) {
        const res = await api.patch(`/api/produits/${modal.editing.id}/`, {
          nom: payload.nom,
          quantitee: Number(payload.quantitee),
          etat: payload.etat,
          entrepot: Number(payload.entrepot),
        });
        setData(prev => ({ ...prev, products: prev.products.map(p => p.id === modal.editing.id ? res.data : p) }));
      } else {
        const res = await api.post("/api/produits/", payload);
        setData(prev => ({ ...prev, products: [res.data, ...prev.products] }));
      }
      setModal({ open: false, editing: null });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await api.delete(`/api/produits/${id}/`);
      setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  };

  // --- CALCULS DÉRIVÉS ---
  const filteredProducts = selectedWhId
    ? data.products.filter(p => Number(p.entrepot) === Number(selectedWhId) || p.entrepot === selectedWhId)
    : data.products;

  const tableProducts = filteredProducts.map(p => {
    const matchedWh = data.warehouses.find(w => w.id === p.entrepot);
    return {
      id: p.id,
      sku: `PRO-${1000 + p.id}`,
      name: p.nom,
      warehouse: matchedWh ? matchedWh.nom : (typeof p.entrepot === "string" ? p.entrepot : "Inconnu"),
      quantity: p.quantitee,
      weight: "Lot standard",
      expiration: p.date_expiration ? new Date(p.date_expiration).toLocaleDateString("fr-FR") : "Non spécifiée",
      state: p.etat ? p.etat.toUpperCase() : "DISPONIBLE",
    };
  });

  return (
    <Layout>
      <div className="p-6 pb-0 flex items-center justify-between w-full">
        <div className="flex flex-col">
          <h1 className="font-black text-2xl text-[#10141A]">Produits</h1>
          <p className="text-[#5C665F] text-sm mt-1">
            {data.loading ? "Chargement..." : `${data.products.length} référence(s) au total`}
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, editing: null })}
          disabled={data.loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2F5DFF] disabled:bg-[#96A099] rounded-xl text-white font-bold text-xs h-[39px]"
        >
          <Plus className="w-4 h-4" /> <span>Ajouter un produit</span>
        </button>
      </div>

      <div className="p-6 pb-2">
        <select
          className="bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl px-3 text-xs font-bold w-[240px] h-[42px] focus:outline-none"
          value={selectedWhId}
          onChange={(e) => setSelectedWhId(e.target.value)}
          disabled={data.loading}
        >
          <option value="">Tous les entrepôts</option>
          {data.warehouses.map(wh => (
            <option key={wh.id} value={wh.id}>{wh.nom}</option>
          ))}
        </select>
      </div>

      <div className="px-6 pb-6">
        {data.loading ? (
          <LoadingPlaceholder />
        ) : (
          <ProductTable
            products={tableProducts}
            onEdit={(row) => setModal({ open: true, editing: data.products.find(p => p.id === row.id) })}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ProductForm
        isOpen={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        onAdd={handleSave}
        onUpdate={handleSave}
        initialData={modal.editing}
        warehousesList={data.warehouses}
      />
    </Layout>
  );
};

// --- COMPOSANT INTERNE DE SQUELETTE ---

const LoadingPlaceholder = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-2 bg-white border border-[#E1E6E1] rounded-xl">
    <Loader2 className="w-6 h-6 text-[#2F5DFF] animate-spin" />
    <p className="text-xs font-semibold text-[#5C665F]">Synchronisation de l'inventaire...</p>
  </div>
);

export default Product;