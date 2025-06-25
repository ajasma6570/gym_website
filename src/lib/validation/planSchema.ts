import { z } from "zod";

export const basePlanSchema = z.object({
    name: z
        .string({ required_error: "Plan name is required" })
        .min(3, "Plan name must be at least 3 characters")
        .max(50, "Plan name must be at most 50 characters"),

    duration: z
        .number({ required_error: "Duration is required" })
        .int("Duration must be a whole number")
        .positive("Duration must be a positive number"),

    amount: z
        .number({ required_error: "Amount is required" })
        .int("Amount must be an integer")
        .positive("Amount must be a positive number"),

    status: z.enum(["active", "inactive"], {
        required_error: "Status is required",
    }),
});

export const createPlanSchema = basePlanSchema;

export const updatePlanSchema = basePlanSchema.extend({
    id: z.number({ required_error: "ID is required" }).int().positive(),
});

export type Plan = z.infer<typeof updatePlanSchema>;
export type PlanList = Plan[]; // this is a list of plans
