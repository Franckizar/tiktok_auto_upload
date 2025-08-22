'use client';

import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Mon', scheduled: 12, published: 10, failed: 1 },
  { name: 'Tue', scheduled: 8, published: 7, failed: 0 },
  { name: 'Wed', scheduled: 15, published: 13, failed: 2 },
  { name: 'Thu', scheduled: 10, published: 9, failed: 1 },
  { name: 'Fri', scheduled: 18, published: 16, failed: 1 },
  { name: 'Sat', scheduled: 22, published: 20, failed: 2 },
  { name: 'Sun', scheduled: 25, published: 23, failed: 1 },
];

export function AnalyticsChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>
            Your posting activity for the past 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="scheduled" 
                  stroke="#FE2C55" 
                  strokeWidth={2}
                  name="Scheduled"
                />
                <Line 
                  type="monotone" 
                  dataKey="published" 
                  stroke="#25F4EE" 
                  strokeWidth={2}
                  name="Published"
                />
                <Line 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Failed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}