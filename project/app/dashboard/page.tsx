'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import components with ssr: false
const OverviewCards = dynamic(
  () => import('@/components/dashboard/overview-cards').then(mod => mod.OverviewCards),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const AnalyticsChart = dynamic(
  () => import('@/components/dashboard/analytics-chart-client'),
  { ssr: false, loading: () => <div>Loading chart...</div> }
);

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure component only renders on client side
    setIsClient(true);
  }, []);

  // Prevent rendering on server side
  if (!isClient) {
    return <div className="space-y-8 p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here&apos;s an overview of your TikTok content performance.
        </p>
      </div>

      <OverviewCards />
      <AnalyticsChart />
    </div>
  );
}
