import { showToastMessage } from "@/lib/toast";
import {
    createPlanSchema,
    updatePlanSchema,
} from "@/lib/validation/planSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const usePlanList = () => {
    return useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            const response = await fetch("/api/plan");
            return response.json();
        },
        refetchOnWindowFocus: false,
        enabled: true,
    });
}

export const usePlanCreate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (data: z.infer<typeof createPlanSchema>) => {
            const response = await fetch("/api/plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create plan");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("Plan created successfully!", "success");
            query.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            console.error("Error creating plan:", error);
            showToastMessage(error.message, "error");
        },
    });
}

export const usePlanUpdate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (data: z.infer<typeof updatePlanSchema>) => {
            const response = await fetch(`/api/plan/${data?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create plan");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("Plan updated successfully!", "success");
            query.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            console.error("Error updating plan:", error);
            showToastMessage(error.message, "error");
        },
    });
}

export const usePlanDelete = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (planId: number) => {
            const response = await fetch(`/api/plan/${planId}`, {
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