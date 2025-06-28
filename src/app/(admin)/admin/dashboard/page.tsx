"use client";

import { DashboardStats } from "@/components/admin/Dashboard/DashboardStats";
import { RefreshButton } from "@/components/admin/Dashboard/RefreshButton";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Page() {
  const { refetch, loading } = useDashboardStats();

  return (
    <div className="flex-1 space-y-4 ">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            View your gym statistics, including total members, active members,
            and more.
          </p>
        </div>
        <RefreshButton onRefresh={refetch} loading={loading} />
      </div>
      <DashboardStats />
    </div>
  );
}
