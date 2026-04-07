import KpiCard from './KpiCard';
import TopCategoriesChart from './TopCategoriesChart';

function ProductsTab({ data }) {
  return (
    <div className="content-container">
      <h1 className="title" style={{ textAlign: 'left' }}>Análise de Produtos</h1>
      
      <div className="kpi-grid">
        <KpiCard 
          title="Produtos Únicos Vendidos" 
          value={data.totalDistinctProducts.toLocaleString('pt-BR')} 
          icon="🛍️"
        />
        <KpiCard 
          title="Top Categoria" 
          value={data.topCategories[0]?.name || '-'} 
          icon="🏆"
        />
        <KpiCard 
          title="Faturamento Top Categoria" 
          value={`R$ ${data.topCategories[0]?.revenue?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) || 0}`} 
          icon="📈"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h2 className="chart-title">Top 10 Categorias por Receita</h2>
          <TopCategoriesChart data={data.topCategories} />
        </div>
      </div>
    </div>
  );
}

export default ProductsTab;
