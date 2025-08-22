'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  loginWithTikTok: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockDatabaseUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    username: 'existingUser',
    role: 'user',
    tiktok_connected: false,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await delay(1000); // simulate server delay

    // Find user in mock DB (password check skipped for simplicity)
    const foundUser = mockDatabaseUsers.find((u) => u.email === email);
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('User not found');
    }

    setUser(foundUser);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const loginWithTikTok = async () => {
    setIsLoading(true);
    await delay(1000); // simulate TikTok OAuth delay

    // Simulate logging in via TikTok API and returning user info
    const tiktokUser: User = {
      id: 'tiktok-123',
      email: '', // TikTok might not provide email
      username: 'mock_tiktok_user',
      role: 'user',
      tiktok_connected: true,
    };

    setUser(tiktokUser);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    await delay(1000); // simulate server delay

    // Check if user already exists
    if (mockDatabaseUsers.some((u) => u.email === email)) {
      setIsLoading(false);
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: (mockDatabaseUsers.length + 1).toString(),
      email,
      username,
      role: 'user',
      tiktok_connected: false,
    };

    mockDatabaseUsers.push(newUser);

    setUser(newUser);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    router.push('/auth/login');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, loginWithTikTok, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
