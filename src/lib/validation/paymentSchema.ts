import { z } from "zod";

export const paymentSchema = z.object({
    planId: z.number().min(1, "Plan is required"),
    paymentStart: z.string().min(1, "Payment start date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    personalTrainingPlan: z.string().optional(),
    paymentType: z.enum(["cash", "bank", "both"], {
        required_error: "Payment type is required",
    }),
    amount: z.number().min(0, "Amount must be positive"),
}).refine((data) => {
    // Validate that due date is after payment start date
    const startDate = new Date(data.paymentStart);
    const endDate = new Date(data.dueDate);
    return endDate > startDate;
}, {
    message: "Due date must be after payment start date",
    path: ["dueDate"],
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
