'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE';
  phone?: string;
  adminId?: string | null;
  storeName?: string | null;
  storeLogo?: string | null;
  subscriptionEnd?: string | null;
  isTrial?: boolean;
}

export interface RegisterData {
  storeName: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  storeAddress?: string;
  planType: 'TRIAL' | 'DIRECT_SUBSCRIPTION' | 'FREE';
  durationMonths?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: RegisterData) => Promise<{ user: User; message: string; planType: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session on mount
    const savedToken = localStorage.getItem('laundryku_token');
    const savedUser = localStorage.getItem('laundryku_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('laundryku_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password: pass });
      const { token: newToken, user: userData } = response.data.data;

      setToken(newToken);
      setUser(userData);

      localStorage.setItem('laundryku_token', newToken);
      localStorage.setItem('laundryku_user', JSON.stringify(userData));

      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ user: User; message: string; planType: string }> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      const { token: newToken, user: userData, planType } = response.data.data;

      setToken(newToken);
      setUser(userData);

      localStorage.setItem('laundryku_token', newToken);
      localStorage.setItem('laundryku_user', JSON.stringify(userData));

      return { user: userData, message: response.data.message, planType };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('laundryku_token');
    localStorage.removeItem('laundryku_user');
    window.location.href = '/login';
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const nextUser = { ...prev, ...data };
      localStorage.setItem('laundryku_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
