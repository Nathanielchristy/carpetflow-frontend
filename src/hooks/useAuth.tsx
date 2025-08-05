import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('carpet-flow-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Check if user has a token
        if (userData.token) {
          setUser(userData);
        } else {
          // No token, clear invalid session
          localStorage.removeItem('carpet-flow-user');
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('carpet-flow-user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await ApiService.login(email, password);
      if (response.success && response.data) {
        // The ApiService.login already stores the user with token in localStorage
        // We just need to get it back to set the user state
        const savedUser = localStorage.getItem('carpet-flow-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(response.data);
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carpet-flow-user');
  };

  return {
    user,
    loading,
    login,
    logout
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthProvider();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};