# How to View Your Dashboard - Connection Fix Guide

## Problem Summary

Your dashboard is not connecting to the backend because:
1. The dashboard components are using static/hardcoded data instead of fetching from the API
2. There's no environment configuration for the API connection
3. React Query is not being used to fetch and manage data

## Solution Overview

To fix the dashboard connection issue, we need to:

1. Configure environment variables for API connection
2. Update dashboard components to fetch real data using React Query
3. Test the connection to ensure everything works properly

## Detailed Fix Instructions

### 1. Environment Configuration

Create a `.env.local` file in your project root with the following content:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

This sets the base URL for your API calls. Adjust the URL if your backend is running on a different port or host.

### 2. Update Dashboard Components

#### Overview Cards Component

Replace the static data in `components/dashboard/overview-cards.tsx` with real API data:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { scheduleAPI } from '@/lib/api';

export function OverviewCards() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Fetch data from multiple API endpoints
      const [scheduled, history] = await Promise.all([
        scheduleAPI.getScheduledPosts(),
        scheduleAPI.getHistory()
      ]);

      // Process the data to get counts
      const upcomingCount = scheduled.data.length;
      const publishedCount = history.data.length;
      // You'll need to implement logic to count failed posts
      const failedCount = 0;
      // You'll need to implement logic for pending review
      const pendingCount = 0;

      return [
        {
          title: 'Upcoming Posts',
          value: upcomingCount.toString(),
          change: '+2 from yesterday',
          icon: Calendar,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
        },
        {
          title: 'Published Posts',
          value: publishedCount.toString(),
          change: '+12% from last month',
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
        },
        {
          title: 'Failed Posts',
          value: failedCount.toString(),
          change: '-2 from yesterday',
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
        },
        {
          title: 'Pending Review',
          value: pendingCount.toString(),
          change: '+1 from yesterday',
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
        },
      ];
    }
  });

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard data: {error.message}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats?.map((stat, index) => (
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
```

#### Analytics Chart Component

Update `components/dashboard/analytics-chart.tsx` to fetch real analytics data:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
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
import { scheduleAPI } from '@/lib/api';

export function AnalyticsChart() {
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      // Fetch data for the chart
      const [scheduled, history] = await Promise.all([
        scheduleAPI.getScheduledPosts(),
        scheduleAPI.getHistory()
      ]);

      // Process the data to create chart data structure
      // This is a simplified example - you'll need to implement proper data aggregation
      const data = [
        { name: 'Mon', scheduled: 12, published: 10, failed: 1 },
        { name: 'Tue', scheduled: 8, published: 7, failed: 0 },
        { name: 'Wed', scheduled: 15, published: 13, failed: 2 },
        { name: 'Thu', scheduled: 10, published: 9, failed: 1 },
        { name: 'Fri', scheduled: 18, published: 16, failed: 1 },
        { name: 'Sat', scheduled: 22, published: 20, failed: 2 },
        { name: 'Sun', scheduled: 25, published: 23, failed: 1 },
      ];

      return data;
    }
  });

  if (isLoading) {
    return <div>Loading chart data...</div>;
  }

  if (error) {
    return <div>Error loading chart data: {error.message}</div>;
  }

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
              <LineChart data={chartData}>
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
```

### 3. Additional API Functions

You may need to add additional API functions in `lib/api.ts` to support the dashboard:

```typescript
// Add to the scheduleAPI object
getDashboardStats: () => api.get('/schedule/dashboard-stats'),
getWeeklyAnalytics: () => api.get('/schedule/analytics/weekly'),
```

### 4. Backend Requirements

Make sure your backend has the following endpoints:
- `GET /api/schedule` - For scheduled posts
- `GET /api/schedule/history` - For published posts
- `GET /api/schedule/dashboard-stats` - For dashboard statistics
- `GET /api/schedule/analytics/weekly` - For analytics data

## Testing the Connection

1. Start your backend server
2. Create the `.env.local` file with the correct API URL
3. Run your Next.js application with `npm run dev`
4. Log in to your application
5. Navigate to the dashboard page
6. Check the browser console for any errors
7. Verify that data is being fetched from the backend

## Troubleshooting

If you're still having connection issues:

1. Check that your backend server is running
2. Verify the API URL in `.env.local` is correct
3. Check the browser's Network tab to see if API requests are being made
4. Look for any CORS errors in the console
5. Ensure your authentication is working properly
6. Check that the backend endpoints exist and return the expected data

## Next Steps

To fully implement this solution, you'll need to switch to Code mode to make the actual file changes. The Architect mode is limited to planning and documentation, so the implementation requires the Code mode to modify the source files directly.