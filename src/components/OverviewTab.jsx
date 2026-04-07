import KpiCard from './KpiCard';
import RevenueChart from './RevenueChart';

function OverviewTab({ data }) {
  return (
    <div className="content-container">
      <h1 className="title" style={{ textAlign: 'left' }}>Visão Geral</h1>
      
      <div className="kpi-grid">
        <KpiCard 
          title="Receita Total Líquida" 
          value={`R$ ${data.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon="💰"
        />
        <KpiCard 
          title="Pedidos Entregues" 
          value={data.totalOrders.toLocaleString('pt-BR')} 
          icon="📦"
        />
        <KpiCard 
          title="Ticket Médio" 
          value={`R$ ${data.avgOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon="📊"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h2 className="chart-title">Receita ao Longo do Tempo</h2>
          <RevenueChart data={data.monthlyData} />
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
