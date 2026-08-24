import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import { User } from '../types/user.types';
import { storage } from '../utils/storage';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phoneNumber: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
  sendOtp: (phoneNumber: string) => Promise<string>;
}

// ✅ ایجاد Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = storage.getToken();
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          storage.removeToken();
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (phoneNumber: string, code: string) => {
    const response = await authApi.verifyOtp({ phoneNumber, code });
    storage.setToken(response.token);
    setUser(response.user);
  };

  const logout = async () => {
    await authApi.logout();
    storage.removeToken();
    setUser(null);
  };

  const updateProfile = async (displayName: string) => {
    if (!user) throw new Error('User not authenticated');
    const updated = await authApi.updateProfile(user.id, { displayName });
    setUser(updated);
  };

  const sendOtp = async (phoneNumber: string) => {
    const response = await authApi.sendOtp({ phoneNumber });
    return response.sessionId;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile, sendOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ صادر کردن Context با نام (named export)
export { AuthContext };

// ✅ هوک useAuth در همین فایل (یا در فایل جداگانه)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};