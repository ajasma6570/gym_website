import { number, object, string, coerce } from "zod";

export const signInSchema = object({
    username: string({ required_error: "Email is required" })
        .min(1, "Email is required"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(3, "Password must be at least 6 characters long")
        .max(20, "Password must be at most 20 characters long"),
})

export const newUserSchema = object({
    id: string({ required_error: "ID is required" }),
    name: string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    age: coerce.number({ required_error: "Age is required" })
        .int("Age must be a whole number"),
    weight: coerce.number({ required_error: "Weight is required" })
        .multipleOf(0.1, "Weight can have up to 1 decimal place"),
    height: coerce.number({ required_error: "Height is required" })
        .int("Height must be a whole number in centimeters"),
    joiningDate: string({ required_error: "Joining date is required" })
        .min(1, "Joining date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Joining date must be in YYYY-MM-DD format"),
    phone: string({ required_error: "Phone number is required" })
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits")
        .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Phone number can only contain numbers, spaces, dashes, parentheses, and + sign")
        .refine((phone) => {
            // Remove all non-digit characters to count actual digits
            const digits = phone.replace(/\D/g, '');
            return digits.length >= 10;
        }, "Phone number must contain 10 digits"),
    planId: string({ required_error: "Plan is required" })
        .min(1, "Please select a plan"),
})

export const newPlanSchema = object({
    id: string({ required_error: "ID is required" }),
    name: string({ required_error: "Plan name is required" })
        .min(1, "Plan name is required")
        .min(3, "Plan name must be at least 3 characters")
        .max(50, "Plan name must be at most 50 characters"),
    days: coerce.number({ required_error: "Days is required" })
        .int("Days must be a whole number"),
    amount: coerce.number({ required_error: "Amount is required" })
        .multipleOf(0.01, "Amount can have up to 2 decimal places"),
    status: string({ required_error: "Status is required" })
        .min(1, "Status is required")
        .regex(/^(active|inactive)$/, "Status must be either 'active' or 'inactive'"),
})