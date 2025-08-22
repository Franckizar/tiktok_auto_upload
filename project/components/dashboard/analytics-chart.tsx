'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsChartClient = dynamic(
  () => import('./analytics-chart-client'),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>
            Your posting activity for the past 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Loading chart...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
);

export function AnalyticsChart() {
  return <AnalyticsChartClient />;
}