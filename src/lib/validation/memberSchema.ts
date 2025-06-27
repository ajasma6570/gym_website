import { z } from "zod";

// Base schema for member data (simplified for user forms)
export const newMemberSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),

    gender: z.enum(["male", "female", "other"], {
        required_error: "Gender is required",
    }),

    phone: z
        .string({ required_error: "Phone number is required" })
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

    age: z
        .number({ required_error: "Age is required" })
        .int("Age must be a whole number")
        .min(1, "Age must be at least 1")
        .max(120, "Age must be realistic"),

    weight: z
        .number({ required_error: "Weight is required" })
        .positive("Weight must be a positive number")
        .min(1, "Weight must be at least 1 kg")
        .max(500, "Weight must be realistic"),

    height: z
        .number({ required_error: "Height is required" })
        .positive("Height must be a positive number")
        .min(50, "Height must be at least 50 cm")
        .max(300, "Height must be realistic"),

    joiningDate: z
        .string({ required_error: "Joining date is required" })
        .min(1, "Joining date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Joining date must be in YYYY-MM-DD format"),
});

export type NewMember = z.infer<typeof newMemberSchema>;

// Schema for updating members (includes ID)
export const updateMemberSchema = newMemberSchema.extend({
    id: z.number({ required_error: "ID is required" }).int().positive(),
});

export type User = z.infer<typeof updateMemberSchema>;
export type UserList = User[];

// Extended schema for member creation with payment and plan information
// This is used when creating members with payment plans
export const memberWithPaymentSchema = newMemberSchema.extend({
    // Form field for selecting plan (will be converted to planId)
    activePlan: z
        .string({ required_error: "Active plan is required" })
        .min(1, "Please select a membership plan"),

    paymentStart: z
        .string({ required_error: "Payment start date is required" })
        .min(1, "Payment start date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Payment start date must be in YYYY-MM-DD format"),

    dueDate: z
        .string({ required_error: "Due date is required" })
        .min(1, "Due date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format"),
}).superRefine((data, ctx) => {
    const { joiningDate, paymentStart, dueDate } = data;

    // Convert string dates to Date objects for comparison
    const joinDate = new Date(joiningDate);
    const payStart = new Date(paymentStart);
    const due = new Date(dueDate);

    // Check if dates are valid
    if (isNaN(joinDate.getTime()) || isNaN(payStart.getTime()) || isNaN(due.getTime())) {
        return; // Skip validation if any date is invalid
    }

    if (joinDate > payStart) {
        ctx.addIssue({
            path: ["paymentStart"],
            code: "custom",
            message: "Payment start date cannot be before joining date",
        });
    }

    if (joinDate > due) {
        ctx.addIssue({
            path: ["dueDate"],
            code: "custom",
            message: "Due date cannot be before joining date",
        });
    }

    if (due < payStart) {
        ctx.addIssue({
            path: ["dueDate"],
            code: "custom",
            message: "Due date cannot be before payment start date",
        });
    }
});

export type MemberWithPayment = z.infer<typeof memberWithPaymentSchema>;
