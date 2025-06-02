import { number, object, string } from "zod";

export const signInSchema = object({
    username: string({ required_error: "Email is required" })
        .min(1, "Email is required"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(3, "Password must be at least 6 characters long")
        .max(20, "Password must be at most 20 characters long"),
})

export const newUserSchema = object({
    id: number({ required_error: "ID is required" }),
    name: string({ required_error: "Name is required" })
        .min(1, "Name is required"),
    age: string({ required_error: "Age is required" })
        .min(1, "Age is required")
        .regex(/^\d+$/, "Age must be a number"),
    weight: string({ required_error: "Weight is required" })
        .min(1, "Weight is required")
        .regex(/^\d+$/, "Weight must be a number"),
    height: string({ required_error: "Height is required" })
        .min(1, "Height is required")
        .regex(/^\d+$/, "Height must be a number"),
    joinDate: string({ required_error: "Joining date is required" })
        .min(1, "Joining date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Joining date must be in YYYY-MM-DD format"),
    phone: string({ required_error: "Phone number is required" })
        .min(10, "Phone number is required")
        .max(10, "Phone number must be at most 15 characters long")
        .regex(/^\+?[1-9]\d{1,14}$/, "Phone number must be a valid format"),

})