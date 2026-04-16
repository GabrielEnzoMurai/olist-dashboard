import KpiCard from './KpiCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Palette with good contrast but muted saturation for readability
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b', '#06b6d4', '#f43f5e'];

const STATUS_TRANSLATION = {
  'delivered': 'Entregue',
  'shipped': 'Enviado',
  'canceled': 'Cancelado',
  'unavailable': 'Indisponível',
  'invoiced': 'Faturado',
  'processing': 'Processando',
  'created': 'Criado',
  'approved': 'Aprovado'
};

function OrderStatusChart({ data }) {
  const translatedData = data.map(item => ({
    ...item,
    name: STATUS_TRANSLATION[item.name] || item.name
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={translatedData}
            innerRadius={100}
            outerRadius={140}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', textTransform: 'capitalize' }} 
            formatter={(val) => [val.toLocaleString('pt-BR'), 'Pedidos']}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function LogisticsTab({ data }) {
  return (
    <div className="content-container">
      <h1 className="title" style={{ textAlign: 'left' }}>Sellers & Logística</h1>
      <div className="kpi-grid">
        <KpiCard title="Lojistas (Sellers)" value={data.totalSellers.toLocaleString('pt-BR')} icon="🏪" />
        <KpiCard title="Receita de Fretes" value={`R$ ${data.totalFreight.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} icon="🚚" />
        <KpiCard title="Pedidos Entregues" value={data.orderStatusData.find(s => s.name === 'delivered')?.value.toLocaleString('pt-BR') || 0} icon="✅" />
      </div>
      <div className="charts-grid">
        <div className="chart-card glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h2 className="chart-title">Distribuição do Status dos Pedidos (Em toda a base Olist)</h2>
          <OrderStatusChart data={data.orderStatusData} />
        </div>
      </div>
    </div>
  );
}

export default LogisticsTab;
