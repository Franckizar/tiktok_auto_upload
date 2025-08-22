// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import { authAPI } from '@/lib/api';

// interface User {
//   id: string;
//   email: string;
//   username: string;
//   role: 'user' | 'admin';
//   tiktok_connected: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, username: string) => Promise<void>;
//   logout: () => void;
//   updateUser: (userData: Partial<User>) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = Cookies.get('auth_token');
//       if (token) {
//         try {
//           const response = await authAPI.getCurrentUser();
//           setUser(response.data);
//         } catch (error) {
//           Cookies.remove('auth_token');
//         }
//       }
//       setIsLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await authAPI.login({ email, password });
//       const { token, user: userData } = response.data;
      
//       Cookies.set('auth_token', token, {
//         expires: 7,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//       });
      
//       setUser(userData);
//       router.push('/dashboard');
//     } catch (error: any) {
//       throw new Error(error.response?.data?.message || 'Login failed');
//     }
//   };

//   const register = async (email: string, password: string, username: string) => {
//     try {
//       const response = await authAPI.register({ email, password, username });
//       const { token, user: userData } = response.data;
      
//       Cookies.set('auth_token', token, {
//         expires: 7,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//       });
      
//       setUser(userData);
//       router.push('/dashboard');
//     } catch (error: any) {
//       throw new Error(error.response?.data?.message || 'Registration failed');
//     }
//   };

//   const logout = () => {
//     Cookies.remove('auth_token');
//     setUser(null);
//     router.push('/auth/login');
//   };

//   const updateUser = (userData: Partial<User>) => {
//     setUser(prev => prev ? { ...prev, ...userData } : null);
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       isLoading,
//       login,
//       register,
//       logout,
//       updateUser,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }