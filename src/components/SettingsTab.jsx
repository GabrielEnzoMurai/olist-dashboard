import React, { useState, useEffect } from 'react';

function SettingsTab({ activeUser, setActiveUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

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
             <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Deixe em branco para não alterar" 
                style={{ width: '100%', padding: '0.875rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', fontFamily: 'inherit' }}
             />
          </div>

          <div>
             <label style={{ display: 'block', color: '#fca5a5', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Senha Atual (Obrigatória para confirmar)</label>
             <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Confirme sua identidade" required
                style={{ width: '100%', padding: '0.875rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.5)', color: 'white', borderRadius: '8px', fontFamily: 'inherit' }}
             />
          </div>

          <button type="submit" style={{ padding: '1rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.2s', marginTop: '1rem' }} onMouseOver={e => e.currentTarget.style.background = 'var(--accent-hover)'} onMouseOut={e => e.currentTarget.style.background = 'var(--accent-color)'}>
             Aplicar Modificações
          </button>
        </form>
      </div>

    </div>
  );
}

export default SettingsTab;
