import './kpi.css' 
import { Warehouse, Box, TriangleAlert, TrendingUp, TrendingDown } from 'lucide-react'

const KpiCards = () => {
  const kpiData = [
    {
      id: 1,
      value: "5",
      change: "+1",
      title: 'Entrepôts actifs',
      icon: <Warehouse className="w-[18px] h-[18px]" style={{ color: '#2F5DFF' }} />,
      color: '#2F5DFF',
      subtitle: `1 suspendu(s) sur 6`,
      trend: 'up'
    },
    {
      id: 2,
      value: "64%",
      change: '+3%',
      title: `Taux d'utilisation moyen`,
      icon: <Box className="w-[18px] h-[18px]" style={{ color: '#0FA968' }} />,
      color: '#0FA968',
      subtitle: `Sur les entrepôts actifs`,
      trend: 'up'
    },
    {
      id: 3,
      value: "12",
      change: 'Attention',
      title: 'Alertes de péremption',
      icon: <TriangleAlert className="w-[18px] h-[18px]" style={{ color: '#EF4438' }} />,
      color: '#EF4438',
      subtitle: `Fenêtre critique : 30 jours`,
      trend: 'up'
    }
  ];

  return (
    <div className="kpiCards">
      {kpiData.map((kpi) => (
        <div key={kpi.id} className="kpiCard">
          <div className="kpiHeader">
            <div className="kpiIconWrapper" style={{ background: `${kpi.color}15` }}>
              {kpi.icon}
            </div>
            <span className={`kpiTrend ${kpi.trend}`}>
              <span>{kpi.change}</span>
              {kpi.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
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