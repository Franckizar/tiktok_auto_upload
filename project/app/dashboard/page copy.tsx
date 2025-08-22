// 'use client';

// import dynamicImport from 'next/dynamic';

// // ✅ Correct Next.js export for forcing dynamic rendering
// export const dynamic = "force-dynamic";

// const OverviewCards = dynamicImport(
// //   () => import('@/components/dashboard/overview-cards').then(mod => mod.OverviewCards),
// //   { ssr: false }
// // );

// // const AnalyticsChart = dynamicImport(
// //   () => import('@/components/dashboard/analytics-chart-client'),
// //   { ssr: false }
// );

// export default function DashboardPage() {
//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
//         <p className="text-gray-600 mt-2">
//           Welcome back! Here&apos;s an overview of your TikTok content performance.
//         </p>
//       </div>

//       {/* <OverviewCards />
//       <AnalyticsChart /> */}
//     </div>
//   );
// }
