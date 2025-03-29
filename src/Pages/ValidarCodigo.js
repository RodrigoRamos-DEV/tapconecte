import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Adicione esta linha
import { db } from '../firebase'; // Importe o db corretamente

const ValidarCodigo = () => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleValidacao = async (e) => {
    e.preventDefault();

    try {
      // 1. Buscar o código no Firestore
      const codigoRef = doc(db, 'codigos', codigo.toUpperCase()); // Agora doc está definido
      const codigoDoc = await getDoc(codigoRef); // Agora getDoc está definido

      if (!codigoDoc.exists()) {
        setError('Código inválido!');
        return;
      }

      const dadosCodigo = codigoDoc.data();
      
      if (dadosCodigo.status !== 'disponivel') {
        setError('Código já utilizado!');
        return;
      }

      navigate('/cadastro', { state: { codigo: codigo.toUpperCase() } });

    } catch (err) {
      setError('Erro ao validar código: ' + err.message);
    }
  };

  return (
    <div className="container-validacao">
      <h1>Validar Código</h1>
      <form onSubmit={handleValidacao}>
        <input
          type="text"
          placeholder="Digite seu código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          maxLength="6"
        />
        <button type="submit">Validar</button>
        {error && <p className="erro">{error}</p>}
      </form>
    </div>
  );
};

export default ValidarCodigo;