import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ProductTable from "../table/ProductTable";
import { ArrowLeft, MapPin, X, BarChart3, Calendar } from "lucide-react";

const INITIAL_WAREHOUSES_DATA = {
  'wh-1': { name: 'Entrepôt Dakar-Port', location: 'Dakar, Sénégal', used: 3820, total: 5000, productsCount: 4, activeAlerts: 2 },
  'wh-2': { name: 'Entrepôt Thiès-Nord', location: 'Thiès, Sénégal', used: 1490, total: 3200, productsCount: 4, activeAlerts: 0 },
  'wh-3': { name: 'Entrepôt Kaolack-Centre', location: 'Kaolack, Sénégal', used: 3960, total: 4100, productsCount: 4, activeAlerts: 1 },
};

const INITIAL_PRODUCTS = [
  { id: 1, sku: 'PRO-1001', name: 'Riz brisé importé', warehouse: 'Entrepôt Dakar-Port', quantity: 1200, weight: '24 kg', expiration: '2027-02-10', state: 'DISPONIBLE' },
  { id: 2, sku: 'PRO-1002', name: 'Oignons frais', warehouse: 'Entrepôt Dakar-Port', quantity: 800, weight: '6,4 kg', expiration: '2026-07-14', state: 'PÉREMPTION' },
  { id: 3, sku: 'PRO-1003', name: "Huile d'arachide", warehouse: 'Entrepôt Dakar-Port', quantity: 340, weight: '3,4 kg', expiration: '2026-09-28', state: 'RÉSERVÉ' },
  { id: 4, sku: 'PRO-1004', name: 'Poisson séché (kethiakh)', warehouse: 'Entrepôt Dakar-Port', quantity: 210, weight: '1,05 kg', expiration: '2026-07-05', state: 'PÉREMPTION' },
  { id: 5, sku: 'PRO-1005', name: 'Mil local de Sédhiou', warehouse: 'Entrepôt Thiès-Nord', quantity: 950, weight: '18 kg', expiration: '2027-01-01', state: 'DISPONIBLE' },
];

const WarehouseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const warehouse = INITIAL_WAREHOUSES_DATA[id];
  
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!warehouse) {
    return (
      <Layout>
        <div className="p-6 text-center text-sm font-bold text-[#EF4438]">Entrepôt introuvable.</div>
      </Layout>
    );
  }

  const ratio = Math.round((warehouse.used / warehouse.total) * 100);

  const handleEditProduct = (productToEdit) => {
    // Redirection vers l'onglet général des produits pour modification centralisée
    navigate("/produits");
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Supprimer ce produit de l'inventaire de cet entrepôt ?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  return (
    <Layout>
      <div className="relative flex w-full h-full overflow-hidden bg-[#F8FAFC]">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          <button 
            onClick={() => navigate("/entrepots")}
            className="flex items-center gap-2 text-xs font-bold text-[#5C665F] hover:text-[#10141A] w-fit transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Retour au centre de pilotage</span>
          </button>

          <div className="bg-white border border-[#EAEFFF] rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
              <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-[#F1F5F9]" strokeDasharray="100, 100" stroke="currentColor" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#E8890B]" strokeDasharray={`${ratio}, 100`} stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-[#10141A] tracking-tighter">{ratio}%</span>
                  <span className="text-[8px] font-bold text-[#96A099] uppercase tracking-wider -mt-0.5">Capacité</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="font-black text-2xl text-[#10141A] tracking-tight">{warehouse.name}</h1>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-1 text-[#5C665F] text-xs font-semibold -mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#96A099]" />
                  <span>{warehouse.location}</span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-8 mt-1">
                  <div>
                    <p className="text-[9px] font-bold text-[#96A099] uppercase tracking-wider">Capacité</p>
                    <p className="text-sm font-black text-[#10141A] mt-0.5">{warehouse.used.toLocaleString()} <span className="text-[#5C665F] font-bold">/ {warehouse.total.toLocaleString()} m²</span></p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[#96A099] uppercase tracking-wider">Produits référencés</p>
                    <p className="text-sm font-black text-[#10141A] mt-0.5">{warehouse.productsCount}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[#96A099] uppercase tracking-wider">Alertes actives</p>
                    <p className="text-sm font-black text-[#EF4438] mt-0.5">{warehouse.activeAlerts}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-base font-black text-[#10141A] tracking-tight">Inventaire des produits</h2>
            <ProductTable 
              products={products}
              selectedWarehouse={warehouse.name} 
              onRowClick={(product) => setSelectedProduct(product)} 
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        </div>

        {selectedProduct && (
          <>
            <div className="fixed inset-0 bg-[#10141A]/10 backdrop-blur-[1px] z-40 transition-opacity" onClick={() => setSelectedProduct(null)} />
            <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white border-l border-[#EAEFFF] shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300">
              <div>
                <div className="p-6 border-b border-[#F8FAFC] flex items-center justify-between bg-[#F8FAFC]">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#96A099] uppercase font-bold px-2 py-0.5 bg-white border border-[#EAEFFF] rounded-md">{selectedProduct.sku}</span>
                    <h3 className="font-black text-lg text-[#10141A] mt-2 leading-tight">{selectedProduct.name}</h3>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="p-2 text-[#5C665F] hover:bg-[#F1F5F9] rounded-xl"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-[#EAEEFF] text-[#2F5DFF] rounded-xl"><BarChart3 className="w-4 h-4"/></div>
                    <div>
                      <p className="text-[10px] font-bold text-[#96A099] uppercase tracking-wide">Quantité et conditionnement</p>
                      <p className="text-base font-black text-[#10141A] mt-0.5">{selectedProduct.quantity.toLocaleString()} unités ({selectedProduct.weight})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-[#F8FAFC] border border-[#EAEFFF] text-[#5C665F] rounded-xl"><Calendar className="w-4 h-4"/></div>
                    <div>
                      <p className="text-[10px] font-bold text-[#96A099] uppercase tracking-wide">Date de durabilité minimale</p>
                      <p className="text-sm font-bold text-[#10141A] font-mono mt-0.5">{selectedProduct.expiration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default WarehouseDetails;
