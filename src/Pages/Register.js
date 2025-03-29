// src/pages/Register.js
import React, { useState } from 'react';
import { db, auth } from './firebase'; // Importando Firebase e Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Para definir se o usuário é admin
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Função para cadastrar o usuário no Firebase e Firestore
    const cadastrarUsuario = async () => {
        try {
            // Criando o usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Salvando os dados do usuário no Firestore
            await addDoc(collection(db, 'usuarios'), {
                email: email,
                isAdmin: isAdmin, // Definindo se é administrador ou não
                uid: user.uid, // Usando o uid do usuário para associar o Firestore com o Auth
            });

            alert('Usuário cadastrado com sucesso!');
            navigate('/login'); // Redireciona para a tela de login
        } catch (error) {
            setError('Erro ao cadastrar usuário. Verifique os dados.');
            console.error('Erro ao cadastrar usuário:', error);
        }
    };

    return (
        <div>
            <h2>Cadastro de Usuário</h2>
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
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={() => setIsAdmin(!isAdmin)}
                    />
                    Administrador?
                </label>
            </div>
            <button onClick={cadastrarUsuario}>Cadastrar</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;
