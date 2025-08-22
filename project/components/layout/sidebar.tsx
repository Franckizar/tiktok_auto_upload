'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Upload, 
  History, 
  Settings, 
  Menu, 
  X,
  Users,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Users },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const allNavigation = user?.role === 'admin' 
    ? [...navigation, ...adminNavigation] 
    : navigation;

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ 
          x: isMobileOpen || window.innerWidth >= 768 ? 0 : -280 
        }}
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40',
          'md:relative md:translate-x-0',
          'flex flex-col shadow-lg'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 tiktok-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold gradient-text">TikScheduler</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {allNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                      'hover:bg-gray-100 group relative',
                      isActive && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    <item.icon 
                      className={cn(
                        'h-5 w-5 transition-colors',
                        isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700'
                      )} 
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 ml-auto text-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-tiktok-pink to-tiktok-cyan rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}