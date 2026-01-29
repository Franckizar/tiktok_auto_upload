'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email?: string;
  username: string;
  role: 'user' | 'admin';
  tiktokConnected: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithTikTok: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  toggleTestMode: () => void;
  isTestMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE_URL = 'https://modest-integral-ibex.ngrok-free.app';

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true'
};

const TEST_USERS = {
  user: {
    id: 'test-user-1',
    email: 'test@example.com',
    username: 'testuser',
    role: 'user' as const,
    tiktokConnected: false
  },
  admin: {
    id: 'test-admin-1',
    email: 'admin@example.com',
    username: 'admin',
    role: 'admin' as const,
    tiktokConnected: true
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // ✅ CRITICAL FIX: Start with isLoading=true to prevent premature redirects
  const [isLoading, setIsLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const router = useRouter();

  console.log('🔐 AuthProvider mounted', { isTestMode });

  // ✅ Check token on mount (runs once)
  useEffect(() => {
    const initAuth = async () => {
      if (isTestMode) {
        console.log('🧪 TEST MODE: Skipping token validation');
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      console.log('🔍 Checking token:', token ? 'Found' : 'None');
      
      if (token) {
        await validateToken(token);
      } else {
        console.log('❌ No token found');
        setIsLoading(false);
      }
    };

    initAuth();
  }, []); // ✅ Empty dependency array - only run once on mount

  const toggleTestMode = () => {
    console.log('🔄 TOGGLING TEST MODE:', !isTestMode);
    setIsTestMode(prev => {
      const newMode = !prev;
      
      if (newMode) {
        setUser(TEST_USERS.user);
        localStorage.setItem('token', 'test-mode-token');
        console.log('🧪 TEST MODE ENABLED - Auto-logged as:', TEST_USERS.user.username);
      } else {
        setUser(null);
        localStorage.removeItem('token');
        console.log('🔐 TEST MODE DISABLED - Back to real auth');
      }
      
      return newMode;
    });
  };

  const validateToken = async (token: string) => {
    if (isTestMode) {
      setIsLoading(false);
      return;
    }
    
    console.log('🔍 Validating token...');
    setIsLoading(true); // ✅ Set loading while validating
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          ...NGROK_HEADERS
        }
      });
      console.log('📡 /auth/me response:', response.status, response.statusText);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Valid token, user:', userData);
        setUser(userData);
      } else {
        console.log('❌ Invalid token, clearing...');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('💥 Token validation error:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      // ✅ CRITICAL: Always set isLoading to false when done
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (isTestMode) {
      console.log('🧪 TEST MODE: Fake login success');
      return;
    }

    console.log('🔑 Login attempt:', { email });
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...NGROK_HEADERS
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('📡 Login response:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Login failed:', response.status, errorText);
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      console.log('✅ Login success:', data.user?.username);
      localStorage.setItem('token', data.token);
      setUser(data.user);
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
      console.log('🧪 TEST MODE: Fake TikTok login');
      setUser(TEST_USERS.admin);
      return;
    }

    console.log('🎵 TikTok login initiated');
    setIsLoading(true);
    try {
      console.log('📡 Calling /auth/tiktok/init...');
      const response = await fetch(`${API_BASE_URL}/auth/tiktok/init`, {
        headers: NGROK_HEADERS
      });
      console.log('📡 TikTok init response:', response.status);
      
      const data = await response.json();
      console.log('🔗 TikTok auth URL:', data.authUrl);
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('💥 TikTok login error:', error);
      setIsLoading(false);
      throw new Error('TikTok login failed');
    }
  };

  const register = async (email: string, password: string, username: string) => {
    if (isTestMode) {
      console.log('🧪 TEST MODE: Fake register success');
      return;
    }

    console.log('📝 Register attempt:', { email, username });
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...NGROK_HEADERS
        },
        body: JSON.stringify({ email, password, username }),
      });
      console.log('📡 Register response:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Register failed:', response.status, errorText);
        throw new Error('Registration failed');
      }
      
      const data = await response.json();
      console.log('✅ Register success:', data.user?.username);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    if (!isTestMode) {
      localStorage.removeItem('token');
    }
    setUser(null);
    if (!isTestMode) {
      router.push('/auth/login');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    console.log('🔄 Updating user:', userData);
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  console.log('👤 Current state:', { 
    user: user?.username || 'none', 
    isLoading, 
    isTestMode,
    testModeStatus: isTestMode ? '🧪 ACTIVE' : '🔐 REAL'
  });
  
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
      isTestMode
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