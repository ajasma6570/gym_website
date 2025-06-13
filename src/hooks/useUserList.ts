import { showToastMessage } from "@/lib/toast";
import { newUserSchema } from "@/lib/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const useUserList = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await fetch("/api/users");
            return response.json();
        },
        refetchOnWindowFocus: false,
        enabled: true,
    });
}

export const useUserCreate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (newUser: z.infer<typeof newUserSchema>) => {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error("Failed to create user");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("User created successfully!", "success");
            query.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Error creating user:", error);
            showToastMessage("Failed to create user", "error");
        },
    });
}

export const useUserUpdate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (updatedUser: z.infer<typeof newUserSchema>) => {
            const response = await fetch("/api/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("User updated successfully!", "success");
            query.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            showToastMessage("Failed to update user", "error");
        },
    });
}

export const useUserDelete = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await fetch("/api/users", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("User deleted successfully!", "success");
            query.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Error deleting user:", error);
            showToastMessage("Failed to delete user", "error");
        },
    });
}