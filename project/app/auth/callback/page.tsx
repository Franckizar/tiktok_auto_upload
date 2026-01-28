'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');

    if (errorParam) {
      console.error('TikTok auth error:', errorParam);
      setError(decodeURIComponent(errorParam));
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login?error=' + encodeURIComponent(errorParam));
      }, 3000);
      return;
    }

    if (token && userId) {
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      if (username) {
        localStorage.setItem('username', username);
      }
      
      console.log('✅ TikTok login successful! Redirecting to dashboard...');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      setError('Missing authentication credentials');
      setTimeout(() => {
        router.push('/auth/login?error=missing_credentials');
      }, 3000);
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing TikTok authentication...
        </h2>
        <p className="text-gray-600">Please wait while we log you in</p>
      </div>
    </div>
  );
}