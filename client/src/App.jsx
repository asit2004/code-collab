import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EditorPage from './pages/EditorPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/"        element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/room/:roomId" element={<PrivateRoute><EditorPage /></PrivateRoute>} />
      <Route path="/login"   element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*"        element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
