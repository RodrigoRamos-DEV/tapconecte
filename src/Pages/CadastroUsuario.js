// src/pages/CadastroUsuario.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const CadastroUsuario = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Criar usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      
      // 2. Atualizar código no Firestore
      const codigoRef = doc(db, 'codes', state.codigo);
      await updateDoc(codigoRef, {
        status: 'used',
        usedBy: userCredential.user.uid,
        usedAt: new Date().toISOString()
      });

      // 3. Criar documento do usuário
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
        codigo: state.codigo,
        email,
        dadosCartao: null,
        createdAt: new Date().toISOString()
      });

      navigate('/cardform');

    } catch (error) {
      setError('Erro no cadastro: ' + error.message);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Criar Conta</h2>
      <p>Código válido: {state?.codigo}</p>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleCadastro}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CadastroUsuario;