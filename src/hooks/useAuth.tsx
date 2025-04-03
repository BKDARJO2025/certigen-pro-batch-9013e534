
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, getCurrentUser, logout as logoutService, initAuthService } from '@/lib/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Initialize mock users in localStorage
    initAuthService();
    
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
