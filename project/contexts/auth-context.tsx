'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email?: string;
  firstname?: string;
  displayName?: string;
  avatarUrl?: string;
  tiktokId?: string;
  role: string;
  tiktokConnected: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithTikTok: () => Promise<void>;
  register: (email: string, password: string, firstname: string, lastname: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  toggleTestMode: () => void;
  isTestMode: boolean;
  fetchCurrentUser: () => Promise<void>;  // ← ADDED
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'https://modest-integral-ibex.ngrok-free.app';

const HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json'
};

const TEST_USERS = {
  user: {
    id: 'test-user-1',
    email: 'test@example.com',
    firstname: 'Test',
    displayName: 'testuser',
    role: 'PLAYER',
    tiktokConnected: false
  },
  admin: {
    id: 'test-admin-1',
    email: 'admin@example.com',
    firstname: 'Admin',
    displayName: 'admin',
    role: 'ADMIN',
    tiktokConnected: true
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      if (isTestMode) {
        setIsLoading(false);
        return;
      }
      await fetchCurrentUser();
    };
    initAuth();
  }, []);

  const fetchCurrentUser = async () => {
    console.log('🔍 Checking current user via cookies...');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shared/profile/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });

      console.log('📡 /me response:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User found:', userData);
        setUser(userData);
      } else {
        console.log('❌ Not authenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('💥 Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTestMode = () => {
    setIsTestMode(prev => {
      const newMode = !prev;
      if (newMode) {
        setUser(TEST_USERS.user as User);
        console.log('🧪 TEST MODE ENABLED');
      } else {
        setUser(null);
        console.log('🔐 TEST MODE DISABLED');
      }
      return newMode;
    });
  };

  const login = async (email: string, password: string) => {
    if (isTestMode) return;
    console.log('🔑 Login attempt:', email);
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/authenticate`, {
        method: 'POST',
        credentials: 'include',
        headers: HEADERS,
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Login failed');
      }

      await fetchCurrentUser();
      router.push('/dashboard');
    } catch (error) {
      console.error('💥 Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithTikTok = async () => {
    if (isTestMode) {
      setUser(TEST_USERS.admin as User);
      return;
    }

    console.log('🎵 TikTok login initiated');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/tiktok/init`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });

      const data = await response.json();
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('💥 TikTok login error:', error);
      setIsLoading(false);
      throw new Error('TikTok login failed');
    }
  };

  const register = async (email: string, password: string, firstname: string, lastname: string) => {
    if (isTestMode) return;
    console.log('📝 Register attempt:', email);
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: HEADERS,
        body: JSON.stringify({ email, password, firstname, lastname }),
      });

      if (!response.ok) throw new Error('Registration failed');
      router.push('/auth/verify-email');
    } catch (error) {
      console.error('💥 Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out...');
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/auth/login');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginWithTikTok,
      register,
      logout,
      updateUser,
      toggleTestMode,
      isTestMode,
      fetchCurrentUser  // ← ADDED
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}