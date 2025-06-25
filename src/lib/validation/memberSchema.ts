import { z } from "zod";

const dateString = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .transform((val) => new Date(val));

const baseMemberSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(2, "Name must be at least 2 characters"),

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

    joiningDate: dateString,
    paymentStart: dateString,
    dueDate: dateString,

    planId: z.number().int().positive(),
    status: z.boolean(),
});

const addDateValidation = (schema: typeof baseMemberSchema) =>
    schema.superRefine((data, ctx) => {
        const { joiningDate, paymentStart, dueDate } = data;

        if (joiningDate && paymentStart && joiningDate > paymentStart) {
            ctx.addIssue({
                path: ["paymentStart"],
                code: "custom",
                message: "Payment start date cannot be before joining date",
            });
        }

        if (joiningDate && dueDate && joiningDate > dueDate) {
            ctx.addIssue({
                path: ["dueDate"],
                code: "custom",
                message: "Due date cannot be before joining date",
            });
        }

        if (paymentStart && dueDate && dueDate < paymentStart) {
            ctx.addIssue({
                path: ["dueDate"],
                code: "custom",
                message: "Due date cannot be before payment start date",
            });
        }
    });

export const newMemberSchema = addDateValidation(baseMemberSchema);

export const updateMemberSchema = addDateValidation(
    baseMemberSchema.extend({
        id: z.number({ required_error: "ID is required" }).int().positive(),
    })
);
