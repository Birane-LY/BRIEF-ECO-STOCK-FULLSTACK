import React, { useState, useEffect } from "react";
import "./kpi.css";
import api from "../services/api"; // Configured Axios instance
import {
  Warehouse,
  Box,
  TriangleAlert,
  TrendingUp,
  Loader2,
} from "lucide-react";

const KpiCards = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load both KPI data sources in parallel
  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        setLoading(true);
        const [whRes, prodRes] = await Promise.all([
          api.get("/api/warehouses/"),
          api.get("/api/produits/"),
        ]);
        setWarehouses(whRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.error("Error calculating KPI metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKpiData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 w-full">
        <Loader2 className="w-5 h-5 text-[#2F5DFF] animate-spin mr-2" />
        <span className="text-xs font-semibold text-[#5C665F]">
          Calcul des indicateurs logistiques...
        </span>
      </div>
    );
  }

  // KPI 1: compute total active warehouses
  const totalWarehouses = warehouses.length;

  // KPI 2: compute average usage ratio across all warehouses
  const globalCapacity = warehouses.reduce(
    (acc, wh) => acc + (Number(wh.capacitee) || 0),
    0,
  );
  const totalProductsVolume = products.reduce(
    (acc, p) => acc + (Number(p.quantitee) || 0),
    0,
  );
  const globalUsageRatio =
    globalCapacity > 0
      ? Math.round((totalProductsVolume / globalCapacity) * 100)
      : 0;

  // KPI 3: count all products in expired state
  const activeAlertsCount = products.filter((p) => p.etat === "perime").length;

  const kpiData = [
    {
      id: 1,
      value: totalWarehouses.toString(),
      change: "+1",
      title: "Entrepôts enregistrés",
      icon: (
        <Warehouse className="w-[18px] h-[18px]" style={{ color: "#2F5DFF" }} />
      ),
      color: "#2F5DFF",
      subtitle: `Réseau logistique global`,
      trend: "up",
    },
    {
      id: 2,
      value: `${globalUsageRatio}%`,
      change: "+3%",
      title: `Taux d'utilisation moyen`,
      icon: <Box className="w-[18px] h-[18px]" style={{ color: "#0FA968" }} />,
      color: "#0FA968",
      subtitle: `Volume stocké / Capacité m²`,
      trend: "up",
    },
    {
      id: 3,
      value: activeAlertsCount.toString(),
      change: activeAlertsCount > 0 ? "Critique" : "Stable",
      title: "Alertes de péremption",
      icon: (
        <TriangleAlert
          className="w-[18px] h-[18px]"
          style={{ color: "#EF4438" }}
        />
      ),
      color: "#EF4438",
      subtitle: `Lots nécessitant un retrait`,
      trend: "up",
    },
  ];

  return (
    <div className="kpiCards">
      {kpiData.map((kpi) => (
        <div key={kpi.id} className="kpiCard">
          <div className="kpiHeader">
            <div
              className="kpiIconWrapper"
              style={{ background: `${kpi.color}15` }}
            >
              {kpi.icon}
            </div>
            <span className={`kpiTrend ${kpi.trend}`}>
              <span>{kpi.change}</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="kpiBody">
            <h3 className="kpiValue">{kpi.value}</h3>
            <p className="kpiTitle">{kpi.title}</p>
            <span className="kpiSubtitle">{kpi.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
