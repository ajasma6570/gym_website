import { showToastMessage } from "@/lib/toast";
import { newMemberSchema } from "@/lib/validation/memberSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const useUserList = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await fetch("/api/member");
            return response.json();
        },
        refetchOnWindowFocus: false,
        enabled: true,
    });
}

export const useUserCreate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (data: z.infer<typeof newMemberSchema>) => {
            const response = await fetch("/api/member", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create user");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("User created successfully!", "success");
            query.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Error creating user:", error);
            showToastMessage(error.message, "error");
        },
    });
}

export const useUserUpdate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (updatedUser: z.infer<typeof newMemberSchema> & { id: number }) => {


            console.log("Updating user with data:", updatedUser);

            const response = await fetch(`/api/member/${updatedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create user");
            }

            return response.json();
        },
        onSuccess: () => {
            showToastMessage("User updated successfully!", "success");
            query.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            showToastMessage(error.message, "error");
        },
    });
};

export const useUserDelete = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (userId: number) => {
            const response = await fetch(`/api/member/${userId}`, {
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

export const useUserDetails = (userId: string) => {
    return useQuery({
        queryKey: ["users", userId],
        queryFn: async () => {
            const response = await fetch(`/api/member/${userId}`);
            if (!response.ok) {
                throw new Error("User not found");
            }
            return response.json();
        },
        refetchOnWindowFocus: false,
        enabled: !!userId, // Only fetch if userId is provided
    });
}