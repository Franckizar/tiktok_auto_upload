'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AnalyticsChartClient() {
  const [Chart, setChart] = useState<JSX.Element | null>(null);

  useEffect(() => {
    (async () => {
      const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = await import('recharts');

      const data = [
        { name: 'Mon', scheduled: 12, published: 10, failed: 1 },
        { name: 'Tue', scheduled: 8, published: 7, failed: 0 },
        { name: 'Wed', scheduled: 15, published: 13, failed: 2 },
        { name: 'Thu', scheduled: 10, published: 9, failed: 1 },
        { name: 'Fri', scheduled: 18, published: 16, failed: 1 },
        { name: 'Sat', scheduled: 22, published: 20, failed: 2 },
        { name: 'Sun', scheduled: 25, published: 23, failed: 1 },
      ];

      setChart(
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="scheduled" stroke="#FE2C55" strokeWidth={2} />
            <Line type="monotone" dataKey="published" stroke="#25F4EE" strokeWidth={2} />
            <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
        <CardDescription>Your posting activity for the past 7 days</CardDescription>
      </CardHeader>
      <CardContent style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Chart || <p className="text-gray-500">Loading chart...</p>}
      </CardContent>
    </Card>
  );
}
