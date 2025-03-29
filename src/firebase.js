// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 👈 Adicionei o Storage

const firebaseConfig = {
  apiKey: "AIzaSyBrAdLC0qy31zzMUzmHioM5b5EWEk5KIms",
  authDomain: "tapconecte-68691.firebaseapp.com",
  projectId: "tapconecte-68691",
  storageBucket: "tapconecte-68691.firebasestorage.app", // 👈 Já está correto!
  messagingSenderId: "178713766138",
  appId: "1:178713766138:web:73031779bb067f62514143",
  measurementId: "G-GX0DH5X3JG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporte os serviços que vai usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 👈 Novo export para o Storage

// (Analytics é opcional - só se for usar)
// const analytics = getAnalytics(app); 