// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Pages/Login';
import AdminPanel from './Pages/AdminPanel';
import Register from './Pages/Register';
import CardForm from './Pages/CardForm';
import CardPreview from './Pages/CardPreview';



function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota do painel administrativo */}
        <Route path="/admin-panel" element={<AdminPanel />} />
        
        {/* Rota de registro */}
        <Route path="/register" element={<Register />} />
        
        {/* Rota do formulário do card */}
        <Route path="/form" element={<CardForm />} />
        <Route path="/card-preview" element={<CardPreview />} />

     
        
        {/* Página inicial: redireciona para o login */}
        <Route path="/" element={<Login />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;
