// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// 1. Criar o contexto
const AuthContext = createContext();

// 2. Provedor de autenticação
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); // Dados adicionais do Firestore
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 3. Monitorar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuário logado: buscar dados adicionais no Firestore
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData(null);
        }

        setCurrentUser(user);
      } else {
        // Usuário deslogado
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Limpar na desmontagem
  }, []);

  // 4. Função de logout
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  // 5. Valor do contexto
  const value = {
    currentUser,
    userData,
    isAdmin: currentUser?.email === 'admin@exemplo.com', // Verifica se é admin
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 6. Hook personalizado para usar o contexto
export function useAuth() {
  return useContext(AuthContext);
}