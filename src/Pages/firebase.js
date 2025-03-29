// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Seu firebaseConfig obtido do Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBrAdLC0qy31zzMUzmHioM5b5EWEk5KIms",
    authDomain: "tapconecte-68691.firebaseapp.com",
    projectId: "tapconecte-68691",
    storageBucket: "tapconecte-68691.firebasestorage.app",
    messagingSenderId: "178713766138",
    appId: "1:178713766138:web:73031779bb067f62514143",
    measurementId: "G-GX0DH5X3JG"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Para o Firestore (banco de dados)
const auth = getAuth(app); // Para a autenticação

export { db, auth };
