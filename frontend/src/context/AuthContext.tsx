import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  login(email: string, senha: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData>({
  usuario: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken]         = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const tokenLocal = localStorage.getItem('token');
    const usuarioLocal = localStorage.getItem('usuario');
    if (tokenLocal && usuarioLocal) {
      const user: Usuario = JSON.parse(usuarioLocal);
      setToken(tokenLocal);
      setUsuario(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenLocal}`;
    }
  }, []);

  const login = async (email: string, senha: string) => {
    const res = await api.post<{ token: string; user: Usuario }>('/auth/login', {
      email,
      senha,
    });
    const { token: newToken, user } = res.data;

 
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(user));


    setToken(newToken);
    setUsuario(user);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;


    navigate('/kanban');
  };


  const logout = () => {
    setUsuario(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
