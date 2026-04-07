import KpiCard from './KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];

function StateDistributionChart({ data }) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
          <XAxis type="number" stroke="#94a3b8" tickFormatter={(val) => `R$ ${(val/1000).toFixed(0)}k`} />
          <YAxis dataKey="state" type="category" stroke="#94a3b8" width={50} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', textTransform: 'capitalize' }}
            formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita do Estado']}
          />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {data.slice(0, 10).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RegionsTab({ data }) {
  return (
    <div className="content-container">
      <h1 className="title" style={{ textAlign: 'left' }}>Visão Regional</h1>
      <div className="kpi-grid">
        <KpiCard title="Clientes Únicos" value={data.totalUniqueCustomers.toLocaleString('pt-BR')} icon="👥" />
        <KpiCard title="Estados Atingidos" value={data.stateData.length.toString()} icon="🗺️" />
        <KpiCard title="Estado Campeão de Vendas" value={data.stateData[0]?.state || '-'} icon="🥇" />
      </div>
      <div className="charts-grid">
        <div className="chart-card glass-panel" style={{ gridColumn: '1 / -1' }}>
          <h2 className="chart-title">Top 10 Estados por Receita Gerada</h2>
          <StateDistributionChart data={data.stateData} />
        </div>
      </div>
    </div>
  );
}

export default RegionsTab;
