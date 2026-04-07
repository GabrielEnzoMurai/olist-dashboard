function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const tabs = [
    { id: 'Overview', label: '📊 Visão Geral' },
    { id: 'Products', label: '🛍️ Produtos' },
    { id: 'Regions',  label: '🗺️ Regiões' },
    { id: 'Logistics',label: '🚚 Logística' },
    { id: 'Settings', label: '⚙️ Configurações' }
  ];

  return (
    <div className="sidebar" style={{ justifyContent: 'space-between' }}>
      <div>
        <div className="sidebar-title">Dashboard Olist</div>
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div>
        <div className="nav-item" style={{ color: '#fca5a5', marginTop: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)' }} onClick={onLogout}>
          🚪 Desconectar
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
