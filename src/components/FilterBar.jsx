function FilterBar({ data, filters, setFilters }) {
  // Extract unique options from raw flat data
  const months = [...new Set(data.map(d => d.m))].filter(Boolean).sort().reverse();
  const states = [...new Set(data.map(d => d.s))].filter(s => s && s !== '?').sort();
  const categories = [...new Set(data.map(d => d.c))].filter(c => c && c !== 'Desconhecido').sort();

  return (
    <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>Período da Compra</label>
        <select 
          className="filter-select"
          value={filters.month || ''} 
          onChange={e => setFilters({ ...filters, month: e.target.value })}
        >
          <option value="">Todo o Período</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>Localidade (UF)</label>
        <select 
          className="filter-select"
          value={filters.state || ''} 
          onChange={e => setFilters({ ...filters, state: e.target.value })}
        >
          <option value="">Todo o Brasil</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>Categoria Principal</label>
        <select 
          className="filter-select"
          value={filters.category || ''} 
          onChange={e => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Todas as Categorias</option>
          {categories.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
