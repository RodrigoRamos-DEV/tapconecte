// src/pages/Signup.js
import React, { useState } from 'react';
import { db, auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [codigo, setCodigo] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Função para verificar código de inscrição
    const verificarCodigo = async () => {
        const q = query(collection(db, 'codigos'), where('codigo', '==', codigo));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            setError('Código inválido!');
            return false;
        }
        const codigoDoc = querySnapshot.docs[0];
        if (codigoDoc.data().status === 'usado') {
            setError('Código já foi utilizado!');
            return false;
        }
        return true;
    };

    // Função para cadastrar o usuário
    const cadastrarUsuario = async () => {
        try {
            const codigoValido = await verificarCodigo();
            if (!codigoValido) return;

            // Criando o usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Salvando os dados do usuário no Firestore
            await addDoc(collection(db, 'usuarios'), {
                email: email,
                uid: user.uid,
                codigo: codigo,
            });

            // Atualizando o status do código para "usado"
            await updateDoc(doc(db, 'codigos', querySnapshot.docs[0].id), {
                status: 'usado',
            });

            alert('Usuário cadastrado com sucesso!');
            navigate('/cardform');
        } catch (error) {
            setError('Erro ao cadastrar o usuário!');
            console.error('Erro ao cadastrar o usuário:', error);
        }
    };

    return (
        <div>
            <h2>Cadastro de Usuário</h2>
            <input
                type="text"
                placeholder="Código de Inscrição"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
            />
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
            <button onClick={cadastrarUsuario}>Cadastrar</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Signup;
