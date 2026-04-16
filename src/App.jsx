import { useEffect, useState, useMemo } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import Login from './components/Login';
import OverviewTab from './components/OverviewTab';
import ProductsTab from './components/ProductsTab';
import RegionsTab from './components/RegionsTab';
import LogisticsTab from './components/LogisticsTab';
import SettingsTab from './components/SettingsTab';

function App() {
  const [activeUser, setActiveUser] = useState(localStorage.getItem('olist_active_user') || null);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({ month: '', state: '', category: '' });

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => {
        setRawData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar dados:", err);
        setLoading(false);
      });
  }, []);

  const computedData = useMemo(() => {
    if (!rawData) return null;

    // Apply global filters
    const filtered = rawData.filter(d => {
      if (filters.month && d.m !== filters.month) return false;
      if (filters.state && d.s !== filters.state) return false;
      if (filters.category && d.c !== filters.category) return false;
      return true;
    });

    let totalRevenue = 0;
    let totalFreight = 0;
    
    // Grouping maps
    const revByMonth = {};
    const revByCategory = {};
    const revByState = {};
    const statusCounts = {};

    // Unique Identifier Sets
    const orderSet = new Set();
    const customerSet = new Set();
    const productSet = new Set();
    const sellerSet = new Set();

    for (let i = 0; i < filtered.length; i++) {
        const d = filtered[i];
        
        // Tracking Unique Orders logic
        if (!orderSet.has(d.o)) {
            orderSet.add(d.o);
            statusCounts[d.st] = (statusCounts[d.st] || 0) + 1;
        }

        // Only compute Revenue/Financials for Delivered Orders
        if (d.st !== 'delivered') continue;

        totalRevenue += d.p;
        totalFreight += d.f;
        
        if (d.u !== '?') customerSet.add(d.u);
        productSet.add(d.pr);
        sellerSet.add(d.se);

        // Compute Dimensions
        if (d.m) revByMonth[d.m] = (revByMonth[d.m] || 0) + d.p;
        revByCategory[d.c] = (revByCategory[d.c] || 0) + d.p;
        if (d.s !== '?') revByState[d.s] = (revByState[d.s] || 0) + d.p;
    }

    const monthlyData = Object.entries(revByMonth)
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a,b) => a.month.localeCompare(b.month));

    const topCategories = Object.entries(revByCategory)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a,b) => b.revenue - a.revenue)
        .slice(0, 10);

    const stateData = Object.entries(revByState)
        .map(([state, revenue]) => ({ state, revenue }))
        .sort((a,b) => b.revenue - a.revenue);

    const orderStatusData = Object.entries(statusCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value);

    return {
        visaoGeral: {
            totalRevenue,
            totalOrders: orderSet.size,
            avgOrderValue: orderSet.size > 0 ? (totalRevenue / orderSet.size) : 0,
            monthlyData
        },
        produtos: {
            totalDistinctProducts: productSet.size,
            topCategories
        },
        regioes: {
            totalUniqueCustomers: customerSet.size,
            stateData
        },
        logistica: {
            totalSellers: sellerSet.size,
            totalFreight,
            orderStatusData
        }
    };
  }, [rawData, filters]);

  if (loading) {
    return (
      <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2 className="title" style={{ animation: 'pulse 1.5s infinite running' }}>Carregando 110.000 Pedidos...</h2>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('olist_active_user');
    setActiveUser(null);
  };

  if (!computedData) return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Erro crítico ao computar dados</div>;

  if (!activeUser) {
    return <Login onLoginSuccess={(email) => {
      localStorage.setItem('olist_active_user', email);
      setActiveUser(email);
    }} />;
  }

  return (
    <div className={`app-layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeUser={activeUser} 
        onLogout={handleLogout} 
        collapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      
      <div className="main-content">
        {/* Render filtering if NOT in settings */}
        {activeTab !== 'Settings' && <FilterBar data={rawData} filters={filters} setFilters={setFilters} />}
        
        {/* Dynamic Route Pages */}
        {activeTab === 'Overview' && <OverviewTab data={computedData.visaoGeral} />}
        {activeTab === 'Products' && <ProductsTab data={computedData.produtos} />}
        {activeTab === 'Regions' && <RegionsTab data={computedData.regioes} />}
        {activeTab === 'Logistics' && <LogisticsTab data={computedData.logistica} />}
        {activeTab === 'Settings' && <SettingsTab activeUser={activeUser} setActiveUser={setActiveUser} />}
      </div>
    </div>
  );
}

export default App;
