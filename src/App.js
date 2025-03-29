import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthLoader from './Componentes/AuthLoader';
import PrivateRoute from './Componentes/PrivateRoute';
import Login from './Pages/Login';
import AdminPanel from './Pages/AdminPanel';
import ValidarCodigo from './Pages/ValidarCodigo';
import CardForm from './Pages/CardForm';
import CardPreview from './Pages/CardPreview';
import NotFound from './Pages/NotFound';
import CadastroUsuario from './Pages/CadastroUsuario';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthLoader>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<CadastroUsuario />} />

            <Route path="/validar-codigo" element={
              <PrivateRoute>
                <ValidarCodigo />
              </PrivateRoute>
            } />

            <Route path="/cardform" element={
              <PrivateRoute>
                <CardForm />
              </PrivateRoute>
            } />

            <Route path="/preview/:codigo" element={
              <PrivateRoute>
                <CardPreview />
              </PrivateRoute>
            } />

            <Route path="/admin" element={
              <PrivateRoute isAdmin>
                <AdminPanel />
              </PrivateRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthLoader>
      </AuthProvider>
    </Router>
  );
}

export default App;