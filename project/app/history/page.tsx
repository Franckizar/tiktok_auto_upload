'use client';

import { motion } from 'framer-motion';
import { History, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Post History</h1>
          <p className="text-gray-600 mt-2">
            View all your published TikTok posts and their performance.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search post history..."
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border p-6 h-[600px] flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <History className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Post History</h3>
          <p>Your published posts will appear here...</p>
        </div>
      </motion.div>
    </div>
  );
}