import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenLocal = localStorage.getItem('token');
    const usuarioLocal = localStorage.getItem('usuario');

    if (tokenLocal && usuarioLocal) {
      try {
        const usuarioParse = JSON.parse(usuarioLocal);
        setUsuario(usuarioParse);
        setToken(tokenLocal);
      } catch (e) {
        console.error('Erro ao recuperar usuário:', e);
        logout();
      }
    }
  }, []);

  const login = (usuario: Usuario, token: string) => {
    setUsuario(usuario);
    setToken(token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
