import { object, string, coerce } from "zod";

export const signInSchema = object({
    username: string({ required_error: "Email is required" })
        .min(1, "Email is required"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(3, "Password must be at least 6 characters long")
        .max(20, "Password must be at most 20 characters long"),
})

import { z } from "zod";

// Base schema without refinements
const baseMemberSchema = z.object({
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
        .int("Height must be a whole number in centimeters")
        .positive("Height must be a positive number")
        .min(50, "Height must be at least 50 cm")
        .max(300, "Height must be realistic"),

    joiningDate: z
        .string({ required_error: "Joining date is required" })
        .min(1, "Joining date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Joining date must be in YYYY-MM-DD format"),

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
});

// Function to add date validation refinements
const addDateValidation = (schema: typeof baseMemberSchema) => {
    return schema.superRefine((data, ctx) => {
        const { joiningDate, paymentStart, dueDate } = data;

        // Convert string dates to Date objects for comparison
        const joinDate = new Date(joiningDate);
        const payStart = new Date(paymentStart);
        const due = new Date(dueDate);

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
};

// Schema for creating new members
export const newMemberSchema = addDateValidation(baseMemberSchema);

// Schema for updating members (includes ID)
export const updateMemberSchema = addDateValidation(
    baseMemberSchema.extend({
        id: z.string({ required_error: "ID is required" }).min(1, "ID is required"),
    })
);


// Base membership schema without ID for creation
export const baseMembershipSchema = object({
    name: string({ required_error: "Plan name is required" })
        .min(1, "Plan name is required")
        .min(3, "Plan name must be at least 3 characters")
        .max(50, "Plan name must be at most 50 characters"),
    duration: coerce.number({ required_error: "Days is required" })
        .int("Days must be a whole number"),
    amount: coerce.number({ required_error: "Amount is required" })
        .multipleOf(0.01, "Amount can have up to 2 decimal places"),
    status: string({ required_error: "Status is required" })
        .min(1, "Status is required")
        .regex(/^(active|inactive)$/, "Status must be either 'active' or 'inactive'"),
});

// Schema for creating new membership (no ID required)
export const createMembershipSchema = baseMembershipSchema;

// Schema for updating membership (includes ID)
export const updateMembershipSchema = baseMembershipSchema.extend({
    id: coerce.number({ required_error: "ID is required" })
        .int("ID must be an integer")
        .positive("ID must be positive"),
});

// Keep the old schema for backward compatibility
export const newMembershipSchema = updateMembershipSchema;