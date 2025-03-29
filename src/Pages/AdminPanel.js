// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminPanel = () => {
    const [codigo, setCodigo] = useState('');
    const [codigosGerados, setCodigosGerados] = useState([]);
    const [error, setError] = useState('');

    // Função para gerar código aleatório
    const gerarCodigo = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let codigoGerado = '';
        for (let i = 0; i < 8; i++) {
            codigoGerado += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCodigo(codigoGerado);
    };

    // Função para salvar código no banco de dados
    const salvarCodigo = async () => {
        if (codigo === '') {
            setError('Código não gerado!');
            return;
        }

        try {
            await addDoc(collection(db, 'codigos'), {
                codigo: codigo,
                status: 'não usado',  // Inicialmente "não usado"
            });
            alert('Código gerado e salvo com sucesso!');
            setCodigo('');  // Limpar o código
            fetchCodigos();  // Atualizar a lista de códigos
        } catch (error) {
            console.error('Erro ao salvar o código:', error);
            setError('Erro ao salvar o código!');
        }
    };

    // Função para buscar todos os códigos do banco de dados
    const fetchCodigos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'codigos'));
            const codigosArray = querySnapshot.docs.map(doc => doc.data());
            setCodigosGerados(codigosArray);
        } catch (error) {
            console.error('Erro ao buscar códigos:', error);
        }
    };

    useEffect(() => {
        fetchCodigos();
    }, []);

    return (
        <div>
            <h2>Painel Administrativo</h2>
            <button onClick={gerarCodigo}>Gerar Código</button>
            <button onClick={salvarCodigo}>Salvar Código</button>
            {codigo && <p>Código gerado: {codigo}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Códigos Gerados</h3>
            <ul>
                {codigosGerados.map((codigoDoc, index) => (
                    <li key={index}>
                        {codigoDoc.codigo} - {codigoDoc.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
