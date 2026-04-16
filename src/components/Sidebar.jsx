function Sidebar({ activeTab, setActiveTab, activeUser, onLogout, collapsed, setCollapsed }) {
  const tabs = [
    { id: 'Overview', label: '📊 Visão Geral' },
    { id: 'Products', label: '🛍️ Produtos' },
    { id: 'Regions',  label: '🗺️ Regiões' },
    { id: 'Logistics',label: '🚚 Logística' },
    { id: 'Settings', label: '⚙️ Configurações' }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{ justifyContent: 'space-between', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' }}>
      
      <button 
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: collapsed ? '0' : '0.5rem', zIndex: 50,
          background: 'transparent', color: '#94a3b8', border: 'none',
          width: '32px', height: '64px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease', outline: 'none'
        }}
        onMouseOver={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
        onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        title={collapsed ? "Expandir Menu" : "Minimizar Menu"}
      >
        {collapsed ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        )}
      </button>

      <div className="sidebar-top-section" style={{ display: 'flex', flexDirection: 'column' }}>
        
        <div className="sidebar-title" style={{ fontSize: collapsed ? '1rem' : '1.5rem', textAlign: collapsed ? 'center' : 'left', paddingLeft: collapsed ? 0 : '1rem', transition: 'all 0.3s ease', whiteSpace: 'nowrap', overflow: 'hidden', marginBottom: '2rem' }}>
          {collapsed ? 'Olist' : 'Dashboard Olist'}
        </div>

        <div className="sidebar-nav">
          {tabs.map(tab => {
            const icon = tab.label.split(' ')[0];
            const text = tab.label.substring(tab.label.indexOf(' ') + 1);
            return (
              <div 
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', padding: collapsed ? '1rem 0' : '1rem', justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all 0.3s ease' }}
                title={tab.label}
              >
                <span style={{ flexShrink: 0, minWidth: collapsed ? '100%' : '1.5rem', textAlign: 'center', transition: 'all 0.3s ease' }}>{icon}</span>
                <span style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', marginLeft: collapsed ? 0 : '0.5rem', transition: 'all 0.15s ease' }}>{text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 1 }}>
        <div style={{ padding: collapsed ? '0.5rem 0' : '0.5rem', fontSize: collapsed ? '0.6rem' : '0.8rem', color: '#94a3b8', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', whiteSpace: 'nowrap', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'center' }}>
           <span style={{ minWidth: collapsed ? '100%' : 'auto', transition: 'all 0.3s ease' }}>👤</span>
           <span style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', marginLeft: collapsed ? 0 : '0.5rem', transition: 'all 0.15s ease' }}>{activeUser}</span>
        </div>
        <div className="nav-item" style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'center', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)', padding: collapsed ? '1rem 0' : '1rem', overflow: 'hidden', whiteSpace: 'nowrap', transition: 'all 0.3s ease' }} onClick={onLogout} title="Desconectar">
          <span style={{ minWidth: collapsed ? '100%' : '1.5rem', textAlign: 'center', transition: 'all 0.3s ease' }}>🚪</span>
          <span style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', marginLeft: collapsed ? 0 : '0.5rem', transition: 'all 0.15s ease' }}>Desconectar</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
