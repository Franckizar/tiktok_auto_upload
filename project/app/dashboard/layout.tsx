'use client';

import { useAuth } from '@/contexts/auth-context';
import { Sidebar } from '@/app/dashboard/sidebar';
import { Header } from '@/components/layout/header';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ✅ FIXED: Only redirect if we're SURE there's no user (after loading completes)
    if (!isLoading && !user) {
      console.log('❌ No user found after loading, redirecting to login');
      router.push('/auth/login');
    } else if (user) {
      console.log('✅ User found:', user.displayName || user.firstname);
    }
  }, [user, isLoading, router]);

  // ✅ CRITICAL: Show loading screen while checking auth
  if (isLoading) {
    console.log('⏳ Auth is loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="h-8 w-8 text-tiktok-pink" />
        </motion.div>
      </div>
    );
  }

  // ✅ Show nothing while redirecting
  if (!user) {
    console.log('❌ No user, returning null (redirecting...)');
    return null;
  }

console.log('✅ Rendering dashboard for:', user.displayName || user.firstname);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}