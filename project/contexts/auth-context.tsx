'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  tiktok_connected: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Fix: Change useState<User> to useState<User | null> and allow null initialization
  const [user, setUser] = useState<User | null>({
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    role: 'user',
    tiktok_connected: false,
  }); // Mock logged-in user
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const mockUser = {
      id: '1',
      email,
      username: 'testuser',
      role: 'user' as const,
      tiktok_connected: false,
    };
    setUser(mockUser);
    router.push('/dashboard');
  };

  const register = async (email: string, password: string, username: string) => {
    const mockUser = {
      id: '1',
      email,
      username,
      role: 'user' as const,
      tiktok_connected: false,
    };
    setUser(mockUser);
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null); // This will now work without TypeScript error
    router.push('/auth/login');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...userData } : null));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}