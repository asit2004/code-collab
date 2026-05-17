import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EditorPage from './pages/EditorPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-subtle text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/room/:roomId" element={<PrivateRoute><EditorPage /></PrivateRoute>} />
      <Route path="/login"       element={<Login />} />
      <Route path="/register"    element={<Register />} />
      <Route path="*"            element={<Navigate to="/" replace />} />
    </Routes>
  );
}
