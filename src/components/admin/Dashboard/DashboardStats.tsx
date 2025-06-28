import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  Dumbbell,
  Loader2,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-blue-600",
  bgColor = "",
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color?: string;
  bgColor?: string;
}) => (
  <Card
    className={`flex flex-row items-center justify-between p-4 gap-4 ${bgColor}`}
  >
    <div className="flex-1">
      <CardHeader className="px-0 py-0">
        <CardTitle className="text-sm font-medium leading-none">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-1 pb-0">
        <div className="text-2xl font-bold leading-tight">{value}</div>
      </CardContent>
    </div>

    <div className="flex-shrink-0 self-center">
      <Icon className={`h-8 w-8 ${color}`} />
    </div>
  </Card>
);

export function DashboardStats() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          Error loading dashboard statistics: {error}
        </p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 d:grid-cols-2 lg:grid-cols-3 ">
      <StatCard
        title="Total Members"
        value={stats.totalMembers}
        icon={Users}
        color="text-blue-600"
      />

      <StatCard
        title="Active Members"
        value={stats.activeMembers}
        icon={UserCheck}
        color="text-green-600"
      />

      <StatCard
        title="Inactive Members"
        value={stats.inactiveMembers}
        icon={UserX}
        color="text-red-600"
      />

      <StatCard
        title="Expire in 3 Days"
        value={stats.expiringIn3Days}
        icon={AlertTriangle}
        color="text-orange-600"
      />

      <StatCard
        title="Expire in 7 Days"
        value={stats.expiringIn7Days}
        icon={Clock}
        color="text-yellow-600"
      />

      <StatCard
        title="Personal Training"
        value={stats.personalTrainingUsers}
        icon={Dumbbell}
        color="text-purple-600"
      />
    </div>
  );
}
