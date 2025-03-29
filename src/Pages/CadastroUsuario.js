import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './CadastroUsuario.css';

const CadastroUsuario = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações básicas
    if (!email || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (!state?.codigo) {
      setError('Código de validação não encontrado');
      setLoading(false);
      return;
    }

    try {
      // 1. Criar usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Atualizar o código no Firestore
      const codeRef = doc(db, 'codes', state.codigo);
      await updateDoc(codeRef, {
        status: 'used',
        usedBy: user.uid,
        usedAt: new Date()
      });

      // 3. Criar documento do usuário
      await setDoc(doc(db, 'users', user.uid), {
        email,
        codigoVinculado: state.codigo,
        createdAt: new Date(),
        profileComplete: false
      });

      // Redirecionar para completar perfil
      navigate('/complete-profile');

    } catch (error) {
      let errorMessage = 'Erro ao cadastrar: ';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage += 'Este email já está em uso';
          break;
        case 'auth/invalid-email':
          errorMessage += 'Email inválido';
          break;
        case 'auth/weak-password':
          errorMessage += 'Senha muito fraca (mínimo 6 caracteres)';
          break;
        default:
          errorMessage += error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h2>Criar Conta</h2>
        <p className="codigo-info">Código válido: <strong>{state?.codigo}</strong></p>
        
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu email"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite novamente"
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="login-link">
          Já tem uma conta? <a href="/login">Faça login</a>
        </div>
      </div>
    </div>
  );
};

export default CadastroUsuario;