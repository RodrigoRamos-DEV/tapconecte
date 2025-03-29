import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Adicionei o Link
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      if (user.email === 'admin@exemplo.com') {
        navigate('/admin');
        return;
      }

      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      
      if (userDoc.exists()) {
        navigate('/cardform');
      } else {
        navigate('/validar-codigo');
      }

    } catch (err) {
      setError('Erro no login: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
          required
        />
        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>

      {/* Seção para novos usuários */}
      <div style={styles.registerSection}>
        <span style={styles.registerText}>Novo usuário? </span>
        <Link to="/validar-codigo" style={styles.registerLink}>
          Valide seu código aqui
        </Link>
      </div>
    </div>
  );
}

// Estilos atualizados
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  registerSection: {
    marginTop: '20px',
    textAlign: 'center',
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
};

export default Login;