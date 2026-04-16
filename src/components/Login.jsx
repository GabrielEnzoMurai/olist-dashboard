import { useState, useEffect } from 'react';
import './Login.css'; // Módulo CSS exclusivo para isolamento

function Login({ onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Initialization: ensure admin exists in browser storage
  useEffect(() => {
    const usersData = localStorage.getItem('olist_users');
    if (!usersData) {
      localStorage.setItem('olist_users', JSON.stringify([
        { email: 'admin@olist.com', password: 'admin' }
      ]));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const usersData = JSON.parse(localStorage.getItem('olist_users') || '[]');

    if (isLoginMode) {
      // Login validation
      const user = usersData.find(u => u.email === email && u.password === password);
      if (user) {
        onLoginSuccess(email);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else {
      // Register validation
      if (usersData.find(u => u.email === email)) {
        setError('Este e-mail já está cadastrado no sistema.');
        return;
      }
      usersData.push({ email, password });
      localStorage.setItem('olist_users', JSON.stringify(usersData));
      
      setSuccessMsg('Conta criada com sucesso! Faça login.');
      setIsLoginMode(true);
      setPassword(''); // Limpa a senha por segurança
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccessMsg('');
    setPassword('');
  };

  return (
      <div className="login-wrapper">
         <div className="glass-panel login-card">
            <h1 className="title" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>
              {isLoginMode ? 'Portal Olist' : 'Nova Conta'}
            </h1>
            
            {error && <div className="error-message">{error}</div>}
            {successMsg && <div className="error-message" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', borderColor: 'rgba(34, 197, 94, 0.5)' }}>{successMsg}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>E-mail de Acesso</label>
                <input 
                  type="email" 
                  className="login-input" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Senha Mestra</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="login-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: '2.5rem', boxSizing: 'border-box', width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '0.75rem',
                      background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0
                    }}
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn">
                {isLoginMode ? 'Acessar Dashboard' : 'Cadastrar Usuário'}
              </button>
            </form>

            <div className="login-toggle">
              {isLoginMode ? (
                <>Ainda não tem acesso? <span onClick={toggleMode}>Criar nova conta</span></>
              ) : (
                <>Já possui credenciais? <span onClick={toggleMode}>Fazer Login</span></>
              )}
            </div>
         </div>
      </div>
  );
}

export default Login;
