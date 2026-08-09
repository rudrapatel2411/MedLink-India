// MedLink India — Auth Context Provider
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  avatar?: string;
  abhaId?: string;
  isActive: boolean;
  isVerified: boolean;
  patientProfile?: any;
  doctorProfile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('medlink_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.data);
    } catch {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('medlink_token', newToken);
    localStorage.setItem('medlink_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const register = async (data: any) => {
    const res = await authAPI.register(data);
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('medlink_token', newToken);
    localStorage.setItem('medlink_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('medlink_token');
    localStorage.removeItem('medlink_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
