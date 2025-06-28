import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    expiringIn3Days: number;
    expiringIn7Days: number;
    personalTrainingUsers: number;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await fetch('/api/dashboard/stats');
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
    }
    return response.json();
};

export function useDashboardStats() {
    const { data: stats, isLoading: loading, error, refetch } = useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: fetchDashboardStats,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    return {
        stats: stats || null,
        loading,
        error: error?.message || null,
        refetch
    };
}
