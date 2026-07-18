import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ProductTable from "../table/ProductTable";
import api from "../services/api";
import { ArrowLeft, MapPin,} from "lucide-react";
import TransferPanel from "../components/TransferPanel";

const WarehouseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [whRes, prodRes, allWhRes] = await Promise.all([
        api.get(`/api/warehouses/${id}/`),
        api.get("/api/produits/"),
        api.get("/api/warehouses/"),
      ]);

      setWarehouse(whRes.data);
      setAllWarehouses(allWhRes.data.filter((w) => w.id !== Number(id)));
      setProducts(
        prodRes.data.filter(
          (p) => Number(p.entrepot) === Number(whRes.data.id),
        ),
      );
    } catch (err) {
      console.error("Error fetching warehouse details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate("/entrepots");
  };

  const handleTransferSuccess = (productId, newWarehouseId) => {
    // remove from current list and close drawer
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId),
    );
    setSelectedProduct(null);
    alert("Succés: Produit transféré.");
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-10 text-center text-xs font-bold text-[#5C665F]">
          Synchronisation avec le réseau...
        </div>
      </Layout>
    );
  }

  if (!warehouse) {
    return (
      <Layout>
        <div className="p-6 text-center font-bold text-[#EF4438]">
          Entrepôt introuvable.
        </div>
      </Layout>
    );
  }

  const totalProd = products.length;
  const disponibleProd = products.filter((p) => p.etat === "disponible").length;
  const perimeProd = products.filter((p) => p.etat === "perime").length;
  const ratioDispo =
    totalProd > 0 ? Math.round((disponibleProd / totalProd) * 100) : 0;
  const ratioPerime =
    totalProd > 0 ? Math.round((perimeProd / totalProd) * 100) : 0;
  const capacityUsed = products.reduce(
    (acc, p) => acc + (Number(p.quantitee) || 0),
    0,
  );

  return (
    <Layout>
      <div className="relative flex w-full h-full overflow-hidden bg-[#F8FAFC]">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-xs font-bold text-[#5C665F] hover:text-[#10141A] w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />{" "}
            <span>Retour au centre de pilotage</span>
          </button>

          <div className="bg-white border border-[#EAEFFF] rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="flex flex-col gap-2 w-full text-center sm:text-left">
              <h1 className="font-black text-2xl text-[#10141A] tracking-tight">
                {warehouse.nom}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[#5C665F] text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#96A099]" />{" "}
                <span>{warehouse.localisation}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E1E6E1] p-5 rounded-2xl">
              <p className="text-[10px] font-bold text-[#96A099] uppercase tracking-wider">
                Lots Disponibles
              </p>
              <p className="text-xl font-black text-[#0FA968] mt-1">
                {disponibleProd}{" "}
                <span className="text-xs text-[#5C665F]">({ratioDispo}%)</span>
              </p>
              <div className="w-full bg-[#FAFBFA] rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#0FA968]"
                  style={{ width: `${ratioDispo}%` }}
                />
              </div>
            </div>
            <div className="bg-white border border-[#E1E6E1] p-5 rounded-2xl">
              <p className="text-[10px] font-bold text-[#96A099] uppercase tracking-wider">
                Lots Périmés (Alertes)
              </p>
              <p className="text-xl font-black text-[#EF4438] mt-1">
                {perimeProd}{" "}
                <span className="text-xs text-[#5C665F]">({ratioPerime}%)</span>
              </p>
              <div className="w-full bg-[#FAFBFA] rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#EF4438]"
                  style={{ width: `${ratioPerime}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-base font-black text-[#10141A] tracking-tight">
              Inventaire des stocks ({capacityUsed.toLocaleString()} m² occupés)
            </h2>

            <ProductTable
              products={products.map((p) => ({
                id: p.id,
                // Add a visual suffix to indicate the item is selectable / actionable
                name: `${p.nom}`,
                sku: `SKU-${1000 + p.id}`,
                warehouse: warehouse.nom,
                quantity: p.quantitee,
                weight: "Lot unique",
                expiration: p.date_expiration
                  ? new Date(p.date_expiration).toLocaleDateString("fr-FR")
                  : "Non spécifiée",
                state: p.etat ? p.etat.toUpperCase() : "DISPONIBLE",
              }))}
              onRowClick={(product) => {
                const original = products.find(
                  (orig) => orig.id === product.id,
                );
                setSelectedProduct(original);
              }}
            />
          </div>
        </div>

      
        {selectedProduct && (
          <>
            <div
              className="fixed inset-0 bg-[#10141A]/10 backdrop-blur-[1px] z-40"
              onClick={() => setSelectedProduct(null)}
            />
            <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white border-l border-[#EAEFFF] shadow-2xl z-50 flex flex-col justify-between">
              <TransferPanel
                selectedProduct={selectedProduct}
                allWarehouses={allWarehouses}
                onClose={() => setSelectedProduct(null)}
                onTransferSuccess={handleTransferSuccess}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default WarehouseDetails;
