import { z } from "zod";

export const paymentSchema = z.object({
    planId: z.number().min(1, "Plan is required"),
    personalTrainingId: z.number().min(0, "Personal training ID must be non-negative").optional(),
    paymentStart: z
        .string({ required_error: "Payment start date is required" })
        .min(1, "Payment start date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Payment start date must be in YYYY-MM-DD format"),
    dueDate: z
        .string({ required_error: "Due date is required" })
        .min(1, "Due date is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format"),
    personalTrainingPlan: z.string().optional(),
    paymentType: z.enum(["cash", "bank", "both"], {
        required_error: "Payment type is required",
    }),
    amount: z.number().min(0, "Amount must be positive"),
}).refine((data) => {
    // Validate that due date is after payment start date
    const startDate = new Date(data.paymentStart);
    const endDate = new Date(data.dueDate);

    // Check if dates are valid first
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return true; // Skip validation if dates are invalid (other validations will catch this)
    }

    return endDate > startDate;
}, {
    message: "Due date must be after payment start date",
    path: ["dueDate"],
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
