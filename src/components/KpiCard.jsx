function KpiCard({ title, value, icon }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.3s ease' }}
         onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
         onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ fontSize: '2.5rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{value}</p>
      </div>
    </div>
  );
}

export default KpiCard;
