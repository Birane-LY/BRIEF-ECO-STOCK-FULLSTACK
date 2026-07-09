import React, { useState } from "react";
import Layout from "../components/Layout";
import ProductTable from "../table/ProductTable";
import ProductForm from "../forms/ProductForm"; 
import { Plus } from "lucide-react";

const WAREHOUSES_SEED = [
  { id: 'wh-1', name: 'Entrepôt Dakar-Port' },
  { id: 'wh-2', name: 'Entrepôt Thiès-Nord' },
  { id: 'wh-3', name: 'Entrepôt Kaolack-Centre' },
];

const INITIAL_PRODUCTS = [
  { id: 1, sku: 'PRO-1001', name: 'Riz brisé importé', warehouse: 'Entrepôt Dakar-Port', quantity: 1200, weight: '24 kg', expiration: '2027-02-10', state: 'DISPONIBLE' },
  { id: 2, sku: 'PRO-1002', name: 'Oignons frais', warehouse: 'Entrepôt Dakar-Port', quantity: 800, weight: '6,4 kg', expiration: '2026-07-14', state: 'PÉREMPTION' },
  { id: 3, sku: 'PRO-1003', name: "Huile d'arachide", warehouse: 'Entrepôt Dakar-Port', quantity: 340, weight: '3,4 kg', expiration: '2026-09-28', state: 'RÉSERVÉ' },
  { id: 4, sku: 'PRO-1004', name: 'Poisson séché (kethiakh)', warehouse: 'Entrepôt Dakar-Port', quantity: 210, weight: '1,05 kg', expiration: '2026-07-05', state: 'PÉREMPTION' },
  { id: 5, sku: 'PRO-1005', name: 'Mil local de Sédhiou', warehouse: 'Entrepôt Thiès-Nord', quantity: 950, weight: '18 kg', expiration: '2027-01-01', state: 'DISPONIBLE' },
];

const Product = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce produit de l'inventaire ?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="p-[24px] pb-0 flex items-center justify-between w-full">
        <div className="flex flex-col">
          <h1 className="flex font-black text-2xl text-[#10141A]">Produits</h1>
          <p className="text-[#5C665F] text-sm mt-1">
            {products.length} référence(s) tous les entrepôts confondus
          </p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2F5DFF] hover:bg-[#1B3FD1] rounded-xl text-white font-bold text-xs shadow-sm transition-all h-[39px]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Ajouter un produit</span>
        </button>
      </div>

      <div className="p-[24px] pb-2">
        <select 
          className="bg-[#FAFBFA] border border-[#E1E6E1] rounded-xl px-3 text-xs font-bold w-[240px] h-[42px] text-[#10141A] focus:outline-none focus:border-[#2F5DFF] cursor-pointer transition-all"
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
        >
          <option value="">Tous les entrepôts</option>
          {WAREHOUSES_SEED.map((wh) => (
            <option key={wh.id} value={wh.name}>{wh.name}</option>
          ))}
        </select>
      </div>

      <div className="px-[24px] pb-[24px]">
        <ProductTable 
          products={products} 
          selectedWarehouse={selectedWarehouse} 
          onEdit={handleStartEdit}
          onDelete={handleDeleteProduct}
        />
      </div>

      <ProductForm 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        onAdd={handleAddProduct}
        onUpdate={handleUpdateProduct}
        initialData={editingProduct}
      />
    </Layout>
  );
};

export default Product;
