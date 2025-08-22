import { OverviewCards } from '@/components/dashboard/overview-cards';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your TikTok content performance.
        </p>
      </div>

      <OverviewCards />
      <AnalyticsChart />
    </div>
  );
}