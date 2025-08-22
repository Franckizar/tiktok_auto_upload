'use client';

import { motion } from 'framer-motion';
import { Users, BarChart, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
        <p className="text-gray-600 mt-2">
          Manage users, monitor activity, and view system reports.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>
                Manage registered users and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-gray-500">Total users</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>System Reports</span>
              </CardTitle>
              <CardDescription>
                View system performance and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">98.5%</p>
              <p className="text-sm text-gray-500">System uptime</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
              <CardDescription>
                Monitor security events and system logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-500">Security incidents</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg border p-6 h-[400px] flex items-center justify-center"
        >
          <div className="text-center text-gray-500">
            <Users className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Admin Features</h3>
            <p>Detailed admin functionality coming soon...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}