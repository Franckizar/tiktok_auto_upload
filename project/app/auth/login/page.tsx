'use client';

import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tiktok-pink via-purple-500 to-tiktok-cyan flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to TikScheduler
          </h1>
          <p className="text-white/80">
            Schedule and publish your TikTok content effortlessly
          </p>
        </motion.div>
        <LoginForm />
      </div>
    </div>
  );
}