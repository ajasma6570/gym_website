import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToastMessage } from "@/lib/toast";

interface Task {
    id: number;
    title: string;
    description?: string | null;
    isComplete: boolean;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateTaskRequest {
    title: string;
    description?: string;
}

interface UpdateTaskRequest {
    title?: string;
    description?: string;
    isComplete?: boolean;
}

// Hook to get all tasks
export const useTaskList = () => {
    return useQuery<Task[]>({
        queryKey: ["tasks"],
        queryFn: async (): Promise<Task[]> => {
            const response = await fetch("/api/tasks");
            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }
            return response.json();
        },
        refetchOnWindowFocus: false,
    });
};

// Hook to get task by ID
export const useTaskDetails = (taskId: string | number) => {
    return useQuery<Task>({
        queryKey: ["task", taskId],
        queryFn: async (): Promise<Task> => {
            const response = await fetch(`/api/tasks/${taskId}`);
            if (!response.ok) {
                throw new Error("Task not found");
            }
            return response.json();
        },
        enabled: !!taskId && taskId.toString().trim() !== "", // Only run query when taskId is provided
        refetchOnWindowFocus: false,
    });
};

// Hook to create a new task
export const useTaskCreate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskData: CreateTaskRequest): Promise<Task> => {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create task");
            }

            return response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch task list
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            showToastMessage("Task created successfully!", "success");
        },
        onError: (error) => {
            console.error("Task creation failed:", error);
            showToastMessage(error.message, "error");
        },
    });
};

// Hook to update a task
export const useTaskUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, taskData }: { taskId: number; taskData: UpdateTaskRequest }): Promise<Task> => {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update task");
            }

            return response.json();
        },
        onSuccess: (updatedTask) => {
            // Invalidate and refetch task list
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            // Invalidate specific task details
            queryClient.invalidateQueries({ queryKey: ["task", updatedTask.id] });
            showToastMessage("Task updated successfully!", "success");
        },
        onError: (error) => {
            console.error("Task update failed:", error);
            showToastMessage(error.message, "error");
        },
    });
};

// Hook to delete a task (soft delete)
export const useTaskDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskId: number): Promise<{ message: string; task: Task }> => {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete task");
            }

            return response.json();
        },
        onSuccess: (data) => {
            // Invalidate and refetch task list
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            // Invalidate specific task details
            queryClient.invalidateQueries({ queryKey: ["task", data.task.id] });
            showToastMessage("Task deleted successfully!", "success");
        },
        onError: (error) => {
            console.error("Task deletion failed:", error);
            showToastMessage(error.message, "error");
        },
    });
};

// Hook to toggle task completion status
export const useTaskToggleComplete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, isComplete }: { taskId: number; isComplete: boolean }): Promise<Task> => {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isComplete }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update task status");
            }

            return response.json();
        },
        onSuccess: (updatedTask) => {
            // Invalidate and refetch task list
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            // Invalidate specific task details
            queryClient.invalidateQueries({ queryKey: ["task", updatedTask.id] });
            showToastMessage(
                `Task marked as ${updatedTask.isComplete ? "completed" : "incomplete"}!`,
                "success"
            );
        },
        onError: (error) => {
            console.error("Task status update failed:", error);
            showToastMessage(error.message, "error");
        },
    });
};

// Helper function to transform form data if needed
export const transformTaskFormData = (formData: {
    title: string;
    description?: string;
}): CreateTaskRequest => {
    return {
        title: formData.title,
        description: formData.description || undefined,
    };
};