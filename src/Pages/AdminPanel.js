import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Gerar código aleatório
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Buscar todos os códigos
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
      setError('Erro ao buscar códigos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo código (apenas para admins)
  const handleAddCode = async () => {
    if (!currentUser?.isAdmin) {
      setError('Acesso negado: apenas administradores podem gerar códigos');
      return;
    }

    if (!newCode.trim()) {
      setError('Digite um código válido');
      return;
    }

    try {
      await addDoc(collection(db, 'codes'), {
        code: newCode.toUpperCase(),
        status: 'available',
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
        usedBy: null,
        usedAt: null
      });
      setSuccess(`Código ${newCode} adicionado com sucesso!`);
      setNewCode('');
      fetchCodes();
    } catch (error) {
      setError('Erro ao adicionar código: ' + error.message);
    }
  };

  // Gerar e adicionar código aleatório
  const handleGenerateCode = async () => {
    const code = generateRandomCode();
    setNewCode(code);
    await handleAddCode();
  };

  // Inativar código (apenas para admins)
  const deactivateCode = async (codeId) => {
    if (!currentUser?.isAdmin) {
      setError('Acesso negado: apenas administradores podem desativar códigos');
      return;
    }

    try {
      await updateDoc(doc(db, 'codes', codeId), {
        status: 'inactive',
        deactivatedAt: serverTimestamp(),
        deactivatedBy: currentUser.uid
      });
      setSuccess('Código desativado com sucesso');
      fetchCodes();
    } catch (error) {
      setError('Erro ao desativar código: ' + error.message);
    }
  };

  // Logout
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      setError('Erro ao sair: ' + error.message);
    }
  };

  // Filtrar códigos
  const filteredCodes = codes.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (code.usedBy && code.usedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Carregar códigos ao montar o componente
  useEffect(() => {
    fetchCodes();
  }, []);

  // Limpar mensagens após 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Redirecionar se não for admin
  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return <div className="loading">Verificando acesso...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Painel Administrativo</h1>
        <div className="user-info">
          <span>{currentUser.email}</span>
          <button onClick={handleSignOut} className="logout-button">
            Sair
          </button>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="admin-content">
        <div className="code-controls">
          <h2>Gerenciar Códigos</h2>
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
            <div className="codes-list-header">
              <span>Código</span>
              <span>Status</span>
              <span>Criado em</span>
              <span>Usuário</span>
              <span>Ações</span>
            </div>
            <div className="codes-list">
              {filteredCodes.length > 0 ? (
                filteredCodes.map((code) => (
                  <div key={code.id} className={`code-item ${code.status}`}>
                    <span>{code.code}</span>
                    <span className={`status-badge ${code.status}`}>
                      {code.status === 'available' ? 'Disponível' : 
                       code.status === 'used' ? 'Utilizado' : 'Inativo'}
                    </span>
                    <span>
                      {code.createdAt?.toDate().toLocaleDateString()}
                    </span>
                    <span>{code.usedBy || '-'}</span>
                    <span>
                      {code.status === 'available' && (
                        <button 
                          onClick={() => deactivateCode(code.id)}
                          className="deactivate-button"
                        >
                          Desativar
                        </button>
                      )}
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
    </div>
  );
};

export default AdminPanel;