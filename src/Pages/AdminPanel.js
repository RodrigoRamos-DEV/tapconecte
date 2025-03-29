import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css'; // Create this CSS file for styling

const AdminPanel = () => {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch all codes from Firestore
  const fetchCodes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'codes'));
      const querySnapshot = await getDocs(q);
      const codesData = [];
      querySnapshot.forEach((doc) => {
        codesData.push({ id: doc.id, ...doc.data() });
      });
      setCodes(codesData);
    } catch (error) {
      console.error('Error fetching codes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate a new random code
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing characters
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Add a new code to Firestore
  const handleAddCode = async () => {
    if (!newCode.trim()) return;
    
    try {
      await addDoc(collection(db, 'codes'), {
        code: newCode.toUpperCase(),
        status: 'available',
        createdAt: new Date().toISOString(),
        usedBy: null,
        usedAt: null
      });
      setNewCode('');
      fetchCodes(); // Refresh the list
    } catch (error) {
      console.error('Error adding code:', error);
    }
  };

  // Generate and add a random code
  const handleGenerateCode = async () => {
    const code = generateRandomCode();
    setNewCode(code);
    await handleAddCode();
  };

  // Sign out admin
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Filter codes based on search term
  const filteredCodes = codes.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (code.usedBy && code.usedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchCodes();
  }, []);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Painel Administrativo</h1>
        <button onClick={handleSignOut} className="logout-button">
          Sair
        </button>
      </header>

      <div className="code-controls">
        <div className="code-input-group">
          <input
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Digite um código ou gere aleatório"
            maxLength="6"
            className="code-input"
          />
          <button onClick={handleAddCode} className="add-button">
            Adicionar Código
          </button>
          <button onClick={handleGenerateCode} className="generate-button">
            Gerar Código
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar códigos ou usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="codes-list-container">
          <h2>Códigos Cadastrados</h2>
          <div className="codes-list-header">
            <span>Código</span>
            <span>Status</span>
            <span>Usuário</span>
            <span>Data</span>
          </div>
          <div className="codes-list">
            {filteredCodes.length > 0 ? (
              filteredCodes.map((code) => (
                <div key={code.id} className={`code-item ${code.status}`}>
                  <span>{code.code}</span>
                  <span className={`status-badge ${code.status}`}>
                    {code.status === 'available' ? 'Disponível' : 'Utilizado'}
                  </span>
                  <span>{code.usedBy || '-'}</span>
                  <span>
                    {code.usedAt 
                      ? new Date(code.usedAt).toLocaleDateString() 
                      : new Date(code.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-codes">Nenhum código encontrado</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;