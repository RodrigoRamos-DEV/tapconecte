import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './Componentes/PrivateRoute';
import Login from './Pages/Login';
import AdminPanel from './Pages/AdminPanel';
import ValidarCodigo from './Pages/ValidarCodigo';
import CardForm from './Pages/CardForm';
import CardPreview from './Pages/CardPreview';
import NotFound from './Pages/NotFound'; // 👈 Importe o NotFound

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 👇 Rota raiz redireciona para /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />

          {/* Rotas privadas */}
          <Route path="/validar-codigo" element={<PrivateRoute><ValidarCodigo /></PrivateRoute>} />
          <Route path="/cardform" element={<PrivateRoute><CardForm /></PrivateRoute>} />
          <Route path="/preview/:codigo" element={<PrivateRoute><CardPreview /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute isAdmin><AdminPanel /></PrivateRoute>} />

          {/* Rota 404 - SEMPRE a última! */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;