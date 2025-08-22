'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, List, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SchedulePage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Schedule Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your scheduled posts with calendar and list views.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search scheduled posts..."
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={(value) => setView(value as any)}>
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar View</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span>List View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border p-6 h-[600px] flex items-center justify-center"
          >
            <div className="text-center text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Calendar View</h3>
              <p>Full calendar integration coming soon...</p>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border p-6 h-[600px] flex items-center justify-center"
          >
            <div className="text-center text-gray-500">
              <List className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">List View</h3>
              <p>Scheduled posts list coming soon...</p>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}