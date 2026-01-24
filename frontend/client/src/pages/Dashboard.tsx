import { useEffect, useState } from "react";
import { getDashboardData } from "@/services/dashboard.service";

import StatsCard from "@/components/dashboard/StatsCard";
import AttentionPanel from "@/components/dashboard/AttentionPanel";
import RevenuePanel from "@/components/dashboard/RevenuePanel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ShiftSnapshot from "@/components/dashboard/ShiftSnapshot";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Students" value={data.stats.activeStudents} />
        <StatsCard title="Seats Occupied" value={data.stats.seatsOccupied} />
        <StatsCard title="Unpaid Students" value={data.stats.unpaidStudents} />
        <StatsCard title="Monthly Revenue" value={`₹ ${data.stats.paidRevenue}`} />
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttentionPanel allocations={data.allocations} />
        <RevenuePanel
          paid={data.stats.paidRevenue}
          pending={data.stats.pendingRevenue}
        />
      </div>

      {/* THIRD ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed logs={data.recentActivities} />
        <ShiftSnapshot allocations={data.allocations} />
      </div>
    </div>
  );
}
