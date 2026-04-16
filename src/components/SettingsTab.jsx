import React, { useState, useEffect } from 'react';

function SettingsTab({ activeUser, setActiveUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    // Populate with existing user's data on load
    const usersData = JSON.parse(localStorage.getItem('olist_users') || '[]');
    const user = usersData.find(u => u.email === activeUser);
    if (user) {
      setEmail(user.email);
    }
  }, [activeUser]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });

    if (!email) {
      setMsg({ text: 'O E-mail de conta não pode ficar vazio.', type: 'error' });
      return;
    }

    // Security check: Must input current password before changing anything, 
    // but we won't strictly enforce if password is empty and we assume they just want to change email.
    // Wait, let's enforce matching the current password for security if they are trying to update something important.
    
    let usersData = JSON.parse(localStorage.getItem('olist_users') || '[]');
    const userIndex = usersData.findIndex(u => u.email === activeUser);

    if (userIndex === -1) {
      setMsg({ text: 'Conta não localizada. Sua sessão parece viciada. Faça Login de novo.', type: 'error' });
      return;
    }

    const matchedUser = usersData[userIndex];
    if (password !== matchedUser.password) {
      setMsg({ text: 'A senha atual está incorreta. Mudanças não foram salvas.', type: 'error' });
      return;
    }

    // Verifies valid update state before pushing changes
    if (email !== activeUser && usersData.find(u => u.email === email)) {
        setMsg({ text: 'Este e-mail futuro já está sendo usado por outro funcionário.', type: 'error' });
        return;
    }

    // Ready to overwrite
    usersData[userIndex].email = email;
    if (newPassword) {
      usersData[userIndex].password = newPassword;
    }

    // Save Data
    localStorage.setItem('olist_users', JSON.stringify(usersData));
    
    // Update active cache stamp if they changed email
    if (email !== activeUser) {
        localStorage.setItem('olist_active_user', email);
        setActiveUser(email);
    }

    setMsg({ text: 'Credenciais atualizadas com enorme sucesso!', type: 'success' });
    setPassword(''); // clean temporary security pin
    setNewPassword(''); // clean temp security field
  };

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteAccount = () => {
    const usersData = JSON.parse(localStorage.getItem('olist_users') || '[]');
    const newUsersData = usersData.filter(u => u.email !== activeUser);
    localStorage.setItem('olist_users', JSON.stringify(newUsersData));
    localStorage.removeItem('olist_active_user');
    setActiveUser(null);
  };

  return (
    <div className="content-container">
      <h1 className="title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Minhas Configurações ⚙️</h1>

      <div className="glass-panel chart-card" style={{ maxWidth: '600px', margin: '0' }}>
        <h2 className="chart-title">Gerenciador de Credenciais</h2>

        {msg.text && (
            <div className="error-message" style={{ 
                marginBottom: '1.5rem', 
                background: msg.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                color: msg.type === 'success' ? '#86efac' : '#fca5a5',
                borderColor: msg.type === 'success' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.3)'
            }}>
                {msg.text}
            </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
             <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Login E-mail (Olist App)</label>
             <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.875rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', fontFamily: 'inherit' }}
             />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />

          <div>
             <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Nova Senha Opcional</label>
             <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
               <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Deixe em branco para não alterar" 
                  style={{ width: '100%', padding: '0.875rem', paddingRight: '2.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }}
               />
               <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                 {showNewPassword ? (
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                 ) : (
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                 )}
               </button>
             </div>
          </div>

          <div>
             <label style={{ display: 'block', color: '#fca5a5', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Senha Atual (Apenas para atualizar dados)</label>
             <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
               <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Confirme sua identidade" required
                  style={{ width: '100%', padding: '0.875rem', paddingRight: '2.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.5)', color: 'white', borderRadius: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }}
               />
               <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                 {showPassword ? (
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                 ) : (
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                 )}
               </button>
             </div>
          </div>

          <button type="submit" style={{ padding: '1rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.2s', marginTop: '1rem' }} onMouseOver={e => e.currentTarget.style.background = 'var(--accent-hover)'} onMouseOut={e => e.currentTarget.style.background = 'var(--accent-color)'}>
             Aplicar Modificações
          </button>
        </form>

        <hr style={{ border: 'none', borderTop: '1px outset rgba(239, 68, 68, 0.3)', margin: '2rem 0 1.5rem 0' }} />
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button type="button" onClick={handleDeleteAccount} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>
            🗑️ Apagar Minha Conta
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '400px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h3 style={{ marginTop: 0, color: '#fca5a5', fontSize: '1.5rem' }}>⚠️ Atenção</h3>
            <p style={{ color: '#cbd5e1', marginBottom: '2rem', lineHeight: '1.5' }}>Você tem certeza que deseja deletar permanentemente a conta <strong>{activeUser}</strong>? Após a confirmação, você será deslogado.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button type="button" onClick={() => setShowConfirmModal(false)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: '#cbd5e1', border: '1px solid #475569', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button type="button" onClick={confirmDeleteAccount} style={{ padding: '0.75rem 1.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Sim, apagar agora</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SettingsTab;
