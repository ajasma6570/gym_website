// validation/signInSchema.ts
import { z } from "zod";

export const signInSchema = z.object({
    username: z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required"),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password must be at most 20 characters long"),
});
