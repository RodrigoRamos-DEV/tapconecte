import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBrAdLC0qy31zzMUzmHioM5b5EWEk5KIms",
  authDomain: "tapconecte-68691.firebaseapp.com",
  projectId: "tapconecte-68691",
  storageBucket: "tapconecte-68691.appspot.com",
  messagingSenderId: "178713766138",
  appId: "1:178713766138:web:73031779bb067f62514143",
  measurementId: "G-GX0DH5X3JG"
};

// Inicialização condicional do Firebase
let firebaseApp;
if (!window.firebaseInitialized) {
  firebaseApp = initializeApp(firebaseConfig);
  window.firebaseInitialized = true;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// HMR para desenvolvimento
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <NextApp />
      </React.StrictMode>
    );
  });
}