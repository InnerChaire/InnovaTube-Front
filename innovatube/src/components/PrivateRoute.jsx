import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function PrivateRoute({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return <div className="p-6 text-center">Cargando...</div>;
  return usuario ? children : <Navigate to="/login" />;
}
