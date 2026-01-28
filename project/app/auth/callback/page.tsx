'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useAuth(); // Optional: integrate with AuthContext
  const [error, setError] = useState<string | null>(null);

  // Handle callback once params available
  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');

    console.log('🔗 Callback params:', { 
      token: token ? `${token.slice(0,20)}...` : null, 
      userId, 
      username, 
      error: errorParam 
    });

    if (errorParam) {
      console.error('❌ TikTok auth error:', errorParam);
      setError(decodeURIComponent(errorParam));
      setTimeout(() => {
        router.push('/auth/login?error=' + encodeURIComponent(errorParam));
      }, 3000);
      return;
    }

    if (token && userId) {
      // ✅ Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      if (username) localStorage.setItem('username', username);
      
      // ✅ Optional: Update AuthContext
      if (updateUser) {
        updateUser({
          id: userId,
          username: username || 'tiktok_user',
          role: 'user',
          tiktokConnected: true
        });
      }
      
      console.log('✅ TikTok login successful! Redirecting...');
      router.replace('/dashboard'); // replace() prevents back button issues
    } else {
      setError('Missing authentication credentials');
      setTimeout(() => {
        router.push('/auth/login?error=missing_credentials');
      }, 3000);
    }
  }, [searchParams, router, updateUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-red-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-100 mb-6 shadow-lg">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              Redirecting to login page in <span id="countdown">3</span>s...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center p-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 mb-6 shadow-lg">
          <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-green-800">TikTok Login Successful!</span>
        </div>
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-6 shadow-xl"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Setup...</h2>
        <p className="text-lg text-gray-600">Finalizing your account</p>
      </div>
    </div>
  );
}
