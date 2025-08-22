'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: 'Upcoming Posts',
    value: '12',
    change: '+2 from yesterday',
    icon: Calendar,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Published Posts',
    value: '248',
    change: '+12% from last month',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Failed Posts',
    value: '3',
    change: '-2 from yesterday',
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Pending Review',
    value: '7',
    change: '+1 from yesterday',
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
];

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}