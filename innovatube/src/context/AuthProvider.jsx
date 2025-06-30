import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import API from '../api/axios';

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUsuario(null);
        setCargando(false);
        return;
      }

      try {
        const res = await API.get('/usuarios/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuario(res.data.usuario);
      } catch {
        localStorage.removeItem('token');
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    verificarToken();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cerrarSesion, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};
