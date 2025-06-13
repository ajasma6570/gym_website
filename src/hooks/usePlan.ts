import { showToastMessage } from "@/lib/toast";
import { newPlanSchema } from "@/lib/zod";
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

export const usePlanListMutate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (newPlan: z.infer<typeof newPlanSchema>) => {
            await fetch("/api/plans", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPlan),
            });
        },
        onSuccess: () => {
            showToastMessage("Plan created successfully!", "success");
            query.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            console.error("Error creating plan:", error);
        },
    });
}