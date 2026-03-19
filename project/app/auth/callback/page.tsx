'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchCurrentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setTimeout(() => {
        router.push('/auth/login?error=' + encodeURIComponent(errorParam));
      }, 3000);
      return;
    }

    const completeLogin = async () => {
      try {
        console.log('🔗 Completing TikTok login via cookies...');
        await fetchCurrentUser();
        console.log('✅ Login complete, redirecting...');
        router.replace('/dashboard');
      } catch (err) {
        console.error('💥 Failed to complete login:', err);
        router.push('/auth/login?error=login_failed');
      }
    };

    completeLogin();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-red-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center p-12">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing login...</h2>
        <p className="text-lg text-gray-600">Please wait</p>
      </div>
    </div>
  );
}