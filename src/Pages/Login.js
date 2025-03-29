// src/pages/Login.js
import React, { useState } from 'react';
import { db, auth } from './firebase'; // Importando Firestore e Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Função para verificar o login (usuário ou admin)
    const verificarLogin = async () => {
        try {
            // Autenticando o usuário com o Firebase Auth
            await signInWithEmailAndPassword(auth, email, senha);

            // Verificando se é um login de administrador ou de usuário
            const q = query(collection(db, 'usuarios'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Usuário não encontrado.');
            } else {
                const userDoc = querySnapshot.docs[0];
                const isAdmin = userDoc.data().isAdmin; // Assume que o campo 'isAdmin' é armazenado no Firestore.

                if (isAdmin) {
                    // Se for admin, redireciona para o painel administrativo
                    navigate('/admin-panel');
                } else {
                    // Caso contrário, vai para o perfil do usuário
                    navigate('/profile'); // Redirecionar para o perfil do usuário
                }
            }
        } catch (error) {
            setError('Erro de autenticação. Verifique seus dados.');
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
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
            <button onClick={verificarLogin}>Entrar</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
