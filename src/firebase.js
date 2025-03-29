import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrAdLC0qy31zzMUzmHioM5b5EWEk5KIms",
  authDomain: "tapconecte-68691.firebaseapp.com",
  projectId: "tapconecte-68691",
  storageBucket: "tapconecte-68691.appspot.com",
  messagingSenderId: "178713766138",
  appId: "1:178713766138:web:73031779bb067f62514143",
  measurementId: "G-GX0DH5X3JG"
};

// Inicialização simplificada sem persistência inicial
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Firestore com inicialização básica
const db = initializeFirestore(app, {});

export { auth, db, storage, app };