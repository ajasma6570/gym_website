import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToastMessage } from "@/lib/toast";

export const usePlanHistoryDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (planHistoryId: number) => {
            const response = await fetch(`/api/plan-history/${planHistoryId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete plan history");
            }

            return response.json();
        },
    onSuccess: (data) => {
      const message = data.deletedPayment 
        ? "Plan and associated payment deleted successfully!" 
        : "Plan deleted successfully!";
      showToastMessage(message, "success");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["member"] });
      queryClient.invalidateQueries({ queryKey: ["payment details"] });
    },
        onError: (error) => {
            console.error("Error deleting plan history:", error);
            showToastMessage(error.message || "Failed to delete plan", "error");
        },
    });
};
