import { showToastMessage } from "@/lib/toast";
import { newUserSchema } from "@/lib/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const useUSerList = () => {
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

export const useUserListMutate = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (newUser: z.infer<typeof newUserSchema>) => {
            await fetch("/api/member", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });
        },
        onSuccess: () => {
            showToastMessage("User created successfully!", "success");
            query.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            console.error("Error creating user:", error);
        },
    });
}