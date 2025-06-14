import { showToastMessage } from "@/lib/toast";
import { newMembershipSchema } from "@/lib/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const usePlanList = () => {
    return useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            const response = await fetch("/api/plans");
            return response.json();
        },
        refetchOnWindowFocus: false,
        enabled: true,
    });
}

export const usePlanCreate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (newPlan: z.infer<typeof newMembershipSchema>) => {
            const response = await fetch("/api/plans", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPlan),
            });

            if (!response.ok) {
                throw new Error("Failed to create plan");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("Plan created successfully!", "success");
            query.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            console.error("Error creating plan:", error);
            showToastMessage("Failed to create plan", "error");
        },
    });
}

export const usePlanUpdate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (updatedPlan: z.infer<typeof newMembershipSchema>) => {
            const response = await fetch("/api/plans", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPlan),
            });

            if (!response.ok) {
                throw new Error("Failed to update plan");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("Plan updated successfully!", "success");
            query.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            console.error("Error updating plan:", error);
            showToastMessage("Failed to update plan", "error");
        },
    });
}

export const usePlanDelete = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (planId: string) => {
            const response = await fetch("/api/plans", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: planId }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete plan");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("Plan deleted successfully!", "success");
            query.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            console.error("Error deleting plan:", error);
            showToastMessage("Failed to delete plan", "error");
        },
    });
}

// Keep the old hook for backward compatibility
export const usePlanListMutate = usePlanCreate;